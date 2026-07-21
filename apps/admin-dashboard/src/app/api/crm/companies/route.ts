import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function GET(req: Request) {
  const denied = await requireAdminApi(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');

  try {
    const companies = await prisma.organization.findMany({
      where: orgId ? { id: orgId, deletedAt: null } : { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ companies: companies || [] });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
