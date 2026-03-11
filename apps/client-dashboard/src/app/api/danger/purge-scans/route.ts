import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

export const dynamic = 'force-dynamic';

const PurgeSchema = z.object({
  confirmation: z.literal('PURGE SCANS'),
  olderThanDays: z.number().int().min(30).max(3650),
});

/** POST /api/danger/purge-scans — bulk-delete scan logs older than N days */
export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admins can purge
  if (!claims.permissions?.['workspace:manage'] && !claims.permissions?.['gates:manage']) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = PurgeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request. Type PURGE SCANS to confirm.', details: parsed.error.flatten() }, { status: 400 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parsed.data.olderThanDays);

  const { count } = await prisma.scanLog.deleteMany({
    where: {
      gate: { organizationId: claims.orgId },
      scannedAt: { lt: cutoff },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: 'SCAN_LOGS_PURGED',
      entityType: 'ScanLog',
      organizationId: claims.orgId,
      userId: claims.sub,
      metadata: { deletedCount: count, olderThanDays: parsed.data.olderThanDays, cutoff: cutoff.toISOString() },
    },
  });

  return NextResponse.json({ success: true, deletedCount: count });
}
