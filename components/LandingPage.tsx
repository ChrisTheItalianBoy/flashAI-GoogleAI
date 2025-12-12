
import React, { useState, useEffect, useRef } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import ChatWidget from './ChatWidget';
import PhysicsHero from './PhysicsHero';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { localizedUniversities, localizedPricing } from '../services/i18nService';

// --- SCRAMBLE TEXT COMPONENT ---
const ScrambleText: React.FC<{ text: string }> = ({ text }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplay(prev => 
        text.split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      
      // Slower iteration for smoother effect (was 1/3)
      iteration += 1 / 4; 
    }, 40); // Slightly slower frame rate (was 30) for cinematic feel

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return <>{display}</>;
};

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: (email: string) => void;
  onNavigate: (status: AppStatus) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick, onNavigate }) => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // SCROLL STAGE STATE: 0 = Hero, 1 = Domina, 2 = Content
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  // Dynamic Word State - REMOVED "READ"
  const wordLists: Record<string, string[]> = {
    en: ['ABSORB', 'LEARN', 'MEMORIZE', 'INTERNALIZE', 'MASTER'],
    it: ['ASSORBI', 'IMPARA', 'MEMORIZZA', 'INTERIORIZZA', 'DOMINA'],
    es: ['ABSORBE', 'APRENDE', 'MEMORIZA', 'INTERIORIZA', 'DOMINA'],
    de: ['AUFNEHMEN', 'LERNEN', 'MEMORIEREN', 'VERINNERLICHEN', 'MEISTERN'],
    fr: ['ABSORBER', 'APPRENDRE', 'MÉMORISER', 'INTÉRIORISER', 'MAÎTRISER']
  };

  const [wordIndex, setWordIndex] = useState(0);
  const currentWords = wordLists[language] || wordLists['en'];
  const dominaWord = currentWords[wordIndex % currentWords.length];

  // Reset index when language changes to start fresh
  useEffect(() => {
    setWordIndex(0);
  }, [language]);

  useEffect(() => {
      const wordInterval = setInterval(() => {
          setWordIndex(prev => prev + 1);
      }, 3500); // Change word every 3.5s
      return () => clearInterval(wordInterval);
  }, [language]); 
  
  // Dynamic Font Size Logic based on word length
  const getWordSizeClass = (len: number) => {
      if (len <= 5) return 'text-[20vw] md:text-[24vw]';
      if (len <= 7) return 'text-[16vw] md:text-[20vw]';
      if (len <= 9) return 'text-[12vw] md:text-[15vw]';
      return 'text-[9vw] md:text-[11vw]';
  };

  // Get pricing for current language
  const price = localizedPricing[language] || localizedPricing['en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignupClick(email);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // --- SCROLL RESET ---
  useEffect(() => {
      if (stage === 2 && contentRef.current) {
          contentRef.current.scrollTop = 0;
      }
  }, [stage]);

  // --- SCROLL LOGIC ---
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      // Debounce rapid scrolls during stage transitions
      if (isAnimating || now - lastScrollTime.current < 800) {
          if (stage !== 2) e.preventDefault(); 
          return;
      }

      // DOWN SCROLL
      if (e.deltaY > 0) {
        if (stage === 0) {
           e.preventDefault();
           setStage(1);
           setIsAnimating(true);
           lastScrollTime.current = now;
           setTimeout(() => setIsAnimating(false), 1000);
        } else if (stage === 1) {
           e.preventDefault();
           setStage(2);
           setIsAnimating(true);
           lastScrollTime.current = now;
           setTimeout(() => setIsAnimating(false), 1000);
        }
      } 
      // UP SCROLL
      else if (e.deltaY < 0) {
        if (stage === 1) {
           e.preventDefault();
           setStage(0);
           setIsAnimating(true);
           lastScrollTime.current = now;
           setTimeout(() => setIsAnimating(false), 1000);
        } else if (stage === 2) {
           if (contentRef.current && contentRef.current.scrollTop <= 0) {
               e.preventDefault();
               setStage(1);
               setIsAnimating(true);
               lastScrollTime.current = now;
               setTimeout(() => setIsAnimating(false), 1000);
           }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [stage, isAnimating]);

  const faqItems = t('faq.items.general') || [];
  const landingFaqs = Array.isArray(faqItems) ? faqItems.slice(0, 4) : [
    { q: "Is FlashAI free?", a: "Yes, start with free daily decks." },
    { q: "What files?", a: "PDF and TXT supported." }
  ];

  const schools = localizedUniversities[language] || localizedUniversities['en'];
  const infiniteSchools = [...schools, ...schools, ...schools, ...schools];

  const actionCases = t('action.cases') || [];

  const comp = {
      legacy: t('comparison_rows.labels.legacy'),
      chatbot: t('comparison_rows.labels.chatbot'),
      open_source: t('comparison_rows.labels.open_source'),
      human: t('comparison_rows.labels.human'),
      manual: t('comparison.manual'),
      wf_1: t('comparison_rows.features.workflow.1'),
      wf_2: t('comparison_rows.features.workflow.2'),
      wf_3: t('comparison_rows.features.workflow.3'),
      sm_1: t('comparison_rows.features.smarts.1'),
      sm_2: t('comparison_rows.features.smarts.2'),
      sm_3: t('comparison_rows.features.smarts.3'),
      sm_4: t('comparison_rows.features.smarts.4'),
      ret_1: t('comparison_rows.features.retention.1'),
      ret_2: t('comparison_rows.features.retention.2'),
      ret_3: t('comparison_rows.features.retention.3'),
      ret_4: t('comparison_rows.features.retention.4'),
      control: t('comparison.control'),
      control_free: t('comparison_rows.features.control.free'),
      control_pro: t('comparison_rows.features.control.pro'),
  };

  return (
    <div className="fixed inset-0 bg-slate-900 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <PublicHeader 
        currentStatus={AppStatus.LANDING}
        onNavigate={onNavigate}
        onLoginClick={onLoginClick}
        onSignupClick={() => onSignupClick('')}
      />

      {/* 
          MAIN SCROLL WRAPPER 
      */}
      <div 
        className="w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
        style={{ transform: `translateY(-${stage * 100}vh)` }}
      >
          
          {/* --- STAGE 0: HERO (100vh) --- */}
          <div className="h-screen w-full relative bg-white overflow-hidden flex flex-col pt-20">
             <div className="absolute inset-0 z-0">
                <PhysicsHero />
             </div>
             <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center pb-20">
                <div className={`max-w-4xl mx-auto flex flex-col items-center transition-all duration-1000 ${stage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-sm'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50/90 backdrop-blur border border-indigo-100 text-indigo-700 text-sm font-bold rounded-lg mb-8 uppercase tracking-wider shadow-sm">
                        <span>🚀</span>
                        {t('hero.new_badge')}
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8 drop-shadow-sm">
                        {t('hero.title_1')} <br />
                        <span className="text-indigo-600">
                        {t('hero.title_2')}
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-600 font-medium mb-12 max-w-2xl leading-tight bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                        {t('hero.subtitle')}
                    </p>

                    <div className="w-full max-w-lg relative group mx-auto">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="email" 
                                required
                                placeholder={t('hero.email_placeholder')}
                                className="flex-1 px-6 py-4 bg-white/80 backdrop-blur border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl outline-none text-xl font-medium transition-all placeholder:text-slate-400 shadow-sm text-center sm:text-left"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all whitespace-nowrap border border-white/20"
                            >
                                {t('hero.cta_free')}
                            </button>
                        </form>
                        
                        <div className="mt-8 flex justify-center">
                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-300 text-yellow-900 text-sm font-extrabold rounded-full shadow-lg border-2 border-yellow-400 hover:scale-105 transition-transform cursor-default animate-fade-in-up">
                                <span className="text-lg">🎁</span>
                                {t('hero.lead_magnet_badge') || 'Limited Time Offer'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 transition-opacity duration-500 ${stage === 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
             </div>
          </div>


          {/* --- STAGE 1: DOMINA (100vh) --- */}
          <div className="h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden px-0">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-[100vw] h-[100vw] bg-indigo-600/30 rounded-full blur-[150px] animate-blob mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[100vw] h-[100vw] bg-purple-600/30 rounded-full blur-[150px] animate-blob animation-delay-2000 mix-blend-screen"></div>
              </div>

              <div className="w-full h-full flex flex-col items-center justify-center relative z-10 px-4 perspective-1000">
                  
                  <h2 
                    className={`text-[4vw] md:text-[3.5vw] font-bold tracking-[0.3em] text-slate-400 mb-0 uppercase whitespace-nowrap transition-all duration-[1200ms] ease-out will-change-transform
                      ${stage === 1 ? 'opacity-70 blur-0 translate-y-0 scale-100' : ''}
                      ${stage === 0 ? 'opacity-0 blur-md translate-y-10 scale-90' : ''}
                      ${stage === 2 ? 'opacity-0 blur-xl -translate-y-[50vh] scale-150' : ''}
                    `}
                  >
                      {t('hero.motivational_1')}
                  </h2>
                  
                  <h2 
                    className={`
                      ${getWordSizeClass(dominaWord.length)} leading-[0.85] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-900 drop-shadow-[0_20px_50px_rgba(79,70,229,0.5)] select-none py-[2vw] px-4 w-full text-center
                      transition-all duration-[1200ms] will-change-transform
                      ${stage === 1 ? 'opacity-100 scale-100 blur-0 ease-out' : ''}
                      ${stage === 0 ? 'opacity-0 scale-[0.2] blur-[20px] ease-in' : ''}
                      ${stage === 2 ? 'opacity-0 scale-[25] blur-xl ease-in' : ''} 
                    `}
                  >
                    <ScrambleText text={dominaWord} />
                  </h2>

                  <p 
                    className={`
                      text-xl md:text-3xl lg:text-4xl text-indigo-200 font-medium max-w-5xl mx-auto mt-8 lg:mt-12 leading-relaxed px-4 text-center
                      transition-all duration-[1200ms] ease-out will-change-transform
                      ${stage === 1 ? 'opacity-80 translate-y-0 blur-0' : ''}
                      ${stage === 0 ? 'opacity-0 translate-y-10 blur-md' : ''}
                      ${stage === 2 ? 'opacity-0 translate-y-[50vh] blur-xl scale-150' : ''}
                    `}
                  >
                      {t('hero.motivational_2')}
                  </p>
                  
                  <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50 transition-opacity duration-700 delay-500 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                  </div>
              </div>
          </div>


          {/* --- STAGE 2: THE REST (100vh Container, Scrollable Internally) --- */}
          <div 
            ref={contentRef}
            className="h-screen w-full bg-white overflow-y-auto"
          >
              <div className="bg-white min-h-screen pt-20"> 
                
                {/* TRUSTED BY SECTION - WITH LOGOS */}
                <section className="py-8 border-y border-slate-100 bg-white overflow-hidden relative z-20">
                    <div className="max-w-7xl mx-auto px-6 text-center mb-8 relative z-30">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{t('hero.trusted_by')}</p>
                    </div>
                    <div className="relative flex overflow-x-hidden group">
                        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
                        <div className="flex animate-scroll whitespace-nowrap gap-12 px-10 items-center">
                            {infiniteSchools.map((school, index) => (
                                <div key={`${school.domain}-${index}`} className="flex-shrink-0 flex items-center justify-center p-4 bg-white/50 backdrop-blur border border-slate-200/50 rounded-xl h-24 min-w-[160px] transition-all hover:shadow-md hover:border-indigo-100 hover:-translate-y-1">
                                    <img 
                                        src={`https://logo.clearbit.com/${school.domain}`}
                                        alt={school.name}
                                        className="max-h-12 max-w-[120px] object-contain"
                                        onError={(e) => {
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                e.currentTarget.style.display = 'none';
                                                parent.innerText = school.name;
                                                parent.classList.add('text-lg', 'font-bold', 'text-slate-700', 'text-center', 'leading-tight', 'whitespace-normal');
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- NARRATIVE SECTION (PAS Framework) --- */}
                <section className="py-32 px-4 relative z-20 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                {t('narrative.problem_title')}
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto">
                                {t('narrative.problem_sub')}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-8 md:p-16 border-l-8 border-red-500 shadow-sm mb-24 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-6 uppercase tracking-wider">
                                    {t('narrative.agitation_bold')}
                                </h3>
                                <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium">
                                    {t('narrative.agitation_text')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-80"></div>
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-30 animate-blob"></div>
                                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
                            </div>
                            
                            <div className="relative z-10">
                                <div className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 text-sm font-bold uppercase tracking-widest mb-8 rounded-full border border-green-500/30">
                                    {t('narrative.solution_badge')}
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                                    {t('narrative.solution_title')}
                                </h2>
                                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
                                    {t('narrative.solution_text')}
                                </p>
                                <button 
                                    onClick={() => onNavigate(AppStatus.PRICING)}
                                    className="px-10 py-5 bg-white text-slate-900 text-xl font-bold rounded-full hover:bg-indigo-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105"
                                >
                                    {t('narrative.cta_urgent')}
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                <section className="py-32 px-4 relative z-20 bg-white border-t border-slate-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-20 max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t('features.title')}</h2>
                        <p className="text-lg text-slate-600">{t('features.subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
                        <div className="md:col-span-2 bg-slate-50 rounded-[2rem] border border-slate-200 p-10 relative overflow-hidden group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 text-center md:text-left">
                            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between items-center md:items-start">
                                <div>
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl mb-6 mx-auto md:mx-0">📄</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('features.universal_input')}</h3>
                                    <p className="text-slate-600 max-w-md mx-auto md:mx-0">{t('features.universal_desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-[2rem] p-10 relative overflow-hidden group text-white text-center md:text-left">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative z-10 h-full flex flex-col items-center md:items-start">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl mb-6">⚡</div>
                                <h3 className="text-2xl font-bold mb-2">{t('features.instant')}</h3>
                                <p className="text-slate-400 mb-auto">{t('features.instant_desc')}</p>
                                <div className="mt-8 text-4xl font-mono font-bold text-indigo-400">0.8s<span className="text-sm font-sans text-slate-500 ml-2 block">avg.</span></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-10 relative overflow-hidden group hover:shadow-2xl hover:border-purple-100 transition-all duration-500 text-center md:text-left">
                            <div className="relative z-10 flex flex-col items-center md:items-start">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-center text-2xl mb-6 text-purple-600">🧠</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('features.srs')}</h3>
                                <p className="text-slate-600">{t('features.srs_desc')}</p>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-[2rem] border border-slate-200 p-10 relative overflow-hidden group hover:shadow-xl transition-all text-center md:text-left">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 flex flex-col items-center md:items-start">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl border border-indigo-200 flex items-center justify-center text-2xl mb-6 text-indigo-600">📈</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('features.insights')}</h3>
                                    <p className="text-slate-600">{t('features.insights_desc')}</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-20"></div>
                    
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">{t('action.badge')}</div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('action.title')}</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t('action.subtitle')}</p>
                        </div>

                        <div className="flex overflow-x-auto pb-12 snap-x snap-mandatory gap-6 px-4 md:px-0 scrollbar-hide">
                            {actionCases.map((item: any, idx: number) => (
                                <div 
                                    key={idx} 
                                    className="min-w-[320px] md:min-w-[380px] snap-center bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 flex flex-col text-left"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-4xl bg-white/10 w-16 h-16 flex items-center justify-center rounded-2xl">{item.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{item.role}</h3>
                                            <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold mt-1">Input: {item.input}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                                        <p className="text-indigo-300 text-sm font-bold italic leading-tight">
                                            {item.question}
                                        </p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <p className="text-sm font-bold text-indigo-300 mb-1 uppercase tracking-wide">The Challenge</p>
                                        <p className="text-slate-300 text-sm leading-relaxed">{item.challenge}</p>
                                    </div>

                                    <div className="mt-auto bg-slate-950/50 rounded-2xl p-5 border border-slate-800">
                                        <p className="text-xs font-bold text-green-400 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            {item.solution}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="comparison" className="py-24 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('comparison.title')}</h2>
                        <p className="text-slate-500">{t('comparison.subtitle')}</p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-[100px_1.5fr_1fr_1fr_1fr_1fr] divide-x divide-slate-100 min-w-[1000px] overflow-x-auto text-center">
                            <div className="p-4 bg-white"></div>
                            <div className="p-6 bg-slate-900 text-white relative flex flex-col justify-end items-center">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">{t('comparison.best_value')}</div>
                                <h3 className="text-2xl font-bold flex items-center gap-2">FlashAI ⚡</h3>
                                <p className="text-indigo-200 text-xs mt-1 font-medium">The Future</p>
                            </div>
                            <div className="p-6 bg-white flex flex-col justify-end items-center"><h3 className="text-lg font-bold text-slate-700">Quizlet Plus</h3><p className="text-slate-400 text-xs mt-1">{comp.legacy}</p></div>
                            <div className="p-6 bg-white flex flex-col justify-end items-center"><h3 className="text-lg font-bold text-slate-700">ChatGPT Plus</h3><p className="text-slate-400 text-xs mt-1">{comp.chatbot}</p></div>
                            <div className="p-6 bg-white flex flex-col justify-end items-center"><h3 className="text-lg font-bold text-slate-700">Anki</h3><p className="text-slate-400 text-xs mt-1">{comp.open_source}</p></div>
                            <div className="p-6 bg-white flex flex-col justify-end items-center"><h3 className="text-lg font-bold text-slate-700">Private Tutor</h3><p className="text-slate-400 text-xs mt-1">{comp.human}</p></div>

                            <div className="p-4 flex items-center justify-end text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">{t('comparison.cost')}</div>
                            <div className="p-6 bg-slate-900/5 flex items-center justify-center font-bold text-slate-900 border-t border-slate-100">
                                <span className="text-3xl text-indigo-600 mr-1">{price.format(price.value)}</span>
                            </div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 font-medium">{price.format(price.subValue)} {t('pricing.month')}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 font-medium">{price.format('20.00')} {t('pricing.month')}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 font-medium">$0 <span className="text-[10px] text-slate-400 ml-1">(Time)</span></div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 font-medium">{price.format('50.00')}+ / hr</div>

                            <div className="p-4 flex items-center justify-end text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">{t('comparison.workflow')}</div>
                            <div className="p-6 bg-slate-900/5 flex items-center justify-center font-bold text-slate-900 border-t border-slate-100"><span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>1-Click PDF to Deck</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.manual}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.wf_1}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.wf_2}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.wf_3}</div>

                            <div className="p-4 flex items-center justify-end text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">{comp.control}</div>
                            <div className="p-6 bg-slate-900/5 flex items-center justify-center font-bold text-slate-900 border-t border-slate-100"><span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>{comp.control_pro}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.control_free}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.control_free}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.control_pro}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.control_pro}</div>

                            <div className="p-4 flex items-center justify-end text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">{t('comparison.smarts')}</div>
                            <div className="p-6 bg-slate-900/5 flex items-center justify-center font-bold text-slate-900 border-t border-slate-100"><span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>Exam-Ready Logic</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.sm_1}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.sm_2}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.sm_3}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.sm_4}</div>

                            <div className="p-4 flex items-center justify-end text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">{t('comparison.retention')}</div>
                            <div className="p-6 bg-slate-900/5 flex items-center justify-center font-bold text-slate-900 border-t border-slate-100"><span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>Automated SRS</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.ret_1}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.ret_2}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.ret_3}</div>
                            <div className="p-6 flex items-center justify-center text-slate-500 border-t border-slate-100 text-sm">{comp.ret_4}</div>
                        </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-4">
                    <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-50"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-50"></div>
                        </div>
                        <div className="relative z-10">
                        <div className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-6 rounded-full border border-green-500/30">{t('cta_bottom.badge')}</div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">{t('cta_bottom.title_pre')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t('cta_bottom.title_highlight')}</span>{t('cta_bottom.title_post')}</h2>
                        <p className="text-indigo-200 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                            {t('cta_bottom.conviction_sub')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                            <button onClick={() => onSignupClick('')} className="px-8 py-5 bg-white text-slate-900 text-lg font-bold rounded-full hover:bg-indigo-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 min-w-[240px]">{t('cta_bottom.button')}</button>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-indigo-100 text-left max-w-2xl mx-auto">
                            <div className="flex items-center gap-3"><span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">✓</span><span>{t('cta_bottom.feat_1')}</span></div>
                            <div className="flex items-center gap-3"><span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">✓</span><span>{t('cta_bottom.feat_2')}</span></div>
                            <div className="flex items-center gap-3"><span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">✓</span><span>{t('cta_bottom.feat_3')}</span></div>
                        </div>
                        </div>
                    </div>
                </section>

                <section className="py-32 px-4 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{t('landing_faq.title')}</h2>
                    <div className="space-y-4">
                        {landingFaqs.map((faq: any, idx: number) => (
                        <div key={idx} className="group border-b border-slate-200 pb-4">
                            <button 
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex items-center justify-between text-left py-4 text-lg font-medium text-slate-800 focus:outline-none hover:text-indigo-600 transition-colors"
                            >
                                {faq.q}
                                <span className={`transform transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`}><svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                                <p className="text-slate-600 leading-relaxed text-left">{faq.a}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <button onClick={() => onNavigate(AppStatus.FAQ)} className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">{t('landing_faq.link')} &rarr;</button>
                    </div>
                </section>

                <PublicFooter onNavigate={onNavigate} />
              </div>
          </div>

      </div>

      <ChatWidget />
    </div>
  );
};

export default LandingPage;
