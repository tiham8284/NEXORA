import React from 'react';
import { IssueStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle, Wrench, RotateCcw, UserCheck, ShieldCheck, Brain, Play } from 'lucide-react';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const getConfig = () => {
    switch (status) {
      case 'REPORTED':
        return {
          label: 'Reported',
          bg: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: Clock
        };
      case 'AI_ANALYSED':
        return {
          label: 'AI Analysed',
          bg: 'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          icon: Brain
        };
      case 'ASSIGNED':
        return {
          label: 'Assigned',
          bg: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          icon: UserCheck
        };
      case 'ACCEPTED':
        return {
          label: 'Accepted',
          bg: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold',
          icon: Play
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          bg: 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          icon: Wrench
        };
      case 'RESOLVED':
        return {
          label: 'Resolved (Pending Feedback)',
          bg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: CheckCircle2
        };
      case 'REOPENED':
        return {
          label: 'Reopened',
          bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: RotateCcw
        };
      case 'CLOSED':
        return {
          label: 'Closed & Rated',
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: CheckCircle2
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: AlertCircle
        };

    }
  };

  const { label, bg, icon: Icon } = getConfig();

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-medium px-3 py-1.5 gap-2'
  };

  return (
    <span className={`inline-flex items-center rounded-md border font-medium transition-colors ${bg} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
