import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

/**
 * Headless CMS API - Public (or API-Key protected)
 * Consumed by apps/marketing or partner sites to fetch landing page content.
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const { slug } = params;

  try {
    const page = await prisma.landingPage.findUnique({
      where: {
        slug,
        status: 'PUBLISHED', // Only serve published pages via public API
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        organization: {
          select: {
            name: true,
            branding: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found or not published' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('[CMS_PAGE_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
