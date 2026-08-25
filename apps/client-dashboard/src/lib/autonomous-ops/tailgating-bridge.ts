import { createHmac, timingSafeEqual } from 'crypto';

export interface CameraPassageEvent {
  eventId: string;
  gateId: string;
  organizationId: string;
  timestamp: string; // ISO 8601
  vehicleType?: 'SEDAN' | 'SUV' | 'TRUCK' | 'MOTORCYCLE';
  licensePlateSnippet?: string;
}

export interface GateScanLogEntry {
  scanId: string;
  gateId: string;
  organizationId: string;
  timestamp: string; // ISO 8601
  isAuthorized: boolean;
}

export interface TailgatingIncident {
  incidentId: string;
  gateId: string;
  gateName: string;
  organizationId: string;
  passageTimestamp: string;
  precedingScanTimestamp?: string;
  deltaSeconds: number;
  severity: 'CRITICAL';
  licensePlateSnippet?: string;
  alertEn: string;
  alertAr: string;
}

/**
 * Validates the HMAC-SHA256 signature of the incoming perimeter camera webhook.
 */
export function verifyPerimeterWebhookSignature(
  rawPayload: string,
  signatureHeader: string,
  secret: string
): boolean {
  if (!rawPayload || !signatureHeader || !secret) {
    return false;
  }

  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(rawPayload);
    const expectedSignature = hmac.digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const providedBuffer = Buffer.from(signatureHeader, 'utf-8');

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
}

/**
 * Detects whether a camera passage event constitutes a tailgating violation.
 * A violation occurs when a vehicle passes the barrier without an authorized QR scan within `maxDeltaSeconds`.
 */
export function detectTailgating(
  passage: CameraPassageEvent,
  recentScans: GateScanLogEntry[],
  gateName: string,
  maxDeltaSeconds: number = 3.0
): TailgatingIncident | null {
  const passageTime = new Date(passage.timestamp).getTime();

  // Find matching authorized scan at the same gate within window
  const matchingScan = recentScans.find((scan) => {
    if (
      scan.gateId !== passage.gateId ||
      scan.organizationId !== passage.organizationId
    ) {
      return false;
    }
    if (!scan.isAuthorized) {
      return false;
    }
    const scanTime = new Date(scan.timestamp).getTime();
    const diffSec = (passageTime - scanTime) / 1000;
    return diffSec >= 0 && diffSec <= maxDeltaSeconds;
  });

  // If an authorized scan is found within the threshold, passage is nominal
  if (matchingScan) {
    return null;
  }

  // Find closest preceding scan for delta calculation
  const precedingScan = recentScans
    .filter(
      (s) =>
        s.gateId === passage.gateId &&
        new Date(s.timestamp).getTime() <= passageTime
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

  const deltaSeconds = precedingScan
    ? Math.round(
        (passageTime - new Date(precedingScan.timestamp).getTime()) / 1000
      )
    : 999;

  const plateText = passage.licensePlateSnippet
    ? ` [Plate: ${passage.licensePlateSnippet}]`
    : '';

  return {
    incidentId: `inc-tailgate-${passage.eventId}`,
    gateId: passage.gateId,
    gateName,
    organizationId: passage.organizationId,
    passageTimestamp: passage.timestamp,
    precedingScanTimestamp: precedingScan?.timestamp,
    deltaSeconds,
    severity: 'CRITICAL',
    licensePlateSnippet: passage.licensePlateSnippet,
    alertEn: `🚨 Tailgating Alert: Unauthorized vehicle entered through ${gateName} without QR verification${plateText}.`,
    alertAr: `🚨 تنبيه اختراق تتبعي: مركبة غير مصرح بها عبرت من خلال ${gateName} بدون مسح رمز QR${passage.licensePlateSnippet ? ` [لوحة: ${passage.licensePlateSnippet}]` : ''}.`,
  };
}
