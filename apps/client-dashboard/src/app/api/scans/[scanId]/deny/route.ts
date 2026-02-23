import { NextRequest, NextResponse } from 'next/server';
import { prisma, type Prisma } from '@gate-access/db';
import { requireAuth, isNextResponse } from '../../../../../lib/require-auth';

interface AuditEntry {
  timestamp: string;
  action: string;
  resolvedBy: 'lww' | 'server' | 'client';
  details: Record<string, unknown>;
}

/**
 * POST /api/scans/:scanId/deny
 *
 * Called by the scanner app when an operator chooses "Deny Entry" in the
 * Pass/Cancel dialog after a QR code has already been validated successfully.
 * Updates the ScanLog status from SUCCESS → DENIED and appends an audit entry.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { scanId: string } },
): Promise<NextResponse> {
  // Authenticate
  const authResult = await requireAuth(request);
  if (isNextResponse(authResult)) return authResult;
  const claims = authResult;

  const { scanId } = params;
  if (!scanId) {
    return NextResponse.json({ success: false, message: 'scanId is required' }, { status: 400 });
  }

  // Parse optional reason from body
  let reason = 'operator_denied';
  try {
    const body = await request.json();
    if (typeof body?.reason === 'string' && body.reason.trim()) {
      reason = body.reason.trim();
    }
  } catch {
    // body is optional
  }

  // Find the scan log and verify it belongs to the operator's organisation
  const scanLog = await prisma.scanLog.findUnique({
    where: { id: scanId },
    include: { qrCode: { select: { organizationId: true } } },
  });

  if (!scanLog) {
    return NextResponse.json({ success: false, message: 'Scan log not found' }, { status: 404 });
  }

  if (claims.orgId && scanLog.qrCode.organizationId !== claims.orgId) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  // Only update if currently SUCCESS — guard against double-denial
  if (scanLog.status !== 'SUCCESS') {
    return NextResponse.json(
      { success: false, message: `Cannot deny a scan with status ${scanLog.status}` },
      { status: 409 },
    );
  }

  const auditEntry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action: 'operator_denied',
    resolvedBy: 'server',
    details: { reason, operatorId: claims.sub },
  };

  const existingTrail = Array.isArray(scanLog.auditTrail) ? (scanLog.auditTrail as unknown as AuditEntry[]) : [];

  await prisma.scanLog.update({
    where: { id: scanId },
    data: {
      status: 'DENIED',
      auditTrail: [...existingTrail, auditEntry] as unknown as Prisma.JsonArray,
    },
  });

  return NextResponse.json({ success: true });
}
