import { LiveBarrierMapState } from './live-barrier-map-state';

describe('LiveBarrierMapState', () => {
  beforeEach(() => {
    LiveBarrierMapState.clearState();
  });

  it('stores and retrieves gate telemetry', () => {
    LiveBarrierMapState.updateGateTelemetry({
      gateId: 'gate_north_1',
      gateName: 'North Gate Barrier',
      status: 'OPEN',
      lastHeartbeat: new Date().toISOString(),
      relayStatus: 'ACTIVE',
      temperatureCelsius: 38.5,
      voltageValue: 24.1,
      recentScansCount: 42,
    });

    const gate = LiveBarrierMapState.getGateTelemetry('gate_north_1');
    expect(gate).not.toBeNull();
    expect(gate?.status).toBe('OPEN');
    expect(gate?.temperatureCelsius).toBe(38.5);
  });

  it('returns all active telemetry records', () => {
    LiveBarrierMapState.updateGateTelemetry({
      gateId: 'gate_1',
      gateName: 'Gate 1',
      status: 'CLOSED',
      lastHeartbeat: new Date().toISOString(),
      relayStatus: 'INACTIVE',
      recentScansCount: 10,
    });
    LiveBarrierMapState.updateGateTelemetry({
      gateId: 'gate_2',
      gateName: 'Gate 2',
      status: 'OPEN',
      lastHeartbeat: new Date().toISOString(),
      relayStatus: 'ACTIVE',
      recentScansCount: 25,
    });

    const all = LiveBarrierMapState.getAllTelemetry();
    expect(all.length).toBe(2);
  });
});
