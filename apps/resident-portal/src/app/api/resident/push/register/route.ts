import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { resolveOrganizationId } from '@/lib/session-claims';
import { resolveResidentApiBase } from '@/lib/api-upstream';

export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const organizationId = resolveOrganizationId(claims);
  if (!organizationId) {
    return NextResponse.json(
      { success: false, error: 'Organization missing' },
      { status: 400 }
    );
  }

  const body = await request.json();
  let apiBase: string;
  try {
    apiBase = resolveResidentApiBase();
  } catch {
    return NextResponse.json(
      { success: false, error: 'API upstream not configured' },
      { status: 503 }
    );
  }

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
    headers: {
      'Content-Type':
        upstream.headers.get('Content-Type') ?? 'application/json',
    },
  });
}
