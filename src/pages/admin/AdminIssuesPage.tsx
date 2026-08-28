import React, { useState, useEffect } from 'react';
import { Issue, User } from '../../types';
import { getIssues, getUsers, assignIssue, subscribeToStore } from '../../services/storageService';
import { exportIssuesToCSV } from '../../services/exportService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { StarRating } from '../../components/common/StarRating';
import { Modal } from '../../components/common/Modal';
import { Search, Download, Eye, MapPin } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../../data/seedData';

interface AdminIssuesPageProps {
  onSelectIssue: (issueId: string) => void;
}

export const AdminIssuesPage: React.FC<AdminIssuesPageProps> = ({ onSelectIssue }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [buildingFilter, setBuildingFilter] = useState<string>('ALL');

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState<Issue | null>(null);
  const [selectedTechId, setSelectedTechId] = useState('');

  const loadData = () => {
    setIssues(getIssues());
    const users = getUsers();
    setTechnicians(users.filter(u => u.role === 'maintenance'));
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  const handleOpenAssign = (e: React.MouseEvent, issue: Issue) => {
    e.stopPropagation();
    setSelectedIssueForAssign(issue);
    setSelectedTechId(technicians[0]?.id || '');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedIssueForAssign || !selectedTechId) return;
    const tech = technicians.find(t => t.id === selectedTechId);
    if (!tech) return;

    assignIssue(
      selectedIssueForAssign.id,
      {
        id: tech.id,
        name: tech.name,
        email: tech.email,
        phone: tech.phone,
        department: tech.department,
        avatar: tech.avatar
      },
      { id: 'admin-1', name: 'Facilities Admin', role: 'admin' }
    );

    setAssignModalOpen(false);
    setSelectedIssueForAssign(null);
  };

  const filtered = issues.filter(issue => {
    if (statusFilter === 'BREACHED') {
      if (!issue.isSlaBreached) return false;
    } else if (statusFilter !== 'ALL' && issue.status !== statusFilter) {
      return false;
    }

    if (priorityFilter !== 'ALL' && issue.priority !== priorityFilter) return false;
    if (categoryFilter !== 'ALL' && issue.category !== categoryFilter) return false;
    if (buildingFilter !== 'ALL' && !issue.building.toLowerCase().includes(buildingFilter.toLowerCase())) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.building.toLowerCase().includes(q) ||
        issue.room.toLowerCase().includes(q) ||
        issue.reportedBy.name.toLowerCase().includes(q) ||
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
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Issue Master Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Campus Issues Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {issues.length} total recorded facility complaints across all departments with live SLA timers
          </p>
        </div>

        <button
          onClick={() => exportIssuesToCSV(filtered)}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-2xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID (e.g. CF-1001), keyword, room, student name..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">All Statuses</option>
              <option value="BREACHED">⚠️ SLA Breached Queue</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REOPENED">Reopened</option>
              <option value="CLOSED">Closed & Rated</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical (2h SLA)</option>
              <option value="High">High (4h SLA)</option>
              <option value="Medium">Medium (24h SLA)</option>
              <option value="Low">Low (72h SLA)</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">All Categories</option>
              {['Electrical', 'Plumbing', 'Furniture', 'Cleaning', 'Wi-Fi/Network', 'Classroom Equipment', 'Safety', 'Infrastructure', 'HVAC/Air Conditioning'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Building */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Building</label>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">All Buildings</option>
              {CAMPUS_BUILDINGS.map(b => (
                <option key={b} value={b.split('—')[0].trim()}>{b.split('—')[0]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No matching complaints found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Try changing your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-3">Problem</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Target SLA</th>
                  <th className="py-3 px-3">Assigned Staff</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filtered.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => onSelectIssue(issue.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {issue.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white max-w-[170px] truncate" title={issue.title}>
                        {issue.title}
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{issue.category}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[120px]">{issue.building.split('—')[0]}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-4">{issue.room}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3">
                      <SLATimerBadge
                        deadline={issue.slaDeadline}
                        isResolved={issue.status === 'RESOLVED' || issue.status === 'CLOSED'}
                        escalationLevel={issue.escalationLevel}
                        slaHours={issue.slaHours}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                      {issue.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={issue.assignedTo.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <span className="truncate max-w-[100px] text-slate-800 dark:text-slate-200 font-semibold">{issue.assignedTo.name}</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleOpenAssign(e, issue)}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-lg transition-colors"
                        >
                          + Dispatch Staff
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectIssue(issue.id)}
                        className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK ASSIGN MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Dispatch Maintenance Technician"
      >
        {selectedIssueForAssign && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{selectedIssueForAssign.id}</span>
                <PriorityBadge priority={selectedIssueForAssign.priority} size="sm" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{selectedIssueForAssign.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">📍 {selectedIssueForAssign.building} ({selectedIssueForAssign.room})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Technician
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {technicians.map(tech => (
                  <label
                    key={tech.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedTechId === tech.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="tech"
                        checked={selectedTechId === tech.id}
                        onChange={() => setSelectedTechId(tech.id)}
                        className="text-indigo-600"
                      />
                      <img
                        src={tech.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{tech.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{tech.department} • {tech.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Dispatch Staff
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

