import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const BulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1).max(500),
});

/** POST /api/qrcodes/bulk-delete — soft delete QR codes by ids (org-scoped). */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rl = await checkRateLimit(`qrcodes-bulk-delete:${claims.sub}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many bulk delete requests. Please retry shortly.' },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const parsed = BulkDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const orgId = claims.orgId;
    const now = new Date();
    const ids = Array.from(new Set(parsed.data.ids.map((x) => x.trim()).filter(Boolean)));
    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No ids provided' },
        { status: 400 }
      );
    }

    const result = await prisma.qRCode.updateMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        id: { in: ids },
      },
      data: {
        deletedAt: now,
        isActive: false,
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: claims.sub,
        action: 'QRCODES_BULK_DELETE',
        entityType: 'QRCode',
        metadata: {
          idsCount: ids.length,
          idsSample: ids.slice(0, 50),
          updatedCount: result.count,
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('POST /api/qrcodes/bulk-delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

