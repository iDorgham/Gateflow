import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

// Plan prices (placeholder values — TODO: Replace with real Stripe data via API)
const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  PRO: 49,
  ENTERPRISE: 499,
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [planGroups, orgsWithPlans] = await Promise.all([
    prisma.organization.groupBy({
      by: ['plan'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.organization.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        plan: true,
        createdAt: true,
        _count: { select: { users: true } },
      },
    }),
  ]);

  // Scans this month per org
  const scansByGate = await prisma.scanLog.groupBy({
    by: ['gateId'],
    where: { scannedAt: { gte: monthStart } },
    _count: true,
  });
  const gateIds = scansByGate.map((s) => s.gateId);
  const gates = await prisma.gate.findMany({
    where: { id: { in: gateIds } },
    select: { id: true, organizationId: true },
  });
  const gateOrgMap = new Map(gates.map((g) => [g.id, g.organizationId]));
  const orgScanMap = new Map<string, number>();
  for (const s of scansByGate) {
    const orgId = gateOrgMap.get(s.gateId);
    if (orgId) orgScanMap.set(orgId, (orgScanMap.get(orgId) ?? 0) + s._count);
  }

  const planCounts: Record<string, number> = {};
  for (const g of planGroups) {
    planCounts[g.plan] = g._count.id;
  }

  const mrr = Object.entries(planCounts).reduce((sum, [plan, count]) => {
    return sum + (PLAN_PRICES[plan] ?? 0) * count;
  }, 0);

  return NextResponse.json({
    success: true,
    data: {
      planCounts,
      mrr,
      planPrices: PLAN_PRICES,
      orgsWithPlans: orgsWithPlans.map((o) => ({
        id: o.id,
        name: o.name,
        plan: o.plan,
        userCount: o._count.users,
        scansThisMonth: orgScanMap.get(o.id) ?? 0,
        createdAt: o.createdAt.toISOString(),
        mrr: PLAN_PRICES[o.plan] ?? 0,
      })),
    },
  });
}
