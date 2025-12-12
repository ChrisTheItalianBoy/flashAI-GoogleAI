
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  initialMode?: 'login' | 'signup' | 'forgot' | 'verify';
  onAuthSuccess: (user: User) => void;
  bonusCardsActive?: boolean; // If true, sets default preference to 25
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialEmail = '', 
  initialMode = 'login', 
  onAuthSuccess,
  bonusCardsActive = false
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode === 'verify' ? 'login' : initialMode);
  
  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
    if (initialMode === 'verify') {
        setIsVerifying(true);
        setMode('login'); // Background mode doesn't matter much here
    } else {
        setMode(initialMode || 'login');
        setIsVerifying(false);
    }
    setError('');
    setSuccessMsg('');
    setPassword('');
    setVerificationCode('');
  }, [isOpen, initialEmail, initialMode]);

  if (!isOpen) return null;

  const handleResendCode = async () => {
      setIsLoading(true);
      setSuccessMsg('');
      setError('');
      try {
          const devCode = await authService.resendVerificationCode(email);
          if (devCode) {
              setVerificationCode(devCode);
              setSuccessMsg(`Dev Mode: Verification code ${devCode} auto-filled.`);
          } else {
              setSuccessMsg('Verification code resent to your email.');
          }
      } catch (err: any) {
          setError('Failed to resend code.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // NORMALIZE EMAIL: Trim whitespace and lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // 1. VERIFICATION STEP
    if (isVerifying) {
        if (verificationCode.length !== 6) {
            setError('Please enter the 6-digit code sent to your email.');
            return;
        }
        setIsLoading(true);
        try {
            const verifiedUser = await authService.verifyAccount(normalizedEmail, verificationCode);
            setSuccessMsg('Account Verified!');
            setTimeout(() => {
                onAuthSuccess(verifiedUser);
                onClose();
            }, 800);
        } catch (err: any) {
            setError(err.message || 'Verification failed. Try again.');
        } finally {
            setIsLoading(false);
        }
        return;
    }

    // 2. NORMAL AUTH STEPS
    // Custom Validation: Require email format unless the user is 'admin'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(normalizedEmail);
    
    if (normalizedEmail !== 'admin' && !isEmail) {
        setError('Please enter a valid email address.');
        return;
    }

    // Robust Password Validation (Only for Sign Up)
    if (mode === 'signup') {
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (!/[a-zA-Z]/.test(password)) {
            setError('Password must contain at least one letter.');
            return;
        }
        if (!/\d/.test(password)) {
            setError('Password must contain at least one number.');
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError('Password must contain at least one special character (e.g. !@#$).');
            return;
        }
    }

    setIsLoading(true);

    try {
      if (mode === 'forgot') {
         await authService.resetPassword(normalizedEmail);
         setSuccessMsg('If an account exists with this email, you will receive a password reset link shortly.');
         setIsLoading(false);
         return;
      }

      if (mode === 'signup') {
        const defaultCount = bonusCardsActive ? 25 : 10;
        const result = await authService.register(normalizedEmail, password, defaultCount);
        
        if (result.pendingVerification) {
            setIsVerifying(true);
            
            // Check if Dev/Fallback Code was returned (happens if Email API fails due to CORS or Server Error)
            if (result.devCode) {
                setVerificationCode(result.devCode);
                // We show this as a success message with the code included, rather than an error
                setSuccessMsg(`Dev Mode: Code ${result.devCode} auto-filled.`);
            } else {
                setSuccessMsg(`Confirmation email sent to ${normalizedEmail}`);
            }
            // Don't close, wait for user to click Verify
        } else {
            onAuthSuccess(result.user);
            onClose();
        }
      } else {
        // LOGIN
        const user = await authService.login(normalizedEmail, password);
        onAuthSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      if (mode !== 'forgot') setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {!isVerifying && (
            <div className="flex border-b border-slate-100">
            <button
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors
                ${mode === 'login' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}
                `}
            >
                {t('auth.login_btn')}
            </button>
            <button
                onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors
                ${mode === 'signup' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}
                `}
            >
                {t('auth.signup_btn')}
            </button>
            </div>
        )}

        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800">
              {isVerifying ? 'Verify Email' : (mode === 'login' ? t('auth.login_title') : (mode === 'signup' ? t('auth.signup_title') : 'Reset Password'))}
            </h3>
            {mode === 'signup' && bonusCardsActive && !isVerifying && (
              <p className="text-green-600 text-sm font-semibold mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                {t('auth.bonus')}
              </p>
            )}
            <p className="text-slate-500 mt-2 text-sm">
              {isVerifying && 'Enter the 6-digit code sent to your email.'}
              {!isVerifying && mode === 'login' && 'Enter your details to access your flashcards.'}
              {!isVerifying && mode === 'signup' && 'Start generating flashcards in seconds.'}
              {!isVerifying && mode === 'forgot' && 'Enter your email to receive reset instructions.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* EMAIL / CODE INPUTS */}
            {!isVerifying ? (
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">{t('auth.email')}</label>
                    <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="you@example.com"
                    />
                </div>
            ) : (
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Confirmation Code</label>
                    <input
                        type="text"
                        required
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                        placeholder="123456"
                    />
                </div>
            )}

            {/* PASSWORD INPUT (Only if not verifying and not forgot) */}
            {mode !== 'forgot' && !isVerifying && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">{t('auth.password')}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                {mode === 'signup' && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t('auth.password_req')}
                  </p>
                )}
                {mode === 'login' && (
                  <div className="text-right mt-1">
                    <button 
                        type="button"
                        onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        {t('auth.forgot')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            {successMsg && (
              <div className={`p-3 text-sm rounded-lg text-center font-semibold ${successMsg.includes('Dev Mode') ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!!successMsg && mode === 'forgot' && !successMsg.includes("Dev Mode"))}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                 isVerifying ? 'Verify & Login' : (mode === 'login' ? t('auth.login_btn') : (mode === 'signup' ? t('auth.signup_btn') : t('auth.reset')))
              )}
            </button>

            {isVerifying && (
                <div className="text-center mt-4">
                    <button 
                        type="button"
                        onClick={handleResendCode}
                        className="text-xs text-slate-500 hover:text-indigo-600 font-medium underline"
                    >
                        Didn't receive code? Resend
                    </button>
                </div>
            )}

            {mode === 'forgot' && !isVerifying && (
                <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                    className="w-full py-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
                >
                    Back to Login
                </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
