import { prisma } from '@gate-access/db';
import { requireAdmin } from '../../../../../lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '../../../../../lib/i18n/i18n-config';
import {
  Building2,
  Users,
  ScanLine,
  Activity,
  ArrowUpRight,
  TrendingUp,
  LayoutGrid,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@gate-access/ui';
import { PageHeader } from '@gate-access/ui';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Organization Overview' };

export default async function OrgOverviewPage(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const organization = await prisma.organization.findUnique({
    where: { id: orgId, deletedAt: null },
    select: {
      id: true,
      name: true,
      type: true,
      plan: true,
    },
  });

  if (!organization) {
    notFound();
  }

  const [
    totalUsers,
    totalProjects,
    totalGates,
    scansToday,
  ] = await Promise.all([
    prisma.user.count({ where: { organizationId: orgId, deletedAt: null } }),
    prisma.project.count({ where: { organizationId: orgId, deletedAt: null } }),
    prisma.gate.count({ where: { organizationId: orgId, deletedAt: null } }),
    prisma.scanLog.count({
      where: {
        qrCode: { organizationId: orgId },
        scannedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  const stats = [
    {
      label: t('overview.totalUsers'),
      value: totalUsers.toLocaleString(locale),
      sub: t('overview.adminUsers', { count: totalUsers }), // Simplified for now
      icon: Users,
      variant: 'brand',
    },
    {
      label: 'Projects',
      value: totalProjects.toLocaleString(locale),
      sub: 'Active Infrastructure',
      icon: LayoutGrid,
      variant: 'primary',
    },
    {
      label: 'Gates',
      value: totalGates.toLocaleString(locale),
      sub: 'Operational Perimeters',
      icon: Building2,
      variant: 'success',
    },
    {
      label: t('overview.scansToday'),
      value: scansToday.toLocaleString(locale),
      sub: t('overview.scansLast24h'),
      icon: ScanLine,
      variant: 'warning',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      <PageHeader
        titleClassName="font-black uppercase tracking-tighter text-3xl"
        title={organization.name}
        subtitle={`${organization.type} • ${organization.plan} PLAN`}
        badge={
          <Badge
            variant="primary"
            className="bg-ds-background-selected text-ds-text-selected border-ds-border-selected/30 font-bold text-xs px-2.5 py-1"
          >
            ORG CONTEXT
          </Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border bg-card shadow-lg hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    'p-3.5 rounded-2xl shadow-xl ring-2 ring-ds-border/10 transition-transform group-hover:rotate-6',
                    stat.variant === 'brand'
                      ? 'bg-ds-background-brand-bold text-ds-text-inverse'
                      : stat.variant === 'primary'
                        ? 'bg-ds-background-selected text-ds-text-selected'
                        : stat.variant === 'success'
                          ? 'bg-ds-background-success text-ds-text-success'
                          : 'bg-ds-background-warning text-ds-text-warning'
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ds-background-neutral-subtle opacity-40 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="h-4 w-4 text-ds-text-subtlest" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest group-hover:text-primary transition-colors">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-ds-text tracking-tighter italic">
                    {stat.value}
                  </h3>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between">
                <p className="text-[10px] text-ds-text-subtlest font-black uppercase tracking-widest flex items-center gap-2">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      stat.variant === 'brand'
                        ? 'bg-primary'
                        : stat.variant === 'success'
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                    )}
                  />
                  {stat.sub}
                </p>
                <ArrowUpRight className="h-3.5 w-3.5 text-ds-text-subtlest opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
