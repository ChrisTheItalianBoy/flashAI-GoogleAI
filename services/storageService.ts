
import { FlashcardSet, Flashcard } from '../types';
import { supabase } from './supabaseClient';

export const storageService = {
  
  async getDecks(userEmail: string): Promise<FlashcardSet[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch Decks
    const { data: decks, error } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error || !decks) {
        console.error("Error fetching decks:", error);
        return [];
    }

    // For each deck, fetch cards
    // In a production app, use a join query: .select('*, cards(*)')
    const fullDecks: FlashcardSet[] = [];

    for (const deck of decks) {
        const { data: cards } = await supabase
            .from('cards')
            .select('*')
            .eq('deck_id', deck.id);
        
        fullDecks.push({
            id: deck.id,
            userId: userEmail,
            topic: deck.topic,
            subject: deck.subject,
            createdAt: deck.created_at,
            cards: cards ? cards.map(this.mapDbCardToAppCard) : []
        });
    }

    return fullDecks;
  },

  async saveDeck(userEmail: string, deck: FlashcardSet): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    // 1. Insert Deck
    const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .insert({
            id: deck.id,
            user_id: user.id,
            topic: deck.topic,
            subject: deck.subject,
            created_at: deck.createdAt
        })
        .select()
        .single();

    if (deckError) throw new Error(deckError.message);

    // 2. Insert Cards
    const dbCards = deck.cards.map(c => ({
        id: c.id,
        deck_id: deck.id,
        question: c.question,
        answer: c.answer,
        difficulty: c.difficulty,
        srs_data: c.srsData,
        related_card_ids: c.relatedCardIds
    }));

    const { error: cardsError } = await supabase
        .from('cards')
        .insert(dbCards);

    if (cardsError) throw new Error(cardsError.message);
  },

  async updateDeck(userEmail: string, updatedDeck: FlashcardSet): Promise<FlashcardSet[]> {
    // 1. Update Deck Details
    await supabase
        .from('decks')
        .update({
            topic: updatedDeck.topic,
            subject: updatedDeck.subject
        })
        .eq('id', updatedDeck.id);

    // 2. Upsert Cards (Update existing, Insert new)
    // Note: Deleting removed cards is tricky without diffing. 
    // For simplicity, we upsert based on ID.
    const dbCards = updatedDeck.cards.map(c => ({
        id: c.id,
        deck_id: updatedDeck.id,
        question: c.question,
        answer: c.answer,
        difficulty: c.difficulty,
        srs_data: c.srsData,
        related_card_ids: c.relatedCardIds
    }));

    await supabase.from('cards').upsert(dbCards);

    return this.getDecks(userEmail);
  },

  async deleteDeck(userEmail: string, deckId: string): Promise<FlashcardSet[]> {
    const { error } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId);

    if (error) console.error("Error deleting deck:", error);

    return this.getDecks(userEmail);
  },

  mapDbCardToAppCard(dbCard: any): Flashcard {
      return {
          id: dbCard.id,
          question: dbCard.question,
          answer: dbCard.answer,
          difficulty: dbCard.difficulty as any,
          srsData: dbCard.srs_data,
          relatedCardIds: dbCard.related_card_ids
      };
  }
};
