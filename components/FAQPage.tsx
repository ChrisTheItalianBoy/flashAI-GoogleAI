
import React, { useState } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import ChatWidget from './ChatWidget';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FAQPageProps {
  onNavigate: (status: AppStatus) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ onNavigate, onLoginClick, onSignupClick }) => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string>('general');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Retrieve categories and items from translation service
  const categories = t('faq.categories') || {};
  const items = t('faq.items') || {};
  
  const currentFaqs = items[openSection] || [];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <PublicHeader 
        currentStatus={AppStatus.FAQ} 
        onNavigate={onNavigate} 
        onLoginClick={onLoginClick} 
        onSignupClick={onSignupClick}
      />

      <main className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">{t('faq.title')}</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('page_content.faq_sub')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <div className="w-full md:w-64 flex flex-col gap-2">
                  {Object.keys(categories).map(catKey => (
                      <button 
                        key={catKey}
                        onClick={() => { setOpenSection(catKey); setOpenIndex(null); }}
                        className={`text-left px-4 py-3 rounded-xl font-bold capitalize transition-all ${openSection === catKey ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                          {categories[catKey]}
                      </button>
                  ))}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                  {currentFaqs.map((faq: any, index: number) => (
                    <div 
                        key={index} 
                        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                        >
                        <span className={`font-bold text-lg ${openIndex === index ? 'text-indigo-700' : 'text-slate-800'}`}>
                            {faq.q}
                        </span>
                        <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                        </button>
                        <div 
                        className={`px-6 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                        <p className="text-slate-600 leading-relaxed">
                            {faq.a}
                        </p>
                        </div>
                    </div>
                    ))}
              </div>
          </div>

        </div>
      </main>

      <PublicFooter onNavigate={onNavigate} />
      <ChatWidget />
    </div>
  );
};

export default FAQPage;
