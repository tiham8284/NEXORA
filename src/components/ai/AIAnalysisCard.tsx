import React from 'react';
import { AIAnalysisResult } from '../../types';
import { Sparkles, Brain, CheckCircle2, Clock } from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';

interface AIAnalysisCardProps {
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
  onApplySuggestions: () => void;
  isApplied: boolean;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  analysis,
  isLoading,
  onApplySuggestions,
  isApplied
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-400 animate-spin" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-100 flex items-center gap-2">
              <span>CampusFix AI Auto-Categorisation & SLA Engine</span>
            </h4>
            <p className="text-xs text-slate-400">Evaluating image fixtures, priority urgency matrix, and duplicate index...</p>
          </div>
        </div>

        <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-2/3 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">AI Classification</span>
              <span className="bg-slate-800 border border-slate-700 text-blue-300 text-[10px] font-medium px-2 py-0.2 rounded">
                {analysis.confidence}% Confidence
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">{analysis.detectedIssue}</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onApplySuggestions}
          disabled={isApplied}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isApplied
              ? 'bg-slate-800 text-green-400 border border-slate-700 cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Suggestions Applied
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Use AI Suggestions
            </>
          )}
        </button>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Auto Category</span>
          <span className="text-xs font-bold text-white mt-0.5 block">{analysis.category}</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Priority Score</span>
          <div className="mt-1">
            <PriorityBadge priority={analysis.priority} size="sm" />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Target SLA</span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{analysis.slaHours} Hours</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Suggested Dept</span>
          <span className="text-xs font-medium text-slate-200 mt-0.5 block truncate" title={analysis.suggestedDepartment}>
            {analysis.suggestedDepartment}
          </span>
        </div>
      </div>

      {/* Observations */}
      {analysis.keyObservations && analysis.keyObservations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Detected Signals:
          </span>
          {analysis.keyObservations.map((obs, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded"
            >
              • {obs}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
