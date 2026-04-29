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
    const { titleEn, titleAr, slug, sections } = await req.json();

    // Transaction to create page and sections
    const result = await prisma.landingPage.create({
      data: {
        organizationId: orgId,
        titleEn,
        titleAr,
        slug,
        createdById: 'SYSTEM', // TODO: Get actual user ID
        sections: {
          create: sections.map((section: any, idx: number) => ({
            type: section.type,
            order: idx,
            contentEn: section.contentEn,
            contentAr: section.contentAr,
            aiGenerated: true
          }))
        }
      },
      include: {
        sections: true
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[CMS_PAGE_SAVE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
