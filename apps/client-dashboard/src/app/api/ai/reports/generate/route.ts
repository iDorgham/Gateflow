import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/dashboard-auth';
import { AnalyticsQuerySchema } from '@/lib/analytics/analytics-query';

// This is a unified endpoint for AI-requested reports.
// It can handle both PDF and CSV by proxying or sharing logic.
// For now, we reuse the existing export routes but this acts as the "official" AI report gate.

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'pdf'; // pdf or csv

    // Validate parameters
    const parsed = AnalyticsQuerySchema.safeParse({
      dateFrom: searchParams.get('dateFrom') ?? '',
      dateTo: searchParams.get('dateTo') ?? '',
      projectId: searchParams.get('projectId') ?? '',
      gateId: searchParams.get('gateId') ?? '',
      unitType: searchParams.get('unitType') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid report parameters' }, { status: 400 });
    }

    // Proxy to the specialized endpoints
    const baseUrl = new URL(request.url).origin;
    const targetPath = type === 'pdf' ? '/api/analytics/export-pdf' : '/api/analytics/export';
    const targetUrl = new URL(targetPath, baseUrl);
    
    // Copy all params
    searchParams.forEach((value, key) => {
      if (key !== 'type') targetUrl.searchParams.set(key, value);
    });

    // Fetch the report from the specialized endpoint
    // We pass the session cookies to maintain auth
    const response = await fetch(targetUrl.toString(), {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return new Response(errorMsg, { status: response.status });
    }

    const blob = await response.blob();
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('Content-Disposition') || '';

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && (error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('AI Report Gen Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
