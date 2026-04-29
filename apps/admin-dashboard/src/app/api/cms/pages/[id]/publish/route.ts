import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const page = await prisma.landingPage.update({
      where: { id },
      data: { 
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    // ISR Revalidation Trigger
    const marketingUrl = process.env.MARKETING_SITE_URL;
    const revalidateSecret = process.env.MARKETING_SITE_REVALIDATE_SECRET;

    if (marketingUrl && revalidateSecret) {
      try {
        await fetch(`${marketingUrl}/api/revalidate?secret=${revalidateSecret}&slug=${page.slug}`, {
          method: 'POST'
        });
      } catch (err) {
        console.warn('[ISR_REVALIDATE_FAILED]', err);
      }
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('[CMS_PAGE_PUBLISH_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
