import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Issue } from '../../types';
import { getIssues, subscribeToStore } from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { StarRating } from '../../components/common/StarRating';
import {
  Plus,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Eye,
  Check,
  MapPin,
  Sparkles,
  Layers
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (route: string) => void;
  onSelectIssue: (issueId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onSelectIssue }) => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);

  const loadData = () => {
    setIssues(getIssues());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const myReports = issues.filter(
    i => i.reportedBy.id === currentUser?.id || i.reportedBy.email === currentUser?.email
  );

  const pendingReports = myReports.filter(i => i.status === 'REPORTED' || i.status === 'AI_ANALYSED');
  const inProgressReports = myReports.filter(i => i.status === 'ASSIGNED' || i.status === 'ACCEPTED' || i.status === 'IN_PROGRESS' || i.status === 'REOPENED');
  const resolvedReports = myReports.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED');

  const needVerification = myReports.filter(i => i.status === 'RESOLVED' && !i.studentVerified);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner with Vibrant Gradient & NEXORA branding */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-indigo-700/50 shadow-md shadow-indigo-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              NEXORA • Student Portal
            </span>
            {currentUser?.studentId && (
              <span className="text-xs text-indigo-200 font-mono font-semibold">
                ID: {currentUser.studentId}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome back, {currentUser?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl font-medium">
            Report facility issues in under 1 minute. NEXORA AI handles intelligent routing, SLA window tracking, and requests your 5-star rating after repair completion.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/student/report')}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-102 flex items-center gap-2 shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Verification Alert Callout */}
      {needVerification.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-amber-900 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                Action Required: {needVerification.length} Issue{needVerification.length > 1 ? 's' : ''} Ready for Verification & Rating
              </h4>
              <p className="text-xs text-amber-800 font-medium">
                Technicians finished work with photographic evidence. Please inspect the fix and submit your feedback rating.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectIssue(needVerification[0].id)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Inspect Fix & Rate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Stat Cards with Color Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Reported Issues"
          value={myReports.length}
          subtitle="Total tickets submitted"
          icon={FileText}
          color="indigo"
          onClick={() => onNavigate('/student/my-reports')}
        />
        <StatCard
          title="Pending Triage"
          value={pendingReports.length}
          subtitle="Awaiting staff dispatch"
          icon={Clock}
          color="amber"
          onClick={() => onNavigate('/student/my-reports')}
        />
        <StatCard
          title="Active Repairs"
          value={inProgressReports.length}
          subtitle="Technicians on-site"
          icon={Wrench}
          color="blue"
          onClick={() => onNavigate('/student/my-reports')}
        />
        <StatCard
          title="Resolved & Verified"
          value={resolvedReports.length}
          subtitle="Completed with ratings"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => onNavigate('/student/my-reports')}
        />
      </div>

      {/* Recent Complaints Table with Light Styled Surface */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-indigo-50 bg-gradient-to-r from-slate-50/50 via-indigo-50/20 to-white flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Recent Campus Facility Complaints</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time SLA status and technician resolution milestones</p>
          </div>

          <button
            onClick={() => onNavigate('/student/campus-feed')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>Browse all campus issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myReports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FileText className="w-10 h-10 mx-auto opacity-30 text-indigo-600" />
            <p className="text-sm font-bold text-slate-700">No complaints registered yet</p>
            <button
              onClick={() => onNavigate('/student/report')}
              className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-xs"
            >
              Report First Issue
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-4">Problem</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Target SLA</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {myReports.slice(0, 6).map((issue) => (
                  <tr key={issue.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-indigo-600">
                      {issue.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 max-w-xs truncate" title={issue.title}>
                        {issue.title}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{issue.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[140px]">{issue.building.split('—')[0]}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 ml-4">{issue.room}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <SLATimerBadge
                        deadline={issue.slaDeadline}
                        isResolved={issue.status === 'RESOLVED' || issue.status === 'CLOSED'}
                        escalationLevel={issue.escalationLevel}
                        slaHours={issue.slaHours}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      {issue.rating ? (
                        <StarRating value={issue.rating} readOnly size="sm" />
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unrated</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => onSelectIssue(issue.id)}
                        className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg transition-colors border border-indigo-200"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Track</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
