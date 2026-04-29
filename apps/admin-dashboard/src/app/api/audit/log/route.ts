import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, entityType, entityId, metadata } = await req.json();

    // 1. Mock Audit Logging
    // In production, this would write to the Prisma auditLog model
    console.log(
      `[AUDIT_LOG] Admin performed ${action} on ${entityType}:${entityId}`,
      metadata
    );

    return NextResponse.json({
      success: true,
      logId: `log-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AUDIT_LOG_API]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
