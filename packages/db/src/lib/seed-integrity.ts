/**
 * Pre-insert uniqueness registry for bulk seeding: catches duplicate business keys
 * within a synthetic batch before `createMany`.
 *
 * DB alignment: `Contact` uses **partial** unique indexes on (`organizationId`,`email`)
 * and (`organizationId`,`phone`) where `deletedAt IS NULL` (migration `seeding_integrity_foundation`).
 * `Unit` keeps `@@unique([organizationId, name])` for active names; use `unitName` here when pre-checking batches.
 */

const KEY_SEP = '\u001f';

export type UniquenessField = 'id' | 'email' | 'phone' | 'unitId' | 'unitName';

export class UniquenessViolationError extends Error {
  readonly field: UniquenessField;
  readonly duplicateValue: string;

  constructor(field: UniquenessField, duplicateValue: string) {
    super(
      `Uniqueness violation on field "${field}": duplicate value "${duplicateValue}" in batch`
    );
    this.name = 'UniquenessViolationError';
    this.field = field;
    this.duplicateValue = duplicateValue;
  }
}

export type UniquenessBucket = {
  emails: Set<string>;
  phones: Set<string>;
  unitIds: Set<string>;
  unitNames: Set<string>;
  ids: Set<string>;
};

export function createUniquenessBucket(): UniquenessBucket {
  return {
    emails: new Set(),
    phones: new Set(),
    unitIds: new Set(),
    unitNames: new Set(),
    ids: new Set(),
  };
}

/** Trim + lowercase; returns `null` when absent or empty after trim. */
export function normalizeEmail(
  email: string | null | undefined
): string | null {
  if (email == null) return null;
  const t = email.trim().toLowerCase();
  return t.length === 0 ? null : t;
}

/** Trim + collapse common separators for stable comparison. */
export function normalizePhone(
  phone: string | null | undefined
): string | null {
  if (phone == null) return null;
  const t = phone.trim().replace(/[\s\-().]/g, '');
  return t.length === 0 ? null : t;
}

export function normalizeUnitName(
  name: string | null | undefined
): string | null {
  if (name == null) return null;
  const t = name.trim();
  return t.length === 0 ? null : t;
}

export type UniquenessRowInput = {
  organizationId: string;
  id?: string | null;
  email?: string | null;
  phone?: string | null;
  unitId?: string | null;
  /** For unit rows: checked as @@unique([organizationId, name]) */
  unitName?: string | null;
};

function orgKey(organizationId: string, value: string): string {
  return `${organizationId}${KEY_SEP}${value}`;
}

/**
 * Ensures `row` does not duplicate keys already registered in `bucket`, then registers
 * normalized keys. Call in row order for a single-org or multi-org batch.
 */
export function validateUniqueness(
  bucket: UniquenessBucket,
  row: UniquenessRowInput
): void {
  const { organizationId } = row;
  if (!organizationId || organizationId.trim() === '') {
    throw new Error('validateUniqueness: organizationId is required');
  }

  const id = row.id?.trim();
  if (id) {
    if (bucket.ids.has(id)) {
      throw new UniquenessViolationError('id', id);
    }
  }

  const email = normalizeEmail(row.email ?? null);
  if (email) {
    const k = orgKey(organizationId, email);
    if (bucket.emails.has(k)) {
      throw new UniquenessViolationError('email', email);
    }
  }

  const phone = normalizePhone(row.phone ?? null);
  if (phone) {
    const k = orgKey(organizationId, phone);
    if (bucket.phones.has(k)) {
      throw new UniquenessViolationError('phone', phone);
    }
  }

  const unitId = row.unitId?.trim();
  if (unitId) {
    if (bucket.unitIds.has(unitId)) {
      throw new UniquenessViolationError('unitId', unitId);
    }
  }

  const unitName = normalizeUnitName(row.unitName ?? null);
  if (unitName) {
    const k = orgKey(organizationId, unitName);
    if (bucket.unitNames.has(k)) {
      throw new UniquenessViolationError('unitName', unitName);
    }
  }

  // Register after all checks
  if (id) bucket.ids.add(id);
  if (email) bucket.emails.add(orgKey(organizationId, email));
  if (phone) bucket.phones.add(orgKey(organizationId, phone));
  if (unitId) bucket.unitIds.add(unitId);
  if (unitName) bucket.unitNames.add(orgKey(organizationId, unitName));
}
