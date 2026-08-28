import { IoTDevice } from '../types';
import { getIoTDevices, updateIoTDevice, simulateWaterLeakAnomaly } from './storageService';

export function startTelemetrySimulation() {
  const interval = setInterval(() => {
    const devices = getIoTDevices();
    devices.forEach(device => {
      // If currently in ALERT, keep it in alert until user resets
      if (device.status === 'ALERT') return;

      const tempJitter = (Math.random() - 0.5) * 0.4;
      const humJitter = (Math.random() - 0.5) * 0.8;
      const lightJitter = Math.floor((Math.random() - 0.5) * 10);

      const newTemp = +(device.currentReading.temperature + tempJitter).toFixed(1);
      const newHum = Math.min(95, Math.max(20, Math.round(device.currentReading.humidity + humJitter)));
      const newLight = Math.max(0, device.currentReading.lightLevel + lightJitter);

      updateIoTDevice(device.id, {
        currentReading: {
          temperature: newTemp,
          humidity: newHum,
          waterLeak: false,
          lightLevel: newLight,
          timestamp: new Date().toISOString()
        }
      });
    });
  }, 4000);

  return () => clearInterval(interval);
}

export function triggerWaterLeakSimulation(deviceId: string = 'ESP32-CAMPUS-001') {
  return simulateWaterLeakAnomaly(deviceId);
}

export function resetIoTDevice(deviceId: string): IoTDevice | null {
  return updateIoTDevice(deviceId, {
    status: 'ONLINE',
    currentReading: {
      temperature: 24.0,
      humidity: 55,
      waterLeak: false,
      lightLevel: 420,
      timestamp: new Date().toISOString()
    }
  });
}
