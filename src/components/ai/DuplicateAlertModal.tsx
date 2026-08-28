import React from 'react';
import { IssueStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, ThumbsUp, Eye, ArrowRight, X, Copy } from 'lucide-react';

interface DuplicateAlertModalProps {
  isOpen: boolean;
  duplicateInfo: {
    id: string;
    title: string;
    location: string;
    status: IssueStatus;
    similarityScore: number;
  };
  onClose: () => void;
  onSupport: (issueId: string) => void;
  onViewExisting: (issueId: string) => void;
  onProceedAnyway: () => void;
}

export const DuplicateAlertModal: React.FC<DuplicateAlertModalProps> = ({
  isOpen,
  duplicateInfo,
  onClose,
  onSupport,
  onViewExisting,
  onProceedAnyway
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-10">
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Duplicate Complaint Detection</span>
              <h3 className="text-sm font-bold text-slate-900">Possible Duplicate Detected</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">AI Semantic Duplicate Match:</span>
            <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
              {duplicateInfo.similarityScore}% Similarity
            </span>
          </div>

          {/* Existing Issue Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {duplicateInfo.id}
              </span>
              <StatusBadge status={duplicateInfo.status} size="sm" />
            </div>

            <h4 className="font-bold text-xs text-slate-900">{duplicateInfo.title}</h4>
            <p className="text-[11px] text-slate-500 font-medium">📍 {duplicateInfo.location}</p>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Submitting as a <strong>Supporting Report</strong> links your student profile to this existing ticket, upvotes urgency for campus technicians, and sends you live resolution notifications without creating clutter.
          </p>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => onSupport(duplicateInfo.id)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-xs transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Submit as Supporting Report (+1 Urgency)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onViewExisting(duplicateInfo.id)}
                className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs py-2 px-3 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Existing Complaint</span>
              </button>

              <button
                onClick={onProceedAnyway}
                className="flex items-center justify-center gap-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs py-2 px-3 rounded-lg transition-colors"
              >
                <span>Report as Separate Issue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
