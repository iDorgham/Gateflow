import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

export const dynamic = 'force-dynamic';

const DeleteSchema = z.object({
  /** Must exactly match the organization name */
  orgNameConfirmation: z.string().min(1),
  /** "DELETE WORKSPACE" typed verbatim */
  actionConfirmation: z.literal('DELETE WORKSPACE'),
});

/**
 * POST /api/danger/delete-workspace
 * Soft-deletes the entire organization (sets deletedAt).
 * Requires 2-factor text confirmation: org name + "DELETE WORKSPACE".
 */
export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = DeleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid confirmation', details: parsed.error.flatten() }, { status: 400 });
  }

  const org = await prisma.organization.findFirst({
    where: { id: claims.orgId, deletedAt: null },
    select: { id: true, name: true },
  });

  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  if (parsed.data.orgNameConfirmation !== org.name) {
    return NextResponse.json({ error: 'Organization name does not match. Please type it exactly.' }, { status: 422 });
  }

  // Audit log BEFORE deletion
  await prisma.auditLog.create({
    data: {
      action: 'WORKSPACE_DELETION_INITIATED',
      entityType: 'Organization',
      entityId: claims.orgId,
      organizationId: claims.orgId,
      userId: claims.sub,
      metadata: { orgName: org.name, initiatedAt: new Date().toISOString() },
    },
  });

  // Soft-delete: mark organization as deleted
  await prisma.organization.update({
    where: { id: claims.orgId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true, message: 'Workspace scheduled for deletion.' });
}
