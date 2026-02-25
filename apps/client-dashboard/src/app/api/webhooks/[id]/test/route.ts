import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { testWebhookDelivery } from '@/lib/webhook-delivery';

type RouteContext = { params: { id: string } };
export const dynamic = 'force-dynamic';

// ─── POST /api/webhooks/[id]/test ─────────────────────────────────────────────
// Sends a single test delivery and returns the result synchronously.

export async function POST(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const result = await testWebhookDelivery(params.id, claims.orgId);

    return NextResponse.json({
      success: result.success,
      data: result,
    });
  } catch (err) {
    console.error('POST /api/webhooks/[id]/test error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
