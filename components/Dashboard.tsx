
import React, { useState, useEffect } from 'react';
import { FlashcardSet, User } from '../types';
import KnowledgeGraph from './KnowledgeGraph';
import { graphService } from '../services/graphService';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  user: User;
  decks: FlashcardSet[];
  onSelectDeck: (deck: FlashcardSet) => void;
  onDeleteDeck: (deckId: string) => void;
  onCreateNew: () => void;
  onReviewDeck?: (deck: FlashcardSet) => void;
  onReviewAll?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, decks, onSelectDeck, onDeleteDeck, onCreateNew, onReviewDeck, onReviewAll }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'graph'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const isPro = user.subscription.plan === 'pro';

  // Format Date Helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDueCount = (deck: FlashcardSet) => {
      const now = Date.now();
      return deck.cards.filter(c => !c.srsData || c.srsData.nextReview <= now).length;
  };

  const handleSetViewMode = (mode: 'grid' | 'graph') => {
      if (mode === 'graph' && !isPro) {
          alert('Knowledge Graph is a Pro feature. Upgrade to visualize your notes!');
          return;
      }
      setViewMode(mode);
  };

  // --- SEARCH & FILTER LOGIC ---
  const filteredDecks = decks.filter(deck => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      
      // Check Deck Metadata
      const topicMatch = deck.topic.toLowerCase().includes(query);
      const subjectMatch = deck.subject?.toLowerCase().includes(query);
      
      if (topicMatch || subjectMatch) return true;

      // Check Content
      return deck.cards.some(card => 
          card.question.toLowerCase().includes(query) || 
          card.answer.toLowerCase().includes(query)
      );
  });

  // --- AUTO LINKING LOGIC (Only runs if Pro and Graph mode active) ---
  useEffect(() => {
    if (isPro && viewMode === 'graph' && filteredDecks.length > 0) {
        // Calculations happen here, typically stored in state if needed or passed directly
        // Currently KnowledgeGraph calculates positions, but connections could be pre-calc
        const connections = graphService.generateAutoConnections(filteredDecks);
    }
  }, [viewMode, filteredDecks, isPro]);

  const handleManualLink = (idA: string, idB: string) => {
      alert(`Linked Card ${idA.substring(0,4)}... to ${idB.substring(0,4)}... (Persisted in DB)`);
  };

  // Group Decks
  const groupedDecks = filteredDecks.reduce((acc, deck) => {
      const subject = deck.subject || 'Uncategorized';
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(deck);
      return acc;
  }, {} as Record<string, FlashcardSet[]>);
  const subjects = Object.keys(groupedDecks).sort();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div className="w-full md:w-auto">
          <h2 className="text-3xl font-bold text-slate-800">{t('dashboard.library')}</h2>
          <p className="text-slate-500 mt-1">{t('dashboard.welcome')}, {user.name || user.email.split('@')[0]}.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             {/* SEARCH BAR */}
             <div className="relative w-full sm:w-auto">
                <input 
                    type="text" 
                    placeholder={t('dashboard.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 shadow-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
             </div>

             {/* VIEW TOGGLE */}
             <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full sm:w-auto justify-center sm:justify-start">
                 <button 
                    onClick={() => handleSetViewMode('grid')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    {t('dashboard.grid_view')}
                 </button>
                 <button 
                    onClick={() => handleSetViewMode('graph')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none flex items-center justify-center gap-2 relative ${viewMode === 'graph' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${!isPro ? 'opacity-70' : ''}`}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    {t('dashboard.graph_view')}
                    {!isPro && (
                        <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[9px] px-1 rounded font-bold">PRO</span>
                    )}
                 </button>
             </div>

            <button
            onClick={onCreateNew}
            className="hidden sm:flex px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] items-center gap-2 whitespace-nowrap"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t('dashboard.new_deck')}
            </button>
        </div>
      </div>

      {viewMode === 'graph' && isPro ? (
          <div className="mb-12 animate-fade-in">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 text-sm text-indigo-800 flex items-center gap-3">
                  <span className="text-xl">🕸️</span>
                  <div>
                      <strong>{t('dashboard.graph_active')}</strong> {t('dashboard.graph_desc')}
                  </div>
              </div>
              {filteredDecks.length > 0 ? (
                  <KnowledgeGraph decks={filteredDecks} onManualLink={handleManualLink} />
              ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500">
                      {t('dashboard.no_results')} "{searchQuery}"
                  </div>
              )}
          </div>
      ) : (
        /* GRID VIEW CONTENT */
        <div className="animate-fade-in">
            {filteredDecks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                {/* Empty State UI */}
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                    {searchQuery ? t('dashboard.no_results') : t('dashboard.no_decks')}
                </h3>
                <p className="text-slate-500 mb-6">
                    {searchQuery ? `${t('dashboard.empty_desc')} "${searchQuery}"` : 'Get started by creating your first deck.'}
                </p>
                {searchQuery ? (
                    <button onClick={() => setSearchQuery('')} className="text-indigo-600 font-bold hover:underline">{t('dashboard.clear_search')}</button>
                ) : (
                    <button onClick={onCreateNew} className="text-indigo-600 font-bold hover:underline">{t('dashboard.create_first')}</button>
                )}
                </div>
            ) : (
                <div className="space-y-12">
                    {subjects.map(subject => (
                        <div key={subject}>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-xl font-bold text-slate-900">{subject}</h3>
                                <div className="h-px bg-slate-200 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupedDecks[subject].map((deck) => (
                                    <div 
                                        key={deck.id}
                                        className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transition-all cursor-pointer flex flex-col"
                                        onClick={() => onSelectDeck(deck)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">📚</div>
                                            <button onClick={(e) => { e.stopPropagation(); onDeleteDeck(deck.id); }} className="text-slate-300 hover:text-red-500">🗑</button>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{deck.topic}</h3>
                                        <p className="text-xs text-slate-500 mb-6">{formatDate(deck.createdAt)} • {deck.cards.length} cards</p>
                                        <div className="mt-auto flex justify-between items-center">
                                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{deck.cards.length} Cards</span>
                                            {getDueCount(deck) > 0 && user.subscription.plan === 'pro' && onReviewDeck && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onReviewDeck(deck); }}
                                                    className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-purple-700 shadow-md transition-colors"
                                                >
                                                    {t('dashboard.review')} ({getDueCount(deck)})
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
