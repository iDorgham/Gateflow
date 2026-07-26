import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

export const dynamic = 'force-dynamic';

const RedactionSchema = z.object({
  confirmation: z.literal('REDACT SCAN METADATA'),
  olderThanDays: z.number().int().min(30).max(3650),
});

const REDACTED_FIELDS = [
  'utmCampaign',
  'utmContent',
  'utmMedium',
  'utmSource',
  'utmTerm',
] as const;

/**
 * POST /api/danger/purge-scans
 *
 * Legacy path retained for compatibility. ScanLog decisions remain append-only;
 * only expired optional marketing-attribution metadata is redacted.
 */
export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admins can apply retention redaction.
  if (
    !claims.permissions?.['workspace:manage'] &&
    !claims.permissions?.['gates:manage']
  ) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = RedactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid request. Type REDACT SCAN METADATA to confirm.',
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parsed.data.olderThanDays);

  const { count } = await prisma.scanLog.updateMany({
    where: {
      gate: { organizationId: claims.orgId },
      scannedAt: { lt: cutoff },
      OR: [
        { utmCampaign: { not: null } },
        { utmContent: { not: null } },
        { utmMedium: { not: null } },
        { utmSource: { not: null } },
        { utmTerm: { not: null } },
      ],
    },
    data: {
      utmCampaign: null,
      utmContent: null,
      utmMedium: null,
      utmSource: null,
      utmTerm: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'SCAN_LOG_METADATA_REDACTED',
      entityType: 'ScanLog',
      organizationId: claims.orgId,
      userId: claims.sub,
      metadata: {
        cutoff: cutoff.toISOString(),
        fields: [...REDACTED_FIELDS],
        olderThanDays: parsed.data.olderThanDays,
        redactedCount: count,
      },
    },
  });

  return NextResponse.json({ success: true, redactedCount: count });
}
