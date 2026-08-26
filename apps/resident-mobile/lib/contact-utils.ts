/**
 * Utility functions for contact normalization, phone sanitation, and share payload construction.
 */

/**
 * Normalizes a phone number to standard digits/E.164-compatible format.
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Remove whitespace, hyphens, brackets, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return cleaned;
}

/**
 * Extracts a displayable name from an Expo Contacts object.
 */
export function extractContactDisplayName(contact: {
  name?: string;
  firstName?: string;
  lastName?: string;
}): string {
  if (contact.name && contact.name.trim()) {
    return contact.name.trim();
  }
  const parts = [contact.firstName, contact.lastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(' ').trim();
  }
  return 'Guest';
}

/**
 * Builds a localized share invitation payload for WhatsApp, SMS, or OS share sheets.
 */
export function buildInvitationMessage(params: {
  visitorName: string;
  shareUrl: string;
  unitName?: string;
  locale?: 'en' | 'ar';
}): string {
  const { visitorName, shareUrl, unitName, locale = 'en' } = params;

  if (locale === 'ar') {
    const unitText = unitName ? ` إلى ${unitName}` : '';
    return `مرحباً ${visitorName}، تصريح الدخول الخاص بك${unitText} جاهز:\n\n${shareUrl}\n\nيرجى إبراز هذا الرمز عند الوصول لبوابة المجمع.`;
  }

  const unitText = unitName ? ` to ${unitName}` : '';
  return `Hi ${visitorName}, your GateFlow access pass${unitText} is ready:\n\n${shareUrl}\n\nPlease present this pass at the compound security gate upon arrival.`;
}
