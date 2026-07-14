import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * GET /api/cms/blog
 *
 * List blog posts.
 * Query params:
 * - locale: 'en' | 'ar' (default: 'en')
 * - status: 'DRAFT' | 'PUBLISHED' | ...
 * - orgId: string (optional)
 * - limit: number
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const status = searchParams.get('status');
  const orgId = searchParams.get('orgId');
  const limit = parseInt(searchParams.get('limit') || '10');

  // If status is not PUBLISHED, require admin authorization
  if (status !== 'PUBLISHED') {
    const isAuth = await isAdminAuthorized(request);
    if (!isAuth) {
      // If not auth, we can only return PUBLISHED posts
      const posts = await prisma.blogPost.findMany({
        where: {
          status: 'PUBLISHED',
          organizationId: orgId || null,
        },
        include: {
          categories: true,
          author: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
      });

      return NextResponse.json({
        success: true,
        posts: posts.map((p) => transformPost(p, locale as 'en' | 'ar')),
      });
    }
  }

  // Admin request or authorized list
  const posts = await prisma.blogPost.findMany({
    where: {
      status: status ? (status as any) : undefined,
      organizationId: orgId || undefined,
    },
    include: {
      categories: true,
      author: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return NextResponse.json({
    success: true,
    posts: posts.map((p) => transformPost(p, locale as 'en' | 'ar')),
  });
}

/**
 * POST /api/cms/blog
 *
 * Create a new blog post draft.
 */
export async function POST(request: Request) {
  const isAuth = await isAdminAuthorized(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { titleEn, titleAr, organizationId, authorId } = body;

  if (!titleEn || !titleAr) {
    return NextResponse.json(
      { success: false, message: 'Titles required' },
      { status: 400 }
    );
  }

  // Generate unique slugs
  const baseSlugEn = slugify(titleEn);
  const baseSlugAr = slugify(titleAr);

  // Basic collision avoidance (should be more robust in production)
  const slugEn = `${baseSlugEn}-${Math.random().toString(36).substring(2, 7)}`;
  const slugAr = `${baseSlugAr}-${Math.random().toString(36).substring(2, 7)}`;

  try {
    const post = await prisma.blogPost.create({
      data: {
        titleEn,
        titleAr,
        slugEn,
        slugAr,
        contentEn: '',
        contentAr: '',
        status: 'DRAFT',
        authorId: authorId, // This should come from session usually
        organizationId: organizationId || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

function transformPost(post: any, locale: 'en' | 'ar') {
  return {
    id: post.id,
    title: locale === 'ar' ? post.titleAr : post.titleEn,
    slug: locale === 'ar' ? post.slugAr : post.slugEn,
    excerpt: locale === 'ar' ? post.excerptAr : post.excerptEn,
    content: locale === 'ar' ? post.contentAr : post.contentEn,
    status: post.status,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    author: post.author,
    categories: post.categories.map((c: any) => ({
      id: c.id,
      name: locale === 'ar' ? c.nameAr : c.nameEn,
      slug: c.slug,
    })),
    metaTitle: locale === 'ar' ? post.metaTitleAr : post.metaTitleEn,
    metaDesc: locale === 'ar' ? post.metaDescAr : post.metaDescEn,
  };
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\u0621-\u064A-]+/g, '') // Remove all non-word chars (support Arabic)
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
