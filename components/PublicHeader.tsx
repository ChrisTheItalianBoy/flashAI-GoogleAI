import React, { useState } from 'react';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../services/i18nService';

interface PublicHeaderProps {
  currentStatus: AppStatus;
  onNavigate: (status: AppStatus) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ currentStatus, onNavigate, onLoginClick, onSignupClick }) => {
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const linkClass = (status: AppStatus) => 
    `text-sm font-medium transition-colors cursor-pointer ${currentStatus === status ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-indigo-600'}`;

  const handleComparisonClick = () => {
      if (currentStatus === AppStatus.LANDING) {
          const el = document.getElementById('comparison');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
          onNavigate(AppStatus.LANDING);
          // Small timeout to allow render before scrolling
          setTimeout(() => {
              const el = document.getElementById('comparison');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
      }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate(AppStatus.LANDING)}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
            ⚡
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Flash<span className="text-indigo-600">AI</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <button onClick={() => onNavigate(AppStatus.USE_CASES)} className={linkClass(AppStatus.USE_CASES)}>{t('nav.use_cases')}</button>
          <button onClick={handleComparisonClick} className="text-sm font-medium transition-colors cursor-pointer text-slate-600 hover:text-indigo-600">{t('nav.comparison')}</button>
          <button onClick={() => onNavigate(AppStatus.PRICING)} className={linkClass(AppStatus.PRICING)}>{t('nav.pricing')}</button>
          <button onClick={() => onNavigate(AppStatus.FAQ)} className={linkClass(AppStatus.FAQ)}>{t('nav.faq')}</button>
          <button onClick={() => onNavigate(AppStatus.ABOUT)} className={linkClass(AppStatus.ABOUT)}>{t('nav.mission')}</button>
          
          <div className="h-4 w-px bg-slate-200"></div>
          
          {/* Language Selector */}
          <div className="relative">
            <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
                <span>{availableLanguages[language].flag}</span>
                <span className="uppercase">{language}</span>
            </button>
            {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-32 animate-fade-in">
                    {Object.entries(availableLanguages).map(([code, data]) => (
                        <button
                            key={code}
                            onClick={() => { setLanguage(code as Language); setIsLangOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                        >
                            <span>{(data as any).flag}</span>
                            <span>{(data as any).name}</span>
                        </button>
                    ))}
                </div>
            )}
          </div>

          <button 
            onClick={onLoginClick}
            className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            {t('nav.login')}
          </button>
          <button 
            onClick={onSignupClick}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-md"
          >
            {t('nav.get_started')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicHeader;