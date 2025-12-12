
import { Flashcard, SRSData } from "../types";

// Rating: 0 = Again (Complete blackout), 1 = Hard, 2 = Good, 3 = Easy
export type SRSRating = 0 | 1 | 2 | 3;

export const srsService = {
  /**
   * Calculates the next review metadata using a modified SuperMemo-2 algorithm.
   */
  calculateNextReview(card: Flashcard, rating: SRSRating): SRSData {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Default initialization if first time seeing card
    let interval = card.srsData?.interval || 0;
    let repetitions = card.srsData?.repetitions || 0;
    let easeFactor = card.srsData?.easeFactor || 2.5;

    if (rating === 0) {
      // AGAIN: Reset repetitions, review very soon (e.g., 1 minute, but for this app we'll say "due now")
      repetitions = 0;
      interval = 0; // 0 means < 1 day (due immediately/next session)
    } else {
      // SUCCESS (Hard, Good, Easy)
      
      // 1. Calculate new Ease Factor
      // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
      // Mapping our 1,2,3 to SM-2's 3,4,5 scales roughly
      // We will use a simplified adjustment based on Anki logic
      if (rating === 3) { // Easy
        easeFactor += 0.15;
      } else if (rating === 1) { // Hard
        easeFactor -= 0.15; // Penalty for finding it hard
      }
      // Good (2) keeps EF roughly same (or small adjustment)

      if (easeFactor < 1.3) easeFactor = 1.3; // Floor limit

      // 2. Calculate Repetitions & Interval
      repetitions += 1;

      if (repetitions === 1) {
        interval = 1; // 1 day
      } else if (repetitions === 2) {
        interval = 6; // 6 days
      } else {
        interval = Math.round(interval * easeFactor);
      }
      
      // Hard rating modifier (interval grows slower)
      if (rating === 1) {
          interval = Math.max(1, Math.floor(interval * 0.5)); 
      }
    }

    return {
      interval,
      repetitions,
      easeFactor,
      nextReview: now + (interval * oneDay)
    };
  },

  /**
   * Helper to get label for the button based on estimated next interval
   */
  getTimeLabel(rating: SRSRating, currentData?: SRSData): string {
    // Determine what the interval WOULD be
    const dummyCard: any = { srsData: currentData };
    const result = this.calculateNextReview(dummyCard, rating);
    
    if (result.interval === 0) return '< 10m';
    if (result.interval >= 365) return `${Math.round(result.interval / 365)}y`;
    if (result.interval >= 30) return `${Math.round(result.interval / 30)}mo`;
    return `${result.interval}d`;
  }
};
