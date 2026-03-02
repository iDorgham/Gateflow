import Link from 'next/link';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@gate-access/ui';
import {
  QrCode,
  ScanLine,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('overview.title', { defaultValue: 'Dashboard' }) };
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  SUCCESS: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  FAILED: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
  EXPIRED: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  MAX_USES_REACHED: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  INACTIVE: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  DENIED: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ElementType;
  href: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  href,
  iconBg,
  iconColor,
  valueColor,
}: StatCardProps) {
  return (
    <Link href={href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
      <Card className="border border-border bg-card transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBg)}>
              <Icon className={cn('h-4.5 w-4.5', iconColor)} aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end justify-between">
            <div>
              <p className={cn('text-3xl font-bold tabular-nums', valueColor)}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
            </div>
            <ArrowRight
              className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage({ params }: { params: { locale: Locale } }) {
  const claims = await getSessionClaims();
  if (!claims) redirect('/login');
  if (!claims.orgId) redirect('/dashboard/onboarding');

  const { t } = await getTranslation(params.locale, 'dashboard');
  const orgId = claims.orgId;
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

  const STAT_CARDS: StatCardProps[] = [
    {
      title: t('overview.activeQRs', { defaultValue: 'Active QR Codes' }),
      value: totalQRs,
      sub: t('overview.sub.activeQRs', { defaultValue: 'Across all gates' }),
      icon: QrCode,
      href: '/dashboard/qrcodes',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-primary',
    },
    {
      title: t('overview.scansToday', { defaultValue: 'Scans Today' }),
      value: scansToday,
      sub: t('overview.sub.scansToday', { defaultValue: 'Last 24 hours' }),
      icon: ScanLine,
      href: '/dashboard/scans',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      valueColor: 'text-success',
    },
    {
      title: t('overview.activeGates', { defaultValue: 'Active Gates' }),
      value: activeGates,
      sub: t('overview.sub.activeGates', { defaultValue: 'Currently operational' }),
      icon: Shield,
      href: '/dashboard/gates',
      iconBg: 'bg-chart-2/10',
      iconColor: 'text-chart-2',
      valueColor: 'text-chart-2',
    },
    {
      title: t('overview.teamMembers', { defaultValue: 'Team Members' }),
      value: teamSize,
      sub: t('overview.sub.teamMembers', { defaultValue: 'In your organization' }),
      icon: Users,
      href: '/dashboard/team',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      valueColor: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('overview.title', { defaultValue: 'Dashboard' })}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(params.locale, {
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

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="region" aria-label="Key metrics">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>


      {/* Recent scan activity */}
      <Card>
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
                  <div
                    key={scan.id}
                    role="listitem"
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Status dot */}
                      <span
                        className={cn('h-2 w-2 shrink-0 rounded-full', style.dot)}
                        aria-hidden="true"
                      />

                      {/* Status pill */}
                       <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                          style.bg,
                          style.text,
                        )}
                      >
                        {t(`overview.scanStatus.${scan.status}`, { defaultValue: scan.status.replace(/_/g, ' ') })}
                      </span>

                      {/* QR code */}
                      <span className="truncate font-mono text-xs text-muted-foreground" title={scan.qrCode?.code}>
                        {scan.qrCode?.code?.slice(0, 18)}…
                      </span>

                      {/* Gate */}
                      {scan.gate?.name && (
                        <span className="hidden truncate text-muted-foreground sm:block">
                          @ {scan.gate.name}
                        </span>
                      )}
                    </div>
                     <time
                      className="shrink-0 text-xs text-muted-foreground"
                      dateTime={new Date(scan.scannedAt).toISOString()}
                    >
                      {new Date(scan.scannedAt).toLocaleTimeString(params.locale, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
