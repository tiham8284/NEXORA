import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Issue, TimelineEvent } from '../../types';
import {
  getIssueById,
  getTimeline,
  submitFeedbackRating,
  reopenIssueByStudent,
  toggleSupportIssue,
  subscribeToStore
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { StarRating } from '../../components/common/StarRating';
import { Timeline } from '../../components/common/Timeline';
import { Modal } from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ThumbsUp,
  Wrench,
  CheckCircle2,
  AlertOctagon,
  Phone,
  RotateCcw,
  Check,
  Star,
  Brain
} from 'lucide-react';

interface IssueDetailPageProps {
  issueId: string;
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const IssueDetailPage: React.FC<IssueDetailPageProps> = ({ issueId, onBack, onNavigate }) => {
  const { currentUser } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const [reopenReason, setReopenReason] = useState<string>('');

  // Rating & Feedback Modal
  const [feedbackModal, setFeedbackModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('Repaired fixture inspected and confirmed functional. High quality resolution!');

  const loadData = () => {
    const current = getIssueById(issueId);
    if (current) {
      setIssue(current);
      setTimeline(getTimeline(issueId));
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, [issueId]);

  if (!issue) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-4">
        <p className="text-sm font-semibold">Complaint {issueId} not found.</p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white font-medium text-xs px-4 py-2 rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isSupported = currentUser ? issue.supportedByUserIds?.includes(currentUser.id) : false;

  const handleSupportToggle = () => {
    if (!currentUser) return;
    const updated = toggleSupportIssue(issue.id, currentUser.id);
    if (updated) setIssue(updated);
  };

  const handleVerifySuccess = () => {
    if (!currentUser) return;
    const updated = submitFeedbackRating(
      issue.id,
      { id: currentUser.id, name: currentUser.name, role: 'student' },
      rating,
      feedbackComment
    );
    if (updated) {
      setIssue(updated);
      setFeedbackModal(false);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
    }
  };

  const handleReopen = () => {
    if (!currentUser || !reopenReason) return;
    const updated = reopenIssueByStudent(
      issue.id,
      { id: currentUser.id, name: currentUser.name, role: 'student' },
      reopenReason
    );
    if (updated) {
      setIssue(updated);
      setReopenModal(false);
      setReopenReason('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Breadcrumb / Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSupportToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isSupported
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isSupported ? 'fill-blue-600 text-blue-600' : ''}`} />
            <span>{isSupported ? 'Supported' : 'Support Issue'}</span>
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono text-[10px] ml-1">
              {issue.supportersCount || 1}
            </span>
          </button>
        </div>
      </div>

      {/* Main Issue Header Card */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                {issue.id}
              </span>
              <PriorityBadge priority={issue.priority} size="md" />
              <StatusBadge status={issue.status} size="md" />
              <SLATimerBadge
                deadline={issue.slaDeadline}
                isResolved={issue.status === 'RESOLVED' || issue.status === 'CLOSED'}
                escalationLevel={issue.escalationLevel}
                slaHours={issue.slaHours}
                size="md"
              />
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {issue.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {issue.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {issue.building} — <strong>{issue.room}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Reported {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span>
                Source: <strong>{issue.source}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* STUDENT VERIFICATION CALLOUT (When status is RESOLVED) */}
        {issue.status === 'RESOLVED' && (
          <div className="bg-green-50 border border-green-200 text-green-900 rounded-xl p-5 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" />
                  Technician Finished Repair
                </div>
                <h3 className="text-base font-bold text-slate-900">Inspect Resolution Proof & Rate Service</h3>
                <p className="text-xs text-green-800">
                  Review the after-repair photo below. Confirm the fix and provide your 5-star rating to close the ticket.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setFeedbackModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Star className="w-4 h-4" />
                  <span>Verify Fix & Rate (1-5 ★)</span>
                </button>

                <button
                  onClick={() => setReopenModal(true)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Still Not Fixed</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VERIFIED & RATED CLOSED BANNER */}
        {issue.status === 'CLOSED' && (
          <div className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <h4 className="font-bold text-xs text-slate-900">Resolution Verified & Rated by Student</h4>
              </div>
              {issue.rating && (
                <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Student Rating:</span>
                  <StarRating value={issue.rating} readOnly size="sm" />
                </div>
              )}
            </div>
            {issue.feedbackComment && (
              <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200">
                "{issue.feedbackComment}"
              </p>
            )}
          </div>
        )}

        {/* REOPENED BANNER */}
        {issue.status === 'REOPENED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-center gap-3 text-red-900">
            <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <h4 className="font-semibold text-xs text-red-700">Complaint Reopened by Student</h4>
              <p className="text-xs text-red-800 mt-0.5">
                Reason: {issue.reopenReason || 'Fix was incomplete upon reinspection.'}
              </p>
            </div>
          </div>
        )}

        {/* Side-by-Side Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Before Photo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Before Repair (Original Upload)</span>
              <span className="text-slate-400">{new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200 relative">
              <img
                src={issue.beforeImage}
                alt="Before repair"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* After Photo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold uppercase tracking-wider text-[11px]">After Repair (Technician Proof)</span>
              {issue.resolvedAt && (
                <span className="text-green-700 font-medium">{new Date(issue.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </div>
            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative flex items-center justify-center">
              {issue.afterImage ? (
                <img
                  src={issue.afterImage}
                  alt="After repair proof"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 space-y-1">
                  <Wrench className="w-6 h-6 mx-auto opacity-30" />
                  <p className="text-xs font-medium text-slate-600">Pending Repair Completion</p>
                  <p className="text-[11px]">Technician will upload photo after work is finished.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description & Routing Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-1">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reporter Description</h4>
            <p className="text-xs text-slate-800 leading-relaxed">{issue.description}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department Allocation</h4>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                AI Auto-Routed
              </span>
            </div>
            <div className="text-xs space-y-1">
              <p className="text-slate-600">
                AI Suggested: <strong className="text-slate-900">{issue.aiSuggestedDepartment || 'Plumbing Maintenance'}</strong>
              </p>
              <p className="text-slate-600">
                Final Assigned: <strong className="text-blue-700">{issue.finalDepartment || issue.aiSuggestedDepartment || 'General Maintenance'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Technician Profile Box */}
        {issue.assignedTo && (
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={issue.assignedTo.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                alt={issue.assignedTo.name}
                className="w-9 h-9 rounded-md object-cover border border-slate-200"
              />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Field Technician</span>
                <h4 className="font-bold text-xs text-slate-900">{issue.assignedTo.name}</h4>
                <p className="text-[11px] text-slate-500">{issue.assignedTo.department || 'Maintenance Team'}</p>
              </div>
            </div>

            {issue.assignedTo.phone && (
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                {issue.assignedTo.phone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress Timeline Section */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div>
          <h3 className="font-bold text-base text-slate-900">
            SIH 2026 Process Timeline History
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Audit log from submission, AI triage, dispatch, proof, to student feedback</p>
        </div>

        <Timeline events={timeline} currentStatus={issue.status} />
      </div>

      {/* REOPEN MODAL */}
      <Modal
        isOpen={reopenModal}
        onClose={() => setReopenModal(false)}
        title="Reopen Complaint (Incomplete Fix)"
      >
        <div className="space-y-3.5">
          <p className="text-xs text-slate-600">
            Please explain why the repair was incomplete so the technician can address it.
          </p>

          <textarea
            value={reopenReason}
            onChange={(e) => setReopenReason(e.target.value)}
            rows={3}
            placeholder="e.g. Water is still leaking from the ceiling joint when tested..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white resize-none"
            required
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setReopenModal(false)}
              className="px-3.5 py-2 bg-slate-100 text-slate-600 font-medium text-xs rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleReopen}
              disabled={!reopenReason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              Confirm Reopen
            </button>
          </div>
        </div>
      </Modal>

      {/* VERIFY & RATE MODAL */}
      <Modal
        isOpen={feedbackModal}
        onClose={() => setFeedbackModal(false)}
        title="Verify Resolution & Provide 5★ Rating"
      >
        <div className="space-y-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-xs text-green-900 space-y-1">
            <p className="font-semibold">Confirming resolution will officially mark this complaint CLOSED.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Rate Resolution Quality
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Feedback / Inspection Comments
            </label>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows={3}
              placeholder="e.g. Repair tested and verified on-site. Clean work by staff."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => setFeedbackModal(false)}
              className="px-3.5 py-2 bg-slate-100 text-slate-600 font-medium text-xs rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifySuccess}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Submit Rating & Close Ticket</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
