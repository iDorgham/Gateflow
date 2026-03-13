import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      deletedAt: true,
      createdAt: true,
      _count: { select: { users: true, qrCodes: true, gates: true } },
    },
  });

  if (!org) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  // Scans this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [scansTotal, scansThisMonth] = await Promise.all([
    prisma.scanLog.count({
      where: { qrCode: { organizationId: org.id } },
    }),
    prisma.scanLog.count({
      where: {
        qrCode: { organizationId: org.id },
        scannedAt: { gte: monthStart },
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      ...org,
      deletedAt: org.deletedAt?.toISOString() ?? null,
      createdAt: org.createdAt.toISOString(),
      scansTotal,
      scansThisMonth,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const { action, plan } = body as { action?: string; plan?: string };

  const org = await prisma.organization.findUnique({ where: { id: params.id } });
  if (!org) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  if (action === 'suspend') {
    await prisma.organization.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ success: true, action: 'suspended' });
  }

  if (action === 'restore') {
    await prisma.organization.update({
      where: { id: params.id },
      data: { deletedAt: null },
    });
    return NextResponse.json({ success: true, action: 'restored' });
  }

  if (plan && ['FREE', 'PRO'].includes(plan)) {
    await prisma.organization.update({
      where: { id: params.id },
      data: { plan: plan as 'FREE' | 'PRO' },
    });
    return NextResponse.json({ success: true, action: 'plan_changed', plan });
  }

  return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
}
