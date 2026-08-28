import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Building, Save, CheckCircle2 } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [studentId, setStudentId] = useState(currentUser?.studentId || 'STU-2024-8841');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      department,
      studentId
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your institutional identity and contact preferences
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Avatar Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt="Profile Avatar"
            className="w-16 h-16 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <h3 className="font-bold text-base text-slate-900">{currentUser?.name}</h3>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
            <span className="inline-block mt-1 bg-slate-100 text-slate-700 font-semibold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              Student Portal Verified
            </span>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student ID / Roll Number
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Academic Department
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm py-2 px-5 rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
