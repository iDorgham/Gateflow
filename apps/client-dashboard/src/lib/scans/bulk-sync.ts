import { type Prisma, type PrismaClient } from '@gate-access/db';
import { getAuditTrail, type AuditTrailEntry } from '@/lib/types';

// Define strict types for input based on usage
export interface ScanInput {
  id: string;
  scanUuid?: string | null;
  qrCode: string;
  scannedAt: string;
  status:
    | 'SUCCESS'
    | 'FAILED'
    | 'EXPIRED'
    | 'MAX_USES_REACHED'
    | 'INACTIVE'
    | 'DENIED'; // ScanStatus
  gateId: string;
  deviceId?: string | null;
  // Optional fields from ScanEvent (passed through from validated bulk payload)
  retryCount?: number;
  latitude?: number | null;
  longitude?: number | null;
  visitorName?: string | null;
  visitorPhone?: string | null;
  visitorIdNumber?: string | null;
  shiftLogId?: string | null;
}

export interface BulkSyncContext {
  organizationId: string;
  guardId: string;
}

export interface ConflictResult {
  id: string;
  reason: string;
}

export interface SyncResult {
  synced: string[];
  conflicted: ConflictResult[];
  failed: Array<{ id: string; error: string }>;
}

interface QrUsageState {
  type?: string;
  currentUses?: number;
  maxUses?: number | null;
  isActive?: boolean;
  expiresAt?: Date | null;
  gateId?: string | null;
}

function qrUsageLimit(qr: QrUsageState): number | null {
  if (qr.type === 'SINGLE') return 1;
  return qr.maxUses ?? null;
}

function validateSuccessfulQrScan(
  qr: QrUsageState,
  scan: ScanInput
): string | null {
  if (qr.isActive === false) return 'QR code is inactive';
  if (qr.gateId && qr.gateId !== scan.gateId) {
    return 'QR code is not valid for this gate';
  }

  const scannedAt = new Date(scan.scannedAt);
  if (qr.expiresAt && scannedAt > qr.expiresAt) return 'QR code expired';

  const limit = qrUsageLimit(qr);
  if (limit !== null && (qr.currentUses ?? 0) >= limit) {
    return 'QR usage limit reached';
  }
  return null;
}

// Scanner timestamps come from device clocks. This tolerance applies only
// while a shift is open; closed shifts retain their exact historical endTime.
const OPEN_SHIFT_CLOCK_SKEW_MS = 5 * 60 * 1000;

function makeAuditEntry(
  action: string,
  resolvedBy: AuditTrailEntry['resolvedBy'],
  details: Record<string, unknown>
): AuditTrailEntry {
  return {
    timestamp: new Date().toISOString(),
    action,
    resolvedBy,
    details,
  };
}

function shiftDetail(shiftLogId: string | null | undefined): {
  shiftLogId?: string;
} {
  return shiftLogId ? { shiftLogId } : {};
}

/**
 * Verify client-supplied shiftLogId is a real ShiftLog for this org/guard/gate
 * and that scannedAt falls within the shift window. Open shifts allow a small
 * device-clock skew beyond the server's current time.
 */
async function resolveVerifiedShiftLogId(
  scan: ScanInput,
  context: BulkSyncContext | undefined,
  shiftCache: Map<string, { startTime: Date; endTime: Date | null } | null>
): Promise<
  { ok: true; shiftLogId: string | null } | { ok: false; error: string }
> {
  if (!scan.shiftLogId) {
    return context
      ? { ok: false, error: 'shiftLogId is required for bulk sync' }
      : { ok: true, shiftLogId: null };
  }

  if (!context) {
    return {
      ok: false,
      error:
        'Authenticated organization context is required for shift attribution',
    };
  }

  const cacheKey = `${scan.shiftLogId}:${scan.gateId}`;
  const shift = shiftCache.get(cacheKey);
  if (!shift) {
    return {
      ok: false,
      error: 'Invalid or unauthorized shiftLogId for this gate',
    };
  }

  const scannedAtMs = new Date(scan.scannedAt).getTime();
  if (Number.isNaN(scannedAtMs)) {
    return { ok: false, error: 'Invalid scannedAt for shift attribution' };
  }
  if (scannedAtMs < shift.startTime.getTime()) {
    return {
      ok: false,
      error: 'Scan time is before the referenced shift start',
    };
  }
  const endBound =
    shift.endTime?.getTime() ?? Date.now() + OPEN_SHIFT_CLOCK_SKEW_MS;
  if (scannedAtMs > endBound) {
    return {
      ok: false,
      error: 'Scan time is after the referenced shift ended',
    };
  }

  return { ok: true, shiftLogId: scan.shiftLogId };
}

export async function processBulkScans(
  scans: ScanInput[],
  tx: Prisma.TransactionClient | PrismaClient,
  context: BulkSyncContext
): Promise<SyncResult> {
  // Required at the type level, but non-TS/`as any` callers can still bypass
  // that — this is the runtime backstop so a missing context fails closed
  // instead of silently dropping organizationId scoping on the qrCode lookup.
  if (!context?.organizationId) {
    throw new Error(
      'processBulkScans requires an authenticated organization context'
    );
  }

  const synced: string[] = [];
  const conflicted: ConflictResult[] = [];
  const failed: Array<{ id: string; error: string }> = [];
  const shiftCache = new Map<
    string,
    { startTime: Date; endTime: Date | null } | null
  >();

  // 1. Extract IDs for bulk fetching
  const scanUuids = scans
    .map((s) => s.scanUuid)
    .filter((uuid): uuid is string => !!uuid);
  const qrCodes = Array.from(new Set(scans.map((s) => s.qrCode)));
  const shiftLogIds = Array.from(
    new Set(scans.map((s) => s.shiftLogId).filter((id): id is string => !!id))
  );

  // 2. Bulk Fetch Data
  const [existingByUuid, qrCodesWithLatest, verifiedShifts] = await Promise.all(
    [
      scanUuids.length > 0
        ? tx.scanLog.findMany({
            // Deliberately NOT filtering deletedAt: null — scanUuid is a unique DB
            // constraint that soft-delete does not release, so this idempotency
            // check must see soft-deleted rows too or a re-sync would attempt to
            // recreate a row with a scanUuid that's still taken and fail.
            // Tenant-scoped: only check scanUuid collisions within this org to prevent
            // cross-tenant UUID from blocking legitimate scans.
            where: {
              scanUuid: { in: scanUuids },
              qrCode: { organizationId: context.organizationId },
            },
            select: { id: true, scanUuid: true },
          })
        : Promise.resolve([]),
      qrCodes.length > 0
        ? tx.qRCode.findMany({
            where: {
              code: { in: qrCodes },
              organizationId: context.organizationId,
              deletedAt: null,
            },
            include: {
              scanLogs: {
                where: { deletedAt: null },
                orderBy: { scannedAt: 'desc' },
                take: 1,
              },
            },
          })
        : Promise.resolve([]),
      shiftLogIds.length > 0
        ? tx.shiftLog.findMany({
            where: {
              id: { in: shiftLogIds },
              organizationId: context.organizationId,
              guardId: context.guardId,
            },
            select: {
              id: true,
              gateId: true,
              startTime: true,
              endTime: true,
            },
          })
        : Promise.resolve([]),
    ]
  );

  for (const shift of verifiedShifts) {
    shiftCache.set(`${shift.id}:${shift.gateId}`, {
      startTime: shift.startTime,
      endTime: shift.endTime,
    });
  }

  // 3. Build Lookup Maps
  const existingUuidSet = new Set(existingByUuid.map((s) => s.scanUuid));

  // Map qrCode -> Latest Scan State
  interface QrState {
    qrCodeId: string;
    qr: QrUsageState;
    // Current logical state of the latest scan for this QR
    latestScan: {
      id?: string; // Only if exists in DB
      scannedAt: Date;
      auditTrail: AuditTrailEntry[];
      shiftLogId?: string | null;
    } | null;

    // Pending operations
    pendingCreate?: Prisma.ScanLogCreateManyInput;
    pendingUpdate?: { id: string; data: Prisma.ScanLogUpdateInput };
    pendingUsageReservations: number;
    pendingSyncedIds: string[];
  }

  const qrStateMap = new Map<string, QrState>();

  for (const qr of qrCodesWithLatest) {
    const latest = qr.scanLogs[0];
    qrStateMap.set(qr.code, {
      qrCodeId: qr.id,
      qr: {
        type: qr.type,
        currentUses: qr.currentUses,
        maxUses: qr.maxUses,
        isActive: qr.isActive,
        expiresAt: qr.expiresAt,
        gateId: qr.gateId,
      },
      pendingSyncedIds: [],
      pendingUsageReservations: 0,
      latestScan: latest
        ? {
            id: latest.id,
            scannedAt: latest.scannedAt,
            auditTrail: getAuditTrail(latest),
          }
        : null,
    });
  }

  // To track processed UUIDs within this batch (for internal idempotency)
  const processedBatchUuids = new Set<string>();

  // 4. Process Scans Sequentially
  for (const scan of scans) {
    const shiftResolved = await resolveVerifiedShiftLogId(
      scan,
      context,
      shiftCache
    );
    if (shiftResolved.ok === false) {
      failed.push({ id: scan.id, error: shiftResolved.error });
      continue;
    }
    const verifiedShiftLogId = shiftResolved.shiftLogId;

    // A. Check for exact duplicate by scanUuid (idempotency guard)
    if (scan.scanUuid) {
      if (
        existingUuidSet.has(scan.scanUuid) ||
        processedBatchUuids.has(scan.scanUuid)
      ) {
        synced.push(scan.id);
        continue;
      }
      processedBatchUuids.add(scan.scanUuid);
    }

    // B. Check QR existence
    const state = qrStateMap.get(scan.qrCode);
    if (!state) {
      failed.push({
        id: scan.id,
        error: 'QR code not found',
      });
      continue;
    }

    if (scan.status === 'SUCCESS') {
      const qrError = validateSuccessfulQrScan(
        {
          ...state.qr,
          currentUses:
            (state.qr.currentUses ?? 0) + state.pendingUsageReservations,
        },
        scan
      );
      if (qrError) {
        failed.push({ id: scan.id, error: qrError });
        continue;
      }
    }

    // C. Resolve Conflicts / Create
    const incomingTime = new Date(scan.scannedAt).getTime();
    const existingScan = state.latestScan;

    if (existingScan) {
      // Conflict Resolution
      const existingTime = existingScan.scannedAt.getTime();

      if (incomingTime > existingTime) {
        // LWW: incoming is newer — update existing record
        const auditEntry = makeAuditEntry('sync_resolve', 'lww', {
          strategy: 'lww_incoming_wins',
          existingScanId: existingScan.id || 'new_in_batch',
          existingScannedAt: existingScan.scannedAt.toISOString(),
          incomingScannedAt: scan.scannedAt,
          incomingScanUuid: scan.scanUuid,
          ...shiftDetail(verifiedShiftLogId),
        });

        const newAuditTrailEntries: AuditTrailEntry[] = [
          ...existingScan.auditTrail,
          auditEntry,
        ];
        const newAuditTrailJson =
          newAuditTrailEntries as unknown as Prisma.JsonArray;

        // Update In-Memory State
        state.latestScan = {
          id: existingScan.id, // Preserve ID if it was from DB
          scannedAt: new Date(scan.scannedAt),
          auditTrail: newAuditTrailEntries,
          shiftLogId: verifiedShiftLogId,
        };

        // Prepare Operation
        if (state.pendingCreate) {
          // We are updating a pending creation from this batch
          state.pendingCreate = {
            ...state.pendingCreate,
            scannedAt: new Date(scan.scannedAt),
            status: scan.status,
            scanUuid: scan.scanUuid ?? undefined,
            deviceId: scan.deviceId ?? null,
            auditTrail: newAuditTrailJson,
          };
        } else if (existingScan.id) {
          // We are updating an existing DB record
          state.pendingUpdate = {
            id: existingScan.id,
            data: {
              scannedAt: new Date(scan.scannedAt),
              status: scan.status,
              scanUuid: scan.scanUuid ?? undefined,
              deviceId: scan.deviceId ?? null,
              auditTrail: newAuditTrailJson,
              auditNotes: null,
            },
          };
        }

        synced.push(scan.id);
        state.pendingSyncedIds.push(scan.id);
        if (scan.status === 'SUCCESS') state.pendingUsageReservations += 1;
        conflicted.push({
          id: scan.id,
          reason: 'LWW resolved - incoming newer, existing updated',
        });
      } else {
        // Server Wins (Equal or existing is newer)
        const auditEntry = makeAuditEntry('sync_resolve', 'server', {
          strategy:
            incomingTime === existingTime
              ? 'equal_timestamp_server_wins'
              : 'lww_existing_wins',
          existingScanId: existingScan.id || 'new_in_batch',
          existingScannedAt: existingScan.scannedAt.toISOString(),
          incomingScannedAt: scan.scannedAt,
          incomingScanUuid: scan.scanUuid,
          ...shiftDetail(verifiedShiftLogId),
        });

        const newAuditTrailEntries: AuditTrailEntry[] = [
          ...existingScan.auditTrail,
          auditEntry,
        ];
        const newAuditTrailJson =
          newAuditTrailEntries as unknown as Prisma.JsonArray;

        // Update In-Memory Audit Trail Only
        state.latestScan = {
          ...existingScan,
          auditTrail: newAuditTrailEntries,
        };

        if (state.pendingCreate) {
          state.pendingCreate.auditTrail = newAuditTrailJson;
        } else if (existingScan.id) {
          // If we already have a pending update, merge logic?
          // If server wins, we basically keep existing fields but append audit trail.
          // If we had a pending update (LWW from earlier), we keep that update but append this audit trail.
          if (state.pendingUpdate) {
            state.pendingUpdate.data.auditTrail = newAuditTrailJson;
          } else {
            // New update just for audit trail
            state.pendingUpdate = {
              id: existingScan.id,
              data: {
                auditTrail: newAuditTrailJson,
              },
            };
          }
        }

        conflicted.push({
          id: scan.id,
          reason:
            incomingTime === existingTime
              ? 'equal timestamp - server authoritative, kept existing'
              : 'LWW resolved - existing record newer',
        });
      }
    } else {
      // Create New
      const auditEntry = makeAuditEntry('sync_create', 'client', {
        strategy: 'new_record',
        scanUuid: scan.scanUuid,
        deviceId: scan.deviceId ?? null,
        ...shiftDetail(verifiedShiftLogId),
      });

      const auditTrailEntries: AuditTrailEntry[] = [auditEntry];
      const auditTrailJson = auditTrailEntries as unknown as Prisma.JsonArray;

      // Update State
      state.latestScan = {
        scannedAt: new Date(scan.scannedAt),
        auditTrail: auditTrailEntries,
        shiftLogId: verifiedShiftLogId,
      };

      state.pendingCreate = {
        scanUuid: scan.scanUuid ?? undefined,
        status: scan.status,
        scannedAt: new Date(scan.scannedAt),
        qrCodeId: state.qrCodeId,
        gateId: scan.gateId,
        deviceId: scan.deviceId ?? null,
        auditTrail: auditTrailJson,
      };

      synced.push(scan.id);
      state.pendingSyncedIds.push(scan.id);
      if (scan.status === 'SUCCESS') state.pendingUsageReservations += 1;
    }
  }

  // 5. Commit Writes
  const statesWithWrites = Array.from(qrStateMap.values()).filter(
    (state) => state.pendingCreate || state.pendingUpdate
  );

  for (const state of statesWithWrites) {
    if (state.pendingUsageReservations === 0) continue;

    const limit = qrUsageLimit(state.qr);
    const maximumCurrentUses =
      limit === null ? null : limit - state.pendingUsageReservations + 1;
    const reservation = await tx.qRCode.updateMany({
      where: {
        id: state.qrCodeId,
        organizationId: context.organizationId,
        deletedAt: null,
        isActive: true,
        ...(maximumCurrentUses === null
          ? {}
          : { currentUses: { lt: maximumCurrentUses } }),
      },
      data: {
        currentUses: { increment: state.pendingUsageReservations },
      },
    });

    if (reservation.count === 1) continue;

    const rejectedIds = new Set(state.pendingSyncedIds);
    for (let index = synced.length - 1; index >= 0; index -= 1) {
      if (rejectedIds.has(synced[index])) synced.splice(index, 1);
    }
    for (const id of rejectedIds) {
      failed.push({ id, error: 'QR usage limit reached during sync' });
    }
    state.pendingCreate = undefined;
    state.pendingUpdate = undefined;
  }

  const creates = statesWithWrites
    .map((s) => s.pendingCreate)
    .filter((c): c is Prisma.ScanLogCreateManyInput => !!c);

  const updates = statesWithWrites
    .filter((s) => !!s.pendingUpdate && !s.pendingCreate)
    .map(
      (s) => s.pendingUpdate as { id: string; data: Prisma.ScanLogUpdateInput }
    );
  // Note: If pendingCreate exists, it supersedes pendingUpdate (because it means we created it in this batch)
  // Wait, if pendingCreate exists, we don't have an ID yet, so we can't have pendingUpdate for it?
  // Correct. Logic above: if state.pendingCreate, we update state.pendingCreate.
  // So filter is redundant but safe.

  if (creates.length > 0) {
    await tx.scanLog.createMany({ data: creates });
  }

  if (updates.length > 0) {
    // Process updates in parallel
    await Promise.all(
      updates.map((u) =>
        tx.scanLog.update({
          where: { id: u.id },
          data: u.data,
        })
      )
    );
  }

  return { synced, conflicted, failed };
}
