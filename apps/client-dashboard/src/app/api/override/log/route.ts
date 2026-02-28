import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { z } from 'zod';

const OverrideLogSchema = z.object({
  gateId: z.string().min(1),
  qrCode: z.string().min(1),
  reason: z.string().min(1).max(500),
  supervisorAuth: z.boolean(),
  rejectReason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Security: Only TENANT_ADMIN, TENANT_USER, or VISITOR (Scanner) can log overrides
  // Residents should not be able to log overrides for themselves.
  if (claims.roleName?.toUpperCase() === 'RESIDENT') {
    return NextResponse.json({ error: 'Forbidden: Residents cannot log overrides' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = OverrideLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { gateId, qrCode, reason, supervisorAuth, rejectReason } = parsed.data;

  // Verify gate belongs to org
  const gate = await prisma.gate.findFirst({
    where: { id: gateId, organizationId: claims.orgId, deletedAt: null },
    select: { id: true },
  });
  if (!gate) {
    return NextResponse.json({ error: 'Gate not found' }, { status: 404 });
  }

  // Find the most recent ScanLog for this QR code at this gate (within last 10 minutes)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const scanLog = await prisma.scanLog.findFirst({
    where: {
      gateId,
      qrCode: {
        code: qrCode,
        organizationId: claims.orgId,
      },
      scannedAt: { gte: tenMinutesAgo },
    },
    orderBy: { scannedAt: 'desc' },
    select: { id: true, auditTrail: true },
  });

  if (!scanLog) {
    // No matching scan log found — still return success (best-effort audit)
    return NextResponse.json({
      success: true,
      scanId: null,
      note: 'No recent scan log found for this QR code + gate combination',
    });
  }

  // Append override record to auditTrail
  const auditEntry = {
    action: 'supervisor_override',
    supervisorId: claims.sub,
    reason,
    supervisorAuth,
    rejectReason: rejectReason ?? null,
    timestamp: new Date().toISOString(),
  };

  const currentTrail = Array.isArray(scanLog.auditTrail) ? scanLog.auditTrail : [];

  await prisma.scanLog.update({
    where: { id: scanLog.id },
    data: {
      auditTrail: [...currentTrail, auditEntry],
    },
  });

  return NextResponse.json({ success: true, scanId: scanLog.id });
}
