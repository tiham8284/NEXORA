import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { AdminPasswordModal } from './components/common/AdminPasswordModal';
import { initStore, subscribeToStore, getNotifications } from './services/storageService';
import { ShieldCheck, Lock, ArrowRight, KeyRound } from 'lucide-react';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ReportIssuePage } from './pages/student/ReportIssuePage';
import { IssueDetailPage } from './pages/student/IssueDetailPage';
import { MyComplaintsPage } from './pages/student/MyComplaintsPage';
import { CampusIssuesPage } from './pages/student/CampusIssuesPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminIssuesPage } from './pages/admin/AdminIssuesPage';
import { AdminIssueDetailPage } from './pages/admin/AdminIssueDetailPage';
import { AdminMapPage } from './pages/admin/AdminMapPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminIoTPage } from './pages/admin/AdminIoTPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { MaintenanceDashboard } from './pages/maintenance/MaintenanceDashboard';
import { MaintenanceTaskDetailPage } from './pages/maintenance/MaintenanceTaskDetailPage';
import { MaintenanceProfilePage } from './pages/maintenance/MaintenanceProfilePage';

const AppContent: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Admin Password Gate State
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [pendingAdminRoute, setPendingAdminRoute] = useState<string | null>(null);

  // Initialize store
  useEffect(() => {
    initStore();
  }, []);

  // Listen for new high-priority notifications to show as toasts
  useEffect(() => {
    const handleStoreChange = () => {
      if (currentUser) {
        const notifs = getNotifications(currentUser);
        const unread = notifs.filter(n => !n.read && (n.type === 'critical_alert' || n.type === 'verification' || n.type === 'reopened'));
        if (unread.length > 0) {
          const latest = unread[0];
          addToast({
            id: latest.id,
            type: latest.type === 'critical_alert' ? 'error' : latest.type === 'verification' ? 'info' : 'success',
            title: latest.title,
            message: latest.message
          });
        }
      }
    };

    const unsub = subscribeToStore(handleStoreChange);
    return () => unsub();
  }, [currentUser]);

  const addToast = (toast: ToastMessage) => {
    setToasts(prev => {
      if (prev.some(t => t.id === toast.id)) return prev;
      return [...prev, toast];
    });
    setTimeout(() => {
      dismissToast(toast.id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigate = (route: string) => {
    // Admin Route Protection: If non-admin attempts to navigate to /admin routes, challenge for Admin Password
    if (route.startsWith('/admin') && role !== 'admin') {
      setPendingAdminRoute(route);
      setIsAdminPasswordModalOpen(true);
      return;
    }

    // Check if route includes an issue id (e.g. /student/issues/FIX-1024)
    if (route.startsWith('/student/issues/')) {
      const id = route.replace('/student/issues/', '');
      setSelectedIssueId(id);
      setCurrentRoute('/student/issue-detail');
      window.scrollTo(0, 0);
      return;
    }

    if (route.startsWith('/admin/issues/')) {
      const id = route.replace('/admin/issues/', '');
      setSelectedIssueId(id);
      setCurrentRoute('/admin/issue-detail');
      window.scrollTo(0, 0);
      return;
    }

    if (route.startsWith('/maintenance/tasks/')) {
      const id = route.replace('/maintenance/tasks/', '');
      setSelectedIssueId(id);
      setCurrentRoute('/maintenance/task-detail');
      window.scrollTo(0, 0);
      return;
    }

    setSelectedIssueId(null);
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminPasswordModalOpen(false);
    const targetRoute = pendingAdminRoute || '/admin/dashboard';
    setPendingAdminRoute(null);
    setSelectedIssueId(null);
    setCurrentRoute(targetRoute);
    window.scrollTo(0, 0);
    addToast({
      id: `admin-auth-${Date.now()}`,
      type: 'success',
      title: 'Admin Clearance Granted',
      message: 'Logged in as Facilities Administrator (Dr. Ramesh Mehra).'
    });
  };

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    if (role === 'admin') {
      setCurrentRoute('/admin/issue-detail');
    } else if (role === 'maintenance') {
      setCurrentRoute('/maintenance/task-detail');
    } else {
      setCurrentRoute('/student/issue-detail');
    }
    window.scrollTo(0, 0);
  };

  const isLanding = currentRoute === '/';
  const isAuthPage = currentRoute === '/login' || currentRoute === '/register';
  const showSidebar = !isLanding && !isAuthPage && !!currentUser;

  const renderAdminGuardWall = () => {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-inner">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            ACCESS RESTRICTED
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Clearance Required</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            The Admin Portal is password-protected. Unauthorized students or unauthenticated guests cannot access internal ticket dispatch, SLA controls, or campus IoT infrastructure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsAdminPasswordModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter Admin Master Password</span>
          </button>

          <button
            onClick={() => navigate(currentUser ? '/student/dashboard' : '/')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    // Landing & Auth
    if (currentRoute === '/') return <LandingPage onNavigate={navigate} />;
    if (currentRoute === '/login') return <LoginPage onNavigate={navigate} />;
    if (currentRoute === '/register') return <RegisterPage onNavigate={navigate} />;

    // Student Routes
    if (currentRoute === '/student/dashboard') {
      return <StudentDashboard onNavigate={navigate} onSelectIssue={handleSelectIssue} />;
    }
    if (currentRoute === '/student/report') {
      return <ReportIssuePage onNavigate={navigate} onSelectIssue={handleSelectIssue} />;
    }
    if (currentRoute === '/student/issue-detail' && selectedIssueId) {
      return (
        <IssueDetailPage
          issueId={selectedIssueId}
          onBack={() => navigate('/student/dashboard')}
          onNavigate={navigate}
        />
      );
    }
    if (currentRoute === '/student/my-reports') {
      return <MyComplaintsPage onNavigate={navigate} onSelectIssue={handleSelectIssue} />;
    }
    if (currentRoute === '/student/campus-feed') {
      return <CampusIssuesPage onSelectIssue={handleSelectIssue} />;
    }
    if (currentRoute === '/student/profile') {
      return <StudentProfilePage />;
    }

    // Admin Routes (with security wall check)
    if (currentRoute.startsWith('/admin')) {
      if (role !== 'admin') {
        return renderAdminGuardWall();
      }

      if (currentRoute === '/admin/dashboard') {
        return <AdminDashboard onNavigate={navigate} onSelectIssue={handleSelectIssue} />;
      }
      if (currentRoute === '/admin/issues') {
        return <AdminIssuesPage onSelectIssue={handleSelectIssue} />;
      }
      if (currentRoute === '/admin/issue-detail' && selectedIssueId) {
        return (
          <AdminIssueDetailPage
            issueId={selectedIssueId}
            onBack={() => navigate('/admin/issues')}
          />
        );
      }
      if (currentRoute === '/admin/map') {
        return <AdminMapPage onSelectIssue={handleSelectIssue} />;
      }
      if (currentRoute === '/admin/analytics') {
        return <AdminAnalyticsPage />;
      }
      if (currentRoute === '/admin/iot') {
        return <AdminIoTPage onSelectIssue={handleSelectIssue} />;
      }
      if (currentRoute === '/admin/users') {
        return <AdminUsersPage />;
      }
      if (currentRoute === '/admin/settings') {
        return <AdminSettingsPage />;
      }
    }

    // Maintenance Routes
    if (currentRoute === '/maintenance/dashboard') {
      return <MaintenanceDashboard onSelectTask={handleSelectIssue} onNavigate={navigate} />;
    }
    if (currentRoute === '/maintenance/task-detail' && selectedIssueId) {
      return (
        <MaintenanceTaskDetailPage
          taskId={selectedIssueId}
          onBack={() => navigate('/maintenance/dashboard')}
        />
      );
    }
    if (currentRoute === '/maintenance/profile') {
      return <MaintenanceProfilePage />;
    }

    // Fallback
    return <LandingPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Quick Access Bar */}
      <DemoBanner
        onNavigate={navigate}
        onPromptAdminAuth={() => {
          setPendingAdminRoute('/admin/dashboard');
          setIsAdminPasswordModalOpen(true);
        }}
      />

      {/* Main Top Navigation */}
      <Navbar
        onNavigate={navigate}
        currentRoute={currentRoute}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex">
        {showSidebar && (
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={navigate}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main className={`flex-1 min-w-0 ${!isLanding ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
          {renderPage()}
        </main>
      </div>

      {/* Admin Password Verification Gate Modal */}
      <AdminPasswordModal
        isOpen={isAdminPasswordModalOpen}
        onClose={() => {
          setIsAdminPasswordModalOpen(false);
          setPendingAdminRoute(null);
        }}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

