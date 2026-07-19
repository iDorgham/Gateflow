import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import type { LandingPage, LandingPageSection } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Headless CMS Page API
 * GET /api/cms/pages/[slug] - Fetch page content for apps/marketing
 * PATCH /api/cms/pages/[slug] - Update page status (PUBLISH/DRAFT)
 */
export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const { slug } = params;
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') || 'en';

  try {
    const page = (await prisma.landingPage.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })) as (LandingPage & { sections: LandingPageSection[] }) | null;

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Transform content based on locale
    const localizedSections = page.sections.map((s: LandingPageSection) => ({
      id: s.id,
      type: s.type,
      content: locale === 'ar' ? s.contentAr : s.contentEn,
    }));

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        slug: page.slug,
        title: locale === 'ar' ? page.titleAr : page.titleEn,
        description: locale === 'ar' ? page.descriptionAr : page.descriptionEn,
        sections: localizedSections,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { slug } = params;
  const body = await req.json();

  try {
    const updatedPage = await prisma.landingPage.update({
      where: { slug },
      data: {
        status: body.status,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : undefined,
      },
    });

    // Trigger AI Action Log — skip for global (org-less) pages since AiActionLog.organizationId
    // is a required FK and no 'GLOBAL' Organization row exists to satisfy it.
    if (updatedPage.organizationId) {
      await prisma.aiActionLog.create({
        data: {
          organizationId: updatedPage.organizationId,
          actionType: 'CMS_PAGE_PUBLISHED',
          status: 'CONFIRMED',
          prompt: `Publish request for slug: ${slug}`,
          result: `New status: ${updatedPage.status}`,
          metadata: JSON.stringify({ pageId: updatedPage.id }),
        },
      });
    }

    return NextResponse.json({ success: true, page: updatedPage });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
