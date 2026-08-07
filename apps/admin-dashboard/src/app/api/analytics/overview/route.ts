import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * GET /api/analytics/overview
 *
 * Get predictive analytics and performance overview.
 */
export async function GET(request: Request) {
  const isAuth = await isAdminAuthorized(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('orgId');

  if (!orgId) {
    return NextResponse.json(
      { success: false, message: 'orgId query parameter is required' },
      { status: 400 }
    );
  }

  try {
    // 1. Scans over time (scoped via gate; exclude soft-deleted scan logs)
    const scans = await prisma.scanLog.findMany({
      where: {
        gate: { organizationId: orgId, deletedAt: null },
        deletedAt: null,
      },
      orderBy: { scannedAt: 'desc' },
      take: 100,
    });

    // 2. Lead Conversion (mocking funnel based on CRM leads)
    const leads = await prisma.lead.count({
      where: { organizationId: orgId, deletedAt: null },
    });
    const opportunities = await prisma.deal.count({
      where: { organizationId: orgId, deletedAt: null },
    });

    // 3. AI Usage (based on logs — AiActionLog has no deletedAt)
    const aiActions = await prisma.aiActionLog.count({
      where: { organizationId: orgId },
    });

    // Mocking a time series for Recharts
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        scans: Math.floor(Math.random() * 50) + 10,
        aiUsage: Math.floor(Math.random() * 20) + 5,
        conversion: (Math.random() * 5 + 2).toFixed(1),
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalScans: scans.length,
        leadCount: leads,
        oppCount: opportunities,
        aiActionCount: aiActions,
        conversionRate:
          leads > 0 ? ((opportunities / leads) * 100).toFixed(1) : 0,
      },
      chartData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
