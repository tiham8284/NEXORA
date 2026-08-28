import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { changeUserPassword } from '../../services/storageService';
import { Modal } from '../../components/common/Modal';
import {
  Layers,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Wrench,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Check
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('student@fixitcampus.demo');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change Password Modal State
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeEmail, setChangeEmail] = useState('student@fixitcampus.demo');
  const [changeRole, setChangeRole] = useState<UserRole>('student');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showChangePasswords, setShowChangePasswords] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    setPassword('');
    if (newRole === 'student') {
      setEmail('student@fixitcampus.demo');
    } else if (newRole === 'admin') {
      setEmail('admin@fixitcampus.demo');
    } else if (newRole === 'maintenance') {
      setEmail('maintenance@fixitcampus.demo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both your account identifier and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const result = login(email, password, role);
      setIsSubmitting(false);

      if (result.success) {
        if (role === 'student') onNavigate('/student/dashboard');
        else if (role === 'admin') onNavigate('/admin/dashboard');
        else if (role === 'maintenance') onNavigate('/maintenance/dashboard');
      } else {
        setError(result.error || 'Invalid credentials. Please verify your password.');
      }
    }, 200);
  };

  const handleOpenChangePassword = () => {
    setChangeEmail(email);
    setChangeRole(role);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangeError('');
    setChangeSuccess(false);
    setIsChangeModalOpen(true);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess(false);

    if (!currentPassword.trim()) {
      setChangeError('Please enter your current password.');
      return;
    }
    if (!newPassword.trim()) {
      setChangeError('Please enter a new password.');
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
      const res = changeUserPassword(changeEmail, currentPassword, newPassword, changeRole);
      setIsChanging(false);
      if (res.success) {
        setChangeSuccess(true);
        setPassword(newPassword); // fill new password into login input
        setTimeout(() => {
          setIsChangeModalOpen(false);
          setChangeSuccess(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }, 1500);
      } else {
        setChangeError(res.error || 'Failed to update password. Please check your current password.');
      }
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 via-blue-50/20 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Layers className="w-7 h-7" />
            </div>
            <span className="font-black text-3xl tracking-tight bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-600 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              NEXORA
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Sign In to Portal</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Smart India Hackathon 2026 • Problem Statement 306 • Team Nexora
          </p>
        </div>

        {/* Portal Selection Tabs */}
        <div className="bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-2xl grid grid-cols-3 gap-1 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${role === 'student'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 relative cursor-pointer ${role === 'admin'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/50 dark:border-indigo-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="flex items-center gap-1">
              Admin
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('maintenance')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${role === 'maintenance'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Staff</span>
          </button>
        </div>

        {/* Security Notice for Admin */}
        {role === 'admin' && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/60 dark:to-blue-950/40 border border-indigo-200/80 dark:border-indigo-800 rounded-2xl p-4 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-950 dark:text-indigo-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Password-Protected Facilities Admin Portal
              </span>
              <span className="text-[10px] bg-indigo-200/70 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">
                Restricted
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              Requires administrative authentication. Use your configured passcode to log in or click "Change Password" below to reset it.
            </p>
          </div>
        )}

        {/* Card Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-indigo-100 dark:border-slate-800 shadow-xs space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-start gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {role === 'admin' ? 'Admin Email / ID' : role === 'maintenance' ? 'Technician Email' : 'Student Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {role === 'admin' ? 'Admin Master Password' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={handleOpenChangePassword}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={role === 'admin' ? 'Enter admin passcode' : 'Enter your password'}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  required
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-102 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {role === 'admin' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? 'Authenticating Admin...' : 'Authenticate & Open Admin Portal'}</span>
                </>
              ) : (
                <>
                  <span>{isSubmitting ? 'Signing In...' : `Sign In as ${role === 'student' ? 'Student' : 'Staff'}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {role === 'student' && (
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                New student without an account?{' '}
                <button
                  onClick={() => onNavigate('/register')}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold hover:underline cursor-pointer"
                >
                  Register Campus ID
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        title="Change Account Password"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300">
            <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <p>Update your password credentials. Future sign-ins will require the newly updated password.</p>
          </div>

          {changeError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-start gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{changeError}</span>
            </div>
          )}

          {changeSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Password updated successfully! Autofilling your new password...</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={changeEmail}
                onChange={(e) => setChangeEmail(e.target.value)}
                placeholder="name@campus.edu"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showChangePasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
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
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showChangePasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 4 chars)"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showChangePasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsChangeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isChanging}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isChanging ? 'Updating...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};


