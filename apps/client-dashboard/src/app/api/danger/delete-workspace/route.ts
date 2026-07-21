import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { withApiGuards, isGuardError } from '@/lib/api-guards';

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
  const guarded = await withApiGuards(request, {
    permission: 'workspace:manage',
    schema: DeleteSchema,
    rateLimit: { key: 'danger:delete-workspace', limit: 5, windowMs: 60_000 },
  });
  if (isGuardError(guarded)) return guarded;

  const { claims, orgId, data: parsed } = guarded;

  const org = await prisma.organization.findFirst({
    where: { id: orgId, deletedAt: null },
    select: { id: true, name: true },
  });

  if (!org) {
    return NextResponse.json(
      { error: 'Organization not found' },
      { status: 404 }
    );
  }

  if (parsed.orgNameConfirmation !== org.name) {
    return NextResponse.json(
      { error: 'Organization name does not match. Please type it exactly.' },
      { status: 422 }
    );
  }

  // Audit log BEFORE deletion
  await prisma.auditLog.create({
    data: {
      action: 'WORKSPACE_DELETION_INITIATED',
      entityType: 'Organization',
      entityId: orgId,
      organizationId: orgId,
      userId: claims.sub,
      metadata: { orgName: org.name, initiatedAt: new Date().toISOString() },
    },
  });

  // Soft-delete: mark organization as deleted
  await prisma.organization.update({
    where: { id: orgId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({
    success: true,
    message: 'Workspace scheduled for deletion.',
  });
}
