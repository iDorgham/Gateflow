import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Organization Branding API
 * GET /api/branding/[orgId] - Get current branding and snapshots
 * PATCH /api/branding/[orgId] - Update branding (versioned)
 */
export async function GET(
  req: Request,
  props: { params: Promise<{ orgId: string }> }
) {
  const params = await props.params;
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { orgId } = params;

  try {
    const branding = await (prisma as any).organizationBranding.findUnique({
      where: { organizationId: orgId },
    });

    const snapshots = await (prisma as any).brandingSnapshot.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ success: true, branding, snapshots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ orgId: string }> }
) {
  const params = await props.params;
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { orgId } = params;
  const body = await req.json();

  try {
    // 1. Current state for snapshot
    const current = await (prisma as any).organizationBranding.findUnique({
      where: { organizationId: orgId },
    });

    if (current) {
      // Create Snapshot before update
      await (prisma as any).brandingSnapshot.create({
        data: {
          organizationId: orgId,
          version: current.version,
          tokenOverrides: current.tokenOverrides,
          fontFamily: current.fontFamily,
          fontFamilyArabic: current.fontFamilyArabic,
          logoUrl: current.logoUrl,
          createdById: 'SYSTEM', // In a real app, track the session user
        },
      });
    }

    // 2. Update/Create branding
    const updatedBranding = await (prisma as any).organizationBranding.upsert({
      where: { organizationId: orgId },
      update: {
        tokenOverrides: body.tokens,
        fontFamily: body.fontFamily,
        fontFamilyArabic: body.fontFamilyArabic,
        logoUrl: body.logoUrl,
        version: { increment: 1 },
      },
      create: {
        organizationId: orgId,
        tokenOverrides: body.tokens || {},
        fontFamily: body.fontFamily,
        fontFamilyArabic: body.fontFamilyArabic,
        logoUrl: body.logoUrl,
        version: 1,
      },
    });

    // 3. Log AI Action
    await (prisma as any).aiActionLog.create({
      data: {
        organizationId: orgId,
        action: 'BRANDING_UPDATED',
        status: 'CONFIRMED',
        prompt: `Branding update for org ${orgId}`,
        result: `New version: ${updatedBranding.version}`,
        metadata: JSON.stringify({ brandingId: updatedBranding.id }),
      },
    });

    return NextResponse.json({ success: true, branding: updatedBranding });
  } catch (error) {
    console.error('[BRANDING_PATCH_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to update branding' },
      { status: 500 }
    );
  }
}
