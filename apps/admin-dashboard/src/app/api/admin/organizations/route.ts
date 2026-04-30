import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.trim() || undefined;
  const plan = url.searchParams.get('plan') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
  const pageSize = Math.min(
    100,
    parseInt(url.searchParams.get('pageSize') ?? '25')
  );

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(plan && ['FREE', 'PRO'].includes(plan)
      ? { plan: plan as 'FREE' | 'PRO' }
      : {}),
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
    data: orgs.map(
      (o: {
        id: string;
        name: string;
        email: string | null;
        plan: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        _count: { users: number; qrCodes: number; gates: number };
      }) => ({
        ...o,
        deletedAt: o.deletedAt?.toISOString() ?? null,
        createdAt: o.createdAt.toISOString(),
      })
    ),
    total,
    page,
    pageSize,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, plan = 'FREE' } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and Email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.organization.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'An organization with this email already exists',
        },
        { status: 400 }
      );
    }

    const org = await prisma.organization.create({
      data: {
        name,
        email,
        plan: plan as 'FREE' | 'PRO',
        // Default to Real Estate for now
        type: 'REAL_ESTATE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Organization created successfully',
      data: org,
    });
  } catch (error) {
    console.error('[ORG_CREATE_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
