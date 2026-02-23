import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';


const ALL_EVENTS = [
  'QR_CREATED',
  'QR_SCANNED',
  'QR_REVOKED',
  'QR_EXPIRED',
  'SCAN_SUCCESS',
  'SCAN_FAILED',
] as const;

const UpdateWebhookSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.enum(ALL_EVENTS)).min(1).optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = { params: { id: string } };

// ─── PATCH /api/webhooks/[id] ─────────────────────────────────────────────────

export async function PATCH(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const validation = UpdateWebhookSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.webhook.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Webhook not found' }, { status: 404 });
    }

    const updated = await prisma.webhook.update({
      where: { id: params.id },
      data: validation.data,
      select: { id: true, url: true, events: true, isActive: true },
    });

    revalidatePath('/dashboard/settings');
    return NextResponse.json({ success: true, data: updated });

  } catch (err) {
    console.error('PATCH /api/webhooks/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/webhooks/[id] ────────────────────────────────────────────────

export async function DELETE(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.webhook.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Webhook not found' }, { status: 404 });
    }

    await prisma.webhook.update({
      where: { id: params.id },
      data: { deletedAt: new Date(), isActive: false },
    });

    revalidatePath('/dashboard/settings');
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('DELETE /api/webhooks/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
