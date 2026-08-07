import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

const AuditLogBodySchema = z.object({
  organizationId: z.string().min(1),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().optional(),
  userId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = AuditLogBodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { organizationId, action, entityType, entityId, userId, metadata } =
      parsed.data;

    const log = await prisma.auditLog.create({
      data: {
        organizationId,
        action,
        entityType,
        entityId,
        userId,
        metadata: metadata ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      logId: log.id,
      timestamp: log.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('[AUDIT_LOG_API]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
