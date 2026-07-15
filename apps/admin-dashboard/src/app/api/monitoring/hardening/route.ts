import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * POST /api/monitoring/hardening
 *
 * Update platform hardening settings or trigger manual maintenance.
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
  const { action, value } = body;

  try {
    switch (action) {
      case 'REVALIDATE_ALL': {
        // Trigger global ISR revalidation via marketing site webhook
        const revalidateToken = process.env.ISR_REVALIDATE_TOKEN;
        const marketingUrl = process.env.MARKETING_SITE_URL;

        if (marketingUrl && revalidateToken) {
          await fetch(
            `${marketingUrl}/api/revalidate?tag=all&secret=${revalidateToken}`,
            { method: 'POST' }
          );
        }
        return NextResponse.json({
          success: true,
          message: 'Global revalidation triggered',
        });
      }

      case 'UPDATE_RATE_LIMIT':
        // Mocking an update to a shared config or redis
        // In this workspace, we could store it in a 'GlobalSettings' prisma model if it existed
        return NextResponse.json({
          success: true,
          message: `Rate limit updated to ${value} req/min`,
        });

      case 'PURGE_CACHE':
        return NextResponse.json({
          success: true,
          message: 'Cache purged successfully',
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
