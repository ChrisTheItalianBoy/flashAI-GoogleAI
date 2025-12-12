
import React, { useState } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import ChatWidget from './ChatWidget';
import { AppStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { emailService } from '../services/emailService';

interface ContactPageProps {
  onNavigate: (status: AppStatus) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onLoginClick, onSignupClick }) => {
  const { t } = useLanguage();
  const c = t('page_content.contact');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Send email using the service
    const emailBody = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    // In a real scenario, this would send to support@flashai.com
    // For demo/dev purposes, it sends to the user's email so they can verify it works
    await emailService.sendEmail(
        formData.email, // Sending copy to user for confirmation in demo
        `FlashAI Support: ${formData.subject}`, 
        emailBody
    );

    setIsSending(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <PublicHeader 
        currentStatus={AppStatus.CONTACT} 
        onNavigate={onNavigate} 
        onLoginClick={onLoginClick} 
        onSignupClick={onSignupClick}
      />

      <main className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">{c.title}</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {c.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Contact Info Side */}
            <div className="bg-slate-900 text-white p-10 rounded-[2rem] relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-30"></div>
                
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-8">{c.info.get_in_touch}</h3>
                    
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">
                                📧
                            </div>
                            <div>
                                <p className="font-bold text-lg">{c.info.email_t}</p>
                                <p className="text-slate-400 mb-1">{c.info.email_d}</p>
                                <a href="mailto:support@flashai.com" className="text-indigo-300 hover:text-white transition-colors">support@flashai.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">
                                📍
                            </div>
                            <div>
                                <p className="font-bold text-lg">{c.info.hq_t}</p>
                                <p className="text-slate-400">Piazza Gae Aulenti, 10</p>
                                <p className="text-slate-400">20154 Milano, Italy</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-indigo-500/50">
                                🤖
                            </div>
                            <div>
                                <p className="font-bold text-lg">{c.info.agent_t}</p>
                                <p className="text-slate-400 mb-1">{c.info.agent_d}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/10">
                         <div className="flex gap-4">
                             <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">Twitter / X</a>
                             <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">LinkedIn</a>
                         </div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 animate-fade-in delay-100">
                {submitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-2xl mb-6">
                            ✓
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{c.form.success_t}</h3>
                        <p className="text-slate-500 max-w-xs">{c.form.success_d}</p>
                        <button 
                            onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                            className="mt-8 text-indigo-600 font-bold hover:underline"
                        >
                            {c.form.another}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{c.form.name}</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{c.form.email}</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="jane@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{c.form.subject}</label>
                            <select 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="">Select...</option>
                                <option value="support">Technical Support</option>
                                <option value="billing">Billing & Subscription</option>
                                <option value="sales">Enterprise Sales</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{c.form.message}</label>
                            <textarea 
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                placeholder="..."
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSending}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.99] disabled:opacity-70 flex justify-center items-center"
                        >
                            {isSending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                c.form.btn
                            )}
                        </button>
                    </form>
                )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter onNavigate={onNavigate} />
      <ChatWidget />
    </div>
  );
};

export default ContactPage;
