import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { resetStoreToSeed } from '../../services/storageService';
import { UserCheck, ShieldCheck, Wrench, RefreshCw, Sparkles, Layers, Lock } from 'lucide-react';

interface DemoBannerProps {
  onNavigate?: (route: string) => void;
  onPromptAdminAuth?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onNavigate, onPromptAdminAuth }) => {
  const { currentUser, loginAsDemo } = useAuth();

  const handleSwitch = (role: 'student' | 'admin' | 'maintenance') => {
    if (role === 'admin') {
      if (currentUser?.role === 'admin') {
        if (onNavigate) onNavigate('/admin/dashboard');
      } else {
        if (onPromptAdminAuth) {
          onPromptAdminAuth();
        } else if (onNavigate) {
          onNavigate('/login');
        }
      }
      return;
    }

    loginAsDemo(role);
    if (onNavigate) {
      if (role === 'student') onNavigate('/student/dashboard');
      if (role === 'maintenance') onNavigate('/maintenance/dashboard');
    }
  };

  const handleReset = () => {
    if (confirm('Reset NEXORA database to initial demo state? (Will restore all sample complaints and telemetry)')) {
      resetStoreToSeed();
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-slate-200 px-4 py-2 text-xs border-b border-indigo-900/50 flex flex-wrap items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-2">
        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
          <Layers className="w-3.5 h-3.5" />
          TEAM NEXORA
        </span>
        <span className="hidden md:inline text-indigo-200 text-xs font-semibold">
          SIH 2026 PS 306 Quick Switcher:
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        <button
          onClick={() => handleSwitch('student')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all font-semibold text-xs ${
            currentUser?.role === 'student'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Student / Reporter
        </button>

        <button
          onClick={() => handleSwitch('admin')}
          title="Admin Portal is Password Protected"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-semibold text-xs ${
            currentUser?.role === 'admin'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Facilities Admin</span>
          {currentUser?.role !== 'admin' && (
            <Lock className="w-3 h-3 text-amber-400" />
          )}
        </button>

        <button
          onClick={() => handleSwitch('maintenance')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all font-semibold text-xs ${
            currentUser?.role === 'maintenance'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Maintenance Staff
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <button
          onClick={handleReset}
          title="Reset database to initial demo state"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-all border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Seed</span>
        </button>
      </div>
    </div>
  );
};

