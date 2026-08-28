import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Globe2,
  User,
  MapPin,
  BarChart3,
  Cpu,
  Users,
  Settings,
  HardHat,
  LucideIcon,
  Layers,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  route: string;
  icon: LucideIcon;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpen,
  onClose
}) => {
  const { role } = useAuth();

  const getNavItems = (): NavItem[] => {
    if (role === 'admin') {
      return [
        { label: 'Overview', route: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'All Issues', route: '/admin/issues', icon: ListOrdered },
        { label: 'Campus Map', route: '/admin/map', icon: MapPin },
        { label: 'Analytics', route: '/admin/analytics', icon: BarChart3 },
        { label: 'IoT Monitoring', route: '/admin/iot', icon: Cpu, badge: 'Live' },
        { label: 'Users Directory', route: '/admin/users', icon: Users },
        { label: 'Settings', route: '/admin/settings', icon: Settings }
      ];
    }

    if (role === 'maintenance') {
      return [
        { label: 'My Tasks Queue', route: '/maintenance/dashboard', icon: HardHat },
        { label: 'My Profile', route: '/maintenance/profile', icon: User }
      ];
    }

    // Default: Student
    return [
      { label: 'Dashboard', route: '/student/dashboard', icon: LayoutDashboard },
      { label: 'Report Issue', route: '/student/report', icon: PlusCircle, highlight: true },
      { label: 'My Complaints', route: '/student/my-reports', icon: ListOrdered },
      { label: 'Campus Issues', route: '/student/campus-feed', icon: Globe2 },
      { label: 'Profile', route: '/student/profile', icon: User }
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-indigo-100 dark:border-slate-800 flex flex-col justify-between p-4 transition-all duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-black tracking-wider text-indigo-900/60 dark:text-indigo-300/60 uppercase flex items-center justify-between">
            <span>{role === 'admin' ? 'Administration' : role === 'maintenance' ? 'Field Operations' : 'Student Portal'}</span>
            <span className="text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800">
              NEXORA
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;

              return (
                <button
                  key={item.route}
                  onClick={() => {
                    onNavigate(item.route);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-indigo-950/70 dark:to-blue-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 shadow-2xs'
                      : item.highlight
                      ? 'bg-gradient-to-r from-indigo-50/60 to-blue-50/60 dark:from-indigo-950/40 dark:to-blue-950/30 text-indigo-600 dark:text-indigo-400 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-900/50 dark:hover:to-blue-900/50 border border-indigo-100 dark:border-indigo-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Card */}
        <div className="bg-gradient-to-r from-indigo-50/70 to-blue-50/70 dark:from-indigo-950/50 dark:to-blue-950/40 rounded-xl p-3.5 border border-indigo-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              NEXORA v2.0
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Grid
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            Team Nexora • SIH 2026 PS 306
          </p>
        </div>
      </aside>

    </>
  );
};
