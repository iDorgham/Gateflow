/**
 * Retention apply logic — opinionated, pure decision + redaction helpers.
 *
 * Consumed by the nightly PII purge scheduler. Kept dependency-light and
 * unit-testable (Node crypto + prisma only in the driver, not here).
 *
 * Semantics:
 *  - Hard purge: operational records whose retention window has elapsed
 *    (scan logs, ID-artifact attachments, incidents).
 *  - Anonymize: personal-data rows we keep for operational integrity (contacts
 *    and their vehicle plates) are scrubbed of identifying fields rather than
 *    deleted, so foreign keys and audit history stay stable and non-reversible.
 *  - Legal hold: if `retentionLegalHold` is set for an org, nothing is purged.
 */

import { createHash } from 'node:crypto';

export const REDACTED_PLACEHOLDER = '[redacted]';

/**
 * Deterministic, non-reversible redaction token derived from the original value
 * and a per-org salt. Stable across runs for the same input so downstream
 * correlation stays possible without exposing the original value.
 */
export function redact(value: string, salt: string): string {
  const digest = createHash('sha256').update(`${salt}:${value}`).digest('hex');
  return `[redacted-${digest.slice(0, 12)}]`;
}

/** Redact a nullable field to a stable token, or null when the input is empty. */
export function redactedOrNull(
  value: string | null | undefined,
  salt: string
): string | null {
  if (!value) return null;
  return redact(value, salt);
}

export interface ContactPiiFields {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  companyWebsite: string | null;
  notes: string | null;
}

/** Return a PII-scrubbed contact object preserving non-PII/relational fields. */
export function anonymizeContactPii(
  contact: ContactPiiFields,
  salt: string
): ContactPiiFields {
  return {
    firstName: redact(contact.firstName, salt),
    lastName: redact(contact.lastName, salt),
    email: redactedOrNull(contact.email, salt),
    phone: redactedOrNull(contact.phone, salt),
    company: redactedOrNull(contact.company, salt),
    jobTitle: redactedOrNull(contact.jobTitle, salt),
    companyWebsite: redactedOrNull(contact.companyWebsite, salt),
    notes: redactedOrNull(contact.notes, salt),
  };
}

export interface UserPiiFields {
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
}

/** Scrub a dormant user's identity while preserving the account/auth integrity. */
export function anonymizeUserPii(
  user: UserPiiFields,
  salt: string
): UserPiiFields {
  return {
    name: redact(user.name, salt),
    email: redact(user.email, salt),
    phone: redactedOrNull(user.phone, salt),
    // Keep passwordHash authoritative; the randomized login token is invalidated
    // by rotating through the existing must-change-password flow outside this module.
    passwordHash: user.passwordHash,
  };
}

/** Scrub vehicle-plate identity fields that are not needed for matching. */
export function anonymizeVehiclePlatePii(
  plate: {
    plateNumber: string;
    ownerName: string | null;
    ownerPhone: string | null;
  },
  salt: string
): {
  plateNumber: string;
  ownerName: string | null;
  ownerPhone: string | null;
} {
  return {
    plateNumber: plate.plateNumber,
    ownerName: redactedOrNull(plate.ownerName, salt),
    ownerPhone: redactedOrNull(plate.ownerPhone, salt),
  };
}

/**
 * Decide whether an org is eligible for the nightly purge.
 * Returns false when held or when every retention window is disabled (null).
 */
export function retentionBatchEnabled(cutoffs: {
  scanLogs: Date | null;
  visitorHistory: Date | null;
  idArtifacts: Date | null;
  incidents: Date | null;
}): boolean {
  return (
    cutoffs.scanLogs !== null ||
    cutoffs.visitorHistory !== null ||
    cutoffs.idArtifacts !== null ||
    cutoffs.incidents !== null
  );
}
