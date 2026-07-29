/**
 * Pure helpers for visitor pass UX (share/revoke) — easy to unit-test.
 */

export function buildResidentVisitorRevokePath(visitorId: string): string {
  const id = String(visitorId || '').trim();
  if (!id) {
    throw new Error('visitorId is required');
  }
  return `/api/resident/visitors/${encodeURIComponent(id)}`;
}

export function buildVisitorSharePayload(options: {
  visitorName: string;
  qrCode: string;
}): { title: string; text: string } {
  const name =
    typeof options.visitorName === 'string' && options.visitorName.trim()
      ? options.visitorName.trim()
      : 'Guest';
  const code = typeof options.qrCode === 'string' ? options.qrCode.trim() : '';
  if (!code) {
    throw new Error('qrCode is required to share');
  }
  return {
    title: `GateFlow pass for ${name}`,
    text: `Your GateFlow guest pass for ${name}:\n${code}`,
  };
}

export function unitMissingMessage(intent: 'visitor' | 'open-qr'): string {
  if (intent === 'open-qr') {
    return 'No unit is linked to your account, so an open-access QR cannot be created. Contact your building admin.';
  }
  return 'No unit is linked to your account, so a guest pass cannot be created. Contact your building admin.';
}
