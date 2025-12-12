
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Flashcard, FlashcardSet } from '../types';

interface KnowledgeGraphProps {
  decks: FlashcardSet[];
  onManualLink: (cardIdA: string, cardIdB: string) => void;
}

// -- TYPES --
interface Node {
  id: string;
  type: 'card' | 'topic';
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  degree: number;
  data?: Flashcard;
}

interface Link {
  source: string;
  target: string;
}

interface Camera {
  x: number;
  y: number;
  k: number; // Zoom level
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ decks = [], onManualLink }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Graph State
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  
  // Interaction State
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, k: 1 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Refs for animation loop variables to avoid dependency stale closures
  const simulationRef = useRef({
    nodes: [] as Node[],
    links: [] as Link[],
    camera: { x: 0, y: 0, k: 1 },
    alpha: 1 // Simulation heat/energy
  });

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    if (!decks || decks.length === 0 || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Process Nodes
    const newNodes: Node[] = [];
    const newLinks: Link[] = [];
    const nodeMap = new Map<string, Node>();

    // Color Palette matching the app theme
    const colors = [
      '#4f46e5', // Indigo (Pro)
      '#0891b2', // Cyan
      '#db2777', // Pink
      '#7c3aed', // Violet
      '#ea580c', // Orange
      '#16a34a', // Green
    ];

    let colorIndex = 0;

    decks.forEach((deck) => {
      const deckColor = colors[colorIndex % colors.length];
      colorIndex++;

      // 1. Create TOPIC Node
      const topicNode: Node = {
          id: deck.id, // Use deck ID
          type: 'topic',
          label: deck.topic || "Untitled Deck",
          x: (width / 2) + (Math.random() - 0.5) * 400,
          y: (height / 2) + (Math.random() - 0.5) * 400,
          vx: 0,
          vy: 0,
          radius: 25, // Topic nodes are larger
          color: deckColor,
          degree: 0
      };
      newNodes.push(topicNode);
      nodeMap.set(deck.id, topicNode);

      // 2. Create Card Nodes and Link to Topic
      deck.cards.forEach((card) => {
        const node: Node = {
          id: card.id,
          type: 'card',
          label: card.question,
          // Spawn near the topic
          x: topicNode.x + (Math.random() - 0.5) * 100,
          y: topicNode.y + (Math.random() - 0.5) * 100,
          vx: 0,
          vy: 0,
          radius: 5, // Base radius for cards
          color: deckColor, // Inherit deck color
          degree: 0,
          data: card,
        };
        newNodes.push(node);
        nodeMap.set(card.id, node);

        // Link to Topic (Cluster Structure)
        newLinks.push({ source: deck.id, target: card.id });
        topicNode.degree++;
        node.degree++;
      });
    });

    // Process Inter-Card Links (Knowledge Graph connections)
    decks.forEach(deck => {
        deck.cards.forEach(card => {
            if (card.relatedCardIds) {
                card.relatedCardIds.forEach(targetId => {
                    if (targetId !== card.id && nodeMap.has(targetId)) {
                        // Check for duplicate link
                        const exists = newLinks.find(l => 
                            (l.source === card.id && l.target === targetId) ||
                            (l.source === targetId && l.target === card.id)
                        );
                        
                        if (!exists) {
                            newLinks.push({ source: card.id, target: targetId });
                            const u = nodeMap.get(card.id)!;
                            const v = nodeMap.get(targetId)!;
                            u.degree++;
                            v.degree++;
                        }
                    }
                });
            }
        });
    });

    // Update Node Sizes based on degree (Centrality Visual) - Only for cards, Topics stay big
    newNodes.forEach(node => {
        if (node.type === 'card') {
            const baseSize = 4;
            const growthFactor = 1.2;
            node.radius = Math.min(baseSize + (node.degree * growthFactor), 12);
        }
    });

    // Center camera initially
    const initialCamera = { x: 0, y: 0, k: 0.6 }; // Zoomed out slightly to see clusters

    setNodes(newNodes);
    setLinks(newLinks);
    setCamera(initialCamera);

    // Sync Ref
    simulationRef.current.nodes = newNodes;
    simulationRef.current.links = newLinks;
    simulationRef.current.camera = initialCamera;
    simulationRef.current.alpha = 1;

  }, [decks]);


  // --- 2. PHYSICS ENGINE (The Core) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let animationFrameId: number;

    const tick = () => {
        const { nodes, links, alpha } = simulationRef.current;
        
        if (alpha > 0.001) {
            // CONSTANTS
            const REPULSION = 500; 
            const SPRING_LENGTH_TOPIC = 80; // Tighter clusters around topic
            const SPRING_LENGTH_CARD = 120; // Looser connections between cards
            const SPRING_STRENGTH = 0.08;
            const CENTER_GRAVITY = 0.008;
            const MAX_VELOCITY = 12;
            const DAMPING = 0.65;

            // 1. Repulsion
            for (let i = 0; i < nodes.length; i++) {
                const u = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const v = nodes[j];
                    const dx = v.x - u.x;
                    const dy = v.y - u.y;
                    const distSq = dx * dx + dy * dy || 1;
                    const dist = Math.sqrt(distSq);
                    
                    // Stronger repulsion for Topic nodes to separate clusters
                    let localRepulsion = REPULSION;
                    if (u.type === 'topic' && v.type === 'topic') localRepulsion *= 3;

                    if (dist < 500) {
                        const force = (localRepulsion / distSq) * alpha;
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;

                        u.vx -= fx;
                        u.vy -= fy;
                        v.vx += fx;
                        v.vy += fy;
                    }
                }
            }

            // 2. Attraction
            links.forEach(link => {
                const u = nodes.find(n => n.id === link.source);
                const v = nodes.find(n => n.id === link.target);
                if (u && v) {
                    const dx = v.x - u.x;
                    const dy = v.y - u.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    
                    // Determine spring length based on connection type
                    // Topic <-> Card connection = Tighter
                    // Card <-> Card connection = Looser
                    const isTopicLink = u.type === 'topic' || v.type === 'topic';
                    const targetLen = isTopicLink ? SPRING_LENGTH_TOPIC : SPRING_LENGTH_CARD;

                    const displacement = dist - targetLen;
                    const force = displacement * SPRING_STRENGTH * alpha;
                    
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;

                    u.vx += fx;
                    u.vy += fy;
                    v.vx -= fx;
                    v.vy -= fy;
                }
            });

            // 3. Center Gravity & Velocity Update
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            nodes.forEach(node => {
                // Gravity
                node.vx += (centerX - node.x) * CENTER_GRAVITY * alpha;
                node.vy += (centerY - node.y) * CENTER_GRAVITY * alpha;

                // Dragging Override
                if (node.id === draggingNodeId) {
                    node.vx = 0;
                    node.vy = 0;
                }

                // Apply Velocity
                const vMag = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                if (vMag > MAX_VELOCITY) {
                    node.vx = (node.vx / vMag) * MAX_VELOCITY;
                    node.vy = (node.vy / vMag) * MAX_VELOCITY;
                }

                node.x += node.vx;
                node.y += node.vy;

                // Apply Damping
                node.vx *= DAMPING;
                node.vy *= DAMPING;
            });

            // Decay alpha
            simulationRef.current.alpha *= 0.98;
        }

        render(ctx, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(animationFrameId);
  }, [nodes, links, draggingNodeId]);


  // --- 3. RENDER SYSTEM ---
  const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const { nodes, links, camera } = simulationRef.current;
      
      // Clear
      ctx.clearRect(0, 0, width, height);
      
      // Apply Camera Transform
      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.k, camera.k);

      // Determine neighborhood if hovering
      let neighborIds = new Set<string>();
      if (hoveredNodeId) {
          neighborIds.add(hoveredNodeId);
          links.forEach(l => {
              if (l.source === hoveredNodeId) neighborIds.add(l.target);
              if (l.target === hoveredNodeId) neighborIds.add(l.source);
          });
      }

      // Draw Links
      links.forEach(link => {
          const u = nodes.find(n => n.id === link.source);
          const v = nodes.find(n => n.id === link.target);
          if (!u || !v) return;

          const isConnectedToHover = hoveredNodeId && (link.source === hoveredNodeId || link.target === hoveredNodeId);
          const isDimmed = hoveredNodeId && !isConnectedToHover;

          ctx.beginPath();
          ctx.moveTo(u.x, u.y);
          ctx.lineTo(v.x, v.y);
          
          if (hoveredNodeId) {
              if (isConnectedToHover) {
                  ctx.strokeStyle = u.color; 
                  ctx.lineWidth = (u.type === 'topic' || v.type === 'topic' ? 3 : 2) / camera.k; 
                  ctx.globalAlpha = 1;
              } else {
                  ctx.strokeStyle = '#e2e8f0';
                  ctx.lineWidth = 1 / camera.k;
                  ctx.globalAlpha = 0.1;
              }
          } else {
              // Dim cluster links (topic-card) slightly more than structure links
              ctx.strokeStyle = '#cbd5e1';
              ctx.lineWidth = 1.5 / camera.k;
              ctx.globalAlpha = 0.4;
          }
          ctx.stroke();
      });

      // Draw Nodes
      nodes.forEach(node => {
          const isHovered = node.id === hoveredNodeId;
          const isNeighbor = neighborIds.has(node.id);
          const isDimmed = hoveredNodeId && !isNeighbor;

          ctx.globalAlpha = isDimmed ? 0.2 : 1;
          
          // Shadow/Glow
          if (isHovered) {
              ctx.shadowColor = node.color;
              ctx.shadowBlur = 20;
          } else {
              ctx.shadowBlur = 0;
          }

          // Node Shape
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDimmed ? '#94a3b8' : node.color;
          ctx.fill();
          
          // Border (Thicker for topics)
          ctx.lineWidth = (node.type === 'topic' ? 3 : 2) / camera.k;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Reset Shadow
          ctx.shadowBlur = 0;

          // Text Label
          // Show label if: Hovered, Neighbor of hovered, Topic Node, or Zoom is close enough
          const showLabel = isNeighbor || node.type === 'topic' || camera.k > 1.2;
          
          if (showLabel) {
              const fontSize = node.type === 'topic' ? 16 : (isHovered ? 14 : 10);
              const fontWeight = node.type === 'topic' ? '800' : '600';
              ctx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
              ctx.fillStyle = isDimmed ? 'rgba(0,0,0,0)' : '#1e293b'; 
              
              const text = node.label.length > 25 && !isHovered ? node.label.substring(0, 23) + '..' : node.label;
              const textWidth = ctx.measureText(text).width;
              
              if (!isDimmed) {
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                  ctx.fillRect(node.x - textWidth/2 - 4, node.y - node.radius - 8 - fontSize, textWidth + 8, fontSize + 4);
                  
                  ctx.fillStyle = node.type === 'topic' ? '#0f172a' : '#334155';
                  ctx.textAlign = 'center';
                  ctx.fillText(text, node.x, node.y - node.radius - 8);
              }
          }
      });

      ctx.restore();
  };


  // --- 4. INTERACTION HANDLERS ---

  const screenToWorld = (sx: number, sy: number) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (sx - rect.left - simulationRef.current.camera.x) / simulationRef.current.camera.k;
      const y = (sy - rect.top - simulationRef.current.camera.y) / simulationRef.current.camera.k;
      return { x, y };
  };

  const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault(); 
      const zoomSensitivity = 0.001;
      const { camera } = simulationRef.current;
      
      const newK = Math.max(0.1, Math.min(5, camera.k - e.deltaY * zoomSensitivity));
      
      const rect = canvasRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - camera.x) / camera.k;
      const worldY = (mouseY - camera.y) / camera.k;

      const newX = mouseX - worldX * newK;
      const newY = mouseY - worldY * newK;

      const newCamera = { x: newX, y: newY, k: newK };
      setCamera(newCamera);
      simulationRef.current.camera = newCamera;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      
      for (let i = nodes.length - 1; i >= 0; i--) {
          const node = nodes[i];
          const dist = Math.sqrt((node.x - x)**2 + (node.y - y)**2);
          if (dist < node.radius + 5) {
              setDraggingNodeId(node.id);
              simulationRef.current.alpha = 0.5;
              return;
          }
      }

      setIsDraggingCanvas(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      const { x, y } = screenToWorld(e.clientX, e.clientY);

      if (draggingNodeId) {
          const node = simulationRef.current.nodes.find(n => n.id === draggingNodeId);
          if (node) {
              node.x = x;
              node.y = y;
              node.vx = 0;
              node.vy = 0;
              simulationRef.current.alpha = 0.3;
          }
          return;
      }

      if (isDraggingCanvas) {
          const dx = e.clientX - lastMousePos.x;
          const dy = e.clientY - lastMousePos.y;
          const newCamera = { 
              ...simulationRef.current.camera, 
              x: simulationRef.current.camera.x + dx, 
              y: simulationRef.current.camera.y + dy 
          };
          setCamera(newCamera);
          simulationRef.current.camera = newCamera;
          setLastMousePos({ x: e.clientX, y: e.clientY });
          return;
      }

      let foundHover = null;
      for (let i = nodes.length - 1; i >= 0; i--) {
          const node = nodes[i];
          const dist = Math.sqrt((node.x - x)**2 + (node.y - y)**2);
          if (dist < node.radius + 5) {
              foundHover = node.id;
              break;
          }
      }
      setHoveredNodeId(foundHover);
  };

  const handleMouseUp = () => {
      setDraggingNodeId(null);
      setIsDraggingCanvas(false);
  };

  const handleResetView = () => {
      if (!containerRef.current) return;
      const initialCamera = { x: 0, y: 0, k: 0.6 };
      setCamera(initialCamera);
      simulationRef.current.camera = initialCamera;
      simulationRef.current.alpha = 1; 
  };

  useEffect(() => {
      const handleResize = () => {
          if (containerRef.current && canvasRef.current) {
              canvasRef.current.width = containerRef.current.clientWidth;
              canvasRef.current.height = containerRef.current.clientHeight;
              simulationRef.current.alpha = 0.1; 
          }
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group">
        {/* Canvas Layer */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="block"
            />
        </div>

        {/* UI Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Graph View</p>
                <p className="text-sm font-bold text-slate-800">{nodes.filter(n => n.type === 'topic').length} Decks • {nodes.filter(n => n.type === 'card').length} Cards</p>
            </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
                onClick={handleResetView}
                className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 p-2 rounded-lg shadow-sm transition-colors text-xs font-bold flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 0h4.5m-4.5 0L9 15M20.25 3.75v4.5m0 0h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 0h-4.5m4.5 0L15 15" />
                </svg>
                Reset View
            </button>
        </div>

        {/* Help Tip */}
        {nodes.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white px-4 py-2 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm">
                Scroll to Zoom • Drag to Pan
            </div>
        )}
    </div>
  );
};

export default KnowledgeGraph;
