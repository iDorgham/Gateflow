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
  SUCCESS: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  FAILED: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  EXPIRED: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  MAX_USES_REACHED: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  INACTIVE: { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
  DENIED: { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500' },
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
    <Link href={href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
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
              <p className="mt-1 text-xs text-slate-400">{sub}</p>
            </div>
            <ArrowRight
              className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400"
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
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600',
    },
    {
      title: t('overview.scansToday', { defaultValue: 'Scans Today' }),
      value: scansToday,
      sub: t('overview.sub.scansToday', { defaultValue: 'Last 24 hours' }),
      icon: ScanLine,
      href: '/dashboard/scans',
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
    },
    {
      title: t('overview.activeGates', { defaultValue: 'Active Gates' }),
      value: activeGates,
      sub: t('overview.sub.activeGates', { defaultValue: 'Currently operational' }),
      icon: Shield,
      href: '/dashboard/gates',
      iconBg: 'bg-violet-50 dark:bg-violet-900/30',
      iconColor: 'text-violet-600',
      valueColor: 'text-violet-600',
    },
    {
      title: t('overview.teamMembers', { defaultValue: 'Team Members' }),
      value: teamSize,
      sub: t('overview.sub.teamMembers', { defaultValue: 'In your organization' }),
      icon: Users,
      href: '/dashboard/team',
      iconBg: 'bg-orange-50 dark:bg-orange-900/30',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('overview.title', { defaultValue: 'Dashboard' })}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
              <Link href="/dashboard/scans" className="text-blue-600 hover:text-blue-700">
                {t('overview.viewAll', { defaultValue: 'View all' })}
                <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentScans.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-10 text-center">
              <ScanLine className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('overview.noScans', { defaultValue: 'No scans yet' })}</p>
              <p className="mt-1 text-xs text-slate-400">
                {t('overview.noScansDesc', { defaultValue: 'Create and share a QR code to see access activity here.' })}
              </p>
              <Button variant="outline" size="sm" asChild className="mt-4">
                <Link href="/dashboard/qrcodes/create">{t('overview.createFirst', { defaultValue: 'Create your first QR code' })}</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800" role="list" aria-label="Recent scans">
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
                      <span className="truncate font-mono text-xs text-slate-400" title={scan.qrCode?.code}>
                        {scan.qrCode?.code?.slice(0, 18)}…
                      </span>

                      {/* Gate */}
                      {scan.gate?.name && (
                        <span className="hidden truncate text-slate-500 sm:block">
                          @ {scan.gate.name}
                        </span>
                      )}
                    </div>
                     <time
                      className="shrink-0 text-xs text-slate-400"
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
