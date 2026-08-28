import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Issue } from '../../types';
import { getIssues, toggleSupportIssue, subscribeToStore } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { StarRating } from '../../components/common/StarRating';
import { Search, ThumbsUp, MapPin, Eye } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../../data/seedData';

interface CampusIssuesPageProps {
  onSelectIssue: (issueId: string) => void;
}

export const CampusIssuesPage: React.FC<CampusIssuesPageProps> = ({ onSelectIssue }) => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [buildingFilter, setBuildingFilter] = useState('ALL');

  const loadData = () => {
    setIssues(getIssues());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const handleSupport = (e: React.MouseEvent, issueId: string) => {
    e.stopPropagation();
    if (currentUser) {
      toggleSupportIssue(issueId, currentUser.id);
    }
  };

  const filtered = issues.filter(issue => {
    if (categoryFilter !== 'ALL' && issue.category !== categoryFilter) return false;
    if (buildingFilter !== 'ALL' && !issue.building.toLowerCase().includes(buildingFilter.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.building.toLowerCase().includes(q) ||
        issue.room.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Campus-Wide Community Feed
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Public Facility Issues Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Support existing campus complaints to increase repair urgency without creating duplicate tickets
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus issues by ID (e.g. CF-1001), keyword, building, room..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
          >
            <option value="ALL">All Categories</option>
            {['Electrical', 'Plumbing', 'Furniture', 'Cleaning', 'Wi-Fi/Network', 'Classroom Equipment', 'Safety', 'Infrastructure'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
          >
            <option value="ALL">All Campus Buildings</option>
            {CAMPUS_BUILDINGS.map(b => (
              <option key={b} value={b.split('—')[0].trim()}>{b.split('—')[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Complaints */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-slate-400 border border-slate-200">
          <p className="text-xs font-semibold text-slate-700">No issues found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(issue => {
            const isSupported = currentUser ? issue.supportedByUserIds?.includes(currentUser.id) : false;

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue.id)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="aspect-16/9 bg-slate-900 relative overflow-hidden">
                    <img
                      src={issue.beforeImage}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-2xs px-2 py-0.5 rounded">
                        {issue.id}
                      </span>
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </div>
                    <div className="absolute bottom-2.5 left-2.5">
                      <StatusBadge status={issue.status} size="sm" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{issue.building.split('—')[0]} • {issue.room}</span>
                    </div>

                    <div className="pt-1">
                      <SLATimerBadge
                        deadline={issue.slaDeadline}
                        isResolved={issue.status === 'RESOLVED' || issue.status === 'CLOSED'}
                        escalationLevel={issue.escalationLevel}
                        slaHours={issue.slaHours}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={(e) => handleSupport(e, issue.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${
                      isSupported
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isSupported ? 'fill-blue-600 text-blue-600' : ''}`} />
                    <span>{issue.supportersCount || 1} Supports</span>
                  </button>

                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                    <span>Inspect</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
