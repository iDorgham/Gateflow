import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';


type RouteContext = { params: { id: string } };

// ─── DELETE /api/api-keys/[id] ────────────────────────────────────────────────
// Permanently revokes an API key (hard delete — no keyHash to look up after).

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.apiKey.findFirst({
      where: { id: params.id, organizationId: claims.orgId },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'API key not found' }, { status: 404 });
    }

    await prisma.apiKey.delete({ where: { id: params.id } });

    revalidatePath('/dashboard/settings');
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('DELETE /api/api-keys/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
