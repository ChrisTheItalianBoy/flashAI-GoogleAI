
import React, { useEffect, useRef, ReactNode } from 'react';

interface PhysicsHeroProps {
  children?: ReactNode;
}

interface SmokeParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const PhysicsHero: React.FC<PhysicsHeroProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // --- RESPONSIVE CONFIG ---
    let isMobile = false;
    let ballRadius = 60;
    let bookW = 110;
    let bookH = 150;
    let bookD = 20;
    let rocketScale = 0.9;
    let xOffset = 350; // Increased distance from center to clear text area

    // --- ROCKET STATE ---
    const smokeParticles: SmokeParticle[] = [];

    // --- BASKETBALL STATE ---
    let ballX = 0;
    let ballY = 300;
    let ballVx = (Math.random() - 0.5) * 8;
    let ballVy = (Math.random() - 0.5) * 8;
    let rotation = 0;

    // --- BOOK STATE ---
    let bookX = 0;
    let bookY = 400;
    let bookVx = (Math.random() - 0.5) * 3; 
    let bookVy = (Math.random() - 0.5) * 3;
    let bookRotation = -0.2;
    let bookVr = 0.005; 

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      isMobile = canvas.width < 768;

      if (isMobile) {
          ballRadius = 35;
          bookW = 60;
          bookH = 85;
          bookD = 10;
          rocketScale = 0.5;
          xOffset = 120;
      } else {
          ballRadius = 60;
          bookW = 110;
          bookH = 150;
          bookD = 20;
          rocketScale = 0.9;
          xOffset = 400; // Push further out on desktop
      }

      // Reset positions to valid areas if they haven't been initialized or are way off
      if (ballX === 0 || ballX > canvas.width) ballX = (canvas.width / 2) - xOffset;
      if (bookX === 0 || bookX > canvas.width) bookX = (canvas.width / 2) + xOffset;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      // 1. Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 2. UPDATE & DRAW ROCKET ---
      time += 0.0035; 
      const rocketRadiusX = isMobile ? canvas.width * 0.4 : canvas.width * 0.45; 
      const rocketRadiusY = canvas.height * 0.4;
      
      const rX = (canvas.width / 2) + Math.cos(time) * rocketRadiusX;
      const rY = (canvas.height / 2) + Math.sin(time * 2) * rocketRadiusY;
      
      const drX = -Math.sin(time) * rocketRadiusX;
      const drY = Math.cos(time * 2) * 2 * rocketRadiusY;
      const rocketAngle = Math.atan2(drY, drX);

      // Add Smoke
      if (time % 0.01 < 0.1) {
          smokeParticles.push({
              x: rX - Math.cos(rocketAngle) * (55 * (rocketScale/0.9)), // Scale smoke offset
              y: rY - Math.sin(rocketAngle) * (55 * (rocketScale/0.9)),
              size: (8 + Math.random() * 6) * (rocketScale/0.9),
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              life: 1.0,
              maxLife: 1.0,
              color: `rgba(180, 180, 200, ${0.3 + Math.random() * 0.4})`
          });
      }

      // Draw Smoke
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
          const p = smokeParticles[i];
          p.life -= 0.008; 
          p.x += p.vx;
          p.y += p.vy;
          p.size += 0.2;

          if (p.life <= 0) {
              smokeParticles.splice(i, 1);
          } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = p.color.replace(/, [^,]+\)$/, `, ${p.life * 0.5})`);
              ctx.fill();
          }
      }

      // Draw Rocket
      ctx.save();
      ctx.translate(rX, rY);
      ctx.rotate(rocketAngle + Math.PI / 2);
      ctx.scale(rocketScale, rocketScale);

      // Rocket Body
      ctx.fillStyle = '#ef4444'; 
      ctx.beginPath(); ctx.moveTo(-20, 20); ctx.lineTo(-35, 55); ctx.lineTo(-10, 40); ctx.fill();
      ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(35, 55); ctx.lineTo(10, 40); ctx.fill();
      
      ctx.fillStyle = `rgba(255, ${100 + Math.random()*155}, 0, 0.9)`;
      ctx.beginPath(); ctx.moveTo(-12, 50); ctx.lineTo(0, 80 + Math.random() * 25); ctx.lineTo(12, 50); ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(0, 0, 22, 55, 0, 0, Math.PI * 2); ctx.fill();
      
      const grad = ctx.createLinearGradient(-22, 0, 22, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0.15)'); grad.addColorStop(0.5, 'rgba(255,255,255,0.9)'); grad.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = grad; ctx.fill();
      
      ctx.fillStyle = '#0ea5e9'; 
      ctx.beginPath(); ctx.arc(0, -18, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();
      
      ctx.restore();


      // --- 3. DRAW BOOK ---
      bookX += bookVx;
      bookY += bookVy;
      bookRotation += bookVr;

      // Soft Boundaries
      const padding = isMobile ? 40 : 100;
      if (bookX < padding) { bookVx += 0.1; }
      if (bookX > canvas.width - padding) { bookVx -= 0.1; }
      if (bookY < padding) { bookVy += 0.1; }
      if (bookY > canvas.height - padding) { bookVy -= 0.1; }

      ctx.save();
      ctx.translate(bookX, bookY);
      ctx.rotate(bookRotation);

      // Book Shadow
      ctx.shadowColor = 'rgba(79, 70, 229, 0.3)'; 
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 30;

      // Back Cover (Depth)
      ctx.fillStyle = '#312e81'; 
      ctx.beginPath();
      ctx.roundRect(-bookW/2 + 5, -bookH/2 + 5, bookW, bookH, 6);
      ctx.fill();

      // Pages Block (3D Thickness)
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = '#e2e8f0'; 
      ctx.beginPath();
      // Right side thickness
      ctx.moveTo(bookW/2, -bookH/2 + 8);
      ctx.lineTo(bookW/2 + bookD, -bookH/2 + 12);
      ctx.lineTo(bookW/2 + bookD, bookH/2 - 4);
      ctx.lineTo(bookW/2, bookH/2 - 8);
      ctx.fill();
      // Bottom thickness
      ctx.beginPath();
      ctx.moveTo(-bookW/2 + 8, bookH/2);
      ctx.lineTo(bookW/2, bookH/2 - 8);
      ctx.lineTo(bookW/2 + bookD, bookH/2 - 4);
      ctx.lineTo(-bookW/2 + 12, bookH/2 + 8);
      ctx.fill();

      // Front Cover
      const coverGrad = ctx.createLinearGradient(-bookW/2, -bookH/2, bookW/2, bookH/2);
      coverGrad.addColorStop(0, '#4f46e5'); 
      coverGrad.addColorStop(1, '#4338ca'); 
      ctx.fillStyle = coverGrad;
      
      ctx.beginPath();
      ctx.roundRect(-bookW/2, -bookH/2, bookW, bookH, 4);
      ctx.fill();

      // Spine Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(-bookW/2, -bookH/2, 12, bookH);

      // Flash Logo
      ctx.font = `${isMobile ? '20px' : '40px'} sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('⚡', 0, -10);
      
      // Title Lines
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      const lineY = isMobile ? 15 : 25;
      const lineWidth = isMobile ? 25 : 40;
      const lineHeight = isMobile ? 3 : 4;
      ctx.fillRect(-lineWidth/2, lineY, lineWidth, lineHeight);
      ctx.fillRect(-lineWidth/2, lineY + (isMobile ? 8 : 10), lineWidth, lineHeight);

      ctx.restore();


      // --- 4. DRAW BASKETBALL ---
      ballX += ballVx;
      ballY += ballVy;
      
      ballVx += (Math.random() - 0.5) * 0.2;
      ballVy += (Math.random() - 0.5) * 0.2;

      const speed = Math.sqrt(ballVx*ballVx + ballVy*ballVy);
      const MAX_SPEED = 6; 
      const MIN_SPEED = 3;

      if (speed > MAX_SPEED) { ballVx = (ballVx/speed)*MAX_SPEED; ballVy = (ballVy/speed)*MAX_SPEED; }
      if (speed < MIN_SPEED) { ballVx = (ballVx/speed)*MIN_SPEED; ballVy = (ballVy/speed)*MIN_SPEED; }

      if (ballX < ballRadius) { ballX = ballRadius; ballVx *= -1; }
      if (ballX > canvas.width - ballRadius) { ballX = canvas.width - ballRadius; ballVx *= -1; }
      if (ballY < ballRadius) { ballY = ballRadius; ballVy *= -1; }
      if (ballY > canvas.height - ballRadius) { ballY = canvas.height - ballRadius; ballVy *= -1; }

      rotation += ballVx * 0.02;

      ctx.save();
      ctx.translate(ballX, ballY);
      ctx.rotate(rotation);

      ctx.beginPath();
      ctx.arc(0, 0, ballRadius, 0, Math.PI * 2);
      ctx.clip(); 

      const ballGrad = ctx.createRadialGradient(-ballRadius*0.3, -ballRadius*0.3, ballRadius*0.1, 0, 0, ballRadius);
      ballGrad.addColorStop(0, '#fb923c'); 
      ballGrad.addColorStop(0.6, '#ea580c'); 
      ballGrad.addColorStop(1, '#9a3412'); 
      ctx.fillStyle = ballGrad;
      ctx.fill();

      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      for(let i=0; i<300; i++) {
          const angle = i * 2.39996; 
          const r = (6.8 * Math.sqrt(i)) * (ballRadius/60); // Scale texture
          if(r < ballRadius - 2) {
              ctx.beginPath();
              ctx.arc(r * Math.cos(angle), r * Math.sin(angle), 1.5 * (ballRadius/60), 0, Math.PI*2);
              ctx.fill();
          }
      }

      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 4.5 * (ballRadius/60);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, -ballRadius); ctx.lineTo(0, ballRadius); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-ballRadius, 0); ctx.lineTo(ballRadius, 0); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, ballRadius*0.6, ballRadius, 0, 0, Math.PI*2); ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pointer-events-none">
        <div className="pointer-events-auto">
            {children}
        </div>
      </div>
    </div>
  );
};

export default PhysicsHero;
