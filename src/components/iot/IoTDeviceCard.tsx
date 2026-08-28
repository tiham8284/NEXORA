import React from 'react';
import { IoTDevice } from '../../types';
import { Cpu, Thermometer, Droplets, Sun, Battery, AlertOctagon, RotateCcw } from 'lucide-react';
import { resetIoTDevice } from '../../services/iotService';

interface IoTDeviceCardProps {
  device: IoTDevice;
  onSimulateLeak: (deviceId: string) => void;
}

export const IoTDeviceCard: React.FC<IoTDeviceCardProps> = ({ device, onSimulateLeak }) => {
  const isAlert = device.status === 'ALERT' || device.currentReading.waterLeak;

  const handleReset = () => {
    resetIoTDevice(device.id);
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isAlert
          ? 'bg-red-50/40 dark:bg-red-950/30 border-red-300 dark:border-red-800 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isAlert ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{device.id}</span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                  isAlert
                    ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                {isAlert ? 'ALERT ACTIVE' : 'ONLINE'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{device.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">📍 {device.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {device.batteryLevel !== undefined && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg">
              <Battery className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              {device.batteryLevel}%
            </span>
          )}

          {isAlert ? (
            <button
              onClick={handleReset}
              className="text-xs bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          ) : (
            <button
              onClick={() => onSimulateLeak(device.id)}
              className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/60 text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-300 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <AlertOctagon className="w-3 h-3 text-red-600 dark:text-red-400" />
              Simulate Leak
            </button>
          )}
        </div>
      </div>

      {/* Sensor Metrics 4-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
        {/* Temperature */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{device.currentReading.temperature}°C</p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded inline-block mt-0.5 border border-emerald-200 dark:border-emerald-800">
            Nominal
          </span>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Humidity</span>
            <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{device.currentReading.humidity}% RH</p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded inline-block mt-0.5 border border-emerald-200 dark:border-emerald-800">
            Comfort
          </span>
        </div>

        {/* Liquid Conductivity Probe */}
        <div
          className={`border rounded-xl p-3 ${
            device.currentReading.waterLeak
              ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-700'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Liquid Sensor</span>
            <Droplets
              className={`w-3.5 h-3.5 ${
                device.currentReading.waterLeak ? 'text-red-600 dark:text-red-400 animate-bounce' : 'text-slate-400'
              }`}
            />
          </div>
          <p
            className={`text-lg font-black ${
              device.currentReading.waterLeak ? 'text-red-700 dark:text-red-300' : 'text-slate-900 dark:text-white'
            }`}
          >
            {device.currentReading.waterLeak ? 'LEAK DETECTED' : 'Dry'}
          </p>
          <span
            className={`text-[10px] font-bold px-1 py-0.2 rounded inline-block mt-0.5 border ${
              device.currentReading.waterLeak
                ? 'text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
                : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {device.currentReading.waterLeak ? 'Critical Threshold' : 'Nominal'}
          </span>
        </div>

        {/* Light Level */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Light LDR</span>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{device.currentReading.lightLevel} lux</p>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-700 px-1 py-0.2 rounded inline-block mt-0.5 border border-slate-200 dark:border-slate-600">
            Illuminated
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>Wi-Fi 802.11 b/g/n (RSSI -58 dBm)</span>
        <span>Heartbeat active</span>
      </div>
    </div>
  );
};
