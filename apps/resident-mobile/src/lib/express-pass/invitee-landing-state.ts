import { ExpressPassRecord } from './express-pass-engine';

export interface CompoundLocation {
  nameEn: string;
  nameAr: string;
  latitude: number;
  longitude: number;
  addressEn: string;
  addressAr: string;
}

export interface InviteeLandingViewModel {
  passId: string;
  guestName?: string;
  hostName: string;
  unitNumber: string;
  compoundNameEn: string;
  compoundNameAr: string;
  validFrom: string;
  validUntil: string;
  isExpired: boolean;
  qrToken?: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
  wazeUrl: string;
  gateInstructionsEn: string;
  gateInstructionsAr: string;
}

export interface AppleWalletPassPayload {
  formatVersion: number;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  backgroundColor: string;
  foregroundColor: string;
  barcode: {
    format: 'PKBarcodeFormatQR';
    message: string;
    messageEncoding: 'iso-8859-1' | 'utf-8';
  };
  eventTicket: {
    primaryFields: { key: string; label: string; value: string }[];
    secondaryFields: { key: string; label: string; value: string }[];
  };
}

export interface GoogleWalletPassPayload {
  id: string;
  classId: string;
  state: 'ACTIVE' | 'EXPIRED';
  barcode: {
    type: 'QR_CODE';
    value: string;
  };
  textModulesData: {
    id: string;
    header: string;
    body: string;
  }[];
}

/**
 * Generates turn-by-turn navigation URLs for Google Maps, Apple Maps, and Waze.
 */
export function generateGpsNavigationUrl(
  location: { latitude: number; longitude: number; name?: string },
  service: 'GOOGLE' | 'APPLE' | 'WAZE'
): string {
  const { latitude, longitude, name } = location;
  const encodedName = name ? encodeURIComponent(name) : '';

  switch (service) {
    case 'GOOGLE':
      return `https://maps.google.com/?q=${latitude},${longitude}${encodedName ? `+(${encodedName})` : ''}`;
    case 'APPLE':
      return `https://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodedName}`;
    case 'WAZE':
      return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  }
}

/**
 * Resolves comprehensive metadata for the guest invitation landing page.
 */
export function resolveInviteeLandingViewModel(
  pass: ExpressPassRecord,
  host: { name: string },
  compound: CompoundLocation,
  now: Date = new Date()
): InviteeLandingViewModel {
  const isExpired = now.getTime() > new Date(pass.validUntil).getTime();

  const googleMapsUrl = generateGpsNavigationUrl(
    {
      latitude: compound.latitude,
      longitude: compound.longitude,
      name: compound.nameEn,
    },
    'GOOGLE'
  );
  const appleMapsUrl = generateGpsNavigationUrl(
    {
      latitude: compound.latitude,
      longitude: compound.longitude,
      name: compound.nameEn,
    },
    'APPLE'
  );
  const wazeUrl = generateGpsNavigationUrl(
    { latitude: compound.latitude, longitude: compound.longitude },
    'WAZE'
  );

  return {
    passId: pass.id,
    guestName: pass.visitorName,
    hostName: host.name,
    unitNumber: pass.unitId,
    compoundNameEn: compound.nameEn,
    compoundNameAr: compound.nameAr,
    validFrom: pass.validFrom,
    validUntil: pass.validUntil,
    isExpired,
    qrToken: pass.qrToken,
    googleMapsUrl,
    appleMapsUrl,
    wazeUrl,
    gateInstructionsEn:
      'Please display your digital QR pass at the boom barrier scanner camera.',
    gateInstructionsAr:
      'يرجى إبراز رمز QR الرقمي أمام كاميرا الماسح الضوئي عند البوابة.',
  };
}

/**
 * Constructs an Apple Wallet (PKPass) specification payload.
 */
export function generateAppleWalletPassPayload(
  model: InviteeLandingViewModel
): AppleWalletPassPayload {
  const barcodeMessage = model.qrToken || `GF-EXP:${model.passId}`;

  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.site.gateflow.visitor',
    serialNumber: model.passId,
    teamIdentifier: 'GATEFLOW_CORP',
    organizationName: model.compoundNameEn,
    description: `Visitor Access Pass - ${model.compoundNameEn}`,
    backgroundColor: 'rgb(24, 28, 36)',
    foregroundColor: 'rgb(255, 255, 255)',
    barcode: {
      format: 'PKBarcodeFormatQR',
      message: barcodeMessage,
      messageEncoding: 'utf-8',
    },
    eventTicket: {
      primaryFields: [
        { key: 'host', label: 'HOST', value: model.hostName },
        { key: 'unit', label: 'UNIT', value: model.unitNumber },
      ],
      secondaryFields: [
        { key: 'destination', label: 'COMPOUND', value: model.compoundNameEn },
        {
          key: 'validUntil',
          label: 'VALID UNTIL',
          value: new Date(model.validUntil).toLocaleString(),
        },
      ],
    },
  };
}

/**
 * Constructs a Google Wallet Generic Pass specification payload.
 */
export function generateGoogleWalletPassPayload(
  model: InviteeLandingViewModel
): GoogleWalletPassPayload {
  const barcodeValue = model.qrToken || `GF-EXP:${model.passId}`;

  return {
    id: `3388000000022211999.${model.passId}`,
    classId: `3388000000022211999.gateflow_visitor_pass`,
    state: model.isExpired ? 'EXPIRED' : 'ACTIVE',
    barcode: {
      type: 'QR_CODE',
      value: barcodeValue,
    },
    textModulesData: [
      { id: 'host', header: 'Host Resident', body: model.hostName },
      { id: 'unit', header: 'Destination Unit', body: model.unitNumber },
      { id: 'compound', header: 'Community', body: model.compoundNameEn },
    ],
  };
}
