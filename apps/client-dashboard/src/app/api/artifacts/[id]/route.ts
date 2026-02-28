/**
 * GET /api/artifacts/[id] — Retrieve artifact by ID.
 * Org-scoped: only returns artifact if it belongs to the authenticated org.
 * Cross-org access denied.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const ARTIFACT_PERMISSION: Permission = 'gates:manage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, ARTIFACT_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid artifact ID' }, { status: 400 });
    }

    const attachment = await prisma.scanAttachment.findFirst({
      where: { id, organizationId: claims.orgId },
      select: {
        id: true,
        type: true,
        contentBase64: true,
        scanLogId: true,
        incidentId: true,
        createdAt: true,
      },
    });

    if (!attachment) {
      return NextResponse.json({ success: false, message: 'Artifact not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: attachment.id,
        type: attachment.type,
        contentBase64: attachment.contentBase64,
        scanLogId: attachment.scanLogId,
        incidentId: attachment.incidentId,
        createdAt: attachment.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('GET /api/artifacts/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
