import React, { useState, useEffect } from 'react';
import { EscalationLevel } from '../../types';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface SLATimerBadgeProps {
  deadline: string;
  isResolved?: boolean;
  escalationLevel?: EscalationLevel;
  slaHours?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const SLATimerBadge: React.FC<SLATimerBadgeProps> = ({
  deadline,
  isResolved = false,
  escalationLevel = 'None',
  slaHours,
  size = 'md'
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isBreached: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBreached: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(deadline).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isBreached: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isBreached: false });
      }
    };

    calculateTime();
    if (!isResolved) {
      const timer = setInterval(calculateTime, 1000);
      return () => clearInterval(timer);
    }
  }, [deadline, isResolved]);

  if (isResolved) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
        <span>SLA Met</span>
      </span>
    );
  }

  const formatUnit = (n: number) => String(n).padStart(2, '0');

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  if (timeLeft.isBreached) {
    return (
      <div className="inline-flex items-center gap-1.5 flex-wrap">
        <span
          className={`inline-flex items-center font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-md ${sizeClasses[size]}`}
          title="Resolution time exceeded target SLA"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>SLA BREACHED</span>
        </span>

        {escalationLevel && escalationLevel !== 'None' && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700 px-2 py-0.5 rounded">
            <ShieldAlert className="w-3 h-3 text-rose-700 dark:text-rose-300" />
            Escalated to: {escalationLevel.replace('_', ' ')}
          </span>
        )}
      </div>
    );
  }

  // Warning state if less than 1 hour remaining
  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 60;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${
        isUrgent
          ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-semibold'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
      } ${sizeClasses[size]}`}
      title={slaHours ? `Target SLA: ${slaHours} Hours` : 'Target SLA Window'}
    >
      <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`} />
      <span className="font-mono">
        SLA: {formatUnit(timeLeft.hours)}:{formatUnit(timeLeft.minutes)}:{formatUnit(timeLeft.seconds)}
      </span>
    </span>
  );
};

