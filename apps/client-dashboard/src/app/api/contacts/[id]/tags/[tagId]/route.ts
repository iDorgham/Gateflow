import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

/** DELETE /api/contacts/[id]/tags/[tagId] — remove tag from contact */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id: contactId, tagId } = await params;
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, organizationId: claims.orgId, deletedAt: null },
  });
  if (!contact) {
    return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
  }

  try {
    await prisma.contactTag.deleteMany({
      where: { contactId, tagId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/contacts/[id]/tags/[tagId] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
