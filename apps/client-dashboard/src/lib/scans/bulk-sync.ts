import { type Prisma, type PrismaClient } from '@gate-access/db';
import { getAuditTrail, type AuditTrailEntry } from '@/lib/types';

// Define strict types for input based on usage
export interface ScanInput {
  id: string;
  scanUuid?: string | null;
  qrCode: string;
  scannedAt: string;
  status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'MAX_USES_REACHED' | 'INACTIVE' | 'DENIED'; // ScanStatus
  gateId: string;
  deviceId?: string | null;
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

export async function processBulkScans(
  scans: ScanInput[],
  tx: Prisma.TransactionClient | PrismaClient
): Promise<SyncResult> {
  const synced: string[] = [];
  const conflicted: ConflictResult[] = [];
  const failed: Array<{ id: string; error: string }> = [];

  // 1. Extract IDs for bulk fetching
  const scanUuids = scans
    .map((s) => s.scanUuid)
    .filter((uuid): uuid is string => !!uuid);
  const qrCodes = Array.from(new Set(scans.map((s) => s.qrCode)));

  // 2. Bulk Fetch Data
  const [existingByUuid, qrCodesWithLatest] = await Promise.all([
    scanUuids.length > 0
      ? tx.scanLog.findMany({
          where: { scanUuid: { in: scanUuids } },
          select: { id: true, scanUuid: true },
        })
      : Promise.resolve([]),
    qrCodes.length > 0
      ? tx.qRCode.findMany({
          where: { code: { in: qrCodes } },
          include: {
            scanLogs: {
              orderBy: { scannedAt: 'desc' },
              take: 1,
            },
          },
        })
      : Promise.resolve([]),
  ]);

  // 3. Build Lookup Maps
  const existingUuidSet = new Set(existingByUuid.map((s) => s.scanUuid));

  // Map qrCode -> Latest Scan State
  interface QrState {
    qrCodeId: string;
    // Current logical state of the latest scan for this QR
    latestScan: {
      id?: string; // Only if exists in DB
      scannedAt: Date;
      auditTrail: AuditTrailEntry[];
    } | null;

    // Pending operations
    pendingCreate?: Prisma.ScanLogCreateManyInput;
    pendingUpdate?: { id: string; data: Prisma.ScanLogUpdateInput };
  }

  const qrStateMap = new Map<string, QrState>();

  for (const qr of qrCodesWithLatest) {
    const latest = qr.scanLogs[0];
    qrStateMap.set(qr.code, {
      qrCodeId: qr.id,
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
    // A. Check for exact duplicate by scanUuid (idempotency guard)
    if (scan.scanUuid) {
      if (existingUuidSet.has(scan.scanUuid) || processedBatchUuids.has(scan.scanUuid)) {
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
        });

        const newAuditTrailEntries: AuditTrailEntry[] = [
          ...existingScan.auditTrail,
          auditEntry,
        ];
        const newAuditTrailJson = newAuditTrailEntries as unknown as Prisma.JsonArray;

        // Update In-Memory State
        state.latestScan = {
          id: existingScan.id, // Preserve ID if it was from DB
          scannedAt: new Date(scan.scannedAt),
          auditTrail: newAuditTrailEntries,
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
             }
           };
        }

        synced.push(scan.id);
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
        });

        const newAuditTrailEntries: AuditTrailEntry[] = [
          ...existingScan.auditTrail,
          auditEntry,
        ];
        const newAuditTrailJson = newAuditTrailEntries as unknown as Prisma.JsonArray;

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
              }
            };
          }
        }

        conflicted.push({
          id: scan.id,
          reason:
            incomingTime === existingTime
              ? 'Equal timestamp - server authoritative, kept existing'
              : 'LWW resolved - existing record newer',
        });
      }
    } else {
      // Create New
      const auditEntry = makeAuditEntry('sync_create', 'client', {
        strategy: 'new_record',
        scanUuid: scan.scanUuid,
        deviceId: scan.deviceId ?? null,
      });

      const auditTrailEntries: AuditTrailEntry[] = [auditEntry];
      const auditTrailJson = auditTrailEntries as unknown as Prisma.JsonArray;

      // Update State
      state.latestScan = {
        scannedAt: new Date(scan.scannedAt),
        auditTrail: auditTrailEntries,
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
    }
  }

  // 5. Commit Writes
  const creates = Array.from(qrStateMap.values())
    .map((s) => s.pendingCreate)
    .filter((c): c is Prisma.ScanLogCreateManyInput => !!c);

  const updates = Array.from(qrStateMap.values())
    .filter((s) => !!s.pendingUpdate && !s.pendingCreate)
    .map((s) => s.pendingUpdate as { id: string; data: Prisma.ScanLogUpdateInput });
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
