import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getUsers, getUserById, verifyAdminPassword, verifyUserPassword } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  isAdminAuthenticated: boolean;
  login: (email: string, password?: string, roleHint?: UserRole) => { success: boolean; error?: string };
  loginAsDemo: (role: UserRole) => void;
  loginAsAdminWithPassword: (password: string) => { success: boolean; error?: string };
  verifyAdminAccess: (password: string) => boolean;
  register: (data: { name: string; email: string; role: UserRole; studentId?: string; employeeId?: string; department?: string }) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'fixit_campus_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email: string, password?: string, roleHint?: UserRole): { success: boolean; error?: string } => {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    const targetRole = roleHint || (found ? found.role : 'student');

    // Password Enforcement for all roles
    if (!password || !password.trim()) {
      return {
        success: false,
        error: 'Please enter your password to sign in.'
      };
    }

    if (!verifyUserPassword(cleanEmail, password, targetRole)) {
      return {
        success: false,
        error: targetRole === 'admin'
          ? 'Access Denied: Invalid Admin Master Password. Please check your passcode or click "Change Password".'
          : 'Invalid credentials. Please verify your password or click "Change Password".'
      };
    }

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    // Auto-create lightweight user if not found during testing
    const newDemoUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: cleanEmail,
      role: targetRole,
      department: targetRole === 'admin' ? 'Campus Administration' : targetRole === 'maintenance' ? 'Operations' : 'General Campus',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newDemoUser);
    return { success: true };
  };

  const loginAsAdminWithPassword = (password: string): { success: boolean; error?: string } => {
    if (!verifyAdminPassword(password)) {
      return {
        success: false,
        error: 'Incorrect Admin Password. Default demo passcode is "admin123".'
      };
    }
    const users = getUsers();
    const adminUser = users.find(u => u.id === 'user-admin-demo') || users.find(u => u.role === 'admin');
    if (adminUser) {
      setCurrentUser(adminUser);
    } else {
      setCurrentUser({
        id: 'user-admin-demo',
        name: 'Dr. Ramesh Mehra',
        email: 'admin@fixitcampus.demo',
        role: 'admin',
        employeeId: 'EMP-ADM-102',
        department: 'Campus Infrastructure & Estates',
        phone: '+91 98222 33445',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      });
    }
    return { success: true };
  };

  const verifyAdminAccess = (password: string): boolean => {
    return verifyAdminPassword(password);
  };

  const loginAsDemo = (role: UserRole) => {
    const users = getUsers();
    let demoUser: User | undefined;

    if (role === 'student') {
      demoUser = users.find(u => u.id === 'user-student-demo') || users.find(u => u.role === 'student');
    } else if (role === 'admin') {
      demoUser = users.find(u => u.id === 'user-admin-demo') || users.find(u => u.role === 'admin');
    } else if (role === 'maintenance') {
      demoUser = users.find(u => u.id === 'user-maint-demo') || users.find(u => u.role === 'maintenance');
    }

    if (demoUser) {
      setCurrentUser(demoUser);
    }
  };

  const register = (data: { name: string; email: string; role: UserRole; studentId?: string; employeeId?: string; department?: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      studentId: data.studentId,
      employeeId: data.employeeId,
      department: data.department || 'General Facility',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role: currentUser?.role || null,
      isAdminAuthenticated: currentUser?.role === 'admin',
      login,
      loginAsDemo,
      loginAsAdminWithPassword,
      verifyAdminAccess,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

