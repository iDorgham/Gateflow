import { IntercomSignalService } from './intercom-signal-service';

describe('IntercomSignalService', () => {
  it('returns default STUN servers configuration', () => {
    const config = IntercomSignalService.getIceServerConfiguration();
    expect(config.iceServers.length).toBeGreaterThanOrEqual(1);
    expect(config.iceServers[0].urls[0]).toContain('stun:');
  });

  it('creates an intercom call session with INITIATED status', () => {
    const session = IntercomSignalService.createCallSession({
      organizationId: 'org_1',
      gateId: 'gate_1',
      residentId: 'res_101',
      guardId: 'guard_12',
      mediaType: 'VIDEO',
    });

    expect(session.callId).toMatch(/^call_/);
    expect(session.status).toBe('INITIATED');
    expect(session.mediaType).toBe('VIDEO');
    expect(session.residentId).toBe('res_101');
  });
});
