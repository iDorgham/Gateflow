import { type NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Organization Branding API
 *
 * Manages theme overrides and visual identity for a specific organization.
 * Supports GET (retrieve), PATCH (update), and versioned snapshots.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orgId } = params;

    const branding = await prisma.organizationBranding.findUnique({
      where: { organizationId: orgId },
      include: {
        organization: {
          select: { name: true },
        },
      },
    });

    const snapshots = await prisma.brandingSnapshot.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ branding, snapshots });
  } catch (error) {
    console.error('[BRANDING_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orgId } = params;
    const body = await request.json();
    const { tokenOverrides, fontFamily, fontFamilyArabic, logoUrl } = body;

    // 1. Get current branding to create snapshot
    const current = await prisma.organizationBranding.findUnique({
      where: { organizationId: orgId },
    });

    // 2. Perform update and snapshot creation in a transaction
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      // Create snapshot if current branding exists
      if (current) {
        await tx.brandingSnapshot.create({
          data: {
            organizationId: orgId,
            version: current.version,
            tokenOverrides: current.tokenOverrides || {},
            fontFamily: current.fontFamily,
            fontFamilyArabic: current.fontFamilyArabic,
            logoUrl: current.logoUrl,
            createdById: 'system', // Should be session user ID
          },
        });
      }

      // Upsert branding
      return tx.organizationBranding.upsert({
        where: { organizationId: orgId },
        update: {
          tokenOverrides: tokenOverrides || {},
          fontFamily,
          fontFamilyArabic,
          logoUrl,
          version: { increment: 1 },
        },
        create: {
          organizationId: orgId,
          tokenOverrides: tokenOverrides || {},
          fontFamily,
          fontFamilyArabic,
          logoUrl,
          version: 1,
        },
      });
    });

    // 3. Log the action
    await prisma.aiActionLog.create({
      data: {
        organizationId: orgId,
        action: 'BRANDING_UPDATED',
        prompt: `Branding updated to version ${result.version}`,
        result: JSON.stringify(result),
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[BRANDING_PATCH_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
