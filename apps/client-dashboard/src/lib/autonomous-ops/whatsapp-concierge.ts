import { createHmac } from 'crypto';

export interface WhatsAppInboundMessage {
  fromNumber: string;
  messageBody: string;
  organizationId: string;
  timestamp: string;
}

export interface ParsedGuestRequest {
  guestName: string;
  unitNumber: string;
  isValid: boolean;
}

export interface ResidentProfile {
  residentId: string;
  residentName: string;
  unitNumber: string;
  organizationId: string;
  pushToken?: string;
  preferredLanguage: 'en' | 'ar';
}

export interface ConciergeApprovalPrompt {
  requestId: string;
  residentId: string;
  guestName: string;
  unitNumber: string;
  organizationId: string;
  promptTitle: string;
  promptBody: string;
  actions: {
    approveAction: string;
    denyAction: string;
  };
}

export interface GuestAccessPassResult {
  passId: string;
  qrToken: string;
  guestName: string;
  unitNumber: string;
  validFrom: string;
  validUntil: string;
  whatsappReplyMessage: string;
}

/**
 * Extracts unit number and visitor name from natural language messages (English & Arabic).
 */
export function parseWhatsAppVisitorMessage(
  messageBody: string
): ParsedGuestRequest {
  if (!messageBody || messageBody.trim().length === 0) {
    return { guestName: '', unitNumber: '', isValid: false };
  }

  const clean = messageBody.trim();

  // Regex patterns for unit extraction (e.g., "Villa 104", "فيلا 104", "Unit 205", "شقة 12", "104")
  const unitMatch =
    clean.match(
      /(?:villa|unit|apt|فيلا|شقة|وحدة)\s*[:#-]?\s*([a-zA-Z0-9-]+)/i
    ) || clean.match(/\b\d{2,5}[a-zA-Z]?\b/);

  // Regex patterns for name extraction (e.g., "Name: Ahmed", "اسمي كريم", "Visiting Villa 104 - Ahmed")
  let nameMatch = clean.match(
    /(?:name|guest|زائر|اسمي|الاسم)\s*[:#-]?\s*([a-zA-Z\u0621-\u064A\s]+)/i
  );

  if (!nameMatch && clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length > 1) {
      nameMatch = [parts[1].trim(), parts[1].trim()];
    }
  }

  const unitNumber = unitMatch ? unitMatch[1] || unitMatch[0] : '';
  const guestName = nameMatch ? nameMatch[1].trim() : 'Guest';

  const isValid = Boolean(unitNumber && unitNumber.length > 0);

  return {
    guestName: guestName || 'Guest',
    unitNumber: unitNumber.replace(/^(villa|unit|فيلا|شقة)\s*/i, '').trim(),
    isValid,
  };
}

/**
 * Resolves the primary resident registered to the target unit in an organization.
 */
export function matchResidentToUnit(
  residents: ResidentProfile[],
  unitNumber: string,
  organizationId: string
): ResidentProfile | null {
  const normUnit = unitNumber.trim().toLowerCase();
  return (
    residents.find(
      (r) =>
        r.organizationId === organizationId &&
        r.unitNumber.trim().toLowerCase() === normUnit
    ) || null
  );
}

/**
 * Builds the 1-tap push notification approval payload for the resident's mobile device.
 */
export function generateResidentApprovalPrompt(
  request: ParsedGuestRequest,
  resident: ResidentProfile,
  requestId: string
): ConciergeApprovalPrompt {
  const isAr = resident.preferredLanguage === 'ar';

  return {
    requestId,
    residentId: resident.residentId,
    guestName: request.guestName,
    unitNumber: resident.unitNumber,
    organizationId: resident.organizationId,
    promptTitle: isAr ? 'طلب تصريح زائر جديد' : 'New Visitor Pass Request',
    promptBody: isAr
      ? `يطلب ${request.guestName} الدخول إلى ${resident.unitNumber}. هل توافق على منح تصريح دخول؟`
      : `${request.guestName} is requesting access to ${resident.unitNumber}. Approve digital pass?`,
    actions: {
      approveAction: `APPROVE:${requestId}`,
      denyAction: `DENY:${requestId}`,
    },
  };
}

/**
 * Handles resident approval and generates a cryptographically signed visitor pass.
 */
export function processResidentApproval(
  requestId: string,
  resident: ResidentProfile,
  guestName: string,
  hmacSecret: string,
  validHours: number = 12
): GuestAccessPassResult {
  const now = new Date();
  const validFrom = now.toISOString();
  const validUntil = new Date(
    now.getTime() + validHours * 60 * 60 * 1000
  ).toISOString();

  const passId = `pass-wa-${requestId}`;
  const rawPayload = `${passId}:${resident.organizationId}:${resident.unitNumber}:${validUntil}`;
  const signature = createHmac('sha256', hmacSecret)
    .update(rawPayload)
    .digest('hex')
    .substring(0, 32);

  const qrToken = `GF-WA:${passId}:${signature}`;

  const isAr = resident.preferredLanguage === 'ar';
  const whatsappReplyMessage = isAr
    ? `✅ تم اعتماد تصريح دخولك إلى ${resident.unitNumber} من قبل ${resident.residentName}.\nرمز المرور الخاص بك: https://gateflow.site/pass/${passId}`
    : `✅ Your access pass to ${resident.unitNumber} has been approved by ${resident.residentName}.\nYour pass link: https://gateflow.site/pass/${passId}`;

  return {
    passId,
    qrToken,
    guestName,
    unitNumber: resident.unitNumber,
    validFrom,
    validUntil,
    whatsappReplyMessage,
  };
}
