import { NextRequest, NextResponse } from 'next/server';
import { BulkScanRequestSchema, BulkScanResponseSchema } from '@gate-access/types';
import { prisma } from '@gate-access/db';

interface ConflictResult {
  id: string;
  reason: string;
}

interface AuditTrailEntry {
  timestamp: string;
  action: string;
  resolvedBy: 'lww' | 'server' | 'client';
  details: Record<string, unknown>;
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const validation = BulkScanRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { scans } = validation.data;

    const synced: string[] = [];
    const conflicted: ConflictResult[] = [];
    const failed: Array<{ id: string; error: string }> = [];

    const results = await prisma.$transaction(async (tx) => {
      for (const scan of scans) {
        try {
          // 1. Check for exact duplicate by scanUuid (idempotency guard)
          if (scan.scanUuid) {
            const duplicateByScanUuid = await tx.scanLog.findUnique({
              where: { scanUuid: scan.scanUuid },
            });

            if (duplicateByScanUuid) {
              // Already processed this exact scan — treat as success (idempotent)
              synced.push(scan.id);
              continue;
            }
          }

          // 2. Find existing scan for same QR code to check for conflicts
          const existingScan = await tx.scanLog.findFirst({
            where: {
              qrCode: {
                code: scan.qrCode,
              },
            },
            orderBy: {
              scannedAt: 'desc',
            },
          });

          if (existingScan) {
            const existingTime = new Date(existingScan.scannedAt).getTime();
            const incomingTime = new Date(scan.scannedAt).getTime();

            if (incomingTime > existingTime) {
              // LWW: incoming is newer — update existing record
              const auditEntry = makeAuditEntry('sync_resolve', 'lww', {
                strategy: 'lww_incoming_wins',
                existingScanId: existingScan.id,
                existingScannedAt: existingScan.scannedAt.toISOString(),
                incomingScannedAt: scan.scannedAt,
                incomingScanUuid: scan.scanUuid,
              });

              // Preserve existing auditTrail and append new entry
              const existingTrail = (existingScan as unknown as { auditTrail: unknown[] }).auditTrail ?? [];

              await tx.scanLog.update({
                where: { id: existingScan.id },
                data: {
                  scannedAt: new Date(scan.scannedAt),
                  status: scan.status,
                  scanUuid: scan.scanUuid,
                  deviceId: scan.deviceId ?? null,
                  auditTrail: [...existingTrail, auditEntry],
                  auditNotes: null, // Deprecated: migrated to auditTrail
                },
              });

              synced.push(scan.id);
              conflicted.push({
                id: scan.id,
                reason: 'LWW resolved - incoming newer, existing updated',
              });
            } else {
              // Equal or existing is newer — server authoritative, keep existing
              const auditEntry = makeAuditEntry('sync_resolve', 'server', {
                strategy: incomingTime === existingTime
                  ? 'equal_timestamp_server_wins'
                  : 'lww_existing_wins',
                existingScanId: existingScan.id,
                existingScannedAt: existingScan.scannedAt.toISOString(),
                incomingScannedAt: scan.scannedAt,
                incomingScanUuid: scan.scanUuid,
              });

              const existingTrail = (existingScan as unknown as { auditTrail: unknown[] }).auditTrail ?? [];

              await tx.scanLog.update({
                where: { id: existingScan.id },
                data: {
                  auditTrail: [...existingTrail, auditEntry],
                },
              });

              conflicted.push({
                id: scan.id,
                reason: incomingTime === existingTime
                  ? 'Equal timestamp - server authoritative, kept existing'
                  : 'LWW resolved - existing record newer',
              });
            }
          } else {
            // 3. No existing scan — create new record
            const qrCodeRecord = await tx.qRCode.findUnique({
              where: { code: scan.qrCode },
            });

            if (!qrCodeRecord) {
              failed.push({
                id: scan.id,
                error: 'QR code not found',
              });
              continue;
            }

            const auditEntry = makeAuditEntry('sync_create', 'client', {
              strategy: 'new_record',
              scanUuid: scan.scanUuid,
              deviceId: scan.deviceId ?? null,
            });

            await tx.scanLog.create({
              data: {
                scanUuid: scan.scanUuid,
                status: scan.status,
                scannedAt: new Date(scan.scannedAt),
                qrCodeId: qrCodeRecord.id,
                gateId: scan.gateId,
                deviceId: scan.deviceId ?? null,
                auditTrail: [auditEntry],
              },
            });
            synced.push(scan.id);
          }
        } catch (scanError) {
          failed.push({
            id: scan.id,
            error: (scanError as Error).message,
          });
        }
      }

      return { synced, conflicted, failed };
    });

    const response = {
      success: true,
      synced: results.synced,
      conflicted: results.conflicted,
      failed: results.failed,
    };

    return NextResponse.json({
      success: true,
      data: BulkScanResponseSchema.parse(response),
    });
  } catch (error) {
    console.error('Bulk sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
