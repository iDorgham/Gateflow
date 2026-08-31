import { createHmac } from 'crypto';

export interface GooglePassData {
  passId: string;
  organizationName: string;
  residentName: string;
  unitName?: string;
  qrPayload: string;
  expiresAt?: string;
  issuerId?: string;
}

export interface GoogleGenericObject {
  id: string;
  classId: string;
  state: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  cardTitle: { defaultValue: { language: 'en'; value: string } };
  header: { defaultValue: { language: 'en'; value: string } };
  textModulesData: Array<{ id: string; header: string; body: string }>;
  barcode: { type: 'QR_CODE'; value: string; alternateText: string };
  hexBackgroundColor?: string;
}

/**
 * Builds Google Wallet Generic Object JSON.
 */
export function buildGooglePassObject(
  data: GooglePassData
): GoogleGenericObject {
  const issuerId =
    data.issuerId ||
    process.env.GOOGLE_WALLET_ISSUER_ID ||
    '3388000000022114455';
  const classId = `${issuerId}.gateflow_access_v1`;
  const objectId = `${issuerId}.${data.passId.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

  return {
    id: objectId,
    classId,
    state: 'ACTIVE',
    cardTitle: {
      defaultValue: { language: 'en', value: data.organizationName },
    },
    header: {
      defaultValue: { language: 'en', value: data.residentName },
    },
    textModulesData: [
      {
        id: 'unit',
        header: 'UNIT / RESIDENCE',
        body: data.unitName || 'Main Gate',
      },
      {
        id: 'expires',
        header: 'EXPIRES',
        body: data.expiresAt
          ? new Date(data.expiresAt).toLocaleDateString()
          : 'Never',
      },
    ],
    barcode: {
      type: 'QR_CODE',
      value: data.qrPayload,
      alternateText: 'Scan at Gate',
    },
    hexBackgroundColor: '#0F172A',
  };
}

/**
 * Creates Google Wallet "Save to Google Pay" deep link URL.
 */
export function createGooglePaySaveUrl(data: GooglePassData): string {
  const passObject = buildGooglePassObject(data);
  const jsonPayload = JSON.stringify({ genericObjects: [passObject] });
  const b64Payload = Buffer.from(jsonPayload).toString('base64url');

  const secret =
    process.env.GOOGLE_WALLET_SECRET || 'gateflow-google-pass-fallback-secret';
  const signature = createHmac('sha256', secret)
    .update(b64Payload)
    .digest('base64url');

  return `https://pay.google.com/gp/v/save/${b64Payload}?sig=${signature}`;
}
