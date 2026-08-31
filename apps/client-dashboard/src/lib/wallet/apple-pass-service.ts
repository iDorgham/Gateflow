import { createHash } from 'crypto';

export interface ApplePassData {
  passId: string;
  organizationName: string;
  residentName: string;
  unitName?: string;
  qrPayload: string;
  expiresAt?: string;
  logoUrl?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface ApplePassManifest {
  formatVersion: 1;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  logoText: string;
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  barcode: {
    message: string;
    format: 'PKBarcodeFormatQR';
    messageEncoding: 'iso-8859-1';
  };
  generic: {
    primaryFields: Array<{ key: string; label: string; value: string }>;
    secondaryFields: Array<{ key: string; label: string; value: string }>;
    auxiliaryFields: Array<{ key: string; label: string; value: string }>;
  };
}

/**
 * Builds Apple Wallet Pass JSON dictionary (pass.json).
 */
export function buildApplePassDictionary(
  data: ApplePassData
): ApplePassManifest {
  const passTypeIdentifier =
    process.env.APPLE_PASS_TYPE_ID || 'pass.site.gateflow.access';
  const teamIdentifier = process.env.APPLE_TEAM_ID || 'GATEFLOW01';

  return {
    formatVersion: 1,
    passTypeIdentifier,
    serialNumber: data.passId,
    teamIdentifier,
    organizationName: data.organizationName,
    description: `GateFlow Access Pass - ${data.organizationName}`,
    logoText: 'GateFlow Access',
    backgroundColor: data.backgroundColor || 'rgb(15, 23, 42)',
    foregroundColor: data.foregroundColor || 'rgb(255, 255, 255)',
    labelColor: 'rgb(148, 163, 184)',
    barcode: {
      message: data.qrPayload,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
    },
    generic: {
      primaryFields: [
        { key: 'resident', label: 'PASS HOLDER', value: data.residentName },
      ],
      secondaryFields: [
        {
          key: 'organization',
          label: 'ORGANIZATION',
          value: data.organizationName,
        },
        {
          key: 'unit',
          label: 'UNIT / RESIDENCE',
          value: data.unitName || 'Main Compound',
        },
      ],
      auxiliaryFields: [
        {
          key: 'expires',
          label: 'EXPIRES',
          value: data.expiresAt
            ? new Date(data.expiresAt).toLocaleDateString()
            : 'Never',
        },
      ],
    },
  };
}

/**
 * Generates SHA1 manifest dictionary for pass files.
 */
export function generatePassManifest(
  files: Record<string, string>
): Record<string, string> {
  const manifest: Record<string, string> = {};
  for (const [filename, content] of Object.entries(files)) {
    manifest[filename] = createHash('sha1').update(content).digest('hex');
  }
  return manifest;
}
