import { NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';

// ─── GET /api/notifications/expired-qrs ──────────────────────────────────────
// Returns recently-expired QR codes for the current project (max 10).

export async function GET(): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const projectId = await getValidatedProjectId(claims.orgId);

    const expired = await prisma.qRCode.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
        isActive: true,
        expiresAt: { lte: new Date() },
        ...(projectId ? { projectId } : {}),
      },
      select: {
        id: true,
        code: true,
        expiresAt: true,
        gate: { select: { name: true } },
        project: { select: { name: true } },
      },
      orderBy: { expiresAt: 'desc' },
      take: 10,
    });

    const items = expired.map((qr) => ({
      id: qr.id,
      code: qr.code,
      expiresAt: qr.expiresAt!.toISOString(),
      gateName: qr.gate?.name ?? null,
      projectName: qr.project?.name ?? null,
    }));

    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('GET /api/notifications/expired-qrs error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
