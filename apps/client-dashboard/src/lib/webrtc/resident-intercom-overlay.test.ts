import { ResidentIntercomOverlay } from './resident-intercom-overlay';

describe('ResidentIntercomOverlay', () => {
  it('receives incoming call and makes overlay visible', () => {
    const state = ResidentIntercomOverlay.receiveIncomingCall({
      callId: 'call_999',
      organizationId: 'org_1',
      gateId: 'gate_1',
      residentId: 'res_1',
      guardId: 'guard_1',
      status: 'INITIATED',
      mediaType: 'VIDEO',
      createdAt: new Date().toISOString(),
    });

    expect(state.isOverlayVisible).toBe(true);
    expect(state.activeCall?.status).toBe('RINGING');
    expect(state.isVideoEnabled).toBe(true);
  });

  it('grants entry on single-tap action and closes overlay', async () => {
    ResidentIntercomOverlay.receiveIncomingCall({
      callId: 'call_999',
      organizationId: 'org_1',
      gateId: 'gate_1',
      residentId: 'res_1',
      guardId: 'guard_1',
      status: 'INITIATED',
      mediaType: 'VIDEO',
      createdAt: new Date().toISOString(),
    });

    const newState = await ResidentIntercomOverlay.grantEntry();

    expect(newState.grantStatus).toBe('GRANTED');
    expect(newState.isOverlayVisible).toBe(false);
  });
});
