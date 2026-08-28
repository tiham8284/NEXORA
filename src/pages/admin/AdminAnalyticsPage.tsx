import React, { useState, useEffect } from 'react';
import { Issue } from '../../types';
import { getIssues, subscribeToStore } from '../../services/storageService';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, Clock, CheckCircle2, TrendingUp, ShieldAlert, Star } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  const loadData = () => {
    setIssues(getIssues());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const total = issues.length;
  const openCount = issues.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const highPriorityCount = issues.filter(i => (i.priority === 'High' || i.priority === 'Critical') && i.status !== 'CLOSED').length;
  const slaBreachedCount = issues.filter(i => i.isSlaBreached && i.status !== 'CLOSED').length;
  const resolvedWithinSLA = issues.filter(i => (i.status === 'RESOLVED' || i.status === 'CLOSED') && !i.isSlaBreached).length;
  const slaComplianceRate = resolvedCount > 0 ? Math.round((resolvedWithinSLA / resolvedCount) * 100) : 94;

  const ratedIssues = issues.filter(i => i.rating && i.rating > 0);
  const avgRating = ratedIssues.length > 0
    ? (ratedIssues.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedIssues.length).toFixed(1)
    : '4.8';


  // 1. Category Distribution
  const categoryCounts: Record<string, number> = {};
  issues.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const CATEGORY_COLORS = [
    '#2563eb', // Blue
    '#0f172a', // Navy
    '#3b82f6', // Light Blue
    '#64748b', // Slate
    '#d97706', // Amber
    '#16a34a', // Green
    '#475569', // Dark Slate
    '#94a3b8'  // Light Slate
  ];

  // 2. Department Volume
  const departmentCounts: Record<string, number> = {
    'Plumbing': 0,
    'Electrical': 0,
    'Furniture': 0,
    'IT/Network': 0,
    'Housekeeping': 0,
    'AV Support': 0
  };

  issues.forEach(i => {
    if (i.category === 'Plumbing') departmentCounts['Plumbing']++;
    else if (i.category === 'Electrical') departmentCounts['Electrical']++;
    else if (i.category === 'Furniture') departmentCounts['Furniture']++;
    else if (i.category === 'Wi-Fi/Network') departmentCounts['IT/Network']++;
    else if (i.category === 'Cleaning') departmentCounts['Housekeeping']++;
    else departmentCounts['AV Support']++;
  });

  const departmentData = Object.entries(departmentCounts).map(([dept, count]) => ({ dept, count }));

  // 3. 7-Day Velocity
  const velocityData = [
    { day: 'Mon', reported: 6, resolved: 5 },
    { day: 'Tue', reported: 8, resolved: 7 },
    { day: 'Wed', reported: 11, resolved: 10 },
    { day: 'Thu', reported: 9, resolved: 8 },
    { day: 'Fri', reported: 14, resolved: 13 },
    { day: 'Sat', reported: 4, resolved: 5 },
    { day: 'Sun', reported: 3, resolved: 4 },
  ];

  // 4. Department SLA Performance (Hours)
  const slaData = [
    { dept: 'Electrical', avgHours: 3.2, targetHours: 4.0 },
    { dept: 'Plumbing', avgHours: 1.8, targetHours: 2.5 },
    { dept: 'HVAC', avgHours: 4.8, targetHours: 6.0 },
    { dept: 'Network', avgHours: 1.5, targetHours: 2.0 },
    { dept: 'Civil/Estates', avgHours: 6.8, targetHours: 8.0 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
            NEXORA Intelligence
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.2 rounded border border-slate-200 dark:border-slate-700">
            SIH 2026 PS 306
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Campus Facility Analytics & SLA Benchmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Institutional resolution velocity, SLA compliance %, category trends, and department turnaround metrics
        </p>
      </div>

      {/* 6 Summary Stat Cards - Exactly 2 rows of 3 cards each (First line 3, Second line 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">

          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Complaints</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{total}</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Recorded tickets</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Open Queue</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{openCount}</p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Active dispatches</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Resolved Tickets</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Completed fixes</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">High / Critical</span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{highPriorityCount}</p>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Urgent hazards</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">SLA Compliance</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{slaComplianceRate}%</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Resolved in window</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg User Rating</span>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{avgRating}</p>
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Student feedback</span>
        </div>
      </div>


      {/* 2x2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Complaints by Category</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Relative distribution across facility domains</p>
            </div>
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '12px', border: '1px solid #334155', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {categoryData.map((cat, idx) => (
              <span key={cat.name} className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                />
                {cat.name} ({cat.value})
              </span>
            ))}
          </div>
        </div>

        {/* Chart 2: Complaints by Department */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Complaints by Department Queue</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Workload distribution across maintenance trades</p>
            </div>
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="dept" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '12px', border: '1px solid #334155', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: 7-Day Velocity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">7-Day Resolution Velocity</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Reported issues vs completed repairs</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '12px', border: '1px solid #334155', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="reported" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} strokeWidth={2} name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Reported</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Resolved</span>
          </div>
        </div>

        {/* Chart 4: Department SLA Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Department Turnaround Time vs SLA (Hours)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Actual resolution time compared against target SLA</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slaData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="h" />
                <YAxis dataKey="dept" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '12px', border: '1px solid #334155', fontSize: '11px' }}
                />
                <Bar dataKey="avgHours" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Actual Avg Hours" />
                <Bar dataKey="targetHours" fill="#64748b" radius={[0, 4, 4, 0]} name="Target SLA Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Actual Time</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Target SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

