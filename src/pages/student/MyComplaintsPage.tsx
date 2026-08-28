import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Issue } from '../../types';
import { getIssues, subscribeToStore } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { StarRating } from '../../components/common/StarRating';
import { Plus, Search, Eye, MapPin, FileText } from 'lucide-react';

interface MyComplaintsPageProps {
  onNavigate: (route: string) => void;
  onSelectIssue: (issueId: string) => void;
}

export const MyComplaintsPage: React.FC<MyComplaintsPageProps> = ({ onNavigate, onSelectIssue }) => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadData = () => {
    setIssues(getIssues());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const myIssues = issues.filter(
    i => i.reportedBy.id === currentUser?.id || i.reportedBy.email === currentUser?.email
  );

  const filtered = myIssues.filter(issue => {
    if (statusFilter !== 'ALL' && issue.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.building.toLowerCase().includes(q) ||
        issue.room.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Student / Reporter Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Registered Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track real-time SLA progress, technician dispatch status, and provide rating confirmations
          </p>
        </div>

        <button
          onClick={() => onNavigate('/student/report')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search my issues by ID (e.g. CF-1001), keyword, location..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
        >
          <option value="ALL">All Statuses ({myIssues.length})</option>
          <option value="REPORTED">Reported</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved (Needs Review)</option>
          <option value="CLOSED">Closed & Rated</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FileText className="w-8 h-8 mx-auto opacity-30" />
            <p className="text-xs font-semibold text-slate-700">No matching complaints found</p>
            <p className="text-xs text-slate-400">You haven't submitted any complaints matching this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">ID</th>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Target SLA</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-blue-600">
                      {issue.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 max-w-xs truncate" title={issue.title}>
                        {issue.title}
                      </div>
                      <span className="text-[11px] text-slate-400">{issue.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{issue.building.split('—')[0]}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 ml-4">{issue.room}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <SLATimerBadge
                        deadline={issue.slaDeadline}
                        isResolved={issue.status === 'RESOLVED' || issue.status === 'CLOSED'}
                        escalationLevel={issue.escalationLevel}
                        slaHours={issue.slaHours}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      {issue.rating ? (
                        <StarRating value={issue.rating} readOnly size="sm" />
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unrated</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => onSelectIssue(issue.id)}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Track</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
