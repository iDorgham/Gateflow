import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';
import { PageHeader } from '@/components/page-header';
import { RevenueSummaryCards } from '@/components/finance/RevenueSummaryCards';
import { PlanTrendChart } from '@/components/finance/PlanTrendChart';
import { SubscriptionTable } from '@/components/finance/SubscriptionTable';
import { BillingPlaceholder } from '@/components/finance/BillingPlaceholder';

export const metadata = { title: 'Finance' };

const PLAN_PRICES: Record<string, number> = { FREE: 0, PRO: 99 };

export default async function FinancePage({ params: { locale } }: { params: { locale: Locale } }) {
  await requireAdmin();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [planGroups, orgs] = await Promise.all([
    prisma.organization.groupBy({
      by: ['plan'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.organization.findMany({
      where: { deletedAt: null },
      orderBy: [{ plan: 'desc' }, { createdAt: 'desc' }],
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
  for (const g of planGroups) planCounts[g.plan] = g._count.id;

  const mrr = Object.entries(planCounts).reduce((sum, [plan, count]) => sum + (PLAN_PRICES[plan] ?? 0) * count, 0);
  const planChartData = ['FREE', 'PRO'].map((plan) => ({ plan, count: planCounts[plan] ?? 0 }));

  const orgRows = orgs.map((o) => ({
    id: o.id,
    name: o.name,
    plan: o.plan,
    userCount: o._count.users,
    scansThisMonth: orgScanMap.get(o.id) ?? 0,
    createdAt: o.createdAt.toISOString(),
    mrr: PLAN_PRICES[o.plan] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        subtitle="Subscriptions, plans, and revenue overview"
      />

      {/* Revenue summary cards */}
      <RevenueSummaryCards
        mrr={mrr}
        proCount={planCounts['PRO'] ?? 0}
        freeCount={planCounts['FREE'] ?? 0}
        locale={locale}
      />

      {/* Plan distribution chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest">Plan Distribution</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Active organizations by plan tier</p>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <PlanTrendChart data={planChartData} />
            <div className="mt-3 flex justify-center gap-6">
              {planChartData.map(({ plan, count }) => (
                <div key={plan} className="text-center">
                  <p className="text-lg font-black text-foreground">{count}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{plan}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stripe placeholder */}
        <div className="lg:col-span-2">
          <BillingPlaceholder />
        </div>
      </div>

      {/* Subscriptions table */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest">All Subscriptions</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {orgRows.length} organizations · estimated MRR ${mrr.toLocaleString(locale)}/month
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <SubscriptionTable orgs={orgRows} locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
