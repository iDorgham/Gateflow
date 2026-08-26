/**
 * Utility functions for contact normalization, phone sanitation, and share payload construction.
 */

/**
 * Normalizes a phone number to standard digits/E.164-compatible format.
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  // Remove whitespace, hyphens, brackets, parentheses
  return phone.replace(/[\s\-()]/g, '');
}

/**
 * Extracts a displayable name from a Contacts object.
 * @param {{ name?: string; firstName?: string; lastName?: string }} contact
 * @returns {string}
 */
export function extractContactDisplayName(contact) {
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
 * @param {{ visitorName: string; shareUrl: string; unitName?: string; locale?: 'en' | 'ar' }} params
 * @returns {string}
 */
export function buildInvitationMessage(params) {
  const { visitorName, shareUrl, unitName, locale = 'en' } = params;

  if (locale === 'ar') {
    const unitText = unitName ? ` إلى ${unitName}` : '';
    return `مرحباً ${visitorName}، تصريح الدخول الخاص بك${unitText} جاهز:\n\n${shareUrl}\n\nيرجى إبراز هذا الرمز عند الوصول لبوابة المجمع.`;
  }

  const unitText = unitName ? ` to ${unitName}` : '';
  return `Hi ${visitorName}, your GateFlow access pass${unitText} is ready:\n\n${shareUrl}\n\nPlease present this pass at the compound security gate upon arrival.`;
}
