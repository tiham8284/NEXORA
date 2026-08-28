import React, { useState, useEffect } from 'react';
import { IoTDevice, Issue } from '../../types';
import { getIoTDevices, subscribeToStore } from '../../services/storageService';
import { triggerWaterLeakSimulation } from '../../services/iotService';
import { IoTDeviceCard } from '../../components/iot/IoTDeviceCard';
import { IoTSimulationPanel } from '../../components/iot/IoTSimulationPanel';
import { Cpu, Activity, Layers, Sparkles } from 'lucide-react';

interface AdminIoTPageProps {
  onSelectIssue?: (issueId: string) => void;
}

export const AdminIoTPage: React.FC<AdminIoTPageProps> = ({ onSelectIssue }) => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);

  const loadDevices = () => {
    setDevices(getIoTDevices());
  };

  useEffect(() => {
    loadDevices();
    const unsub = subscribeToStore(loadDevices);
    return () => unsub();
  }, []);

  const handleSimulateLeak = (deviceId: string) => {
    const { createdIssue } = triggerWaterLeakSimulation(deviceId);
    if (onSelectIssue && createdIssue) {
      onSelectIssue(createdIssue.id);
    }
  };

  const handleIssueCreated = (issue: Issue) => {
    if (onSelectIssue) {
      onSelectIssue(issue.id);
    }
  };

  const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
  const alertCount = devices.filter(d => d.status === 'ALERT' || d.currentReading.waterLeak).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
              NEXORA Hardware Telemetry
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.2 rounded border border-slate-200 dark:border-slate-700">
              ESP32 Sensor Grid
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            IoT Sensor Grid & Telemetry Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Real-time environmental sensor nodes streaming Wi-Fi telemetry with automated zero-latency incident dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-3 py-1 rounded-xl shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {onlineCount} Online
          </span>

          {alertCount > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold px-3 py-1 rounded-xl shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {alertCount} Alert
            </span>
          )}
        </div>
      </div>

      {/* Simulation Trigger Panel */}
      <IoTSimulationPanel onIssueCreated={handleIssueCreated} />

      {/* Live Device Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Active Microcontroller Nodes ({devices.length})
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Heartbeat: 4s interval</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.map(device => (
            <IoTDeviceCard
              key={device.id}
              device={device}
              onSimulateLeak={handleSimulateLeak}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

