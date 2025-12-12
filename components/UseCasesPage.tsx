
import React from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import ChatWidget from './ChatWidget';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface UseCasesPageProps {
  onNavigate: (status: AppStatus) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const UseCasesPage: React.FC<UseCasesPageProps> = ({ onNavigate, onLoginClick, onSignupClick }) => {
  const { t } = useLanguage();
  const content = t('page_content.use_cases');

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <PublicHeader 
        currentStatus={AppStatus.USE_CASES} 
        onNavigate={onNavigate} 
        onLoginClick={onLoginClick} 
        onSignupClick={onSignupClick}
      />
      
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">{content.badge}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-6">{content.title}</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {content.cards.map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-all hover:shadow-md animate-fade-in">
                <div className="text-5xl mb-6">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, tIdx: number) => (
                        <span key={tIdx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* DEEP DIVES SECTION */}
          <div className="mb-24">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">{content.deep_dives}</h2>
              
              {/* Scenario 1: Medical */}
              <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                  <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">🩺</span>
                          <h3 className="font-bold text-xl">{content.scenarios.med.title}</h3>
                      </div>
                      <p className="text-slate-600 mb-6 italic">"{content.scenarios.med.quote}"</p>
                      <ul className="space-y-3 text-sm text-slate-700">
                          {content.scenarios.med.list.map((li: string, i: number) => (
                              <li key={i} className="flex gap-2"><span className="text-green-500">✓</span> {li}</li>
                          ))}
                      </ul>
                  </div>
                  <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">{content.scenarios.med.desc_title}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed mb-6">
                          {content.scenarios.med.desc_body}
                      </p>
                  </div>
              </div>

              {/* Scenario 2: Technical */}
              <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                  <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">💻</span>
                          <h3 className="font-bold text-xl">{content.scenarios.dev.title}</h3>
                      </div>
                      <p className="text-slate-600 mb-6 italic">"{content.scenarios.dev.quote}"</p>
                      <ul className="space-y-3 text-sm text-slate-700">
                          {content.scenarios.dev.list.map((li: string, i: number) => (
                              <li key={i} className="flex gap-2"><span className="text-green-500">✓</span> {li}</li>
                          ))}
                      </ul>
                  </div>
                  <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">{content.scenarios.dev.desc_title}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed mb-6">
                          {content.scenarios.dev.desc_body}
                      </p>
                  </div>
              </div>
          </div>

          {/* CTA */}
          <div className="bg-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-4">{content.cta.title}</h2>
                 <p className="text-indigo-200 mb-8 max-w-xl mx-auto">{content.cta.sub}</p>
                 <button 
                    onClick={onSignupClick}
                    className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                 >
                    {content.cta.btn}
                 </button>
             </div>
             {/* Decorative circles */}
             <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
      </main>

      <PublicFooter onNavigate={onNavigate} />
      <ChatWidget />
    </div>
  );
};

export default UseCasesPage;
