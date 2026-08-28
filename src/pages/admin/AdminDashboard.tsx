import React, { useState, useEffect } from 'react';
import { Issue, User } from '../../types';
import { getIssues, getUsers, assignIssue, subscribeToStore } from '../../services/storageService';
import { exportIssuesToCSV } from '../../services/exportService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { Modal } from '../../components/common/Modal';
import {
  ListOrdered,
  Clock,
  Wrench,
  AlertOctagon,
  CheckCircle2,
  Download,
  MapPin,
  Eye,
  UserPlus,
  ArrowRight,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../../data/seedData';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
  onSelectIssue: (issueId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onSelectIssue }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState<Issue | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string>('');

  const loadData = () => {
    setIssues(getIssues());
    const users = getUsers();
    setTechnicians(users.filter(u => u.role === 'maintenance'));
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const total = issues.length;
  const pending = issues.filter(i => i.status === 'REPORTED' || i.status === 'AI_ANALYSED').length;
  const inProgress = issues.filter(i => i.status === 'ASSIGNED' || i.status === 'ACCEPTED' || i.status === 'IN_PROGRESS' || i.status === 'REOPENED').length;
  const critical = issues.filter(i => i.priority === 'Critical' && i.status !== 'CLOSED').length;
  const resolved = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const slaBreached = issues.filter(i => i.isSlaBreached && i.status !== 'CLOSED').length;

  const resolvedWithinSLA = issues.filter(i => (i.status === 'RESOLVED' || i.status === 'CLOSED') && !i.isSlaBreached).length;
  const slaComplianceRate = resolved > 0 ? Math.round((resolvedWithinSLA / resolved) * 100) : 94;

  const escalatedIssues = issues.filter(i => i.isSlaBreached && i.status !== 'CLOSED');



  // Recurring Hotspots
  const buildingCounts: Record<string, { total: number; active: number; critical: number }> = {};
  CAMPUS_BUILDINGS.forEach(b => {
    const short = b.split('—')[0].trim();
    buildingCounts[short] = { total: 0, active: 0, critical: 0 };
  });

  issues.forEach(i => {
    const short = i.building.split('—')[0].trim();
    if (!buildingCounts[short]) {
      buildingCounts[short] = { total: 0, active: 0, critical: 0 };
    }
    buildingCounts[short].total++;
    if (i.status !== 'CLOSED') {
      buildingCounts[short].active++;
    }
    if (i.priority === 'Critical' && i.status !== 'CLOSED') {
      buildingCounts[short].critical++;
    }
  });

  const hotspots = Object.entries(buildingCounts)
    .map(([building, counts]) => ({ building, ...counts }))
    .sort((a, b) => b.active - a.active)
    .slice(0, 4);

  const handleOpenAssign = (issue: Issue) => {
    setSelectedIssueForAssign(issue);
    setSelectedTechId(technicians[0]?.id || '');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedIssueForAssign || !selectedTechId) return;
    const tech = technicians.find(t => t.id === selectedTechId);
    if (!tech) return;

    assignIssue(
      selectedIssueForAssign.id,
      {
        id: tech.id,
        name: tech.name,
        email: tech.email,
        phone: tech.phone,
        department: tech.department,
        avatar: tech.avatar
      },
      { id: 'admin-1', name: 'Facilities Admin', role: 'admin' }
    );

    setAssignModalOpen(false);
    setSelectedIssueForAssign(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
              NEXORA Control Center
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.2 rounded border border-slate-200 dark:border-slate-700">
              SIH 2026 PS 306
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Campus Infrastructure Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Real-time infrastructure health, dynamic SLA enforcement, and recurring hotspot intelligence
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => exportIssuesToCSV(issues)}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/map')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-102 flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Spatial Map</span>
          </button>
        </div>
      </div>

      {/* SLA Breached & Escalated Alert Banner */}
      {escalatedIssues.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/30 border-2 border-rose-300 dark:border-rose-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-rose-200 dark:border-rose-700">
                  SLA Escalation Alert
                </span>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  {escalatedIssues.length} complaint{escalatedIssues.length > 1 ? 's' : ''} exceeded SLA threshold
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                {escalatedIssues[0].id}: {escalatedIssues[0].title}
              </h3>
              <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5 font-medium">
                📍 {escalatedIssues[0].building} ({escalatedIssues[0].room}) • Escalated to <strong>{escalatedIssues[0].escalationLevel.replace('_', ' ')}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenAssign(escalatedIssues[0])}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Reassign Staff</span>
            </button>
            <button
              onClick={() => onSelectIssue(escalatedIssues[0].id)}
              className="bg-white dark:bg-slate-900 hover:bg-rose-100/50 dark:hover:bg-slate-800 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
            >
              Inspect
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid - Exactly 2 rows of 3 cards each (First line 3, Second line 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <StatCard

          title="Total Issues"
          value={total}
          subtitle="All recorded tickets"
          icon={ListOrdered}
          color="indigo"
          onClick={() => onNavigate('/admin/issues')}
        />
        <StatCard
          title="Pending Triage"
          value={pending}
          subtitle="Unassigned queue"
          icon={Clock}
          color="amber"
          onClick={() => onNavigate('/admin/issues')}
        />
        <StatCard
          title="Active Repairs"
          value={inProgress}
          subtitle="Technicians on-site"
          icon={Wrench}
          color="blue"
          onClick={() => onNavigate('/admin/issues')}
        />
        <StatCard
          title="Critical Hazards"
          value={critical}
          subtitle="Safety-urgent"
          icon={AlertOctagon}
          color="red"
          onClick={() => onNavigate('/admin/issues')}
        />
        <StatCard
          title="SLA Breached"
          value={slaBreached}
          subtitle="Exceeded deadline"
          icon={ShieldAlert}
          color="rose"
          onClick={() => onNavigate('/admin/issues')}
        />
        <StatCard
          title="SLA Compliance"
          value={`${slaComplianceRate}%`}
          subtitle="Met target SLA"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => onNavigate('/admin/analytics')}
        />


      </div>

      {/* 2-Column: Live Queue & Recurring Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Campus Issues Table (2-Col Span) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-indigo-50 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Active Incident Queue</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live operational dispatch queue with countdown SLA timers</p>
            </div>

            <button
              onClick={() => onNavigate('/admin/issues')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 hover:underline"
            >
              <span>View all {issues.length} issues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-3">Problem</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">SLA Countdown</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {issues.slice(0, 6).map((issue) => (
                  <tr key={issue.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {issue.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white max-w-[170px] truncate" title={issue.title}>
                        {issue.title}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{issue.category}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[110px]">{issue.building.split('—')[0]}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-4">{issue.room}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3">
                      <SLATimerBadge
                        deadline={issue.slaDeadline}
                        isResolved={issue.status === 'RESOLVED' || issue.status === 'CLOSED'}
                        escalationLevel={issue.escalationLevel}
                        slaHours={issue.slaHours}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectIssue(issue.id)}
                        className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recurring Hotspots Panel (1-Col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-indigo-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-50 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Recurring Problem Hotspots
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Problematic campus locations ranking</p>
            </div>
          </div>

          <div className="space-y-3">
            {hotspots.map((h, idx) => (
              <div key={h.building} className="p-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800/80 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    #{idx + 1} {h.building}
                  </span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.2 rounded border border-indigo-200 dark:border-indigo-800 text-[11px]">
                    {h.active} active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>{h.total} total historical tickets</span>
                  {h.critical > 0 && (
                    <span className="text-rose-700 dark:text-rose-400 font-bold">{h.critical} critical</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('/admin/map')}
            className="w-full bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 border border-indigo-200 dark:border-indigo-800"
          >
            <span>View Full Campus Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK ASSIGN MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Dispatch Maintenance Technician"
      >
        {selectedIssueForAssign && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{selectedIssueForAssign.id}</span>
                <PriorityBadge priority={selectedIssueForAssign.priority} size="sm" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{selectedIssueForAssign.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">📍 {selectedIssueForAssign.building} ({selectedIssueForAssign.room})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Technician
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {technicians.map(tech => (
                  <label
                    key={tech.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedTechId === tech.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="tech"
                        checked={selectedTechId === tech.id}
                        onChange={() => setSelectedTechId(tech.id)}
                        className="text-indigo-600"
                      />
                      <img
                        src={tech.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{tech.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{tech.department} • {tech.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Dispatch Staff
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

