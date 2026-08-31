export interface RTCIceServerConfig {
  urls: string[];
  username?: string;
  credential?: string;
}

export interface IntercomCallSession {
  callId: string;
  organizationId: string;
  gateId: string;
  residentId: string;
  guardId: string;
  status: 'INITIATED' | 'RINGING' | 'CONNECTED' | 'ENDED' | 'REJECTED';
  mediaType: 'AUDIO' | 'VIDEO';
  createdAt: string;
}

export class IntercomSignalService {
  /**
   * Returns WebRTC ICE Server configuration (STUN / TURN).
   */
  static getIceServerConfiguration(): { iceServers: RTCIceServerConfig[] } {
    const twilioTurnUrl = process.env.TWILIO_TURN_URL;
    const twilioUsername = process.env.TWILIO_TURN_USERNAME;
    const twilioCredential = process.env.TWILIO_TURN_CREDENTIAL;

    const defaultServers: RTCIceServerConfig[] = [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
      },
    ];

    if (twilioTurnUrl && twilioUsername && twilioCredential) {
      defaultServers.push({
        urls: [twilioTurnUrl],
        username: twilioUsername,
        credential: twilioCredential,
      });
    }

    return { iceServers: defaultServers };
  }

  /**
   * Generates a new WebRTC intercom call session object.
   */
  static createCallSession(params: {
    organizationId: string;
    gateId: string;
    residentId: string;
    guardId: string;
    mediaType?: 'AUDIO' | 'VIDEO';
  }): IntercomCallSession {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      callId,
      organizationId: params.organizationId,
      gateId: params.gateId,
      residentId: params.residentId,
      guardId: params.guardId,
      status: 'INITIATED',
      mediaType: params.mediaType || 'VIDEO',
      createdAt: new Date().toISOString(),
    };
  }
}
