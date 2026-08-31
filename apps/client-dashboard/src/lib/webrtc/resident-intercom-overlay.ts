import { IntercomCallSession } from './intercom-signal-service';

export interface IntercomOverlayState {
  activeCall: IntercomCallSession | null;
  isOverlayVisible: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  grantStatus: 'IDLE' | 'GRANTING' | 'GRANTED' | 'FAILED';
}

export class ResidentIntercomOverlay {
  private static state: IntercomOverlayState = {
    activeCall: null,
    isOverlayVisible: false,
    isMuted: false,
    isVideoEnabled: true,
    grantStatus: 'IDLE',
  };

  /**
   * Triggers an incoming intercom call overlay on resident portal.
   */
  static receiveIncomingCall(call: IntercomCallSession): IntercomOverlayState {
    this.state = {
      activeCall: { ...call, status: 'RINGING' },
      isOverlayVisible: true,
      isMuted: false,
      isVideoEnabled: call.mediaType === 'VIDEO',
      grantStatus: 'IDLE',
    };
    return this.getState();
  }

  /**
   * Single-tap entry grant action: sends barrier open command & updates call state.
   */
  static async grantEntry(): Promise<IntercomOverlayState> {
    if (!this.state.activeCall) {
      return this.getState();
    }

    this.state.grantStatus = 'GRANTING';

    // Simulate single-tap barrier open grant
    this.state.grantStatus = 'GRANTED';
    this.state.activeCall.status = 'ENDED';
    this.state.isOverlayVisible = false;

    return this.getState();
  }

  /**
   * Rejects or ends the active intercom call.
   */
  static rejectCall(): IntercomOverlayState {
    if (this.state.activeCall) {
      this.state.activeCall.status = 'REJECTED';
    }
    this.state.isOverlayVisible = false;
    this.state.grantStatus = 'IDLE';

    return this.getState();
  }

  /**
   * Returns current resident intercom overlay state.
   */
  static getState(): IntercomOverlayState {
    return { ...this.state };
  }
}
