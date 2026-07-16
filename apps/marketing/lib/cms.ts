import { prisma, Prisma } from '@gate-access/db';

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
      sections: page.sections.map((section: any) => ({
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

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: Date | null;
  author: {
    name: string;
    avatarUrl: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

/**
 * Fetches published blog posts.
 */
export async function getBlogPosts(
  locale: string,
  limit = 10
): Promise<BlogPostData[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return posts.map((p: any) => ({
      id: p.id,
      slug: locale === 'ar' ? p.slugAr : p.slugEn,
      title: locale === 'ar' ? p.titleAr : p.titleEn,
      excerpt: (locale === 'ar' ? p.excerptAr : p.excerptEn) || '',
      content: (locale === 'ar' ? p.contentAr : p.contentEn) || '',
      publishedAt: p.publishedAt,
      author: p.author,
      category: p.category
        ? {
            id: p.category.id,
            name: locale === 'ar' ? p.category.nameAr : p.category.nameEn,
            slug: p.category.slug,
          }
        : null,
    }));
  } catch (error) {
    console.error('[CMS_LIB] Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetches a single published blog post by slug.
 */
export async function getBlogPost(
  slug: string,
  locale: string
): Promise<BlogPostData | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [{ slugEn: slug }, { slugAr: slug }],
        status: 'PUBLISHED',
      },
      include: {
        category: true,
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
    } satisfies Prisma.BlogPostFindFirstArgs);

    if (!post) return null;

    return {
      id: post.id,
      slug: locale === 'ar' ? post.slugAr : post.slugEn,
      title: locale === 'ar' ? post.titleAr : post.titleEn,
      excerpt: (locale === 'ar' ? post.excerptAr : post.excerptEn) || '',
      content: (locale === 'ar' ? post.contentAr : post.contentEn) || '',
      publishedAt: post.publishedAt,
      author: post.author,
      category: post.category
        ? {
            id: post.category.id,
            name: locale === 'ar' ? post.category.nameAr : post.category.nameEn,
            slug: post.category.slug,
          }
        : null,
    };
  } catch (error) {
    console.error('[CMS_LIB] Error fetching blog post:', error);
    return null;
  }
}
