export interface RecentGuest {
  name: string;
  phone?: string;
  category?: 'FAMILY' | 'FRIEND' | 'SERVICE' | 'DELIVERY';
  inviteCount: number;
  lastInvitedAt: string; // ISO 8601
}

export interface ShareInviteMessageOptions {
  guestName?: string;
  hostName: string;
  compoundName: string;
  unitNumber: string;
  shortUrl: string;
  language: 'en' | 'ar';
}

export interface ContactItem {
  id: string;
  name: string;
  phone?: string;
}

/**
 * Updates the recent guests list with deduplication, frequency counting, and recency sorting.
 */
export function updateRecentGuests(
  currentList: RecentGuest[],
  guest: { name: string; phone?: string; category?: RecentGuest['category'] },
  maxCount: number = 5,
  now: Date = new Date()
): RecentGuest[] {
  const cleanName = guest.name.trim();
  if (!cleanName) {
    return currentList;
  }

  const existingIndex = currentList.findIndex(
    (g) => g.name.toLowerCase() === cleanName.toLowerCase()
  );

  let updatedList: RecentGuest[];

  if (existingIndex >= 0) {
    const existing = currentList[existingIndex];
    const updated: RecentGuest = {
      ...existing,
      phone: guest.phone?.trim() || existing.phone,
      category: guest.category || existing.category,
      inviteCount: existing.inviteCount + 1,
      lastInvitedAt: now.toISOString(),
    };
    updatedList = [
      ...currentList.slice(0, existingIndex),
      updated,
      ...currentList.slice(existingIndex + 1),
    ];
  } else {
    const newGuest: RecentGuest = {
      name: cleanName,
      phone: guest.phone?.trim(),
      category: guest.category || 'FRIEND',
      inviteCount: 1,
      lastInvitedAt: now.toISOString(),
    };
    updatedList = [newGuest, ...currentList];
  }

  // Sort by most recently invited first and slice to maxCount
  return updatedList
    .sort(
      (a, b) =>
        new Date(b.lastInvitedAt).getTime() -
        new Date(a.lastInvitedAt).getTime()
    )
    .slice(0, maxCount);
}

/**
 * Builds localized, ready-to-dispatch invitation text for SMS and WhatsApp.
 */
export function formatExpressShareMessage(
  options: ShareInviteMessageOptions
): string {
  const isAr = options.language === 'ar';
  const nameSalutation =
    options.guestName && options.guestName.trim().length > 0
      ? isAr
        ? `مرحباً ${options.guestName.trim()}، `
        : `Hi ${options.guestName.trim()}, `
      : '';

  if (isAr) {
    return (
      `${nameSalutation}يسر ${options.hostName} دعوتك لزيارة ${options.compoundName} (وحدة: ${options.unitNumber}).\n` +
      `تصريح الدخول الرقمي الخاص بك:\n${options.shortUrl}`
    );
  }

  return (
    `${nameSalutation}${options.hostName} has sent you an access pass to visit ${options.compoundName} (Unit: ${options.unitNumber}).\n` +
    `Your digital entry pass:\n${options.shortUrl}`
  );
}

/**
 * Filters phone contacts by search term.
 */
export function filterContacts(
  contacts: ContactItem[],
  query: string
): ContactItem[] {
  if (!query || query.trim().length === 0) {
    return contacts;
  }
  const clean = query.trim().toLowerCase();
  return contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(clean) ||
      (c.phone && c.phone.replace(/[^0-9]/g, '').includes(clean))
  );
}
