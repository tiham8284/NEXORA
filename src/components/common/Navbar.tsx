import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Sparkles, Menu, X, Plus, LogOut, User, ShieldCheck, HardHat, GraduationCap, Layers, Sun, Moon, Lock } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  currentRoute,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const { currentUser, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin Console',
          color: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          icon: ShieldCheck
        };
      case 'maintenance':
        return {
          label: 'Field Technician',
          color: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: HardHat
        };
      case 'student':
        return {
          label: 'Student / Reporter',
          color: 'bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: GraduationCap
        };
      default:
        return {
          label: 'Guest',
          color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: User
        };
    }
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  const handleSelectIssue = (issueId: string) => {
    if (role === 'admin') {
      onNavigate(`/admin/issues/${issueId}`);
    } else if (role === 'maintenance') {
      onNavigate(`/maintenance/tasks/${issueId}`);
    } else {
      onNavigate(`/student/issues/${issueId}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-indigo-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Brand Section: NEXORA */}
        <div className="flex items-center gap-3">
          {currentUser && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-600 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  NEXORA
                </span>
                <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider hidden sm:inline-block">
                  CampusFix
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold -mt-1 hidden sm:block">
                SIH 2026 PS 306 • Team Nexora
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="hidden lg:flex items-center gap-1.5 ml-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleInfo.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                {roleInfo.label}
              </span>
            </div>
          )}
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 shadow-2xs"
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform -rotate-12 hover:rotate-0 duration-300" />
            )}
          </button>

          {currentUser && role === 'student' && (
            <button
              onClick={() => onNavigate('/student/report')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </button>
          )}

          {currentUser ? (
            <>
              <NotificationDropdown onSelectIssue={handleSelectIssue} />

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-indigo-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="text-left hidden md:block pr-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[130px]">{currentUser.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold capitalize">{role}</p>
                  </div>
                </button>

                {profileOpen && (
                  <div
                    onClick={() => setProfileOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-4 py-2.5 border-b border-indigo-50 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/40 dark:to-blue-950/30">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800 uppercase">
                        Team Nexora
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (role === 'student') onNavigate('/student/profile');
                        else if (role === 'admin') onNavigate('/admin/settings');
                        else onNavigate('/maintenance/profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50/50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      My Profile
                    </button>

                    <button
                      onClick={() => onNavigate('/')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50/50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      NEXORA Overview
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        onNavigate('/login');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/student/report')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-102"
              >
                Report Issue
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

