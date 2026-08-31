import { MQTTFleetMonitor } from './mqtt-fleet-monitor';

const mockEmitEvent = jest.fn();
jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: (...args: unknown[]) => mockEmitEvent(...args),
  EventType: { WATCHLIST_ALERT: 'WATCHLIST_ALERT' },
}));

describe('MQTTFleetMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MQTTFleetMonitor.clearState();
  });

  it('processes incoming hardware heartbeat and registers device', () => {
    const dev = MQTTFleetMonitor.processHeartbeat({
      deviceId: 'relay_gate_01',
      gateId: 'gate_101',
      organizationId: 'org_1',
      cpuTempCelsius: 45.2,
      relayHealth: 'OK',
    });

    expect(dev.deviceId).toBe('relay_gate_01');
    expect(dev.status).toBe('ONLINE');
    expect(dev.cpuTempCelsius).toBe(45.2);
  });

  it('detects stale devices and marks them OFFLINE after timeout', () => {
    MQTTFleetMonitor.processHeartbeat({
      deviceId: 'relay_gate_02',
      gateId: 'gate_102',
      organizationId: 'org_1',
    });

    // Advance time or evaluate with 0ms timeout
    const stale = MQTTFleetMonitor.evaluateStaleDevices(-1000);
    expect(stale.length).toBe(1);
    expect(stale[0].status).toBe('OFFLINE');
    expect(mockEmitEvent).toHaveBeenCalled();
  });
});
