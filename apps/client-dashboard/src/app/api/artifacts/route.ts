/**
 * Artifacts API: POST to attach ID image to scan or incident.
 * Requires gates:manage. All org-scoped. Cross-org access denied.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const ARTIFACT_PERMISSION: Permission = 'gates:manage';

const ATTACHMENT_TYPES = ['id_front', 'id_back'] as const;

const AttachSchema = z.object({
  scanLogId: z.string().cuid().optional(),
  incidentId: z.string().cuid().optional(),
  type: z.enum(ATTACHMENT_TYPES),
  contentBase64: z.string().min(1).max(5_000_000), // ~3.7MB raw, allow reasonable JPEG
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, ARTIFACT_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const validation = AttachSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request', error: validation.error.flatten() },
        { status: 400 },
      );
    }

    const { scanLogId, incidentId, type, contentBase64 } = validation.data;

    if (!scanLogId && !incidentId) {
      return NextResponse.json(
        { success: false, message: 'Either scanLogId or incidentId is required' },
        { status: 400 },
      );
    }
    if (scanLogId && incidentId) {
      return NextResponse.json(
        { success: false, message: 'Provide only one of scanLogId or incidentId' },
        { status: 400 },
      );
    }

    const orgId = claims.orgId;

    if (scanLogId) {
      const scan = await prisma.scanLog.findFirst({
        where: { id: scanLogId },
        include: { gate: true },
      });
      if (!scan || scan.gate.organizationId !== orgId) {
        return NextResponse.json({ success: false, message: 'Scan not found' }, { status: 404 });
      }
    }

    if (incidentId) {
      const incident = await prisma.incident.findFirst({
        where: { id: incidentId, organizationId: orgId },
      });
      if (!incident) {
        return NextResponse.json({ success: false, message: 'Incident not found' }, { status: 404 });
      }
    }

    const attachment = await prisma.scanAttachment.create({
      data: {
        organizationId: orgId,
        scanLogId: scanLogId ?? null,
        incidentId: incidentId ?? null,
        type,
        contentBase64,
      },
      select: {
        id: true,
        type: true,
        scanLogId: true,
        incidentId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: attachment.id,
          type: attachment.type,
          scanLogId: attachment.scanLogId,
          incidentId: attachment.incidentId,
          createdAt: attachment.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/artifacts error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
