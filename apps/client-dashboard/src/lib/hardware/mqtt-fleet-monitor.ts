import { emitEvent, EventType } from '@/lib/realtime/emit-event';

export interface MQTTFleetDevice {
  deviceId: string;
  gateId: string;
  organizationId: string;
  firmwareVersion: string;
  ipAddress: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastHeartbeat: string;
  relayHealth: 'OK' | 'WARNING' | 'CRITICAL';
  cpuTempCelsius: number;
  memoryUsagePercent: number;
}

export class MQTTFleetMonitor {
  private static fleetDevices: Map<string, MQTTFleetDevice> = new Map();

  /**
   * Processes incoming MQTT heartbeat message payload from hardware barrier relay.
   */
  static processHeartbeat(payload: {
    deviceId: string;
    gateId: string;
    organizationId: string;
    firmwareVersion?: string;
    ipAddress?: string;
    cpuTempCelsius?: number;
    memoryUsagePercent?: number;
    relayHealth?: 'OK' | 'WARNING' | 'CRITICAL';
  }): MQTTFleetDevice {
    const existing = this.fleetDevices.get(payload.deviceId);
    const nowIso = new Date().toISOString();

    const device: MQTTFleetDevice = {
      deviceId: payload.deviceId,
      gateId: payload.gateId,
      organizationId: payload.organizationId,
      firmwareVersion:
        payload.firmwareVersion || existing?.firmwareVersion || 'v2.4.1',
      ipAddress: payload.ipAddress || existing?.ipAddress || '192.168.1.100',
      status: payload.relayHealth === 'CRITICAL' ? 'DEGRADED' : 'ONLINE',
      lastHeartbeat: nowIso,
      relayHealth: payload.relayHealth || 'OK',
      cpuTempCelsius: payload.cpuTempCelsius ?? 42.0,
      memoryUsagePercent: payload.memoryUsagePercent ?? 35,
    };

    this.fleetDevices.set(payload.deviceId, device);

    if (payload.relayHealth === 'CRITICAL') {
      void emitEvent(payload.organizationId, EventType.WATCHLIST_ALERT, {
        severity: 'HARDWARE_FAULT',
        deviceId: payload.deviceId,
        gateId: payload.gateId,
        message: `Hardware critical fault reported by barrier relay ${payload.deviceId}`,
      });
    }

    return device;
  }

  /**
   * Evaluates offline timeout for all fleet devices (stale > 90s).
   */
  static evaluateStaleDevices(timeoutMs = 90_000): MQTTFleetDevice[] {
    const now = Date.now();
    const stale: MQTTFleetDevice[] = [];

    for (const device of this.fleetDevices.values()) {
      const lastSeen = new Date(device.lastHeartbeat).getTime();
      if (now - lastSeen > timeoutMs && device.status !== 'OFFLINE') {
        device.status = 'OFFLINE';
        stale.push(device);

        void emitEvent(device.organizationId, EventType.WATCHLIST_ALERT, {
          severity: 'DEVICE_OFFLINE',
          deviceId: device.deviceId,
          gateId: device.gateId,
          message: `Hardware barrier relay ${device.deviceId} missed heartbeat (OFFLINE)`,
        });
      }
    }

    return stale;
  }

  /**
   * Returns all fleet devices.
   */
  static getFleetDevices(): MQTTFleetDevice[] {
    return Array.from(this.fleetDevices.values());
  }

  /**
   * Clears state for testing.
   */
  static clearState(): void {
    this.fleetDevices.clear();
  }
}
