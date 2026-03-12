import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.trim() || undefined;
  const role = url.searchParams.get('role') || undefined;
  const orgId = url.searchParams.get('orgId') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
  const pageSize = Math.min(100, parseInt(url.searchParams.get('pageSize') ?? '50'));

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(role ? { role: { name: role } } : {}),
    ...(orgId ? { organizationId: orgId } : {}),
    ...(status === 'active'
      ? { deletedAt: null }
      : status === 'suspended'
      ? { NOT: { deletedAt: null } }
      : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        deletedAt: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
        organization: { select: { id: true, name: true, plan: true } },
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: users.map((u) => ({
      ...u,
      deletedAt: u.deletedAt?.toISOString() ?? null,
      createdAt: u.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
  });
}
