import { NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { z } from 'zod';

/**
 * GateAI Operations Hub - Automations API
 * Security: Contract §1 (Multi-tenancy), §4 (Auth), §5 (Input validation)
 */

const automationSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['REPORT', 'EXPORT']),
  trigger: z.literal('CRON'),
  schedule: z.string().min(1), // Cron or NLP string
  action: z.record(z.any()),   // Action metadata
});

export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const automations = await prisma.aiAutomation.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ automations });
  } catch (error) {
    console.error('[Automations GET Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const claims = await getSessionClaims();
  if (!claims?.orgId || !claims?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Security: Only MANAGER or ADMIN can create automations
  const role = claims.role || 'USER';
  if (role !== 'ADMIN' && role !== 'TENANT_ADMIN' && role !== 'MANAGER') {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = automationSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const automation = await prisma.aiAutomation.create({
      data: {
        ...result.data,
        organization: { connect: { id: claims.orgId } }, // Reverted to original correct syntax
        user: { connect: { id: claims.sub } },
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ automation }, { status: 201 });
  } catch (error) {
    console.error('[Automations POST Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Security: Only MANAGER or ADMIN can delete
  const role = claims.role || 'USER';
  if (role !== 'ADMIN' && role !== 'TENANT_ADMIN' && role !== 'MANAGER') {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing automation ID' }, { status: 400 });
    }

    // Soft delete with strict org scoping (Contract §1)
    await prisma.aiAutomation.update({
      where: {
        id,
        organizationId: claims.orgId,
      },
      data: {
        deletedAt: new Date(),
        status: 'PAUSED', // Stop execution
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }
    console.error('[Automations DELETE Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
