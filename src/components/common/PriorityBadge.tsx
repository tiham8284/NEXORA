import React from 'react';
import { IssuePriority } from '../../types';
import { AlertOctagon, Flame, AlertTriangle, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: IssuePriority;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', showIcon = true }) => {
  const getConfig = () => {
    switch (priority) {
      case 'Critical':
        return {
          label: 'Critical',
          bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold',
          icon: AlertOctagon
        };
      case 'High':
        return {
          label: 'High',
          bg: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-semibold',
          icon: Flame
        };
      case 'Medium':
        return {
          label: 'Medium',
          bg: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-medium',
          icon: AlertTriangle
        };
      case 'Low':
        return {
          label: 'Low',
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-normal',
          icon: ArrowDown
        };
      default:
        return {
          label: priority,
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: AlertTriangle
        };

    }
  };

  const { label, bg, icon: Icon } = getConfig();

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2'
  };

  return (
    <span className={`inline-flex items-center rounded-md border ${bg} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
