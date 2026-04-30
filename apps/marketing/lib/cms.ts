import { prisma } from '@gate-access/db';

export interface LandingPageData {
  id: string;
  slug: string;
  title: string;
  status: string;
  publishedAt: Date | null;
  sections: Array<{
    id: string;
    type: string;
    order: number;
    content: any;
  }>;
}

/**
 * Fetches a published landing page from the shared database.
 * Used for ISR rendering in apps/marketing.
 */
export async function getLandingPage(
  slug: string,
  locale: string
): Promise<LandingPageData | null> {
  try {
    const page = await prisma.landingPage.findUnique({
      where: { slug },
      include: {
        sections: {
          where: {
            // In production, we might want to ensure only sections with
            // approved AI assets are shown, but here we assume the
            // 'PUBLISHED' status on the page is the source of truth.
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page || page.status !== 'PUBLISHED') {
      return null;
    }

    return {
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
  } catch (error) {
    console.error('[CMS_LIB] Error fetching page:', error);
    return null;
  }
}
