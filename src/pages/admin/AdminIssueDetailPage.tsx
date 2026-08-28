import React, { useState, useEffect } from 'react';
import { Issue, User, IssueStatus, IssuePriority, EscalationLevel } from '../../types';
import {
  getIssueById,
  getUsers,
  getTimeline,
  updateIssue,
  assignIssue,
  subscribeToStore
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { StarRating } from '../../components/common/StarRating';
import { Timeline } from '../../components/common/Timeline';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wrench,
  Brain,
  ShieldCheck,
  Save,
  MessageSquare,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminIssueDetailPageProps {
  issueId: string;
  onBack: () => void;
}

export const AdminIssueDetailPage: React.FC<AdminIssueDetailPageProps> = ({ issueId, onBack }) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  // Form Controls
  const [status, setStatus] = useState<IssueStatus>('REPORTED');
  const [priority, setPriority] = useState<IssuePriority>('Medium');
  const [assignedTechId, setAssignedTechId] = useState<string>('');
  const [escalationLevel, setEscalationLevel] = useState<EscalationLevel>('None');
  const [internalNote, setInternalNote] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const loadData = () => {
    const current = getIssueById(issueId);
    if (current) {
      setIssue(current);
      setStatus(current.status);
      setPriority(current.priority);
      setAssignedTechId(current.assignedTo?.id || '');
      setEscalationLevel(current.escalationLevel || 'None');
      setTimeline(getTimeline(issueId));
    }
    const allUsers = getUsers();
    setTechnicians(allUsers.filter(u => u.role === 'maintenance'));
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, [issueId]);

  if (!issue) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-sm font-semibold">Incident {issueId} not found.</p>
        <button onClick={onBack} className="mt-3 bg-blue-600 text-white font-medium text-xs px-4 py-2 rounded-lg">
          Return to Issues
        </button>
      </div>
    );
  }

  const handleSaveChanges = () => {
    const updates: Partial<Issue> = {
      status,
      priority,
      escalationLevel
    };

    updateIssue(
      issue.id,
      updates,
      { id: 'admin-1', name: 'Facilities Admin', role: 'admin' }
    );

    if (assignedTechId && assignedTechId !== issue.assignedTo?.id) {
      const tech = technicians.find(t => t.id === assignedTechId);
      if (tech) {
        assignIssue(
          issue.id,
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
      }
    }

    setInternalNote('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
          <span>Back to All Complaints</span>
        </button>
      </div>

      {/* Main Admin Ticket Surface */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2 max-w-2xl">
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
                Reported {new Date(issue.createdAt).toLocaleString()}
              </span>
              <span>
                Reported by: <strong>{issue.reportedBy.name}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* AI Triage Card */}
        {issue.aiConfidence && (
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-xs">CampusFix AI Diagnostic & Triage Audit</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-blue-300 px-2 py-0.2 rounded border border-slate-700">
                {issue.aiConfidence}% match confidence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Auto Category</span>
                <p className="font-bold text-slate-200 mt-0.5">{issue.aiCategory || issue.category}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Priority Score</span>
                <p className="font-bold text-slate-200 mt-0.5">{issue.aiPriority || issue.priority}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Target SLA</span>
                <p className="font-bold text-amber-400 mt-0.5">{issue.slaHours} Hours</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Routed Department</span>
                <p className="font-bold text-slate-200 mt-0.5 truncate">{issue.aiSuggestedDepartment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Before Repair Photo (Reported)</span>
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200">
              <img src={issue.beforeImage} alt="Before" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">After Repair Proof (Technician)</span>
            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
              {issue.afterImage ? (
                <img src={issue.afterImage} alt="After" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-slate-400 space-y-1">
                  <Wrench className="w-6 h-6 mx-auto opacity-30" />
                  <p className="text-xs font-medium text-slate-600">No repair proof uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Rating Display if Closed */}
        {issue.rating && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Verification Rating</span>
              <p className="text-xs text-slate-700 mt-0.5 italic">"{issue.feedbackComment}"</p>
            </div>
            <StarRating value={issue.rating} readOnly size="md" />
          </div>
        )}

        {/* Operations Dispatch Controls */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Administrative Incident Controls & Escalation
            </h3>
            {savedSuccess && (
              <span className="text-xs text-green-700 font-semibold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Status Override
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="REPORTED">Reported</option>
                <option value="AI_ANALYSED">AI Analysed</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REOPENED">Reopened</option>
                <option value="CLOSED">Closed & Rated</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Priority Score
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="Low">Low (72h SLA)</option>
                <option value="Medium">Medium (24h SLA)</option>
                <option value="High">High (4h SLA)</option>
                <option value="Critical">Critical (2h SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Dispatch Technician
              </label>
              <select
                value={assignedTechId}
                onChange={(e) => setAssignedTechId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="">-- Select Technician --</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Escalation Tier
              </label>
              <select
                value={escalationLevel}
                onChange={(e) => setEscalationLevel(e.target.value as EscalationLevel)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="None">None (Standard)</option>
                <option value="Supervisor">Level 1: Dept Supervisor</option>
                <option value="Facility_Manager">Level 2: Facility Manager</option>
                <option value="Admin">Level 3: Campus Administrator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Internal Facility Audit Note
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Log internal note or escalation instructions..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-5 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Apply Operations Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Milestone Timeline */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div>
          <h3 className="font-bold text-base text-slate-900">Incident Audit Log</h3>
          <p className="text-xs text-slate-500">Detailed timestamp log of state transitions</p>
        </div>

        <Timeline events={timeline} currentStatus={issue.status} />
      </div>
    </div>
  );
};
