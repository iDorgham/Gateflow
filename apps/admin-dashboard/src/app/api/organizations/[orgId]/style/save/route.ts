import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ orgId: string }> }
) {
  const params = await props.params;
  const { orgId } = params;

  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { variables } = await req.json();

    // 1. Transaction to update branding token overrides and create a versioned snapshot
    const result = await prisma.$transaction(async (tx) => {
      const current = await (tx as any).organizationBranding.findUnique({
        where: { organizationId: orgId },
      });

      const tokenOverrides = {
        ...((current?.tokenOverrides as Record<string, string>) ?? {}),
      };
      for (const v of variables) {
        tokenOverrides[v.key] = v.value;
      }

      if (current) {
        // Snapshot the pre-update state
        await (tx as any).brandingSnapshot.create({
          data: {
            organizationId: orgId,
            version: current.version,
            tokenOverrides: current.tokenOverrides,
            fontFamily: current.fontFamily,
            fontFamilyArabic: current.fontFamilyArabic,
            logoUrl: current.logoUrl,
            createdById: 'SYSTEM', // TODO: Get actual user ID
          },
        });
      }

      const branding = await (tx as any).organizationBranding.upsert({
        where: { organizationId: orgId },
        update: {
          tokenOverrides,
          version: { increment: 1 },
        },
        create: {
          organizationId: orgId,
          tokenOverrides,
          version: 1,
        },
      });

      return branding;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[STYLE_SAVE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
