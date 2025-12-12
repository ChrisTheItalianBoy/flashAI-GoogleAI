
import React from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import ChatWidget from './ChatWidget';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';

interface PricingPageProps {
  onNavigate: (status: AppStatus) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onGetPro?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onLoginClick, onSignupClick, onGetPro }) => {
  const { t } = useLanguage();

  const handleUpgradeClick = () => {
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && !currentUser.isVerified) {
          alert('Please verify your email address before upgrading to Pro.');
          return;
      }

      if (onGetPro) onGetPro();
      else onSignupClick();
  };

  const tr = {
      core: t('pricing_page.core_features'),
      adv: t('pricing_page.advanced_tools'),
      rows: {
          ai: t('pricing_page.table.rows.ai_gen'),
          cards: t('pricing_page.table.rows.cards_deck'),
          srs: t('pricing_page.table.rows.srs'),
          kg: t('pricing_page.table.rows.knowledge_graph'),
          upl: t('pricing_page.table.rows.upload_limit'),
          exp: t('pricing_page.table.rows.export')
      },
      val: {
          d3: t('pricing_page.table.values.3_decks'),
          unl: t('pricing_page.table.values.unlimited'),
          c5: t('pricing_page.table.values.5_cards'),
          c50: t('pricing_page.table.values.50_cards'),
          cust: t('pricing_page.table.values.custom'),
          inc: t('pricing_page.table.values.included'),
          unl_n: t('pricing_page.table.values.unlimited_nodes'),
          team: t('pricing_page.table.values.team_graph'),
          mb2: t('pricing_page.table.values.2_mb'),
          mb10: t('pricing_page.table.values.10_mb'),
          mb500: t('pricing_page.table.values.500_mb'),
          txt: t('pricing_page.table.values.text_only'),
          json: t('pricing_page.table.values.json_pdf'),
          api: t('pricing_page.table.values.api_access'),
          pro: t('pricing_page.table.values.pro_only')
      }
  };

  const trans = {
      title: t('pricing_page.transparency.title'),
      desc: t('pricing_page.transparency.desc'),
      items: t('pricing_page.transparency.items') || [],
      guar: t('pricing_page.transparency.guarantee'),
      guar_text: t('pricing_page.transparency.guarantee_text')
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 text-center">
      <PublicHeader 
        currentStatus={AppStatus.PRICING} 
        onNavigate={onNavigate} 
        onLoginClick={onLoginClick} 
        onSignupClick={onSignupClick}
      />
      
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">{t('pricing.title')}</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="overflow-x-auto mb-24 animate-fade-in">
            <table className="w-full max-w-6xl mx-auto text-center border-collapse bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-slate-200">
              <colgroup>
                <col className="w-1/4" />
                <col className="w-1/4" />
                <col className="w-1/4" />
                <col className="w-1/4" />
              </colgroup>
              <thead>
                <tr>
                  <th className="p-4 md:p-6 bg-white"></th>
                  <th className="p-4 md:p-6 bg-slate-50 border-b border-slate-200">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-900">{t('pricing.free_plan')}</h3>
                      <p className="text-sm text-slate-500 mt-1">{t('pricing.free_sub')}</p>
                      <div className="mt-4 text-3xl font-bold text-slate-800">$0<span className="text-sm font-normal text-slate-500">{t('pricing.month')}</span></div>
                    </div>
                  </th>
                  <th className="p-4 md:p-6 bg-indigo-50 border-b border-indigo-100 relative shadow-lg z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wide shadow-sm">
                      {t('comparison.best_value')}
                    </div>
                    <div className="text-center pt-2">
                      <h3 className="text-xl font-extrabold text-indigo-700">{t('pricing.pro_plan')}</h3>
                      <p className="text-sm text-indigo-600/70 mt-1">{t('pricing.pro_sub')}</p>
                      <div className="mt-4 text-4xl font-extrabold text-slate-900">$4.99<span className="text-sm font-normal text-slate-500">{t('pricing.month')}</span></div>
                    </div>
                  </th>
                  <th className="p-4 md:p-6 bg-white border-b border-slate-200">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-900">{t('pricing.enterprise')}</h3>
                      <p className="text-sm text-slate-500 mt-1">{t('pricing.enterprise_sub')}</p>
                      <div className="mt-4 text-3xl font-bold text-slate-800">{t('pricing.custom')}</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                <tr className="bg-slate-50/50"><td colSpan={4} className="p-2 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{tr.core}</td></tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 md:p-6 font-semibold text-slate-700 bg-white text-center">{tr.rows.ai}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.d3}</td>
                  <td className="p-4 md:p-6 text-center bg-indigo-50 font-bold text-indigo-900">{tr.val.unl}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.unl}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 md:p-6 font-semibold text-slate-700 bg-white text-center">{tr.rows.cards}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.c5}</td>
                  <td className="p-4 md:p-6 text-center bg-indigo-50 font-bold text-indigo-900">{tr.val.c50}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.cust}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 md:p-6 font-semibold text-slate-700 bg-white text-center">{t('features.srs')}</td>
                  <td className="p-4 md:p-6 text-center text-slate-400">—</td>
                  <td className="p-4 md:p-6 text-center bg-indigo-50 font-bold text-green-600">{tr.val.inc}</td>
                  <td className="p-4 md:p-6 text-center text-green-600">{tr.val.inc}</td>
                </tr>

                <tr className="bg-slate-50/50"><td colSpan={4} className="p-2 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{tr.adv}</td></tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 md:p-6 font-semibold text-slate-700 bg-white text-center">{tr.rows.kg}</td>
                  <td className="p-4 md:p-6 text-center">
                      <span className="bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded text-xs uppercase">{tr.val.pro}</span>
                  </td>
                  <td className="p-4 md:p-6 text-center bg-indigo-50 font-bold text-indigo-900">{tr.val.unl_n}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.team}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 md:p-6 font-semibold text-slate-700 bg-white text-center">{tr.rows.upl}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.mb2}</td>
                  <td className="p-4 md:p-6 text-center bg-indigo-50 font-bold text-indigo-900">{tr.val.mb10}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.mb500}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 md:p-6 font-semibold text-slate-700 bg-white text-center">{tr.rows.exp}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.txt}</td>
                  <td className="p-4 md:p-6 text-center bg-indigo-50 font-bold text-indigo-900">{tr.val.json}</td>
                  <td className="p-4 md:p-6 text-center text-slate-600">{tr.val.api}</td>
                </tr>

                <tr>
                  <td className="p-4 md:p-6 bg-white"></td>
                  <td className="p-4 md:p-6 bg-slate-50 text-center">
                    <button onClick={onSignupClick} className="w-full py-3 rounded-xl text-slate-700 font-bold border border-slate-200 hover:bg-white transition-colors">{t('pricing.start_free')}</button>
                  </td>
                  <td className="p-4 md:p-6 bg-indigo-50 border-x border-indigo-100 text-center">
                    <button 
                      onClick={handleUpgradeClick}
                      className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                    >
                      {t('pricing.upgrade')}
                    </button>
                  </td>
                  <td className="p-4 md:p-6 bg-white text-center">
                    <button className="text-slate-500 font-semibold hover:text-slate-700">{t('pricing.contact')}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TRANSPARENCY SECTION */}
          <div className="grid md:grid-cols-2 gap-12 bg-slate-900 rounded-[2.5rem] p-12 text-white text-center md:text-left">
              <div>
                  <h3 className="text-3xl font-bold mb-6">{trans.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                      {trans.desc}
                  </p>
                  <ul className="space-y-4">
                      {trans.items.map((item: any, i: number) => (
                          <li key={i} className="flex items-center gap-3 justify-center md:justify-start">
                              <div className="w-16 text-right font-mono font-bold text-green-400">{item.cost}</div>
                              <span className="text-sm text-slate-400">{item.label}</span>
                          </li>
                      ))}
                  </ul>
              </div>
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col justify-center text-center">
                   <h4 className="text-xl font-bold mb-2">{trans.guar}</h4>
                   <p className="text-slate-400 mb-6">{trans.guar_text}</p>
                   <div className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
                       🛡️
                   </div>
              </div>
          </div>

        </div>
      </main>
      
      <PublicFooter onNavigate={onNavigate} />
      <ChatWidget />
    </div>
  );
};

export default PricingPage;
