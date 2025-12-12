
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface MockPaymentPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MockPaymentPage: React.FC<MockPaymentPageProps> = ({ onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Security Check: Ensure verification
  useEffect(() => {
      const user = authService.getCurrentUser();
      if (user && !user.isVerified) {
          alert("Account must be verified before purchasing.");
          onCancel();
      }
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  // Basic formatting for visual realism
  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    val = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(val);
  };

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpiry(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Order Summary (Left) */}
        <div className="bg-slate-900 text-white p-8 md:p-12 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">⚡</div>
               <span className="text-xl font-bold">FlashAI</span>
            </div>
            
            <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Subscribe to</p>
            <h2 className="text-3xl font-bold mb-6">Pro Plan</h2>
            
            <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div>
                  <span className="text-slate-300">Unlimited AI Generations</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div>
                  <span className="text-slate-300">50 Cards per Deck (vs 5)</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div>
                  <span className="text-slate-300">Dark Mode</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div>
                  <span className="text-slate-300">Knowledge Graph & SRS</span>
               </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-700">
             <div className="flex justify-between items-end">
                <span className="text-slate-400">Total due today</span>
                <span className="text-3xl font-bold">$4.99</span>
             </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-12 -left-24 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        {/* Payment Form (Right) */}
        <div className="p-8 md:p-12 md:w-7/12 bg-white">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Payment Details</h3>
              <button onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address</label>
                 <input type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Card Information</label>
                 <div className="relative">
                    <input 
                        type="text" 
                        required 
                        placeholder="1234 5678 1234 5678" 
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardInput}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pl-12 font-mono" 
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Expiry Date</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="MM / YY" 
                        maxLength={5}
                        value={expiry}
                        onChange={handleExpiryInput}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono" 
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">CVC</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="123" 
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono" 
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Cardholder Name</label>
                 <input type="text" required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              </div>

              <div className="pt-4">
                 <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {processing ? (
                        <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           Processing...
                        </>
                    ) : (
                        <>Pay $4.99</>
                    )}
                 </button>
                 <div className="text-center mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    Secure 256-bit SSL Encrypted payment
                 </div>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentPage;
