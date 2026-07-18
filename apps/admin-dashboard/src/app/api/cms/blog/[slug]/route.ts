import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import type { BlogPost, BlogCategory, User } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * GET /api/cms/blog/[slug]
 *
 * Get a specific blog post by slug.
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const preview = searchParams.get('preview') === 'true';

  // If preview requested, require admin
  if (preview) {
    const isAuth = await isAdminAuthorized(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized for preview' },
        { status: 401 }
      );
    }
  }

  const post = (await prisma.blogPost.findFirst({
    where: {
      OR: [{ slugEn: slug }, { slugAr: slug }],
    },
    include: {
      category: true,
      author: {
        select: {
          name: true,
          avatarUrl: true,
          bio: true,
        },
      },
    },
  })) as
    | (BlogPost & {
        category: BlogCategory | null;
        author: Pick<User, 'name' | 'avatarUrl' | 'bio'>;
      })
    | null;

  if (!post) {
    return NextResponse.json(
      { success: false, message: 'Post not found' },
      { status: 404 }
    );
  }

  // If not published and not preview, block
  if (post.status !== 'PUBLISHED' && !preview) {
    return NextResponse.json(
      { success: false, message: 'Post not published' },
      { status: 404 }
    );
  }

  const response = {
    id: post.id,
    title: locale === 'ar' ? post.titleAr : post.titleEn,
    slug: locale === 'ar' ? post.slugAr : post.slugEn,
    content: locale === 'ar' ? post.contentAr : post.contentEn,
    excerpt: locale === 'ar' ? post.excerptAr : post.excerptEn,
    status: post.status,
    publishedAt: post.publishedAt,
    author: post.author,
    categories: post.category
      ? [
          {
            id: post.category.id,
            name: locale === 'ar' ? post.category.nameAr : post.category.nameEn,
            slug: post.category.slug,
          },
        ]
      : [],
    meta: {
      title: locale === 'ar' ? post.metaTitleAr : post.metaTitleEn,
      description: locale === 'ar' ? post.metaDescAr : post.metaDescEn,
    },
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/cms/blog/[slug]
 *
 * Update a blog post.
 */
export async function PATCH(
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

  try {
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        OR: [{ slugEn: slug }, { slugAr: slug }],
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: existingPost.id },
      data: {
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        slugEn: body.slugEn,
        slugAr: body.slugAr,
        contentEn: body.contentEn,
        contentAr: body.contentAr,
        excerptEn: body.excerptEn,
        excerptAr: body.excerptAr,
        status: body.status,
        metaTitleEn: body.metaTitleEn,
        metaTitleAr: body.metaTitleAr,
        metaDescEn: body.metaDescEn,
        metaDescAr: body.metaDescAr,
        publishedAt:
          body.status === 'PUBLISHED' && !existingPost.publishedAt
            ? new Date()
            : undefined,
      },
    });

    // If published, trigger ISR revalidation
    if (body.status === 'PUBLISHED') {
      try {
        const marketingUrl =
          process.env.MARKETING_SITE_URL || 'https://www.gateflow.site';
        const revalidateToken = process.env.ISR_REVALIDATE_TOKEN;

        if (revalidateToken) {
          await Promise.all([
            fetch(
              `${marketingUrl}/api/revalidate?tag=blog-post-${updatedPost.slugEn}&locale=en&secret=${revalidateToken}`
            ),
            fetch(
              `${marketingUrl}/api/revalidate?tag=blog-post-${updatedPost.slugAr}&locale=ar&secret=${revalidateToken}`
            ),
            // Revalidate the blog list too
            fetch(
              `${marketingUrl}/api/revalidate?tag=blog-list&locale=en&secret=${revalidateToken}`
            ),
            fetch(
              `${marketingUrl}/api/revalidate?tag=blog-list&locale=ar&secret=${revalidateToken}`
            ),
          ]);
        }
      } catch (e) {
        console.error('[CMS] Blog ISR Revalidation failed:', e);
      }
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/blog/[slug]
 */
export async function DELETE(
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

  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [{ slugEn: slug }, { slugAr: slug }],
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: post.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
