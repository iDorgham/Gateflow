import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import type { BlogPost, BlogCategory, User } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Blog CMS API
 * GET /api/cms/blog - List published posts
 * GET /api/cms/blog?slug=... - Fetch post by slug (EN or AR)
 * POST /api/cms/blog/publish - Publish post
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale') || 'en';

  try {
    if (slug) {
      // Fetch single post by slug (check both EN and AR columns)
      const post = (await prisma.blogPost.findFirst({
        where: {
          OR: [{ slugEn: slug }, { slugAr: slug }],
          status: 'PUBLISHED',
        },
        include: {
          author: { select: { name: true, avatarUrl: true } },
          category: true,
        },
      })) as
        | (BlogPost & {
            author: Pick<User, 'name' | 'avatarUrl'>;
            category: BlogCategory | null;
          })
        | null;

      if (!post)
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });

      // Localize
      return NextResponse.json({
        success: true,
        post: {
          id: post.id,
          title: locale === 'ar' ? post.titleAr : post.titleEn,
          content: locale === 'ar' ? post.contentAr : post.contentEn,
          excerpt: locale === 'ar' ? post.excerptAr : post.excerptEn,
          metaTitle: locale === 'ar' ? post.metaTitleAr : post.metaTitleEn,
          metaDesc: locale === 'ar' ? post.metaDescAr : post.metaDescEn,
          publishedAt: post.publishedAt,
          author: post.author,
          categories: post.category
            ? [
                {
                  name:
                    locale === 'ar'
                      ? post.category.nameAr
                      : post.category.nameEn,
                  slug: post.category.slug,
                },
              ]
            : [],
        },
      });
    }

    // List all published posts
    const posts = (await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { name: true } }, category: true },
    })) as (BlogPost & {
      author: Pick<User, 'name'>;
      category: BlogCategory | null;
    })[];

    const localizedPosts = posts.map((p) => ({
      id: p.id,
      slug: locale === 'ar' ? p.slugAr : p.slugEn,
      title: locale === 'ar' ? p.titleAr : p.titleEn,
      excerpt: locale === 'ar' ? p.excerptAr : p.excerptEn,
      publishedAt: p.publishedAt,
      author: p.author.name,
    }));

    return NextResponse.json({ success: true, posts: localizedPosts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog content' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id, status } = await req.json();

  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
    });

    // Log AI Action — skip for global (org-less) posts since AiActionLog.organizationId
    // is a required FK and no 'GLOBAL' Organization row exists to satisfy it.
    if (updated.organizationId) {
      await prisma.aiActionLog.create({
        data: {
          organizationId: updated.organizationId,
          actionType: 'BLOG_POST_PUBLISHED',
          status: 'CONFIRMED',
          prompt: `Publish request for post ID: ${id}`,
          result: `New status: ${status}`,
          metadata: JSON.stringify({ slug: updated.slugEn }),
        },
      });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Publish failed' }, { status: 500 });
  }
}
