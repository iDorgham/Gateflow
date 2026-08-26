import { NextRequest, NextResponse } from 'next/server';
import { prisma, verifyAuditLedgerIntegrity } from '@gate-access/db';
import { withApiGuards, isGuardError } from '@/lib/api-guards';

export const dynamic = 'force-dynamic';

/**
 * GET /api/security/audit-integrity
 * Evaluates cryptographic SHA-256 hash-chain integrity of the organization's audit log ledger.
 */
export async function GET(request: NextRequest) {
  const guarded = await withApiGuards(request, {
    permission: 'workspace:manage',
    rateLimit: { key: 'security:audit-integrity', limit: 30, windowMs: 60_000 },
  });
  if (isGuardError(guarded)) return guarded;

  const { orgId } = guarded;

  try {
    const result = await verifyAuditLedgerIntegrity(prisma, orgId);
    return NextResponse.json({
      success: true,
      integrity: result,
    });
  } catch (error) {
    console.error('[AuditIntegrity] Verification failed:', error);
    return NextResponse.json(
      { error: 'Failed to verify audit ledger integrity' },
      { status: 500 }
    );
  }
}
