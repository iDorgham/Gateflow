import Link from 'next/link';
import { prisma } from '@gate-access/db';
import { getTranslation, Locale } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@gate-access/ui';
import { AnimatedKpiGrid } from './animated-kpi-grid';
import {
  QrCode,
  ScanLine,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  SUCCESS: {
    bg: 'bg-[var(--ds-background-success-subtle)]',
    text: 'text-[var(--ds-text-success)]',
    dot: 'bg-[var(--ds-background-success-bold)]',
  },
  FAILED: {
    bg: 'bg-[var(--ds-background-danger-subtle)]',
    text: 'text-[var(--ds-text-danger)]',
    dot: 'bg-[var(--ds-background-danger-bold)]',
  },
  EXPIRED: {
    bg: 'bg-[var(--ds-background-warning-subtle)]',
    text: 'text-[var(--ds-text-warning)]',
    dot: 'bg-[var(--ds-background-warning-bold)]',
  },
  MAX_USES_REACHED: {
    bg: 'bg-[var(--ds-background-information-subtle)]',
    text: 'text-[var(--ds-text-information)]',
    dot: 'bg-[var(--ds-background-information-bold)]',
  },
  INACTIVE: {
    bg: 'bg-[var(--ds-background-neutral-subtle)]',
    text: 'text-[var(--ds-text-subtlest)]',
    dot: 'bg-[var(--ds-icon-subtle)]',
  },
  DENIED: {
    bg: 'bg-[var(--ds-background-danger-subtle)]',
    text: 'text-[var(--ds-text-danger)]',
    dot: 'bg-[var(--ds-background-danger-bold)]',
  },
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export async function DashboardOverview({ locale, orgId }: { locale: Locale; orgId: string }) {
  const { t } = await getTranslation(locale, 'dashboard');
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalQRs, scansToday, activeGates, teamSize, recentScans] = await Promise.all([
    prisma.qRCode.count({
      where: { organizationId: orgId, isActive: true, deletedAt: null },
    }),
    prisma.scanLog.count({
      where: { qrCode: { organizationId: orgId }, scannedAt: { gte: todayStart } },
    }),
    prisma.gate.count({
      where: { organizationId: orgId, isActive: true, deletedAt: null },
    }),
    prisma.user.count({ where: { organizationId: orgId, deletedAt: null } }),
    prisma.scanLog.findMany({
      where: { qrCode: { organizationId: orgId } },
      orderBy: { scannedAt: 'desc' },
      take: 8,
      include: {
        qrCode: { select: { code: true, type: true } },
        gate: { select: { name: true } },
      },
    }),
  ]);

  const STAT_CARDS = [
    {
      title: t('overview.activeQRs', { defaultValue: 'Active QR Codes' }),
      value: totalQRs,
      sub: t('overview.sub.activeQRs', { defaultValue: 'Across all gates' }),
      icon: <QrCode className="h-4 w-4 text-primary" aria-hidden="true" />,
      href: '/dashboard/qrcodes',
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary',
    },
    {
      title: t('overview.scansToday', { defaultValue: 'Scans Today' }),
      value: scansToday,
      sub: t('overview.sub.scansToday', { defaultValue: 'Last 24 hours' }),
      icon: <ScanLine className="h-4 w-4 text-success" aria-hidden="true" />,
      href: '/dashboard/scans',
      iconBg: 'bg-success/10',
      valueColor: 'text-success',
    },
    {
      title: t('overview.activeGates', { defaultValue: 'Active Gates' }),
      value: activeGates,
      sub: t('overview.sub.activeGates', { defaultValue: 'Currently operational' }),
      icon: <Shield className="h-4 w-4 text-chart-2" aria-hidden="true" />,
      href: '/dashboard/gates',
      iconBg: 'bg-chart-2/10',
      valueColor: 'text-chart-2',
    },
    {
      title: t('overview.teamMembers', { defaultValue: 'Team Members' }),
      value: teamSize,
      sub: t('overview.sub.teamMembers', { defaultValue: 'In your organization' }),
      icon: <Users className="h-4 w-4 text-warning" aria-hidden="true" />,
      href: '/dashboard/team',
      iconBg: 'bg-warning/10',
      valueColor: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('overview.title', { defaultValue: 'Dashboard' })}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/dashboard/qrcodes/create">
            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t('overview.createQr', { defaultValue: 'Create QR Code' })}
          </Link>
        </Button>
      </div>

      <AnimatedKpiGrid cards={STAT_CARDS} />

      <Card className="border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-surface-raised,#FFFFFF)] bg-background shadow-[0_1px_1px_rgba(9,30,66,0.08),0_0_1px_rgba(9,30,66,0.08)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <CardTitle className="text-base">{t('overview.recentActivity', { defaultValue: 'Recent Scan Activity' })}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/scans" className="text-primary hover:text-primary/80">
                {t('overview.viewAll', { defaultValue: 'View all' })}
                <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentScans.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-10 text-center">
              <ScanLine className="mb-3 h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground">{t('overview.noScans', { defaultValue: 'No scans yet' })}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('overview.noScansDesc', { defaultValue: 'Create and share a QR code to see access activity here.' })}
              </p>
              <Button variant="outline" size="sm" asChild className="mt-4">
                <Link href="/dashboard/qrcodes/create">{t('overview.createFirst', { defaultValue: 'Create your first QR code' })}</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border" role="list" aria-label="Recent scans">
              {recentScans.map((scan) => {
                const style = STATUS_COLORS[scan.status] ?? STATUS_COLORS.INACTIVE;
                return (
                  <div key={scan.id} role="listitem" className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn('h-2 w-2 shrink-0 rounded-full', style.dot)} aria-hidden="true" />
                      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', style.bg, style.text)}>
                        {t(`overview.scanStatus.${scan.status}`, { defaultValue: scan.status.replace(/_/g, ' ') })}
                      </span>
                      <span className="truncate font-mono text-xs text-muted-foreground" title={scan.qrCode?.code}>
                        {scan.qrCode?.code?.slice(0, 18)}…
                      </span>
                      {scan.gate?.name && (
                        <span className="hidden truncate text-muted-foreground sm:block">@ {scan.gate.name}</span>
                      )}
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground" dateTime={new Date(scan.scannedAt).toISOString()}>
                      {new Date(scan.scannedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
