import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'neutral' | 'blue' | 'amber' | 'green' | 'red' | 'indigo' | 'emerald' | 'rose' | 'purple';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'neutral',
  trend,
  onClick
}) => {
  const colorMap = {
    neutral: {
      cardBg: 'bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900/90 border-slate-200/90 dark:border-slate-800',
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      numColor: 'text-slate-900 dark:text-white'
    },
    blue: {
      cardBg: 'bg-gradient-to-br from-white via-blue-50/40 to-blue-100/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border-blue-200 dark:border-blue-900/50',
      iconBg: 'bg-blue-600 text-white shadow-xs shadow-blue-500/20',
      numColor: 'text-blue-700 dark:text-blue-400'
    },
    indigo: {
      cardBg: 'bg-gradient-to-br from-white via-indigo-50/40 to-indigo-100/30 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border-indigo-200 dark:border-indigo-900/50',
      iconBg: 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20',
      numColor: 'text-indigo-700 dark:text-indigo-400'
    },
    amber: {
      cardBg: 'bg-gradient-to-br from-white via-amber-50/40 to-amber-100/30 dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-900 border-amber-200 dark:border-amber-900/50',
      iconBg: 'bg-amber-500 text-white shadow-xs shadow-amber-500/20',
      numColor: 'text-amber-700 dark:text-amber-400'
    },
    green: {
      cardBg: 'bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 border-emerald-200 dark:border-emerald-900/50',
      iconBg: 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/20',
      numColor: 'text-emerald-700 dark:text-emerald-400'
    },
    emerald: {
      cardBg: 'bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 border-emerald-200 dark:border-emerald-900/50',
      iconBg: 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/20',
      numColor: 'text-emerald-700 dark:text-emerald-400'
    },
    red: {
      cardBg: 'bg-gradient-to-br from-white via-rose-50/40 to-rose-100/30 dark:from-slate-900 dark:via-rose-950/30 dark:to-slate-900 border-rose-200 dark:border-rose-900/50',
      iconBg: 'bg-rose-600 text-white shadow-xs shadow-rose-500/20',
      numColor: 'text-rose-700 dark:text-rose-400'
    },
    rose: {
      cardBg: 'bg-gradient-to-br from-white via-rose-50/40 to-rose-100/30 dark:from-slate-900 dark:via-rose-950/30 dark:to-slate-900 border-rose-200 dark:border-rose-900/50',
      iconBg: 'bg-rose-600 text-white shadow-xs shadow-rose-500/20',
      numColor: 'text-rose-700 dark:text-rose-400'
    },
    purple: {
      cardBg: 'bg-gradient-to-br from-white via-purple-50/40 to-purple-100/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900 border-purple-200 dark:border-purple-900/50',
      iconBg: 'bg-purple-600 text-white shadow-xs shadow-purple-500/20',
      numColor: 'text-purple-700 dark:text-purple-400'
    }
  };

  const scheme = colorMap[color] || colorMap.neutral;

  return (
    <div
      onClick={onClick}
      className={`border rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all ${scheme.cardBg} ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 pt-0.5">
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${scheme.numColor}`}>{value}</h3>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  trend.isPositive ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800' : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 truncate">{subtitle}</p>}
        </div>

        <div className={`p-2.5 rounded-xl shrink-0 ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

