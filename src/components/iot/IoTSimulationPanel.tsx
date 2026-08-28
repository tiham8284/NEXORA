import React, { useState } from 'react';
import { triggerWaterLeakSimulation } from '../../services/iotService';
import { AlertOctagon, Zap, Terminal, CheckCircle2 } from 'lucide-react';
import { Issue } from '../../types';

interface IoTSimulationPanelProps {
  onIssueCreated?: (issue: Issue) => void;
}

export const IoTSimulationPanel: React.FC<IoTSimulationPanelProps> = ({ onIssueCreated }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastAlertIssue, setLastAlertIssue] = useState<Issue | null>(null);

  const handleSimulate = () => {
    setIsTriggering(true);
    setTimeout(() => {
      const { createdIssue } = triggerWaterLeakSimulation('ESP32-CAMPUS-001');
      setLastAlertIssue(createdIssue);
      setIsTriggering(false);
      if (onIssueCreated) {
        onIssueCreated(createdIssue);
      }
    }, 500);
  };

  return (
    <div className="space-y-5">
      {/* Simulation Callout */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Telemetry Testing
              </span>
              <span className="text-xs text-slate-400">
                Target Node: ESP32-CAMPUS-001
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Test Automatic IoT Incident Dispatch
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inject a simulated liquid conductivity breach. The telemetry router flags the threshold violation, assigns <strong>Critical</strong> priority, and dispatches ticket (<code className="text-blue-400 font-mono">FIX-IOT-xxx</code>) to the facilities dashboard.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start lg:items-end gap-1.5">
            <button
              onClick={handleSimulate}
              disabled={isTriggering}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{isTriggering ? 'Dispatching Alert...' : 'Simulate Water Leakage'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              *Simulation mode for demo evaluation
            </span>
          </div>
        </div>

        {/* Live Notification Feedback if Alert Created */}
        {lastAlertIssue && (
          <div className="mt-5 p-3.5 rounded-lg bg-slate-800 border border-red-500/40 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-red-600 text-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs">
                  Incident Dispatched: {lastAlertIssue.id}
                </h4>
                <p className="text-xs text-slate-300">
                  {lastAlertIssue.title} — Dispatched to Facilities Admin with Critical priority.
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded">
              Priority: Critical
            </span>
          </div>
        )}
      </div>

      {/* Hardware Architecture & Payload Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Architecture Flow */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Hardware Integration Pipeline</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <span className="font-mono font-bold text-slate-400 dark:text-slate-500">01</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">ESP32 Microcontroller Node</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Samples conductivity probe, DHT22 temp/humidity, and LDR every 4 seconds.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <span className="font-mono font-bold text-slate-400 dark:text-slate-500">02</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Wi-Fi Telemetry Ingestion</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Transmits JSON payload over HTTPS REST / MQTT to data router.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <span className="font-mono font-bold text-slate-400 dark:text-slate-500">03</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Threshold Engine & Webhook</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Evaluates anomaly conditions and auto-generates critical maintenance ticket.</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoint Spec */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 border border-slate-800 text-white space-y-3 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between text-slate-400 font-sans pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs text-white">ESP32 Ingestion API Spec</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">POST /api/iot/sensor-data</span>
          </div>

          <pre className="text-slate-300 overflow-x-auto text-[11px] p-3 bg-slate-950 rounded-xl border border-slate-800">
{`{
  "deviceId": "ESP32-CAMPUS-001",
  "location": "Block A - Room 204",
  "temperature": 24.2,
  "humidity": 58,
  "waterLeak": false,
  "lightLevel": 450,
  "timestamp": "2026-08-26T14:05:00Z"
}`}
          </pre>

          <p className="font-sans text-[11px] text-slate-400">
            When <code className="text-rose-400 bg-slate-800 px-1 py-0.2 rounded font-bold">waterLeak: true</code> is received, the platform triggers an emergency webhook dispatch.
          </p>
        </div>
      </div>
    </div>
  );
};

