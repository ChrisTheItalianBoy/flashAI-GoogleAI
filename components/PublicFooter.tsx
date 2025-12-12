
import React from 'react';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface PublicFooterProps {
  onNavigate: (status: AppStatus) => void;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const c = t('page_content.footer');

  return (
    <footer className="bg-white border-t border-slate-100 py-12 font-sans text-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
           <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-center">
              <div 
                  className="flex items-center gap-2 mb-4 cursor-pointer"
                  onClick={() => onNavigate(AppStatus.LANDING)}
              >
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">⚡</div>
                 <span className="text-xl font-bold text-slate-900">FlashAI</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                 {c.tagline}
              </p>
           </div>
           <div>
              <h4 className="font-bold text-slate-900 mb-4">{c.headers.product}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate(AppStatus.PRICING)}>{c.links.pricing}</li>
                 <li className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate(AppStatus.USE_CASES)}>{c.links.use_cases}</li>
                 <li className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate(AppStatus.LANDING)}>{c.links.features}</li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-slate-900 mb-4">{c.headers.company}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate(AppStatus.ABOUT)}>{c.links.mission}</li>
                 <li className="hover:text-indigo-600 cursor-pointer">{c.links.careers}</li>
                 <li className="hover:text-indigo-600 cursor-pointer">{c.links.legal}</li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-slate-900 mb-4">{c.headers.support}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate(AppStatus.FAQ)}>{c.links.faq}</li>
                 <li className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate(AppStatus.CONTACT)}>{c.links.contact}</li>
                 <li className="hover:text-indigo-600 cursor-pointer">Twitter</li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 text-center text-sm text-slate-400 flex flex-col md:flex-row justify-between items-center">
           <p>{c.copy}</p>
           <div className="flex gap-4 mt-4 md:mt-0 justify-center">
              <span className="cursor-pointer hover:text-slate-600">{c.links.privacy}</span>
              <span className="cursor-pointer hover:text-slate-600">{c.links.terms}</span>
           </div>
        </div>
    </footer>
  );
};

export default PublicFooter;
