/**
 * GET /api/analytics/quota
 * Resident quota usage by unit type.
 * Stub: returns empty array until quota tracking is implemented.
 * Query: dateFrom, dateTo, projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { AnalyticsQuerySchema, validateAnalyticsQuery } from '@/lib/analytics/analytics-query';
import type { QuotaUsageRow } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = AnalyticsQuerySchema.safeParse({
      dateFrom: searchParams.get('dateFrom') ?? '',
      dateTo: searchParams.get('dateTo') ?? '',
      projectId: searchParams.get('projectId') ?? '',
      gateId: searchParams.get('gateId') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const validation = await validateAnalyticsQuery(claims.orgId, parsed.data);
    if (!validation.ok) {
      return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
    }

    // Stub: quota usage tracking not yet implemented
    const data: QuotaUsageRow[] = [];

    return NextResponse.json({
      success: true,
      data,
      message: 'Quota usage data not yet available',
    });
  } catch (error) {
    console.error('GET /api/analytics/quota error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
