import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { getUsers, subscribeToStore } from '../../services/storageService';
import { Search, GraduationCap, ShieldCheck, HardHat, Mail, Phone, Building } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const loadData = () => {
    setUsers(getUsers());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const filtered = users.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.studentId && u.studentId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Campus Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          User & Technician Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Directory of registered students, facilities administrators, and field maintenance technicians
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { key: 'ALL', label: 'All Users' },
            { key: 'student', label: 'Students' },
            { key: 'admin', label: 'Admins' },
            { key: 'maintenance', label: 'Technicians' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRoleFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                roleFilter === key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(user => {
          const roleConfig = {
            student: { label: 'Student', icon: GraduationCap, badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700' },
            admin: { label: 'Facilities Admin', icon: ShieldCheck, badge: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
            maintenance: { label: 'Field Technician', icon: HardHat, badge: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
          }[user.role];

          const Icon = roleConfig.icon;

          return (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{user.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 ${roleConfig.badge}`}>
                        <Icon className="w-3 h-3" />
                        {roleConfig.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user.department && (
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.department}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{user.studentId ? `ID: ${user.studentId}` : user.employeeId ? `Emp: ${user.employeeId}` : 'ID Verified'}</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

