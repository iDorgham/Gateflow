import { NextRequest, NextResponse } from 'next/server';
import { BulkScanRequestSchema, BulkScanResponseSchema } from '@gate-access/types';
import { prisma } from '@gate-access/db';

interface ConflictResult {
  id: string;
  reason: string;
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
              await tx.scanLog.update({
                where: { id: existingScan.id },
                data: {
                  scannedAt: new Date(scan.scannedAt),
                  status: scan.status,
                  auditNotes: JSON.stringify({
                    action: 'sync_resolve',
                    strategy: 'lww',
                    timestampsCompared: {
                      existing: existingScan.scannedAt,
                      incoming: scan.scannedAt,
                    },
                  }),
                },
              });
              synced.push(scan.id);
              conflicted.push({
                id: scan.id,
                reason: 'LWW resolved - newer timestamp',
              });
            } else {
              conflicted.push({
                id: scan.id,
                reason: 'LWW resolved - existing record newer',
              });
            }
          } else {
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

            await tx.scanLog.create({
              data: {
                status: scan.status,
                scannedAt: new Date(scan.scannedAt),
                qrCodeId: qrCodeRecord.id,
                gateId: scan.gateId,
                auditNotes: JSON.stringify({
                  action: 'sync_create',
                  strategy: 'new_record',
                }),
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
      data: BulkScanResponseSchema.parse({
        ...response,
        failed: response.failed,
      }),
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
