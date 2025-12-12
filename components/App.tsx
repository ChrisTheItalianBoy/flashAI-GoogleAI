
import React, { useState, useEffect, useRef } from 'react';
import FileUpload from './FileUpload';
import FlashcardDeck from './FlashcardDeck';
import LandingPage from './LandingPage';
import AuthModal from './AuthModal';
import Dashboard from './Dashboard';
import SettingsPage from './SettingsPage';
import PricingPage from './PricingPage';
import UseCasesPage from './UseCasesPage';
import AboutPage from './AboutPage';
import FAQPage from './FAQPage';
import ContactPage from './ContactPage';
import MockPaymentPage from './MockPaymentPage';
import AdminDashboard from './AdminDashboard';
import ChatWidget from './ChatWidget';
import { AppStatus, Flashcard, FlashcardSet, GenerateOptions, UploadedFile, User } from '../types';
import { generateFlashcards } from '../services/geminiService';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { SRSRating, srsService } from '../services/srsService';
import { seedDatabase } from '../services/dataSeeder';
import { useLanguage } from '../contexts/LanguageContext';

// Updated Stripe Payment Link provided by user
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/6oUfZhgnIfb092W1OG38402';

const App: React.FC = () => {
  const { t } = useLanguage();

  // Initialize Database Seeder once on mount
  useEffect(() => {
    seedDatabase();
  }, []);

  // Lazy initialization for User and Status
  const [user, setUser] = useState<User | null>(() => {
    return authService.getCurrentUser();
  });

  const [status, setStatus] = useState<AppStatus>(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.role === 'admin') return AppStatus.ADMIN_DASHBOARD;
    return currentUser ? AppStatus.IDLE : AppStatus.LANDING;
  });

  // Listen for Auth Changes (Firebase)
  useEffect(() => {
      const unsubscribe = authService.onAuthStateChange((newUser) => {
          setUser(newUser);
          if (newUser) {
              if (status === AppStatus.LANDING) setStatus(AppStatus.IDLE);
          } else {
              setStatus(AppStatus.LANDING);
          }
      });
      return () => unsubscribe();
  }, [status]);

  // Handle Payment Success Redirect
  useEffect(() => {
      const query = new URLSearchParams(window.location.search);
      if (query.get('payment_success') === 'true' && user) {
          handlePaymentSuccess();
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
      }
  }, [user]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
     const currentUser = authService.getCurrentUser();
     return currentUser?.preferences?.darkMode || false;
  });

  const [file, setFile] = useState<UploadedFile | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  
  const [isSRSMode, setIsSRSMode] = useState(false);

  // Initialize options
  const [options, setOptions] = useState<GenerateOptions>(() => {
    const currentUser = authService.getCurrentUser();
    let defaultCount = 5;
    if (currentUser && currentUser.role !== 'admin') {
       const isFree = currentUser.subscription.plan === 'free';
       const pref = currentUser.preferences.defaultCount;
       if (isFree) {
           defaultCount = pref > 5 ? pref : 5;
       } else {
           defaultCount = Math.min(pref, 50);
       }
    }
    return { 
      count: defaultCount, 
      focus: '',
      subject: '',
      complexity: 'Intermediate',
      manualContext: ''
    };
  });

  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>('login');
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [isBonusActive, setIsBonusActive] = useState(false);

  const [isTimerConfigOpen, setIsTimerConfigOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);

  const [savedDecks, setSavedDecks] = useState<FlashcardSet[]>([]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load decks Asynchronously
  useEffect(() => {
    const loadDecks = async () => {
        if (user && user.role !== 'admin' && (status === AppStatus.DASHBOARD || status === AppStatus.IDLE)) {
            const decks = await storageService.getDecks(user.email);
            setSavedDecks(decks);
        }
    };
    loadDecks();
  }, [user, status]);

  // SCROLL TO TOP ON NAVIGATION
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [status]);

  // STRICT DARK MODE ENFORCEMENT
  useEffect(() => {
      const root = window.document.documentElement;
      // Dark mode ONLY if user exists AND is Pro AND has preference enabled
      const isPro = user?.subscription.plan === 'pro';
      
      if (user && isPro && isDarkMode) {
          root.classList.add('dark');
      } else {
          // Explicitly remove class if condition not met (even if isDarkMode is true in state but user downgraded)
          root.classList.remove('dark');
      }
  }, [isDarkMode, user]);

  // Close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync options with User plan
  useEffect(() => {
    if (user && user.role !== 'admin' && user.subscription.plan === 'free') {
       if (user.preferences.defaultCount <= 5 && options.count > 5) {
           setOptions(prev => ({ ...prev, count: 5 }));
       }
    }
  }, [user, options.count]);

  const handleAuthSuccess = async (authenticatedUser: User) => {
    setUser(authenticatedUser);
    // Set local state based on user pref, but useEffect will enforce Pro requirement
    setIsDarkMode(authenticatedUser.preferences.darkMode || false);

    if (authenticatedUser.role === 'admin') {
        setStatus(AppStatus.ADMIN_DASHBOARD);
        setIsAuthModalOpen(false);
        return;
    }

    let initialCount = 5;
    const isFree = authenticatedUser.subscription.plan === 'free';
    const pref = authenticatedUser.preferences.defaultCount;

    if (isFree) {
        initialCount = pref > 5 ? pref : 5;
    } else {
        initialCount = Math.min(pref, 50);
    }

    setOptions(prev => ({ 
      ...prev, 
      count: initialCount
    }));
    
    // Load decks immediately on auth success
    const decks = await storageService.getDecks(authenticatedUser.email);
    setSavedDecks(decks);

    setStatus(AppStatus.IDLE);
    setIsAuthModalOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setIsDarkMode(updatedUser.preferences.darkMode || false);
    
    const maxCount = updatedUser.subscription.plan === 'free' ? 5 : 50;
    setOptions(prev => ({ 
        ...prev, 
        count: Math.min(updatedUser.preferences.defaultCount, maxCount) 
    }));
  };

  const handleToggleDarkMode = async () => {
      if (!user) return;
      if (user.subscription.plan === 'free') {
          alert("Dark Mode is a Pro feature.");
          return; 
      }

      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      
      const updatedUser = {
          ...user,
          preferences: { ...user.preferences, darkMode: newMode }
      };
      
      // Optimistic update
      setUser(updatedUser);
      await authService.updateUser(updatedUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setStatus(AppStatus.LANDING);
    setFlashcards([]);
    setFile(null);
    setSavedDecks([]);
    setCurrentDeckId(null);
    setIsProfileOpen(false);
    setTimerDuration(null);
    setIsSRSMode(false);
    setIsDarkMode(false); // Reset to light
  };

  const handleLandingLogin = () => {
    setAuthMode('login');
    setPrefilledEmail('');
    setIsBonusActive(false);
    setIsAuthModalOpen(true);
  };

  const handleLandingSignup = (email: string = '') => {
    setAuthMode('signup');
    setPrefilledEmail(email);
    setIsBonusActive(!!email);
    setIsAuthModalOpen(true);
  };

  const handleVerifyAccount = async () => {
      if (!user) return;
      
      // Trigger email send immediately
      try {
          await authService.resendVerificationCode(user.email);
          alert(`Verification code sent to ${user.email}`);
      } catch (e) {
          console.error("Failed to send verification code", e);
      }

      setAuthMode('verify');
      setPrefilledEmail(user.email);
      setIsAuthModalOpen(true);
      setIsProfileOpen(false);
  };

  // Reset to initial generator state
  const handleHomeClick = () => {
      if (user) {
          setFile(null);
          setFlashcards([]);
          setStatus(AppStatus.IDLE);
      } else {
          setStatus(AppStatus.LANDING);
      }
  };

  const handleFileSelected = (uploadedFile: UploadedFile) => {
    setFile(uploadedFile);
  };

  const getRecentUsageCount = (history: number[]) => {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    return history.filter(timestamp => now - timestamp < ONE_DAY_MS).length;
  };

  const handleCancelGeneration = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
      setStatus(AppStatus.IDLE);
      setProgress(0);
  };

  const handleGenerate = async () => {
    if (!file) return;

    if (user && user.subscription.plan === 'free') {
      const history = user.generationHistory || [];
      const recentUsage = getRecentUsageCount(history);
      
      if (recentUsage >= 3) {
        setErrorMsg("You've reached your limit of 3 decks in the last 24 hours. Upgrade to Pro for unlimited access.");
        setStatus(AppStatus.ERROR);
        return;
      }
    }

    setStatus(AppStatus.PROCESSING);
    setErrorMsg('');
    setCurrentDeckId(null);
    setTimerDuration(null);
    setIsSRSMode(false);
    setProgress(0);

    abortControllerRef.current = new AbortController();

    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) return prev; 
            const increment = Math.max(2, 15 - Math.floor(prev / 5)); // Faster visual progress
            return prev + increment;
        });
    }, 200);

    try {
      const rawCards = await generateFlashcards(file, options, abortControllerRef.current.signal);
      
      clearInterval(progressInterval);
      setProgress(100);

      const cardsWithIds = rawCards.map(c => ({
          ...c,
          id: crypto.randomUUID()
      }));

      setFlashcards(cardsWithIds);
      
      if (user) {
        const newDeckId = crypto.randomUUID();
        const newDeck: FlashcardSet = {
          id: newDeckId,
          userId: user.email,
          topic: options.focus || file.name,
          subject: options.subject || 'General',
          cards: cardsWithIds,
          createdAt: Date.now()
        };
        
        await storageService.saveDeck(user.email, newDeck);
        setSavedDecks(prev => [newDeck, ...prev]);
        setCurrentDeckId(newDeckId);

        const updatedUser = {
          ...user,
          generationHistory: [...(user.generationHistory || []), Date.now()]
        };
        await authService.updateUser(updatedUser);
        setUser(updatedUser);
        
        if (user.subscription.plan === 'free' && user.preferences.defaultCount > 5) {
             const resetUser = {
                 ...updatedUser,
                 preferences: { ...updatedUser.preferences, defaultCount: 5 }
             };
             await authService.updateUser(resetUser);
             setUser(resetUser);
             setOptions(prev => ({ ...prev, count: 5 }));
        }
      }

      setStatus(AppStatus.STUDYING);
    } catch (e: any) {
      clearInterval(progressInterval);
      console.error(e);
      if (e.message !== "Generation cancelled by user.") {
          setStatus(AppStatus.ERROR);
          setErrorMsg(e.message || 'Failed to generate flashcards. Please try again.');
      } else {
          setStatus(AppStatus.IDLE);
      }
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setFile(null);
    setFlashcards([]);
    setCurrentDeckId(null);
    setErrorMsg('');
    setTimerDuration(null);
    setIsSRSMode(false);
    setProgress(0);
    setOptions(prev => ({ ...prev, focus: '', subject: '', manualContext: '' }));
  };

  const handleSelectDeck = (deck: FlashcardSet) => {
    setFlashcards(deck.cards);
    setCurrentDeckId(deck.id);
    setStatus(AppStatus.STUDYING);
    setTimerDuration(null);
    setIsSRSMode(false);
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (user && window.confirm('Are you sure you want to delete this deck?')) {
      const updated = await storageService.deleteDeck(user.email, deckId);
      setSavedDecks(updated);
      if (currentDeckId === deckId) {
        handleReset();
      }
    }
  };

  const handleReviewDeck = (deck: FlashcardSet) => {
      const now = Date.now();
      const dueCards = deck.cards.filter(c => !c.srsData || c.srsData.nextReview <= now);
      
      if (dueCards.length === 0) {
          alert("No cards due for review in this deck!");
          return;
      }

      setFlashcards(dueCards);
      setCurrentDeckId(deck.id);
      setIsSRSMode(true);
      setStatus(AppStatus.STUDYING);
      setTimerDuration(null);
  };

  const handleGlobalReview = () => {
      if (!user) {
          handleLandingLogin();
          return;
      }
      if (user.subscription.plan !== 'pro') {
          alert("Study Session (Global Review) is a Pro feature.");
          return;
      }

      const now = Date.now();
      const allDueCards = savedDecks.flatMap(deck => 
          deck.cards.filter(c => !c.srsData || c.srsData.nextReview <= now)
      );

      if (allDueCards.length === 0) {
          alert("You're all caught up! No cards due for review.");
          return;
      }

      setFlashcards(allDueCards);
      setCurrentDeckId(null); // Null ID indicates global review
      setIsSRSMode(true);
      setStatus(AppStatus.STUDYING);
      setTimerDuration(null);
      setIsProfileOpen(false);
  };

  const handleSRSRating = async (cardId: string, rating: SRSRating) => {
    if (!user) return;

    const cardIndex = flashcards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const card = flashcards[cardIndex];
    const newSRSData = srsService.calculateNextReview(card, rating);
    const updatedCard = { ...card, srsData: newSRSData };

    const newFlashcards = [...flashcards];
    newFlashcards[cardIndex] = updatedCard;
    setFlashcards(newFlashcards);

    let deckUpdated = false;
    const updatedDecks = savedDecks.map(deck => {
        if (deckUpdated) return deck;

        const originalIndex = deck.cards.findIndex(c => c.id === cardId);
        if (originalIndex !== -1) {
            const newCards = [...deck.cards];
            newCards[originalIndex] = updatedCard;
            deckUpdated = true;
            return { ...deck, cards: newCards };
        }
        return deck;
    });

    if (deckUpdated) {
        const modifiedDeck = updatedDecks.find(d => d.cards.some(c => c.id === cardId && c.srsData?.nextReview === updatedCard.srsData?.nextReview));
        
        if (modifiedDeck) {
             const finalDecks = await storageService.updateDeck(user.email, modifiedDeck);
             setSavedDecks(finalDecks);
        }
    }
  };

  const handleUpdateCard = async (index: number, updatedCard: Flashcard) => {
    const newCards = [...flashcards];
    newCards[index] = updatedCard;
    setFlashcards(newCards);

    if (user && currentDeckId) { 
        const deckToUpdate = savedDecks.find(d => d.id === currentDeckId);
        if (deckToUpdate) {
            const originalIndex = deckToUpdate.cards.findIndex(c => c.id === updatedCard.id);
            if (originalIndex !== -1) {
                const newDeckCards = [...deckToUpdate.cards];
                newDeckCards[originalIndex] = updatedCard;
                const newDeck = { ...deckToUpdate, cards: newDeckCards };
                const finalDecks = await storageService.updateDeck(user.email, newDeck);
                setSavedDecks(finalDecks);
            }
        }
    }
  };

  const handleAddManualCard = async (newCard: Flashcard) => {
      // Add to current session
      setFlashcards(prev => [...prev, newCard]);

      // Add to persistent storage if in a deck
      if (user && currentDeckId) {
          const deckToUpdate = savedDecks.find(d => d.id === currentDeckId);
          if (deckToUpdate) {
              const newDeckCards = [...deckToUpdate.cards, newCard];
              const newDeck = { ...deckToUpdate, cards: newDeckCards };
              const finalDecks = await storageService.updateDeck(user.email, newDeck);
              setSavedDecks(finalDecks);
          }
      }
  };

  const handlePaymentStart = () => {
      if (!user) return;
      // Append email to Stripe URL for better UX
      const finalLink = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(user.email)}`;
      window.location.href = finalLink;
  };

  const handlePaymentSuccess = async () => {
    if (!user) return;
    
    const updatedUser: User = {
        ...user,
        subscription: {
            ...user.subscription,
            plan: 'pro',
            status: 'active',
            nextBillingDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            cardLast4: '4242' // In a real webhook, this comes from Stripe
        },
        preferences: {
            ...user.preferences,
            defaultCount: 50,
            darkMode: true // Enable dark mode on upgrade
        }
    };
    
    try {
        await authService.updateUser(updatedUser);
        handleUpdateUser(updatedUser);
        setStatus(AppStatus.DASHBOARD);
        setIsProfileOpen(false);
        alert("Upgrade successful! Welcome to Pro.");
    } catch (e) {
        console.error("Failed to update user after payment", e);
    }
  };

  const handleOpenTimerConfig = () => {
    if (user?.subscription.plan === 'free') {
       alert('Study Mode with Timer is a Pro feature! Upgrade to unlock.');
       return;
    }
    setIsTimerConfigOpen(true);
  };

  const handleStartTimer = (minutes: number) => {
      setTimerDuration(minutes * 60);
      setIsTimerConfigOpen(false);
  };

  const navigateToDashboard = () => {
    setFile(null);
    setStatus(AppStatus.DASHBOARD);
    setIsProfileOpen(false);
  };

  const navigateToSettings = () => {
    setStatus(AppStatus.SETTINGS);
    setIsProfileOpen(false);
  };

  const navigateToCreate = () => {
    setStatus(AppStatus.IDLE);
  };

  const renderAuthModal = () => (
    <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        initialEmail={prefilledEmail}
        onAuthSuccess={handleAuthSuccess}
        bonusCardsActive={isBonusActive}
    />
  );

  if (status === AppStatus.ADMIN_DASHBOARD) {
      return (
          <AdminDashboard onLogout={handleLogout} />
      );
  }

  // PUBLIC ROUTES
  if (status === AppStatus.LANDING) {
    return (
      <>
        <LandingPage 
          onLoginClick={handleLandingLogin} 
          onSignupClick={handleLandingSignup} 
          onNavigate={setStatus}
        />
        {renderAuthModal()}
      </>
    );
  }

  if (status === AppStatus.PRICING) {
      return (
        <>
            <PricingPage 
                onLoginClick={handleLandingLogin} 
                onSignupClick={() => handleLandingSignup()} 
                onNavigate={setStatus}
                onGetPro={() => user ? handlePaymentStart() : handleLandingSignup()}
            />
            {renderAuthModal()}
        </>
      );
  }

  if (status === AppStatus.USE_CASES) {
    return (
      <>
          <UseCasesPage 
              onLoginClick={handleLandingLogin} 
              onSignupClick={() => handleLandingSignup()} 
              onNavigate={setStatus}
          />
          {renderAuthModal()}
      </>
    );
  }

  if (status === AppStatus.ABOUT) {
    return (
      <>
          <AboutPage 
              onLoginClick={handleLandingLogin} 
              onSignupClick={() => handleLandingSignup()} 
              onNavigate={setStatus}
          />
          {renderAuthModal()}
      </>
    );
  }

  if (status === AppStatus.FAQ) {
    return (
      <>
          <FAQPage 
              onLoginClick={handleLandingLogin} 
              onSignupClick={() => handleLandingSignup()} 
              onNavigate={setStatus}
          />
          {renderAuthModal()}
      </>
    );
  }

  if (status === AppStatus.CONTACT) {
    return (
      <>
          <ContactPage 
              onLoginClick={handleLandingLogin} 
              onSignupClick={() => handleLandingSignup()} 
              onNavigate={setStatus}
          />
          {renderAuthModal()}
      </>
    );
  }

  if (status === AppStatus.PAYMENT) {
      return (
          <MockPaymentPage 
             onSuccess={handlePaymentSuccess}
             onCancel={() => setStatus(AppStatus.DASHBOARD)} 
          />
      );
  }

  const usageCount = user ? getRecentUsageCount(user.generationHistory || []) : 0;
  const isFreeTier = user?.subscription.plan === 'free';
  const isProTier = user?.subscription.plan === 'pro';
  
  const totalDueCards = user && isProTier 
    ? savedDecks.reduce((acc, deck) => {
        const now = Date.now();
        return acc + deck.cards.filter(c => !c.srsData || c.srsData.nextReview <= now).length;
    }, 0) 
    : 0;

  const showProcessingWarning = options.complexity === 'Advanced' || options.count > 20;

  return (
    <div className="min-h-screen bg-grid dark:bg-slate-900 dark:bg-none text-slate-900 dark:text-white font-sans selection:bg-indigo-100 transition-colors duration-300 text-center">
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                ⚡
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Flash<span className="text-indigo-600">AI</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {user && (
               <div className="flex items-center gap-4">
                 
                 <button 
                    onClick={navigateToCreate}
                    className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${status === AppStatus.IDLE || status === AppStatus.PROCESSING ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                 >
                    Generator
                 </button>

                 <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                 <div className="relative" ref={profileMenuRef}>
                   <button 
                     onClick={() => setIsProfileOpen(!isProfileOpen)}
                     className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                   >
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-sm shadow-sm relative">
                         {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                         {totalDueCards > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                         )}
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                         <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                            {user.name || user.email.split('@')[0]}
                         </span>
                         {isProTier && (
                           <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 px-1.5 rounded-full uppercase tracking-wide">
                             PRO
                           </span>
                         )}
                         {isFreeTier && (
                           <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-1.5 rounded-full uppercase tracking-wide">
                             FREE
                           </span>
                         )}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                   </button>

                   {isProfileOpen && (
                     <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in origin-top-right text-left">
                       <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-700 mb-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
                          <div className="flex justify-between items-center mt-1">
                             <p className="text-xs text-slate-400 capitalize">{user.subscription.plan} Plan</p>
                             {isFreeTier && (
                                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 rounded">
                                    {3 - usageCount} left
                                </span>
                             )}
                          </div>
                       </div>
                       
                       {/* UPGRADE TO PRO OPTION - MOVED TO TOP */}
                       {isFreeTier && (
                           <>
                               <button 
                                  onClick={() => { handlePaymentStart(); setIsProfileOpen(false); }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center gap-2 font-bold bg-indigo-50/50 dark:bg-indigo-900/10"
                               >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                  </svg>
                                  Upgrade to Pro
                               </button>
                               <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                           </>
                       )}

                       {/* DARK MODE TOGGLE */}
                       <button 
                          onClick={handleToggleDarkMode}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group ${isFreeTier ? 'opacity-60' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                       >
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                <span>{isDarkMode ? '🌙' : '☀️'}</span>
                                <span>Dark Mode</span>
                            </div>
                            {isFreeTier ? (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 rounded border border-indigo-100">PRO</span>
                                </div>
                            ) : (
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'left-4.5' : 'left-0.5'}`}></div>
                                </div>
                            )}
                       </button>
                       
                       <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>

                       {/* Study Session Button */}
                       <button 
                          onClick={handleGlobalReview}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center justify-between group"
                       >
                          <div className="flex items-center gap-2">
                              <span className="text-lg">🎓</span>
                              {t('nav.study_session')}
                          </div>
                          {isFreeTier ? (
                              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">PRO</span>
                          ) : totalDueCards > 0 && (
                              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full group-hover:bg-red-200">
                                  {totalDueCards}
                              </span>
                          )}
                       </button>

                       {/* VERIFY ACCOUNT OPTION */}
                       {!user.isVerified && (
                           <button 
                              onClick={handleVerifyAccount}
                              className="w-full text-left px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2 font-bold"
                           >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                              </svg>
                              Verify Account
                           </button>
                       )}

                       <button 
                          onClick={navigateToDashboard}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                          My Library
                       </button>

                       <button 
                          onClick={navigateToSettings}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                       </button>

                       <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>

                       <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                          Logout
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             )}
             
             {!user && status === AppStatus.STUDYING && (
                <button 
                  onClick={handleReset}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 ml-2"
              >
                  Create New
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* MODALS AND PAGES */}
        {isTimerConfigOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsTimerConfigOpen(false)}></div>
             <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-blob">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    ⏱️
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Timed Study Session</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Select a duration to start your focused study block.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                   {[10, 20, 30, 45, 60].map((min) => (
                      <button 
                        key={min}
                        onClick={() => handleStartTimer(min)}
                        className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-slate-700 dark:text-slate-300 transition-all"
                      >
                         {min}m
                      </button>
                   ))}
                </div>
                <button 
                    onClick={() => setIsTimerConfigOpen(false)}
                    className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                >
                    Cancel
                </button>
             </div>
          </div>
        )}

        {status === AppStatus.SETTINGS && user && user.role !== 'admin' && (
            <SettingsPage 
                user={user} 
                onUpdateUser={handleUpdateUser} 
                onUpgradeClick={handlePaymentStart}
                onForgotPassword={() => {
                    setAuthMode('forgot');
                    setPrefilledEmail(user.email);
                    setIsAuthModalOpen(true);
                }}
                onVerifyAccount={handleVerifyAccount}
            />
        )}

        {status === AppStatus.DASHBOARD && user && user.role !== 'admin' && (
          <Dashboard 
            user={user} 
            decks={savedDecks} 
            onSelectDeck={handleSelectDeck}
            onDeleteDeck={handleDeleteDeck}
            onCreateNew={navigateToCreate}
            onReviewDeck={handleReviewDeck}
            onReviewAll={handleGlobalReview} 
          />
        )}

        {status === AppStatus.IDLE && (
          <div className="flex flex-col items-center max-w-2xl mx-auto animate-fade-in-up">
            <div className="text-center mb-10">
              {isFreeTier && (
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-900">
                  <span className={`w-2 h-2 rounded-full ${usageCount >= 3 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  Free Plan: {usageCount}/3 decks used in last 24h
                </div>
              )}
              {isProTier && (
                <div className="inline-block mb-4 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                  ⚡ Pro Active: Unlimited Generations
                </div>
              )}
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                Master your materials in seconds.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Upload your notes, lecture slides (PDF), or chapters (TXT), and let AI build the perfect study deck for you.
              </p>
            </div>

            {!file ? (
               <FileUpload onFileSelected={handleFileSelected} isPro={isProTier} />
            ) : (
                <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-white">{file.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium mt-0.5">Ready for processing</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setFile(null)} 
                            className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Subject / Course (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Math 101, History, Biology"
                                    value={options.subject}
                                    onChange={(e) => setOptions({ ...options, subject: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Focus Topic (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 'Dates and Events', 'Formulas', 'Key Definitions'"
                                    value={options.focus}
                                    onChange={(e) => setOptions({ ...options, focus: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            {isProTier && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <span>Specific Excerpt / Context (Pro)</span>
                                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 rounded uppercase">Experimental</span>
                                </label>
                                <textarea
                                    placeholder="Paste specific text here if you only want flashcards generated from this section, ignoring the rest of the document context."
                                    value={options.manualContext || ''}
                                    onChange={(e) => setOptions({ ...options, manualContext: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                                />
                              </div>
                            )}

                            {isProTier && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Flashcard Detail Level (Pro)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  {['Minimal', 'Intermediate', 'Advanced'].map((level) => (
                                    <button
                                      key={level}
                                      onClick={() => setOptions({...options, complexity: level as any})}
                                      className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                                        options.complexity === level 
                                          ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                                          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                                      }`}
                                    >
                                      {level}
                                    </button>
                                  ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  {options.complexity === 'Minimal' && 'Concise answers focusing on single facts.'}
                                  {options.complexity === 'Intermediate' && 'Standard detail level suitable for most topics.'}
                                  {options.complexity === 'Advanced' && 'Detailed, comprehensive answers with context.'}
                                </p>
                              </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Number of Flashcards ({options.count})
                            </label>
                            
                            <div className="flex gap-4 items-center">
                                <input
                                    type="range"
                                    min="1"
                                    max={isFreeTier ? (user?.preferences.defaultCount > 5 ? user?.preferences.defaultCount : 5) : 50}
                                    step="1" // Allow specific number
                                    value={options.count}
                                    onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value) })}
                                    className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <input 
                                    type="number" 
                                    min="1"
                                    max={isFreeTier ? (user?.preferences.defaultCount > 5 ? user?.preferences.defaultCount : 5) : 50}
                                    value={options.count}
                                    onChange={(e) => {
                                        let val = parseInt(e.target.value);
                                        const max = isFreeTier ? (user?.preferences.defaultCount > 5 ? user?.preferences.defaultCount : 5) : 50;
                                        if (val > max) val = max;
                                        if (val < 1) val = 1;
                                        setOptions({ ...options, count: val });
                                    }}
                                    className="w-16 px-2 py-1 text-center border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md text-sm font-semibold"
                                />
                            </div>

                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>1</span>
                                <span>
                                    {isFreeTier 
                                        ? (user?.preferences.defaultCount > 5 ? `${user?.preferences.defaultCount} (Bonus)` : '5 (Max for Free)')
                                        : '50'}
                                </span>
                            </div>
                        </div>

                        {/* WARNING FOR HEAVY PROCESSING */}
                        {showProcessingWarning && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-xs flex gap-2 items-start">
                                <span className="text-lg">⚠️</span>
                                <p>You selected advanced options or a high card count. Generation may take up to 30 seconds.</p>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isFreeTier && usageCount >= 3}
                        >
                            <span>{isFreeTier && usageCount >= 3 ? 'Daily Limit Reached' : 'Generate Flashcards'}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            </svg>
                        </button>
                        {isFreeTier && usageCount >= 3 && (
                            <div className="mt-2 text-center">
                                <p className="text-xs text-red-500 font-medium mb-1">
                                    You have reached the limit of 3 decks per 24 hours.
                                </p>
                                <button 
                                    onClick={handlePaymentStart}
                                    className="text-xs text-indigo-600 font-bold hover:underline"
                                >
                                    Upgrade to Pro for Unlimited Access &rarr;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-md mx-auto text-center">
            
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div 
                    className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"
                ></div>
                {/* Text percentage in middle */}
                <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700 dark:text-white">
                    {Math.round(progress)}%
                </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Analyzing your document...</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">The AI is extracting key concepts and building your deck.</p>
            
            {/* Progress Bar Visual */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
                <div 
                    className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <button 
                onClick={handleCancelGeneration}
                className="text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors text-sm"
            >
                Cancel Generation
            </button>
          </div>
        )}

        {status === AppStatus.STUDYING && (
          <FlashcardDeck 
            cards={flashcards} 
            onReset={handleReset} 
            onUpdateCard={handleUpdateCard}
            onAddCard={handleAddManualCard}
            initialTimerSeconds={timerDuration}
            onTimerEnd={() => setTimerDuration(0)}
            onTimerStartRequest={handleOpenTimerConfig}
            isSRSMode={isSRSMode}
            onSRSRating={handleSRSRating}
            isPro={isProTier}
          />
        )}
        
        {status === AppStatus.STUDYING && !timerDuration && !isSRSMode && (
           <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-xl rounded-full px-6 py-3 flex items-center gap-4 z-40 animate-fade-in-up">
              <button 
                  onClick={handleOpenTimerConfig}
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Study Mode (Pro)"
              >
                  <span>⏱️</span>
                  <span>Timer</span>
                  {isFreeTier && <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1 rounded uppercase">Pro</span>}
              </button>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {flashcards.length} cards
              </div>
           </div>
        )}

        {status === AppStatus.ERROR && (
           <div className="flex flex-col items-center justify-center min-h-[40vh] text-center max-w-md mx-auto">
             <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
             <p className="text-slate-600 dark:text-slate-400 mb-8">{errorMsg || 'An unexpected error occurred.'}</p>
             <div className="flex gap-4">
               <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Try Again
               </button>
               {errorMsg.includes('limit') && (
                 <button
                    onClick={handlePaymentStart}
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Upgrade Now
                 </button>
               )}
             </div>
           </div>
        )}
      </main>
      <ChatWidget />
    </div>
  );
};

export default App;