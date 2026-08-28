import React, { useState, useEffect } from 'react';
import { resetStoreToSeed, getAdminPassword, setAdminPassword } from '../../services/storageService';
import { RefreshCw, CheckCircle2, Shield, Bell, Database, KeyRound, Lock, Eye, EyeOff, Sparkles, Check } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoTriage, setAutoTriage] = useState(true);

  // Admin Master Password State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    setCurrentPwd(getAdminPassword());
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to the initial seed records? This will restore all default test issues and sensor states.')) {
      resetStoreToSeed();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');

    if (!newPassword.trim()) {
      setPwdError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 4) {
      setPwdError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match. Please recheck.');
      return;
    }

    setAdminPassword(newPassword.trim());
    setCurrentPwd(newPassword.trim());
    setNewPassword('');
    setConfirmPassword('');
    setPwdSuccess(true);
    setTimeout(() => setPwdSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          System Administration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Platform Configuration & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage admin access credentials, system triage rules, and demo seed states
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Demo database successfully restored to default seed state!</span>
        </div>
      )}

      {/* 1. ADMIN MASTER PASSWORD SECURITY CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-indigo-100 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Admin Master Password & Portal Gate</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control the security passcode required to access the Admin Console and override facility dispatch
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Active Admin Passcode
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-sm font-black text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                {showPwd ? currentPwd : '••••••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded"
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-2 rounded-xl border border-indigo-200/50 dark:border-indigo-800/40">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Default demo fallback: <code className="font-bold text-indigo-700 dark:text-indigo-300">admin123</code></span>
          </div>
        </div>

        {pwdSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Admin Master Password updated successfully! All future admin logins will require this passcode.</span>
          </div>
        )}

        {pwdError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 font-medium">
            {pwdError}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                New Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new passcode"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new passcode"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-102 flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Update Admin Passcode</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. DEMO STATE CONTROL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Demo Seed State Control</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Reset store to default complaints, users, and IoT sensors</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-lg">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Restore Clean Hackathon Seed Data</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clears any newly created test issues and resets all 25 pre-loaded issues, timeline audit events, and technician assignments.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shrink-0 border border-slate-300 dark:border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Seed</span>
          </button>
        </div>
      </div>

      {/* 3. TRIAGE AUTOMATION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Triage & Rules Automation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Automatic priority escalation and duplicate suppression</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Automatic Priority Matrix</p>
              <p className="text-slate-500 dark:text-slate-400">Evaluate water leak, high voltage, and fire risk keywords as Critical</p>
            </div>
            <input
              type="checkbox"
              checked={autoTriage}
              onChange={(e) => setAutoTriage(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Critical Emergency Notifications</p>
              <p className="text-slate-500 dark:text-slate-400">Dispatch instant high-priority toast alerts on emergency sensor alerts</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* 4. SYSTEM INFO */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">System Build Specs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Release info for Open Innovation Track presentation</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Environment</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Production MVP</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Version</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">v2.0.0-security</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Security Engine</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Admin Passcode Guard</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Theme Support</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Dark & Light Modes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

