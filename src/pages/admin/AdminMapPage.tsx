import React, { useState, useEffect } from 'react';
import { Issue } from '../../types';
import { getIssues, subscribeToStore } from '../../services/storageService';
import { InteractiveCampusMap } from '../../components/map/InteractiveCampusMap';

interface AdminMapPageProps {
  onSelectIssue: (issueId: string) => void;
}

export const AdminMapPage: React.FC<AdminMapPageProps> = ({ onSelectIssue }) => {
  const [issues, setIssues] = useState<Issue[]>([]);

  const loadData = () => {
    setIssues(getIssues());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(loadData);
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Geospatial Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Campus Spatial Map & Hotspots
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Real-time incident distribution, building density hotspots, and emergency markers
        </p>
      </div>

      <InteractiveCampusMap issues={issues} onSelectIssue={onSelectIssue} />
    </div>
  );
};
