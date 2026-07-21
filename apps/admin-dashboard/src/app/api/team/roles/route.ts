import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function GET(req: Request) {
  const denied = await requireAdminApi(req);
  if (denied) return denied;

  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ roles: roles || [] });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
