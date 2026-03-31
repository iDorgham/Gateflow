import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';

export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = (claims.org as string) || (claims.orgId as string);
  if (!organizationId) {
    return NextResponse.json({ success: false, error: 'Organization missing' }, { status: 400 });
  }

  const body = await request.json();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const upstream = await fetch(`${apiBase}/resident/push/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-organization-id': organizationId,
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
  });
}
