import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

/**
 * POST /api/cms/pages/[slug]/publish
 * Publishes a landing page by id or slug (same dynamic segment as GET/PATCH).
 */
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const { slug: idOrSlug } = params;

  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.landingPage.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const page = await prisma.landingPage.update({
      where: { id: existing.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // ISR Revalidation Trigger
    const marketingUrl = process.env.MARKETING_SITE_URL;
    const revalidateSecret = process.env.MARKETING_SITE_REVALIDATE_SECRET;

    if (marketingUrl && revalidateSecret) {
      try {
        await fetch(
          `${marketingUrl}/api/revalidate?secret=${revalidateSecret}&slug=${page.slug}`,
          {
            method: 'POST',
          }
        );
      } catch (err) {
        console.warn('[ISR_REVALIDATE_FAILED]', err);
      }
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('[CMS_PAGE_PUBLISH_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
