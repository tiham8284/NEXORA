import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Issue } from '../../types';
import {
  getIssues,
  acceptTaskByTech,
  startWorkOnIssue,
  resolveIssue,
  subscribeToStore
} from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { Modal } from '../../components/common/Modal';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Upload,
  Camera,
  MapPin,
  Eye,
  Check,
  CheckCheck
} from 'lucide-react';

interface MaintenanceDashboardProps {
  onSelectTask: (taskId: string) => void;
  onNavigate: (route: string) => void;
}

const SAMPLE_AFTER_REPAIRS = [
  { name: 'Pipe Repaired', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80' },
  { name: 'Electrical Socket Replaced', url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80' },
  { name: 'Clean Area', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' }
];

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ onSelectTask, onNavigate }) => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'resolved'>('pending');

  // Resolve Modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedIssueForResolve, setSelectedIssueForResolve] = useState<Issue | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState(SAMPLE_AFTER_REPAIRS[0].url);
  const [resolutionNote, setResolutionNote] = useState('');

  const loadData = () => {
    setIssues(getIssues());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const myTasks = issues.filter(i => {
    if (!currentUser) return false;
    return i.assignedTo?.id === currentUser.id || i.assignedTo?.email === currentUser.email;
  });

  const assignedTasks = myTasks.filter(i => i.status === 'ASSIGNED');
  const activeWorkingTasks = myTasks.filter(i => i.status === 'ACCEPTED' || i.status === 'IN_PROGRESS' || i.status === 'REOPENED');
  const completedTasks = myTasks.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED');

  const handleAcceptTask = (e: React.MouseEvent, issue: Issue) => {
    e.stopPropagation();
    if (!currentUser) return;
    acceptTaskByTech(issue.id, { id: currentUser.id, name: currentUser.name, role: 'maintenance' });
  };

  const handleStartWork = (e: React.MouseEvent, issue: Issue) => {
    e.stopPropagation();
    if (!currentUser) return;
    startWorkOnIssue(issue.id, { id: currentUser.id, name: currentUser.name, role: 'maintenance' });
  };

  const handleOpenResolveModal = (e: React.MouseEvent, issue: Issue) => {
    e.stopPropagation();
    setSelectedIssueForResolve(issue);
    setResolutionNote('Replaced damaged internal hydraulic valve and pressure tested. No further leakage detected.');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = () => {
    if (!selectedIssueForResolve || !currentUser) return;

    resolveIssue(
      selectedIssueForResolve.id,
      afterImagePreview,
      resolutionNote,
      { id: currentUser.id, name: currentUser.name, role: 'maintenance' }
    );

    setResolveModalOpen(false);
    setSelectedIssueForResolve(null);
  };

  const displayedList =
    activeTab === 'pending'
      ? assignedTasks
      : activeTab === 'in_progress'
      ? activeWorkingTasks
      : completedTasks;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-slate-800 text-blue-400 border border-slate-700 text-[10px] font-semibold px-2 py-0.2 rounded uppercase tracking-wider">
              Maintenance Field Technician Console
            </span>
            <span className="text-xs text-slate-400">{currentUser?.department || 'Facilities Trade'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Field Queue: {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Accept assignments, update state milestones, and upload after-repair photographic proof to resolve tickets.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Dispatches"
          value={assignedTasks.length}
          subtitle="New tasks awaiting acceptance"
          icon={Clock}
          color="amber"
          onClick={() => setActiveTab('pending')}
        />
        <StatCard
          title="In Progress"
          value={activeWorkingTasks.length}
          subtitle="Active on-site repairs"
          icon={Wrench}
          color="blue"
          onClick={() => setActiveTab('in_progress')}
        />
        <StatCard
          title="Completed & Verified"
          value={completedTasks.length}
          subtitle="Finished repairs"
          icon={CheckCircle2}
          color="green"
          onClick={() => setActiveTab('resolved')}
        />
        <StatCard
          title="Total Assigned"
          value={myTasks.length}
          subtitle="Cumulative workload"
          icon={CheckCheck}
          color="neutral"
        />
      </div>

      {/* Task Queue Tabs & Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'pending'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              New Assigned ({assignedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'in_progress'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Progress ({activeWorkingTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Resolved & Closed ({completedTasks.length})
            </button>
          </div>
        </div>

        {displayedList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Wrench className="w-8 h-8 mx-auto opacity-30" />
            <p className="text-xs font-semibold text-slate-700">No tasks in this queue</p>
            <p className="text-xs text-slate-400">All tasks in this category have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedList.map(task => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 space-y-3 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                      {task.id}
                    </span>
                    <PriorityBadge priority={task.priority} size="sm" />
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2">
                    {task.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{task.building} ({task.room})</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <StatusBadge status={task.status} size="sm" />
                    <SLATimerBadge
                      deadline={task.slaDeadline}
                      isResolved={task.status === 'RESOLVED' || task.status === 'CLOSED'}
                      escalationLevel={task.escalationLevel}
                      slaHours={task.slaHours}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Technician Quick Actions */}
                <div className="pt-3 border-t border-slate-200 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  {task.status === 'ASSIGNED' && (
                    <button
                      onClick={(e) => handleAcceptTask(e, task)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Accept Task</span>
                    </button>
                  )}

                  {task.status === 'ACCEPTED' && (
                    <button
                      onClick={(e) => handleStartWork(e, task)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Start On-Site Work</span>
                    </button>
                  )}

                  {(task.status === 'IN_PROGRESS' || task.status === 'REOPENED') && (
                    <button
                      onClick={(e) => handleOpenResolveModal(e, task)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Proof & Resolve</span>
                    </button>
                  )}

                  {task.status === 'RESOLVED' && (
                    <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Awaiting Student Verification
                    </span>
                  )}

                  {task.status === 'CLOSED' && (
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5 text-green-600" />
                      Closed ({task.rating || 5} ★)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPLOAD PROOF & RESOLVE MODAL */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Upload Photographic Resolution Proof"
      >
        {selectedIssueForResolve && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-900">{selectedIssueForResolve.id}: {selectedIssueForResolve.title}</span>
              <p className="text-slate-500 mt-0.5">📍 {selectedIssueForResolve.building} ({selectedIssueForResolve.room})</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select After-Repair Proof Photograph
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_AFTER_REPAIRS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAfterImagePreview(sample.url)}
                    className={`rounded-lg border overflow-hidden p-1 transition-all ${
                      afterImagePreview === sample.url
                        ? 'border-blue-600 ring-2 ring-blue-500'
                        : 'border-slate-200'
                    }`}
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-16 object-cover rounded" />
                    <p className="text-[10px] text-center text-slate-700 truncate mt-1">{sample.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Technical Resolution Note
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={3}
                placeholder="Explain the technical fix performed (parts replaced, tests completed)..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none focus:bg-white"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setResolveModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                disabled={!resolutionNote.trim()}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Submit Proof & Mark Resolved</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
