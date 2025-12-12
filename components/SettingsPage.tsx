
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsPageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onUpgradeClick: () => void;
  onForgotPassword: () => void; // Trigger for auth modal
  onVerifyAccount?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser, onUpgradeClick, onForgotPassword, onVerifyAccount }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Local state for forms
  const [displayName, setDisplayName] = useState(user.name || '');
  const [marketingEmails, setMarketingEmails] = useState(user.preferences.marketingEmails);
  const [productUpdates, setProductUpdates] = useState(user.preferences.productUpdates);
  const [dailyStudyReminder, setDailyStudyReminder] = useState(user.preferences.dailyStudyReminder ?? true); 

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async () => {
      setIsLoading(true);
      setMessage(null);
      try {
          const updatedUser: User = {
              ...user,
              name: displayName
          };
          await authService.updateUser(updatedUser);
          onUpdateUser(updatedUser);
          setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } catch (e) {
          setMessage({ type: 'error', text: 'Failed to update profile.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleUpdatePassword = async () => {
      if (!currentPassword) {
          setMessage({ type: 'error', text: 'Please enter your current password.' });
          return;
      }
      if (newPassword.length < 8) {
          setMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
          return;
      }
      if (newPassword !== confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match.' });
          return;
      }

      setIsLoading(true);
      setMessage(null);
      try {
          // Verify current password first
          const isValid = await authService.verifyPassword(user.email, currentPassword);
          if (!isValid) {
              setMessage({ type: 'error', text: 'Incorrect current password.' });
              setIsLoading(false);
              return;
          }

          const updatedUser: User = {
              ...user,
              password: newPassword
          };
          await authService.updateUser(updatedUser);
          onUpdateUser(updatedUser);
          setMessage({ type: 'success', text: 'Password changed successfully.' });
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
      } catch (e) {
          setMessage({ type: 'error', text: 'Failed to change password.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const updatedUser: User = {
        ...user,
        preferences: {
          ...user.preferences,
          marketingEmails,
          productUpdates,
          dailyStudyReminder
        }
      };
      await authService.updateUser(updatedUser);
      onUpdateUser(updatedUser);
      setMessage({ type: 'success', text: 'Preferences saved successfully.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save preferences.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeCheck = () => {
      if (!user.isVerified) {
          setMessage({ type: 'error', text: 'Please verify your email before upgrading.' });
          return;
      }
      onUpgradeClick();
  };

  const handleResendEmail = async () => {
      if (!user) return;
      setIsLoading(true);
      setMessage(null);
      try {
          const devCode = await authService.resendVerificationCode(user.email);
          if (devCode) {
             setMessage({ type: 'success', text: `Email blocked (browser security). Code: ${devCode}` });
          } else {
             setMessage({ type: 'success', text: `Verification code resent to ${user.email}` });
          }
      } catch (e: any) {
          setMessage({ type: 'error', text: 'Failed to resend code. Please try again later.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleCancelPlan = async () => {
      if(!window.confirm("Are you sure you want to cancel your subscription?")) return;
      
      setIsLoading(true);
      try {
        const updatedUser: User = {
          ...user,
          subscription: {
            ...user.subscription,
            plan: 'free',
            status: 'canceled',
            nextBillingDate: undefined
          },
          preferences: {
              ...user.preferences,
              defaultCount: 5 // Reset to standard free limit
          }
        };
        await authService.updateUser(updatedUser);
        onUpdateUser(updatedUser);
        setMessage({ type: 'success', text: 'Subscription canceled.' });
      } catch (e) {
        setMessage({ type: 'error', text: 'Failed to cancel plan.' });
      } finally {
        setIsLoading(false);
      }
  };

  const handleRefund = async () => {
      if (!window.confirm("Are you sure you want to request a refund? Your Pro features will be removed immediately.")) return;
      
      setIsLoading(true);
      try {
          const updatedUser = await authService.processRefund(user.email);
          onUpdateUser(updatedUser);
          setMessage({ type: 'success', text: 'Refund processed successfully. Plan reverted to Free.' });
      } catch (e) {
          setMessage({ type: 'error', text: 'Refund failed. Please contact support.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleExportData = async () => {
      setIsLoading(true);
      try {
          const decks = await storageService.getDecks(user.email);
          const dataToExport = {
              user: {
                  name: user.name,
                  email: user.email,
                  joined: new Date(user.createdAt).toISOString()
              },
              stats: {
                  totalDecks: decks.length,
                  totalCards: decks.reduce((acc, d) => acc + d.cards.length, 0)
              },
              decks: decks
          };

          const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `flashai_export_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      } catch (e) {
          setMessage({ type: 'error', text: 'Failed to export data.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleDeleteAccount = async () => {
      if (!window.confirm("DANGER: Are you sure? This will permanently delete your account and all flashcards. This action cannot be undone.")) return;
      
      // Second confirmation
      const confirmation = window.prompt("Type 'DELETE' to confirm account deletion:");
      if (confirmation !== 'DELETE') return;

      setIsLoading(true);
      try {
          await authService.deleteAccount(user.email);
          // Force refresh/logout
          window.location.reload();
      } catch (e) {
          setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
          setIsLoading(false);
      }
  };

  // Check if eligible for refund (Active Pro Plan && < 7 days since billing/start)
  const isRefundEligible = React.useMemo(() => {
    if (user.subscription.plan !== 'pro' || user.subscription.status !== 'active') return false;
    if (!user.subscription.nextBillingDate) return false;

    const billingCycleDays = 30;
    const estimatedStartDate = user.subscription.nextBillingDate - (billingCycleDays * 24 * 60 * 60 * 1000);
    const daysSinceStart = (Date.now() - estimatedStartDate) / (24 * 60 * 60 * 1000);
    
    return daysSinceStart <= 7.5;
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-12">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('settings.title')}</h2>
      <p className="text-slate-500 mb-8">{t('settings.sub')}</p>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <span className="mr-2 font-bold">{message.type === 'success' ? '✓' : '⚠'}</span>
          {message.text}
        </div>
      )}

      {/* Verification Banner */}
      {!user.isVerified && onVerifyAccount && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex gap-3">
                <div className="text-amber-500 p-2 bg-amber-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-amber-800">Confirm Your Account</h3>
                    <p className="text-xs text-amber-700 mt-1">Please verify your email address ({user.email}) to secure your account.</p>
                </div>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <button 
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="whitespace-nowrap px-4 py-2 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                    Resend Email
                </button>
                <button 
                    onClick={onVerifyAccount}
                    className="whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                    Enter Code
                </button>
            </div>
        </div>
      )}

      {/* 1. Personal Information */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{t('settings.personal')}</h3>
        </div>
        <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t('settings.display_name')}</label>
                    <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase">{t('auth.email')}</label>
                        {!user.isVerified ? (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1">
                                ⚠ Unverified
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1">
                                ✓ Verified
                            </span>
                        )}
                    </div>
                    <input 
                        type="email" 
                        value={user.email}
                        disabled
                        className={`w-full px-4 py-3 rounded-xl border ${!user.isVerified ? 'border-red-200 bg-red-50/10' : 'border-slate-200 bg-slate-100'} text-slate-500 cursor-not-allowed`}
                    />
                    {!user.isVerified && onVerifyAccount && (
                        <div className="mt-3 flex gap-2">
                            <button 
                                onClick={handleResendEmail}
                                disabled={isLoading}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded hover:bg-indigo-100 transition-colors disabled:opacity-50 border border-indigo-100"
                            >
                                Confirm Account (Send Email)
                            </button>
                            <button 
                                onClick={onVerifyAccount}
                                className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50 transition-colors"
                            >
                                Enter Code
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={handleSaveProfile}
                    disabled={isLoading || displayName === user.name}
                    className="text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    {t('settings.update_profile')}
                </button>
            </div>
        </div>
      </section>

      {/* 2. Security (Password Reset) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{t('settings.security')}</h3>
        </div>
        <div className="p-6">
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <label className="block text-xs font-bold text-slate-700 uppercase">{t('settings.curr_pwd')}</label>
                         <button 
                            onClick={onForgotPassword}
                            className="text-xs text-indigo-600 font-medium hover:underline"
                        >
                            {t('settings.forgot_pwd')}
                        </button>
                    </div>
                    <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t('settings.new_pwd')}</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t('settings.confirm_pwd')}</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={handleUpdatePassword}
                    disabled={isLoading || !newPassword || !currentPassword}
                    className="text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    {t('settings.change_pwd')}
                </button>
            </div>
        </div>
      </section>

      {/* 3. Subscription Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {t('settings.subscription')}
            {user.subscription.plan === 'pro' && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">Pro</span>
            )}
          </h3>
          {user.subscription.plan === 'free' ? (
              <button 
                onClick={handleUpgradeCheck}
                disabled={isLoading}
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-md shadow-indigo-100"
            >
                {t('settings.upgrade')}
              </button>
          ) : (
            <div className="flex gap-2">
                {isRefundEligible && (
                    <button 
                        onClick={handleRefund}
                        disabled={isLoading}
                        className="text-sm font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {t('settings.refund')}
                    </button>
                )}
                <button 
                    onClick={handleCancelPlan}
                    disabled={isLoading}
                    className="text-sm font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    {t('settings.cancel')}
                </button>
            </div>
          )}
        </div>
        <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Current Plan</p>
                    <p className="text-2xl font-bold text-slate-900 capitalize">{user.subscription.plan} Plan</p>
                </div>
                {user.subscription.nextBillingDate && (
                    <div className="flex-1">
                         <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Next Billing</p>
                         <p className="text-lg font-medium text-slate-900">
                             {new Date(user.subscription.nextBillingDate).toLocaleDateString()}
                         </p>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* 4. Payment Methods */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{t('settings.payment')}</h3>
        </div>
        <div className="p-6">
            {user.subscription.cardLast4 ? (
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold tracking-wider">
                            VISA
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700">•••• •••• •••• {user.subscription.cardLast4}</p>
                            <p className="text-xs text-slate-400">Expires 12/28</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-slate-500 mb-4">No payment methods saved.</p>
                </div>
            )}
        </div>
      </section>

      {/* 5. Communication Preferences */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{t('settings.comms')}</h3>
        </div>
        <div className="p-6 space-y-6">
            
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">☕</span>
                        <h4 className="font-medium text-slate-900">{t('settings.daily_email')}</h4>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={dailyStudyReminder}
                        onChange={(e) => setDailyStudyReminder(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-medium text-slate-900">{t('settings.marketing')}</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={marketingEmails}
                        onChange={(e) => setMarketingEmails(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                    onClick={handleSavePreferences}
                    disabled={isLoading}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md active:scale-95 disabled:opacity-50"
                >
                    {t('settings.save')}
                </button>
            </div>
        </div>
      </section>

      {/* 6. Data & Privacy (Danger Zone) */}
      <section className="bg-red-50 rounded-2xl shadow-sm border border-red-100 overflow-hidden">
         <div className="p-6 border-b border-red-100 bg-red-100/50">
             <h3 className="text-lg font-bold text-red-900">{t('settings.data')}</h3>
         </div>
         <div className="p-6 space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                     <h4 className="font-medium text-slate-900">{t('settings.export')}</h4>
                 </div>
                 <button 
                    onClick={handleExportData}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                 >
                     {isLoading ? 'Exporting...' : 'JSON Archive'}
                 </button>
             </div>

             <div className="h-px bg-red-200 w-full"></div>

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                     <h4 className="font-medium text-red-900">{t('settings.delete')}</h4>
                 </div>
                 <button 
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md disabled:opacity-50"
                 >
                     {t('settings.delete')}
                 </button>
             </div>
         </div>
      </section>
    </div>
  );
};

export default SettingsPage;
