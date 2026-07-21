import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function GET(req: Request) {
  const denied = await requireAdminApi(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');

  if (!orgId) {
    return NextResponse.json(
      { error: 'orgId query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: { organizationId: orgId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ contacts: contacts || [] });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
