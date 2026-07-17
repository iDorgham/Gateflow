import { prisma, Prisma } from '@gate-access/db';

// `i18n-config.ts` declares 'ar-EG', never bare 'ar' — a `=== 'ar'` check is
// always false and silently falls back to English content on Arabic routes.
function isArabic(locale: string): boolean {
  return locale.toLowerCase().startsWith('ar');
}

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
    } satisfies Prisma.LandingPageFindUniqueArgs);

    if (!page || page.status !== 'PUBLISHED') {
      return null;
    }

    const arabic = isArabic(locale);

    return {
      id: page.id,
      slug: page.slug,
      title: arabic ? page.titleAr : page.titleEn,
      status: page.status,
      publishedAt: page.publishedAt,
      sections: page.sections.map((section) => ({
        id: section.id,
        type: section.type,
        order: section.order,
        content: arabic ? section.contentAr : section.contentEn,
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
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
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
        tags: true,
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    const arabic = isArabic(locale);

    return posts.map((p) => ({
      id: p.id,
      slug: arabic ? p.slugAr : p.slugEn,
      title: arabic ? p.titleAr : p.titleEn,
      excerpt: (arabic ? p.excerptAr : p.excerptEn) || '',
      content: (arabic ? p.contentAr : p.contentEn) || '',
      publishedAt: p.publishedAt,
      author: p.author,
      category: p.category
        ? {
            id: p.category.id,
            name: arabic ? p.category.nameAr : p.category.nameEn,
            slug: p.category.slug,
          }
        : null,
      tags: p.tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
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
        tags: true,
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
    } satisfies Prisma.BlogPostFindFirstArgs);

    if (!post) return null;

    const arabic = isArabic(locale);

    return {
      id: post.id,
      slug: arabic ? post.slugAr : post.slugEn,
      title: arabic ? post.titleAr : post.titleEn,
      excerpt: (arabic ? post.excerptAr : post.excerptEn) || '',
      content: (arabic ? post.contentAr : post.contentEn) || '',
      publishedAt: post.publishedAt,
      author: post.author,
      category: post.category
        ? {
            id: post.category.id,
            name: arabic ? post.category.nameAr : post.category.nameEn,
            slug: post.category.slug,
          }
        : null,
      tags: post.tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
    };
  } catch (error) {
    console.error('[CMS_LIB] Error fetching blog post:', error);
    return null;
  }
}
