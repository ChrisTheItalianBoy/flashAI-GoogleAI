
import { Flashcard, FlashcardSet } from '../types';

// Stop words to remove for similarity checking
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 
  'of', 'to', 'in', 'for', 'with', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 
  'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'what', 'how', 'why'
]);

export const graphService = {
  /**
   * Tokenizes text into a set of unique meaningful words
   */
  tokenize(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOP_WORDS.has(w)) // Increased min length slightly
    );
  },

  /**
   * Calculates Jaccard Similarity between two sets of tokens
   */
  calculateSimilarity(textA: string, textB: string): number {
    const tokensA = this.tokenize(textA);
    const tokensB = this.tokenize(textB);

    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let intersection = 0;
    tokensA.forEach(t => {
      if (tokensB.has(t)) intersection++;
    });

    const union = new Set([...tokensA, ...tokensB]).size;
    
    return intersection / union;
  },

  /**
   * Scans all cards and automatically links them if they share significant concepts.
   */
  generateAutoConnections(decks: FlashcardSet[], threshold: number = 0.08): Record<string, string[]> {
    // 1. Flatten all cards
    const allCards = decks.flatMap(d => d.cards);
    const connections: Record<string, string[]> = {};

    // Initialize
    allCards.forEach(c => connections[c.id] = c.relatedCardIds ? [...c.relatedCardIds] : []);

    // 2. Compare O(N^2)
    // Optimized threshold for flashcards (short text)
    for (let i = 0; i < allCards.length; i++) {
      for (let j = i + 1; j < allCards.length; j++) {
        const cardA = allCards[i];
        const cardB = allCards[j];

        // Combine Q and A for context
        const contentA = `${cardA.question} ${cardA.answer}`;
        const contentB = `${cardB.question} ${cardB.answer}`;

        const similarity = this.calculateSimilarity(contentA, contentB);

        if (similarity > threshold) {
          if (!connections[cardA.id].includes(cardB.id)) {
            connections[cardA.id].push(cardB.id);
          }
          if (!connections[cardB.id].includes(cardA.id)) {
            connections[cardB.id].push(cardA.id);
          }
        }
      }
    }

    return connections;
  },

  linkCards(cardA: Flashcard, cardB: Flashcard): [Flashcard, Flashcard] {
    const newA = { ...cardA, relatedCardIds: [...(cardA.relatedCardIds || [])] };
    const newB = { ...cardB, relatedCardIds: [...(cardB.relatedCardIds || [])] };

    if (!newA.relatedCardIds.includes(cardB.id)) newA.relatedCardIds.push(cardB.id);
    if (!newB.relatedCardIds.includes(cardA.id)) newB.relatedCardIds.push(cardA.id);

    return [newA, newB];
  }
};
