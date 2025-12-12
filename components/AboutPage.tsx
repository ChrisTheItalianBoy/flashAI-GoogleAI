
import React from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import ChatWidget from './ChatWidget';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutPageProps {
  onNavigate: (status: AppStatus) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onLoginClick, onSignupClick }) => {
  const { t } = useLanguage();
  const c = t('page_content.about'); 

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <PublicHeader 
        currentStatus={AppStatus.ABOUT} 
        onNavigate={onNavigate} 
        onLoginClick={onLoginClick} 
        onSignupClick={onSignupClick}
      />

      <main className="pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-24 animate-fade-in-up">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-4 block">{c.mission_badge}</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
              {c.title_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{c.title_2}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {c.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-y border-slate-100 py-12">
              <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">35k+</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{c.stats.learners}</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">1.2M</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{c.stats.cards}</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">140+</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{c.stats.countries}</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">99.9%</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{c.stats.uptime}</div>
              </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
              <div className="order-2 md:order-1">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">{c.origin_title}</h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                      {c.origin_text_1}
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                      {c.origin_text_2}
                  </p>
              </div>
              <div className="order-1 md:order-2 bg-slate-50 rounded-3xl p-8 border border-slate-200">
                  {/* Chart Visualization */}
                  <div className="space-y-6">
                      <div>
                          <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                              <span>{c.origin_chart.manual}</span>
                              <span>{c.origin_chart.manual_time}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-12 relative overflow-hidden">
                              <div className="absolute top-0 left-0 h-full w-[90%] bg-slate-400 opacity-20"></div>
                              <div className="absolute inset-0 flex items-center px-4 text-slate-500 text-xs italic">
                                  Type... Type... Copy... Paste... Format...
                              </div>
                          </div>
                      </div>
                      <div>
                          <div className="flex justify-between text-sm font-bold text-indigo-600 mb-2">
                              <span>{c.origin_chart.ai}</span>
                              <span>{c.origin_chart.ai_time}</span>
                          </div>
                          <div className="w-full bg-indigo-100 rounded-full h-12 relative overflow-hidden">
                              <div className="absolute top-0 left-0 h-full w-[5%] bg-indigo-600 animate-pulse"></div>
                              <div className="absolute inset-0 flex items-center px-4 text-indigo-700 text-xs font-bold">
                                  Done.
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                  <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[100px]"></div>
                  <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-[100px]"></div>
              </div>
              <div className="relative z-10">
                  <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs mb-4 block">{c.tech.badge}</span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">{c.tech.title}</h2>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
                      {c.tech.desc}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                      <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl border border-white/10 font-mono text-sm">
                          LLM Reasoning
                      </div>
                      <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl border border-white/10 font-mono text-sm">
                          RAG Pipeline
                      </div>
                      <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl border border-white/10 font-mono text-sm">
                          Knowledge Graph
                      </div>
                  </div>
              </div>
          </div>

          <div className="mt-32 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{c.team.title}</h2>
              <p className="text-slate-600 text-lg mb-8">
                  {c.team.desc} <span className="font-bold text-slate-900">{c.team.goal}</span>
              </p>
              <button 
                onClick={onSignupClick}
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
              >
                  {c.team.btn}
              </button>
          </div>

        </div>
      </main>

      <PublicFooter onNavigate={onNavigate} />
      <ChatWidget />
    </div>
  );
};

export default AboutPage;
