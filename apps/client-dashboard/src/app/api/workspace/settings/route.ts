import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

const SettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  domain: z.string().max(100).nullable().optional(),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = SettingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, domain } = validation.data;

    const org = await prisma.organization.findUnique({
      where: { id: claims.orgId },
    });

    if (!org || org.deletedAt) {
      return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
    }

    const updated = await prisma.organization.update({
      where: { id: claims.orgId },
      data: {
        name,
        email,
        domain: domain || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        domain: true,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/workspace/settings error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
