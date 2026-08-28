import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Issue, TimelineEvent } from '../../types';
import {
  getIssueById,
  getTimeline,
  acceptTaskByTech,
  startWorkOnIssue,
  resolveIssue,
  subscribeToStore
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { StarRating } from '../../components/common/StarRating';
import { Timeline } from '../../components/common/Timeline';
import { Modal } from '../../components/common/Modal';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wrench,
  CheckCircle2,
  Play,
  Upload,
  User,
  Check
} from 'lucide-react';

interface MaintenanceTaskDetailPageProps {
  taskId: string;
  onBack: () => void;
}

const SAMPLE_AFTER_REPAIRS = [
  { name: 'Pipe Repaired', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80' },
  { name: 'Socket Fixed', url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80' },
  { name: 'Area Restored', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' }
];

export const MaintenanceTaskDetailPage: React.FC<MaintenanceTaskDetailPageProps> = ({ taskId, onBack }) => {
  const { currentUser } = useAuth();
  const [task, setTask] = useState<Issue | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  // Resolve Modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [afterImagePreview, setAfterImagePreview] = useState(SAMPLE_AFTER_REPAIRS[0].url);
  const [resolutionNote, setResolutionNote] = useState('');

  const loadData = () => {
    const current = getIssueById(taskId);
    if (current) {
      setTask(current);
      setTimeline(getTimeline(taskId));
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, [taskId]);

  if (!task) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-sm font-semibold">Task {taskId} not found.</p>
        <button onClick={onBack} className="mt-3 bg-blue-600 text-white font-medium text-xs px-4 py-2 rounded-lg">
          Back to Task Queue
        </button>
      </div>
    );
  }

  const handleAccept = () => {
    if (!currentUser) return;
    acceptTaskByTech(task.id, { id: currentUser.id, name: currentUser.name, role: 'maintenance' });
  };

  const handleStartWork = () => {
    if (!currentUser) return;
    startWorkOnIssue(task.id, { id: currentUser.id, name: currentUser.name, role: 'maintenance' });
  };

  const handleConfirmResolve = () => {
    if (!currentUser || !resolutionNote.trim()) return;
    resolveIssue(
      task.id,
      afterImagePreview,
      resolutionNote,
      { id: currentUser.id, name: currentUser.name, role: 'maintenance' }
    );
    setResolveModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Field Tasks</span>
        </button>
      </div>

      {/* Task Card */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                {task.id}
              </span>
              <PriorityBadge priority={task.priority} size="md" />
              <StatusBadge status={task.status} size="md" />
              <SLATimerBadge
                deadline={task.slaDeadline}
                isResolved={task.status === 'RESOLVED' || task.status === 'CLOSED'}
                escalationLevel={task.escalationLevel}
                slaHours={task.slaHours}
                size="md"
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {task.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {task.building} — <strong>{task.room}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Reported {new Date(task.createdAt).toLocaleString()}
              </span>
              <span>
                Reported by: <strong>{task.reportedBy.name}</strong>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            {task.status === 'ASSIGNED' && (
              <button
                onClick={handleAccept}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Accept Dispatch</span>
              </button>
            )}

            {task.status === 'ACCEPTED' && (
              <button
                onClick={handleStartWork}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Start On-Site Work</span>
              </button>
            )}

            {(task.status === 'IN_PROGRESS' || task.status === 'REOPENED') && (
              <button
                onClick={() => {
                  setResolutionNote('Replaced damaged internal hydraulic valve and tested flow. Fixture fully operational.');
                  setResolveModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Proof & Resolve</span>
              </button>
            )}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Before Repair Photo (Reported)</span>
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200">
              <img src={task.beforeImage} alt="Before" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">After Repair Proof (Technician)</span>
            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
              {task.afterImage ? (
                <img src={task.afterImage} alt="After" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-slate-400 space-y-1">
                  <Wrench className="w-6 h-6 mx-auto opacity-30" />
                  <p className="text-xs font-medium text-slate-600">Pending Repair Completion</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resolution Note / Feedback */}
        {task.resolutionNote && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Technician Resolution Report</span>
            <p className="text-xs text-slate-800 italic">"{task.resolutionNote}"</p>
          </div>
        )}

        {task.rating && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Inspection Rating</span>
              <p className="text-xs text-slate-700 italic">"{task.feedbackComment}"</p>
            </div>
            <StarRating value={task.rating} readOnly size="md" />
          </div>
        )}
      </div>

      {/* Timeline History */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div>
          <h3 className="font-bold text-base text-slate-900">Task Milestone Audit</h3>
          <p className="text-xs text-slate-500">State transitions and SLA tracking</p>
        </div>

        <Timeline events={timeline} currentStatus={task.status} />
      </div>

      {/* RESOLVE MODAL */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Submit Resolution Proof & Mark Resolved"
      >
        <div className="space-y-4">
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
              placeholder="Explain what was fixed, parts replaced, and tests completed..."
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
      </Modal>
    </div>
  );
};
