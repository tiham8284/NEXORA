import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { setAdminPassword, verifyAdminPassword } from '../../services/storageService';
import { ShieldCheck, Lock, KeyRound, Eye, EyeOff, X, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Admin Authorization Required',
  description = 'The Admin Portal contains campus-wide incident triage, SLA escalation controls, IoT hardware overrides, and dispatch management. Please enter the Admin Master Password to access.'
}) => {
  const { loginAsAdminWithPassword } = useAuth();
  const [mode, setMode] = useState<'unlock' | 'change'>('unlock');
  
  // Unlock state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showChangePasswords, setShowChangePasswords] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  if (!isOpen) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the Admin Master Password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const result = loginAsAdminWithPassword(password);
      setIsSubmitting(false);

      if (result.success) {
        setPassword('');
        setError('');
        onSuccess();
      } else {
        setError(result.error || 'Incorrect Admin Password. Access Denied.');
      }
    }, 250);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess(false);

    if (!currentPassword.trim()) {
      setChangeError('Please enter your current admin password.');
      return;
    }
    if (!verifyAdminPassword(currentPassword)) {
      setChangeError('Current admin password is incorrect. Please re-enter.');
      return;
    }
    if (!newPassword.trim()) {
      setChangeError('Please enter a new admin password.');
      return;
    }
    if (newPassword.length < 4) {
      setChangeError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('New passwords do not match. Please verify.');
      return;
    }

    setIsChanging(true);
    setTimeout(() => {
      setAdminPassword(newPassword.trim());
      setIsChanging(false);
      setChangeSuccess(true);
      setPassword(newPassword.trim());

      setTimeout(() => {
        setMode('unlock');
        setChangeSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1400);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-indigo-100 dark:border-slate-800 shadow-2xl overflow-hidden transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Banner Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                SECURE ACCESS GATE
              </span>
              <h2 className="text-lg sm:text-xl font-black leading-tight">
                {mode === 'unlock' ? title : 'Change Admin Password'}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {mode === 'unlock' ? (
            <>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {description}
              </p>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-start gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Admin Master Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('change');
                        setError('');
                        setChangeError('');
                        setChangeSuccess(false);
                      }}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Change Password</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter Admin Master Password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 transition-all hover:scale-102 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isSubmitting ? 'Verifying...' : 'Unlock Admin Portal'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Change Password View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setMode('unlock');
                    setChangeError('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Unlock</span>
                </button>
                <span className="text-[11px] text-slate-400">Admin Security</span>
              </div>

              {changeError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-start gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{changeError}</span>
                </div>
              )}

              {changeSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Admin password updated successfully! Redirecting...</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Admin Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showChangePasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current admin passcode"
                      className="w-full p-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowChangePasswords(!showChangePasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                    >
                      {showChangePasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Admin Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showChangePasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new passcode (min. 4 chars)"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Admin Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showChangePasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new passcode"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('unlock');
                      setChangeError('');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChanging}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isChanging ? 'Updating...' : 'Save New Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
