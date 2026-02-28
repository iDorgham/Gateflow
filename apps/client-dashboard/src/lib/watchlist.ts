/**
 * Watchlist helpers: load active entries and match visitor identity.
 * Used in scan validate to reject scans when visitor matches a watchlist entry.
 */

import { prisma } from '@gate-access/db';

/** Minimum digits for suffix match: avoids false positives from short substrings (e.g. "12" matching many numbers). */
const MIN_PHONE_SUFFIX_DIGITS = 4;

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Load active (non–soft-deleted) watchlist entries for an org.
 */
export async function getActiveWatchlist(organizationId: string) {
  return prisma.watchlistEntry.findMany({
    where: { organizationId, deletedAt: null },
    select: { id: true, name: true, idNumber: true, phone: true },
  });
}

export interface VisitorIdentity {
  name?: string | null;
  phone?: string | null;
  idNumber?: string | null;
}

/**
 * Check if visitor identity matches any active watchlist entry.
 * Match: exact or normalized string match for name, phone, or idNumber.
 * Returns the matching entry id and normalized match field, or null.
 */
export function findWatchlistMatch(
  entries: Array<{ id: string; name: string; idNumber: string | null; phone: string | null }>,
  visitor: VisitorIdentity
): { entryId: string; matchedField: string } | null {
  if (!visitor.name && !visitor.phone && !visitor.idNumber) return null;

  const vName = visitor.name ? normalize(visitor.name) : null;
  const vPhone = visitor.phone ? normalize(visitor.phone).replace(/\D/g, '') : null;
  const vId = visitor.idNumber ? normalize(visitor.idNumber) : null;

  for (const e of entries) {
    if (e.name && vName && normalize(e.name) === vName) return { entryId: e.id, matchedField: 'name' };
    if (e.phone && vPhone) {
      const ePhone = e.phone.replace(/\D/g, '');
      // Exact match always allowed.
      if (ePhone === vPhone) return { entryId: e.id, matchedField: 'phone' };
      // Suffix match only when visitor supplied a meaningful suffix (last N digits): entry ends with visitor digits.
      // Never use vPhone.endsWith(ePhone) — that would block legitimate users when a short watchlist entry matches many numbers.
      if (vPhone.length >= MIN_PHONE_SUFFIX_DIGITS && ePhone.endsWith(vPhone)) return { entryId: e.id, matchedField: 'phone' };
    }
    if (e.idNumber && vId && normalize(e.idNumber) === vId) return { entryId: e.id, matchedField: 'idNumber' };
  }
  return null;
}
