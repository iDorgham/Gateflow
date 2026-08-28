import { createHash } from 'crypto';

export const GENESIS_HASH =
  '0000000000000000000000000000000000000000000000000000000000000000';

export interface AuditEntryData {
  action: string;
  entityType: string;
  entityId?: string | null;
  organizationId: string;
  userId?: string | null;
  createdAt: string | Date;
  metadataPayload?: unknown;
}

export interface ChainedAuditMetadata {
  previousHash: string;
  hash: string;
  seq: number;
  [key: string]: unknown;
}

export interface LedgerVerificationResult {
  isValid: boolean;
  totalEntries: number;
  checkedAt: string;
  organizationId: string;
  latestHash: string;
  tamperedIndex: number | null;
  tamperedId: string | null;
  errorReason: string | null;
}

/**
 * Deterministically serializes an object with recursively sorted keys.
 */
export function canonicalizeJson(value: unknown): string {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeJson(item)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalizeJson(obj[key])}`
  );
  return `{${pairs.join(',')}}`;
}

/**
 * Computes deterministic SHA-256 hash for an audit log entry chained to previousHash.
 */
export function calculateAuditHash(
  prevHash: string,
  entry: AuditEntryData
): string {
  const normalizedTime =
    entry.createdAt instanceof Date
      ? entry.createdAt.toISOString()
      : new Date(entry.createdAt).toISOString();

  // Strip internal chain metadata and sensitive credential fields if passed
  let payloadClean: unknown = entry.metadataPayload;
  if (
    payloadClean &&
    typeof payloadClean === 'object' &&
    !Array.isArray(payloadClean)
  ) {
    const raw = { ...(payloadClean as Record<string, unknown>) };
    delete raw.previousHash;
    delete raw.hash;
    delete raw.seq;
    delete raw.password;
    delete raw.passwordHash;
    delete raw.secret;
    delete raw.token;
    payloadClean = Object.keys(raw).length > 0 ? raw : null;
  }

  const payloadString = canonicalizeJson({
    prevHash,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId ?? null,
    organizationId: entry.organizationId,
    userId: entry.userId ?? null,
    createdAt: normalizedTime,
    payload: payloadClean,
  });

  return createHash('sha256').update(payloadString, 'utf8').digest('hex');
}

/** Duck-typed interface for AuditLog repository operations */
export interface AuditLogClientLike {
  auditLog: {
    findFirst: (
      args: Record<string, unknown>
    ) => Promise<Record<string, unknown> | null>;
    create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
    findMany: (
      args: Record<string, unknown>
    ) => Promise<Array<Record<string, unknown>>>;
  };
}

/**
 * Inserts a cryptographically hash-chained AuditLog record.
 */
export async function createChainedAuditLog(
  client: AuditLogClientLike | any,
  params: {
    action: string;
    entityType: string;
    entityId?: string | null;
    userId?: string | null;
    organizationId: string;
    metadata?: Record<string, unknown>;
    createdAt?: Date;
  }
) {
  const {
    action,
    entityType,
    entityId,
    userId,
    organizationId,
    metadata,
    createdAt,
  } = params;
  const timestamp = createdAt ?? new Date();

  // 1. Fetch latest audit log for this organization to get previous hash & sequence
  const previousLog = await client.auditLog.findFirst({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, metadata: true },
  });

  let previousHash = GENESIS_HASH;
  let seq = 1;

  if (previousLog && previousLog.metadata) {
    const meta = previousLog.metadata as Record<string, unknown>;
    if (typeof meta.hash === 'string') {
      previousHash = meta.hash;
    }
    if (typeof meta.seq === 'number') {
      seq = meta.seq + 1;
    }
  }

  // 2. Compute entry hash
  const entryHash = calculateAuditHash(previousHash, {
    action,
    entityType,
    entityId,
    organizationId,
    userId,
    createdAt: timestamp,
    metadataPayload: metadata,
  });

  // 3. Create chained metadata
  const chainedMetadata: ChainedAuditMetadata = {
    ...(metadata ?? {}),
    previousHash,
    hash: entryHash,
    seq,
  };

  return client.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      userId,
      organizationId,
      createdAt: timestamp,
      metadata: JSON.parse(JSON.stringify(chainedMetadata)),
    },
  });
}

/**
 * Validates the cryptographic hash chain of an organization's audit log ledger.
 */
export async function verifyAuditLedgerIntegrity(
  client: AuditLogClientLike | any,
  organizationId: string
): Promise<LedgerVerificationResult> {
  const checkedAt = new Date().toISOString();

  const logs = await client.auditLog.findMany({
    where: { organizationId },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      userId: true,
      organizationId: true,
      createdAt: true,
      metadata: true,
    },
  });

  if (logs.length === 0) {
    return {
      isValid: true,
      totalEntries: 0,
      checkedAt,
      organizationId,
      latestHash: GENESIS_HASH,
      tamperedIndex: null,
      tamperedId: null,
      errorReason: null,
    };
  }

  let expectedPrevHash = GENESIS_HASH;

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const meta = (log.metadata ?? {}) as Record<string, unknown>;

    const recordedPrevHash =
      typeof meta.previousHash === 'string' ? meta.previousHash : null;
    const recordedHash = typeof meta.hash === 'string' ? meta.hash : null;

    if (!recordedHash) {
      return {
        isValid: false,
        totalEntries: logs.length,
        checkedAt,
        organizationId,
        latestHash: expectedPrevHash,
        tamperedIndex: i,
        tamperedId: log.id,
        errorReason: `Entry at index ${i} (ID: ${log.id}) is missing cryptographic hash`,
      };
    }

    if (recordedPrevHash !== expectedPrevHash) {
      return {
        isValid: false,
        totalEntries: logs.length,
        checkedAt,
        organizationId,
        latestHash: expectedPrevHash,
        tamperedIndex: i,
        tamperedId: log.id,
        errorReason: `Hash chain broken at index ${i} (ID: ${log.id}). Expected previousHash "${expectedPrevHash}", but found "${recordedPrevHash}"`,
      };
    }

    const calculated = calculateAuditHash(expectedPrevHash, {
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      organizationId: log.organizationId,
      userId: log.userId,
      createdAt: log.createdAt,
      metadataPayload: meta,
    });

    if (calculated !== recordedHash) {
      return {
        isValid: false,
        totalEntries: logs.length,
        checkedAt,
        organizationId,
        latestHash: expectedPrevHash,
        tamperedIndex: i,
        tamperedId: log.id,
        errorReason: `Payload signature mismatch at index ${i} (ID: ${log.id}). Data was modified after insertion.`,
      };
    }

    expectedPrevHash = recordedHash;
  }

  return {
    isValid: true,
    totalEntries: logs.length,
    checkedAt,
    organizationId,
    latestHash: expectedPrevHash,
    tamperedIndex: null,
    tamperedId: null,
    errorReason: null,
  };
}
