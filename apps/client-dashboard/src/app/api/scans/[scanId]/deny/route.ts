import { NextRequest, NextResponse } from 'next/server';
import { prisma, type Prisma } from '@gate-access/db';
import { z } from 'zod';
import { hasPermission } from '../../../../../lib/auth';
import { checkGateAssignment } from '../../../../../lib/gate-assignment';
import { requireAuth, isNextResponse } from '../../../../../lib/require-auth';

interface AuditEntry {
  timestamp: string;
  action: string;
  resolvedBy: 'lww' | 'server' | 'client';
  details: Record<string, unknown>;
}

const DenyScanSchema = z.object({
  reason: z.string().trim().min(1).max(500).optional(),
});

/**
 * POST /api/scans/:scanId/deny
 *
 * Called by the scanner app when an operator chooses "Deny Entry" in the
 * Pass/Cancel dialog after a QR code has already been validated successfully.
 * Updates the ScanLog status from SUCCESS → DENIED and appends an audit entry.
 */
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ scanId: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  // Authenticate
  const authResult = await requireAuth(request);
  if (isNextResponse(authResult)) return authResult;
  const claims = authResult;

  if (!claims.orgId) {
    return NextResponse.json(
      { success: false, message: 'Organization context required' },
      { status: 403 }
    );
  }

  if (!hasPermission(claims, 'scans:override')) {
    return NextResponse.json(
      { success: false, message: 'Forbidden' },
      { status: 403 }
    );
  }

  const { scanId } = params;
  if (!scanId) {
    return NextResponse.json(
      { success: false, message: 'scanId is required' },
      { status: 400 }
    );
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // body is optional
  }
  const parsed = DenyScanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
  const reason = parsed.data.reason ?? 'operator_denied';

  // Find the scan log and verify it belongs to the operator's organisation
  const scanLog = await prisma.scanLog.findFirst({
    where: {
      id: scanId,
      deletedAt: null,
      qrCode: { organizationId: claims.orgId },
    },
    include: { qrCode: { select: { organizationId: true } } },
  });

  if (!scanLog) {
    return NextResponse.json(
      { success: false, message: 'Scan log not found' },
      { status: 404 }
    );
  }

  const assignmentError = await checkGateAssignment(claims, scanLog.gateId);
  if (assignmentError) {
    return NextResponse.json(
      { success: false, message: assignmentError },
      { status: 403 }
    );
  }

  // Only update if currently SUCCESS — guard against double-denial
  if (scanLog.status !== 'SUCCESS') {
    return NextResponse.json(
      {
        success: false,
        message: `Cannot deny a scan with status ${scanLog.status}`,
      },
      { status: 409 }
    );
  }

  const auditEntry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action: 'operator_denied',
    resolvedBy: 'server',
    details: { reason, operatorId: claims.sub },
  };

  const existingTrail = Array.isArray(scanLog.auditTrail)
    ? (scanLog.auditTrail as unknown as AuditEntry[])
    : [];

  await prisma.scanLog.update({
    where: { id: scanId },
    data: {
      status: 'DENIED',
      auditTrail: [...existingTrail, auditEntry] as unknown as Prisma.JsonArray,
    },
  });

  return NextResponse.json({ success: true });
}
