import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * GET /api/cms/pages/[slug]
 *
 * Public endpoint consumed by apps/marketing.
 * Returns the published landing page structure and sections.
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const preview = searchParams.get('preview') === 'true';

  // If preview is requested, require admin authorization
  if (preview) {
    const isAuth = await isAdminAuthorized(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized for preview' },
        { status: 401 }
      );
    }
  }

  const page = await prisma.landingPage.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!page) {
    return NextResponse.json(
      { success: false, message: 'Page not found' },
      { status: 404 }
    );
  }

  // Only show published pages unless in preview mode
  if (page.status !== 'PUBLISHED' && !preview) {
    return NextResponse.json(
      { success: false, message: 'Page is not published' },
      { status: 404 }
    );
  }

  // Transform page data for the consumer
  const response = {
    id: page.id,
    slug: page.slug,
    title: locale === 'ar' ? page.titleAr : page.titleEn,
    status: page.status,
    publishedAt: page.publishedAt,
    sections: page.sections.map((section) => ({
      id: section.id,
      type: section.type,
      order: section.order,
      content: locale === 'ar' ? section.contentAr : section.contentEn,
    })),
  };

  return NextResponse.json(response);
}

/**
 * POST /api/cms/pages/[slug]
 *
 * Admin endpoint to publish/update page status.
 * Triggers ISR revalidation in apps/marketing.
 */
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const isAuth = await isAdminAuthorized(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { slug } = params;
  const body = await request.json();
  const { status } = body;

  if (!['DRAFT', 'IN_REVIEW', 'PUBLISHED'].includes(status)) {
    return NextResponse.json(
      { success: false, message: 'Invalid status' },
      { status: 400 }
    );
  }

  try {
    const page = await prisma.landingPage.update({
      where: { slug },
      data: {
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
    });

    // If published, trigger ISR revalidation in marketing app
    if (status === 'PUBLISHED') {
      try {
        const marketingUrl =
          process.env.MARKETING_SITE_URL || 'https://www.gateflow.site';
        const revalidateToken = process.env.ISR_REVALIDATE_TOKEN;

        if (revalidateToken) {
          // Trigger EN and AR revalidation
          await Promise.all([
            fetch(
              `${marketingUrl}/api/revalidate?tag=landing-page-${slug}&locale=en&secret=${revalidateToken}`
            ),
            fetch(
              `${marketingUrl}/api/revalidate?tag=landing-page-${slug}&locale=ar&secret=${revalidateToken}`
            ),
          ]);
        }
      } catch (e) {
        console.error('[CMS] ISR Revalidation failed:', e);
        // Don't fail the whole request if revalidation fails
      }
    }

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
