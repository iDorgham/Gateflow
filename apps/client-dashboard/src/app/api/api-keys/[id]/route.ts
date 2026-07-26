import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';

type RouteContext = { params: Promise<{ id: string }> };

// ─── DELETE /api/api-keys/[id] ────────────────────────────────────────────────
// Revokes the credential while preserving non-secret audit history.

export async function DELETE(
  _request: NextRequest,
  props: RouteContext
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    if (!claims.permissions?.['workspace:manage']) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const revoked = await prisma.$transaction(async (tx) => {
      const existing = await tx.apiKey.findFirst({
        where: { id: params.id, organizationId: claims.orgId },
        select: {
          id: true,
          name: true,
          keyPrefix: true,
          scopes: true,
          lastUsedAt: true,
          expiresAt: true,
          createdAt: true,
          createdBy: true,
        },
      });
      if (!existing) return false;

      await tx.auditLog.create({
        data: {
          action: 'API_KEY_REVOKED',
          entityType: 'ApiKey',
          entityId: existing.id,
          organizationId: claims.orgId,
          userId: claims.sub,
          metadata: {
            createdAt: existing.createdAt.toISOString(),
            createdBy: existing.createdBy,
            expiresAt: existing.expiresAt?.toISOString() ?? null,
            keyPrefix: existing.keyPrefix,
            lastUsedAt: existing.lastUsedAt?.toISOString() ?? null,
            name: existing.name,
            scopes: existing.scopes,
          },
        },
      });
      await tx.apiKey.delete({ where: { id: existing.id } });
      return true;
    });

    if (!revoked) {
      return NextResponse.json(
        { success: false, message: 'API key not found' },
        { status: 404 }
      );
    }

    revalidatePath('/dashboard/settings');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/api-keys/[id] error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
