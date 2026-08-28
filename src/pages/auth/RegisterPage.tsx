import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CAMPUS_BUILDINGS } from '../../data/seedData';
import { Layers, ArrowRight, UserPlus } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (route: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    register({
      name,
      email,
      role: 'student',
      studentId: studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department
    });
    onNavigate('/student/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/40 via-blue-50/20 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Layers className="w-7 h-7" />
            </div>
            <span className="font-black text-3xl tracking-tight bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-600 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              NEXORA
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Student Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Join the centralized campus facility reporting network</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-indigo-100 dark:border-slate-800 shadow-xs space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                University Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@campus.edu"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Student Roll / ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="STU-2024-8841"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Architecture & Planning">Architecture & Planning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create NEXORA Account</span>
            </button>
          </form>

          <div className="text-center pt-1 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('/login')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

