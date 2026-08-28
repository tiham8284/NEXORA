import React, { useState } from 'react';
import { Issue } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Layers, Eye, Flame } from 'lucide-react';

interface InteractiveCampusMapProps {
  issues: Issue[];
  onSelectIssue: (issueId: string) => void;
}

interface BuildingZone {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const BUILDINGS: BuildingZone[] = [
  { id: 'b1', name: 'Block A — Academic Complex', shortName: 'Block A', x: 80, y: 80, width: 220, height: 160 },
  { id: 'b2', name: 'Block B — Science & Engineering', shortName: 'Block B', x: 340, y: 80, width: 200, height: 150 },
  { id: 'b3', name: 'Block C — Technology Tower', shortName: 'Block C', x: 580, y: 80, width: 180, height: 180 },
  { id: 'b4', name: 'Central Library', shortName: 'Library', x: 80, y: 280, width: 180, height: 160 },
  { id: 'b5', name: 'Student Center & Canteen', shortName: 'Canteen', x: 300, y: 270, width: 220, height: 130 },
  { id: 'b6', name: 'Auditorium & Seminar Halls', shortName: 'Auditorium', x: 560, y: 300, width: 200, height: 140 },
  { id: 'b7', name: 'Hostel Block 1 (Men)', shortName: 'Hostel 1', x: 80, y: 480, width: 190, height: 120 },
  { id: 'b8', name: 'Hostel Block 2 (Women)', shortName: 'Hostel 2', x: 310, y: 440, width: 190, height: 120 },
  { id: 'b9', name: 'Sports Complex & Gymnasium', shortName: 'Sports Arena', x: 540, y: 480, width: 220, height: 130 }
];

export const InteractiveCampusMap: React.FC<InteractiveCampusMapProps> = ({ issues, onSelectIssue }) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [activeBuildingFilter, setActiveBuildingFilter] = useState<string | null>(null);

  const buildingHotspots = BUILDINGS.map(b => {
    const buildingIssues = issues.filter(i => 
      i.building.toLowerCase().includes(b.shortName.toLowerCase()) || 
      b.name.toLowerCase().includes(i.building.toLowerCase())
    );
    const criticalCount = buildingIssues.filter(i => i.priority === 'Critical' && i.status !== 'CLOSED').length;
    const activeCount = buildingIssues.filter(i => i.status !== 'CLOSED').length;
    return {
      ...b,
      totalIssues: buildingIssues.length,
      activeCount,
      criticalCount
    };
  }).sort((a, b) => b.activeCount - a.activeCount);

  const filteredIssues = issues.filter(issue => {
    if (filterPriority !== 'ALL' && issue.priority !== filterPriority) return false;
    if (activeBuildingFilter && !issue.building.toLowerCase().includes(activeBuildingFilter.toLowerCase())) return false;
    return true;
  });

  const getPinPosition = (issue: Issue, index: number) => {
    const b = BUILDINGS.find(zone => 
      issue.building.toLowerCase().includes(zone.shortName.toLowerCase()) || 
      zone.name.toLowerCase().includes(issue.building.toLowerCase())
    ) || BUILDINGS[0];

    const offsetX = (index % 4) * 35 + 25;
    const offsetY = Math.floor(index / 4) * 30 + 35;

    return {
      x: b.x + offsetX,
      y: b.y + offsetY
    };
  };

  return (
    <div className="space-y-5">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Priority:
          </span>

          {['ALL', 'Critical', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterPriority === p
                  ? p === 'Critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p === 'ALL' ? 'All Pins' : p}
            </button>
          ))}
        </div>

        {activeBuildingFilter && (
          <button
            onClick={() => setActiveBuildingFilter(null)}
            className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium hover:bg-slate-200"
          >
            Clear building filter ({activeBuildingFilter}) ✕
          </button>
        )}

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600" /> High</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Medium</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600" /> Resolved</span>
        </div>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Map Canvas */}
        <div className="lg:col-span-3 bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-5 shadow-xs relative overflow-hidden min-h-[500px]">
          <div className="absolute top-5 left-5 z-10 bg-slate-900/90 border border-slate-800 rounded-lg px-3.5 py-2 text-white">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <h4 className="font-semibold text-xs text-slate-100">Main Campus Geospatial Grid</h4>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{filteredIssues.length} active geolocated incidents</p>
          </div>

          <div className="w-full h-full flex items-center justify-center overflow-x-auto py-6">
            <svg
              viewBox="0 0 850 650"
              className="w-full max-w-[850px] select-none"
              style={{ minWidth: '650px' }}
            >
              <defs>
                <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="850" height="650" fill="#0f172a" />
              <rect width="850" height="650" fill="url(#campusGrid)" />

              {/* Pathways */}
              <path
                d="M 50 250 L 800 250 M 50 450 L 800 450 M 300 50 L 300 620 M 540 50 L 540 620"
                stroke="#1e293b"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 50 250 L 800 250 M 50 450 L 800 450 M 300 50 L 300 620 M 540 50 L 540 620"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4,4"
                fill="none"
              />

              {/* Central Green Quad */}
              <rect
                x="320"
                y="150"
                width="200"
                height="80"
                rx="8"
                fill="#064e3b"
                opacity="0.4"
                stroke="#047857"
                strokeWidth="1"
              />
              <text x="420" y="195" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                Central Campus Quad
              </text>

              {/* Buildings */}
              {BUILDINGS.map(b => {
                const isFiltered = activeBuildingFilter && b.shortName.toLowerCase().includes(activeBuildingFilter.toLowerCase());
                return (
                  <g
                    key={b.id}
                    onClick={() => setActiveBuildingFilter(activeBuildingFilter === b.shortName ? null : b.shortName)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={b.x}
                      y={b.y}
                      width={b.width}
                      height={b.height}
                      rx="8"
                      className={`transition-colors ${
                        isFiltered
                          ? 'fill-slate-800 stroke-blue-500 stroke-2'
                          : 'fill-slate-800/90 stroke-slate-700 hover:fill-slate-700'
                      }`}
                    />
                    <text
                      x={b.x + 12}
                      y={b.y + 24}
                      fill="#e2e8f0"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {b.shortName}
                    </text>
                  </g>
                );
              })}

              {/* Issue Pins */}
              {filteredIssues.map((issue, idx) => {
                const pos = getPinPosition(issue, idx);
                const isSelected = selectedIssue?.id === issue.id;

                const pinFill = 
                  issue.status === 'CLOSED' || issue.status === 'RESOLVED'
                    ? '#16a34a'
                    : issue.priority === 'Critical'
                    ? '#dc2626'
                    : issue.priority === 'High'
                    ? '#d97706'
                    : '#2563eb';

                return (
                  <g
                    key={issue.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedIssue(issue)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={isSelected ? 12 : 9}
                      fill={pinFill}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />

                    <text
                      textAnchor="middle"
                      dy="3"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Pin Popup Card */}
          {selectedIssue && (
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-white rounded-xl p-4 shadow-lg border border-slate-200 z-20 text-slate-900">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                      {selectedIssue.id}
                    </span>
                    <PriorityBadge priority={selectedIssue.priority} size="sm" />
                    <StatusBadge status={selectedIssue.status} size="sm" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{selectedIssue.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">📍 {selectedIssue.building} ({selectedIssue.room})</p>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  By: {selectedIssue.reportedBy?.name.split(' ')[0]}
                </span>
                <button
                  onClick={() => onSelectIssue(selectedIssue.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect Ticket
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hotspots Side Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                Campus Hotspots
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">Open Tickets</span>
            </div>

            <div className="space-y-2">
              {buildingHotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  onClick={() => setActiveBuildingFilter(activeBuildingFilter === hotspot.shortName ? null : hotspot.shortName)}
                  className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                    activeBuildingFilter === hotspot.shortName
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900">{hotspot.shortName}</h4>
                    <p className="text-[10px] text-slate-500">{hotspot.totalIssues} total logged</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hotspot.criticalCount > 0 && (
                      <span className="text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 rounded">
                        {hotspot.criticalCount} crit
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {hotspot.activeCount} active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
