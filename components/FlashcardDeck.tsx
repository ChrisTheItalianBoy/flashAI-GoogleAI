
import React, { useState, useEffect, useRef } from 'react';
import { Flashcard } from '../types';
import { srsService, SRSRating } from '../services/srsService';
import { useLanguage } from '../contexts/LanguageContext';

interface FlashcardDeckProps {
  cards: Flashcard[];
  onReset: () => void;
  onUpdateCard?: (index: number, updatedCard: Flashcard) => void;
  onAddCard?: (newCard: Flashcard) => void; // New prop for adding cards
  initialTimerSeconds?: number | null; 
  onTimerEnd?: () => void;
  onTimerStartRequest?: () => void; // Request to start timer from UI
  isSRSMode?: boolean; 
  onSRSRating?: (cardId: string, rating: SRSRating) => void;
  readOnly?: boolean; 
  isPro?: boolean; // Check for Pro features
}

const LatexContent: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.innerText = text;

    const w = window as any;
    if (w.MathJax && w.MathJax.typesetPromise) {
      w.MathJax.typesetPromise([el])
        .catch((err: any) => console.warn('MathJax typeset failed: ' + err.message));
    } else {
      const interval = setInterval(() => {
         if (w.MathJax && w.MathJax.typesetPromise) {
            w.MathJax.typesetPromise([el]);
            clearInterval(interval);
         }
      }, 200);
      setTimeout(() => clearInterval(interval), 3000);
    }
  }, [text]);

  return <div ref={rootRef} className={`${className} whitespace-pre-wrap`}></div>;
};

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ 
  cards, 
  onReset, 
  onUpdateCard,
  onAddCard,
  initialTimerSeconds,
  onTimerEnd,
  onTimerStartRequest,
  isSRSMode = false,
  onSRSRating,
  readOnly = false,
  isPro = false
}) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (initialTimerSeconds && !readOnly) {
        setTimeLeft(initialTimerSeconds);
        setIsTimerActive(true);
        setSessionComplete(false);
        setCurrentIndex(0);
        setIsFlipped(false);
    } else {
        setTimeLeft(null);
        setIsTimerActive(false);
        if (!initialTimerSeconds) setSessionComplete(false);
    }
  }, [initialTimerSeconds, readOnly]);

  useEffect(() => {
      if (currentIndex >= cards.length && cards.length > 0 && !sessionComplete) {
          if (isSRSMode) {
             setSessionComplete(true);
          } else {
             setCurrentIndex(0);
          }
      }
  }, [cards.length, currentIndex, isSRSMode, sessionComplete]);

  useEffect(() => {
    if (!isTimerActive || timeLeft === null || readOnly) return;
    if (timeLeft === 0) {
        setIsTimerActive(false);
        setSessionComplete(true);
        if (onTimerEnd) onTimerEnd();
        return;
    }
    const timer = setInterval(() => {
        setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, onTimerEnd, readOnly]);

  useEffect(() => {
    if (currentCard) {
      setEditQuestion(currentCard.question);
      setEditAnswer(currentCard.answer);
      setEditDifficulty(currentCard.difficulty || 'Medium');
    }
    setIsEditing(false);
    setIsFlipped(false);
  }, [currentIndex, cards]);

  useEffect(() => {
    if (isEditing || sessionComplete || readOnly) return; 

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (!isSRSMode) {
        if (e.key === 'ArrowRight') handleNext();
        else if (e.key === 'ArrowLeft') handlePrev();
      } else if (isSRSMode && isFlipped) {
          // SRS Shortcuts
          if (e.key === '1') handleSRSClick(0); // Again
          if (e.key === '2') handleSRSClick(1); // Hard
          if (e.key === '3') handleSRSClick(2); // Good
          if (e.key === '4') handleSRSClick(3); // Easy
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, isEditing, sessionComplete, isSRSMode, readOnly, cards.length]);

  const handleNext = () => {
    if (isEditing) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    if (isEditing) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  const handleSRSClick = (rating: SRSRating) => {
    if (!currentCard || !onSRSRating || readOnly) return;
    
    // Optimistic UI update
    const nextIdx = currentIndex + 1;
    
    onSRSRating(currentCard.id, rating);
    
    if (nextIdx < cards.length) {
        setIsFlipped(false);
        setCurrentIndex(nextIdx);
    } else {
        setSessionComplete(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCard && !readOnly) {
      onUpdateCard(currentIndex, {
        ...currentCard,
        question: editQuestion,
        answer: editAnswer,
        difficulty: editDifficulty
      });
    }
    setIsEditing(false);
  };

  const handleAddManualCard = () => {
      if (onAddCard) {
          const newCard: Flashcard = {
              id: crypto.randomUUID(),
              question: "New Question",
              answer: "New Answer",
              difficulty: 'Medium'
          };
          onAddCard(newCard);
          // Automatically jump to the new card (last one) and open edit
          setTimeout(() => {
              setCurrentIndex(cards.length); // length because card added will increase length by 1
              setIsEditing(true);
          }, 100);
      }
  };

  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  if (sessionComplete && !readOnly) {
      return (
          <div className="w-full max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in-up">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                      {isSRSMode ? t('deck.review_comp') : t('deck.session_comp')}
                  </h2>
                  <p className="text-slate-500 mb-8 text-lg">You've reviewed {cards.length} cards.</p>
                  <button onClick={onReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95">{t('deck.back')}</button>
              </div>
          </div>
      );
  }

  if (!currentCard) return null;

  return (
    <div className={`flex flex-col items-center w-full max-w-3xl mx-auto px-4 relative ${readOnly ? 'pointer-events-none' : ''}`}>
      
      {/* Top Controls: Timer & Add Card */}
      {!readOnly && (
          <div className="w-full flex justify-between items-center mb-4">
              {/* Timer Control */}
              <button 
                  onClick={onTimerStartRequest}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border ${
                      timeLeft !== null 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
              >
                  <span>⏱️</span>
                  {timeLeft !== null ? formatTime(timeLeft) : 'Start Timer'}
              </button>

              {isSRSMode && (
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                      SRS Review
                  </div>
              )}

              {/* Add Card (Pro) */}
              {isPro && onAddCard && !isSRSMode && (
                  <button 
                      onClick={handleAddManualCard}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm"
                  >
                      <span>+</span> {t('deck.add_card')}
                  </button>
              )}
          </div>
      )}

      {!readOnly && (
          <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ease-out ${isSRSMode ? 'bg-purple-600' : 'bg-indigo-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
      )}

      {!readOnly && (
        <div className="flex justify-between w-full mb-4 text-sm text-slate-500 font-medium">
            <span>{t('deck.card')} {currentIndex + 1} {t('deck.of')} {cards.length}</span>
            <button onClick={onReset} className="text-indigo-600 hover:text-indigo-800">
                {isTimerActive ? t('deck.end') : (isSRSMode ? t('deck.exit') : t('deck.start_over'))}
            </button>
        </div>
      )}

      {/* Card Container */}
      <div className={`relative w-full aspect-[3/2] perspective-1000 mb-8 group ${isEditing || readOnly ? '' : 'cursor-pointer'} ${readOnly ? 'pointer-events-auto' : ''}`} onClick={() => !isEditing && !readOnly && setIsFlipped(!isFlipped)}>
        
        {isEditing ? (
          <div className="absolute inset-0 bg-white p-6 md:p-8 rounded-2xl flex flex-col border-2 border-indigo-500 shadow-xl z-20">
             <form onSubmit={handleSaveEdit} className="h-full flex flex-col gap-3">
                <div className="flex-1 flex flex-col min-h-0">
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">{t('deck.question')}</label>
                    <textarea 
                       className="flex-1 p-3 rounded-lg border border-slate-200 resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                       value={editQuestion}
                       onChange={(e) => setEditQuestion(e.target.value)}
                    />
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">{t('deck.answer')}</label>
                    <textarea 
                       className="flex-1 p-3 rounded-lg border border-slate-200 resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                       value={editAnswer}
                       onChange={(e) => setEditAnswer(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                       <label className="text-[10px] font-bold uppercase text-slate-400">Difficulty:</label>
                       <select 
                          value={editDifficulty} 
                          onChange={(e) => setEditDifficulty(e.target.value as any)}
                          className="p-1.5 rounded-lg border border-slate-200 text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                       </select>
                    </div>

                    <div className="flex gap-2">
                       <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold">Cancel</button>
                       <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md transition-all">Save</button>
                    </div>
                </div>
             </form>
          </div>
        ) : (
          <div 
              className={`relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}
          >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white p-8 md:p-12 rounded-2xl flex flex-col justify-center items-center text-center border border-slate-200">
                  <div className="absolute top-6 right-6 flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(currentCard.difficulty)}`}>
                        {currentCard.difficulty || 'Medium'}
                      </span>
                      {!readOnly && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit Card"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                      )}
                  </div>
                  <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    {t('deck.question')}
                  </span>
                  <div className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed overflow-auto max-h-full">
                    <LatexContent text={currentCard.question} className="text-center" />
                  </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden bg-indigo-50 p-8 md:p-12 rounded-2xl flex flex-col justify-center items-center text-center border border-indigo-100 rotate-y-180">
                  <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-indigo-400 uppercase">{t('deck.answer')}</span>
                  <div className="text-lg md:text-xl text-slate-700 leading-relaxed overflow-auto max-h-full">
                    <LatexContent text={currentCard.answer} className="text-center" />
                  </div>
              </div>
          </div>
        )}
      </div>

      {!readOnly && (
        <div className={`flex flex-col w-full items-center gap-4 transition-opacity duration-300 ${isEditing ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            {isSRSMode ? (
                <>
                    {isFlipped ? (
                        <div className="grid grid-cols-4 gap-3 w-full animate-fade-in-up">
                            <div className="flex flex-col gap-1">
                                <button onClick={(e) => { e.stopPropagation(); handleSRSClick(0); }} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 transition-all">
                                    Again
                                </button>
                                <span className="text-[10px] text-center text-slate-400 font-medium">{srsService.getTimeLabel(0, currentCard.srsData)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={(e) => { e.stopPropagation(); handleSRSClick(1); }} className="p-3 bg-orange-100 hover:bg-orange-200 rounded-xl text-sm font-bold text-orange-700 border-b-4 border-orange-200 active:border-b-0 active:translate-y-1 transition-all">
                                    Hard
                                </button>
                                <span className="text-[10px] text-center text-slate-400 font-medium">{srsService.getTimeLabel(1, currentCard.srsData)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={(e) => { e.stopPropagation(); handleSRSClick(2); }} className="p-3 bg-blue-100 hover:bg-blue-200 rounded-xl text-sm font-bold text-blue-700 border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 transition-all">
                                    Good
                                </button>
                                <span className="text-[10px] text-center text-slate-400 font-medium">{srsService.getTimeLabel(2, currentCard.srsData)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={(e) => { e.stopPropagation(); handleSRSClick(3); }} className="p-3 bg-green-100 hover:bg-green-200 rounded-xl text-sm font-bold text-green-700 border-b-4 border-green-200 active:border-b-0 active:translate-y-1 transition-all">
                                    Easy
                                </button>
                                <span className="text-[10px] text-center text-slate-400 font-medium">{srsService.getTimeLabel(3, currentCard.srsData)}</span>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setIsFlipped(true)} className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-lg hover:bg-slate-800 transition-colors">
                            {t('deck.show_answer')}
                        </button>
                    )}
                </>
            ) : (
                <div className="flex gap-4 items-center">
                    <button onClick={handlePrev} className="p-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                        {isFlipped ? t('deck.show_question') : t('deck.show_answer')}
                    </button>
                    <button onClick={handleNext} className="p-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default FlashcardDeck;
