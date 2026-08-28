import React from 'react';
import { TimelineEvent, IssueStatus } from '../../types';
import { Check, Clock, RotateCcw, Brain, UserCheck, Play, Wrench, CheckCircle2, Star } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  currentStatus: IssueStatus;
}

const STAGES: { status: IssueStatus; label: string; description: string; icon: any }[] = [
  { status: 'REPORTED', label: 'Reported', description: 'Complaint filed with photo & location', icon: Clock },
  { status: 'AI_ANALYSED', label: 'AI Analysed', description: 'Triage, SLA duration & department routed', icon: Brain },
  { status: 'ASSIGNED', label: 'Assigned', description: 'Department allocated & technician dispatched', icon: UserCheck },
  { status: 'ACCEPTED', label: 'Accepted', description: 'Technician acknowledged dispatch', icon: Play },
  { status: 'IN_PROGRESS', label: 'In Progress', description: 'On-site repair and parts replacement', icon: Wrench },
  { status: 'RESOLVED', label: 'Resolved', description: 'Repair completed & proof uploaded', icon: CheckCircle2 },
  { status: 'CLOSED', label: 'Feedback & Rating', description: 'Student inspected and rated resolution', icon: Star },
];

export const Timeline: React.FC<TimelineProps> = ({ events, currentStatus }) => {
  const getStageIndex = (status: IssueStatus): number => {
    switch (status) {
      case 'REPORTED': return 0;
      case 'AI_ANALYSED': return 1;
      case 'ASSIGNED': return 2;
      case 'ACCEPTED': return 3;
      case 'IN_PROGRESS': return 4;
      case 'RESOLVED': return 5;
      case 'REOPENED': return 4;
      case 'CLOSED': return 6;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);
  const isReopened = currentStatus === 'REOPENED';

  return (
    <div className="space-y-6">
      <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-1">
        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex || currentStatus === 'CLOSED';
          const isCurrent = idx === currentIndex && currentStatus !== 'CLOSED';
          const Icon = stage.icon;

          const matchedEvents = events.filter(e => e.status === stage.status);

          return (
            <div key={stage.status} className="relative">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-[33px] top-0 flex items-center justify-center w-7 h-7 rounded-full border-2 transition-colors ${
                  isReopened && stage.status === 'IN_PROGRESS'
                    ? 'bg-red-600 border-red-700 text-white'
                    : isPassed
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-700 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isReopened && stage.status === 'IN_PROGRESS' ? (
                  <RotateCcw className="w-3.5 h-3.5" />
                ) : isPassed ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Step content */}
              <div>
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-semibold text-sm ${
                      isCurrent
                        ? 'text-blue-600'
                        : isPassed
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Active Stage
                    </span>
                  )}
                  {isReopened && stage.status === 'IN_PROGRESS' && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      Reopened
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>

                {matchedEvents.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {matchedEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{evt.changedBy.name} ({evt.changedBy.role})</span>
                          <span>{new Date(evt.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                        <p className="font-medium text-slate-800">{evt.message}</p>
                        {evt.note && (
                          <div className="bg-white p-2 rounded border border-slate-200 text-slate-600 italic text-[11px]">
                            "{evt.note}"
                          </div>
                        )}
                        {evt.evidenceImage && (
                          <div className="mt-2 w-32 h-20 rounded-md overflow-hidden border border-slate-200">
                            <img src={evt.evidenceImage} alt="Milestone proof" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
