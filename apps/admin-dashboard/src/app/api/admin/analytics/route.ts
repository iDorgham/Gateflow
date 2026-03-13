import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);

  // 14-day scan trend
  const scanTrend = await Promise.all(
    Array.from({ length: 14 }, async (_, i) => {
      const day = new Date(now);
      day.setDate(day.getDate() - 13 + i);
      day.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      const count = await prisma.scanLog.count({ where: { scannedAt: { gte: day, lte: dayEnd } } });
      return { label: day.toLocaleDateString('en', { month: 'short', day: 'numeric' }), count };
    })
  );

  // Org growth (last 30 days)
  const orgsAll = await prisma.organization.findMany({ select: { createdAt: true }, orderBy: { createdAt: 'asc' } });
  const orgGrowth = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - 29 + i);
    day.setHours(23, 59, 59, 999);
    const total = orgsAll.filter((o) => o.createdAt <= day).length;
    return { label: day.toLocaleDateString('en', { month: 'short', day: 'numeric' }), total };
  });

  // Plan distribution
  const planGroups = await prisma.organization.groupBy({
    by: ['plan'],
    where: { deletedAt: null },
    _count: { id: true },
  });
  const planDistribution = planGroups.map((g) => ({ plan: g.plan, count: g._count.id }));

  // Top orgs by scan volume (7d)
  const recentGateScans = await prisma.scanLog.groupBy({
    by: ['gateId'],
    where: { scannedAt: { gte: sevenDaysAgo } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 50,
  });
  const gateIds = recentGateScans.map((g) => g.gateId);
  const gates = await prisma.gate.findMany({
    where: { id: { in: gateIds } },
    select: { id: true, organizationId: true, organization: { select: { name: true } } },
  });
  const orgScanAgg = new Map<string, { name: string; scans: number }>();
  for (const gs of recentGateScans) {
    const gate = gates.find((g) => g.id === gs.gateId);
    if (!gate) continue;
    const ex = orgScanAgg.get(gate.organizationId);
    if (ex) { ex.scans += gs._count.id; }
    else { orgScanAgg.set(gate.organizationId, { name: gate.organization.name, scans: gs._count.id }); }
  }
  const topOrgs = Array.from(orgScanAgg.values()).sort((a, b) => b.scans - a.scans).slice(0, 10);

  return NextResponse.json({ success: true, scanTrend, orgGrowth, planDistribution, topOrgs });
}
