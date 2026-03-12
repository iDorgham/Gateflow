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
  const plan = url.searchParams.get('plan') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
  const pageSize = Math.min(100, parseInt(url.searchParams.get('pageSize') ?? '25'));

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(plan && ['FREE', 'PRO'].includes(plan) ? { plan: plan as 'FREE' | 'PRO' } : {}),
    ...(status === 'active'
      ? { deletedAt: null }
      : status === 'suspended'
      ? { NOT: { deletedAt: null } }
      : {}),
  };

  const [total, orgs] = await Promise.all([
    prisma.organization.count({ where }),
    prisma.organization.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        deletedAt: true,
        createdAt: true,
        _count: { select: { users: true, qrCodes: true, gates: true } },
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: orgs.map((o) => ({ ...o, deletedAt: o.deletedAt?.toISOString() ?? null, createdAt: o.createdAt.toISOString() })),
    total,
    page,
    pageSize,
  });
}
