import { type NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { InviteService } from '@/lib/crm/invite-service';

/**
 * Trigger an invitation delivery for a contact.
 * POST /api/contacts/[id]/invite
 * Body: { provider: 'WHATSAPP' | 'SMS', locale?: 'ar' | 'en' }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { provider, locale = 'ar' } = body as {
    provider: 'WHATSAPP' | 'SMS';
    locale?: 'ar' | 'en';
  };

  if (!provider) {
    return NextResponse.json({ error: 'Provider required' }, { status: 400 });
  }

  try {
    const result = await InviteService.processInvitation({
      organizationId: claims.orgId,
      userId: claims.sub,
      contactId: id,
      provider,
      locale,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API_CONTACTS_INVITE] Failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
