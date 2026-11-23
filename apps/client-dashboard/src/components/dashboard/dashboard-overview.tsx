import Link from 'next/link';
import { getTranslation, Locale } from '@/lib/i18n';
import { Button } from '@gateflow/ui';
import { OrganizationType, getOrganizationFeatures } from '@gate-access/types';
import { Plus, UserPlus, ShieldAlert, ScanLine } from 'lucide-react';
import { getOverviewData } from '@/lib/dashboard/overview-data';
import { Panel } from './overview/panel';
import { StackedBars, ChartLegend } from './overview/stacked-bars';
import {
  KpiBand,
  GateStatusPanel,
  LiveFeed,
  AttentionPanel,
  OutcomeMix,
  type WidgetContext,
} from './overview/widgets';

/**
 * Organization overview (dashboard home).
 *
 * Layout: 12-column bento on xl, single column below lg.
 *   Header ─ KPI band (full width)
 *   Access activity 24h (8) │ Gate status (4)
 *   Recent scans (7)        │ Needs attention (5)
 *   14-day trend (8)        │ Scan outcomes (4)
 *
 * Every widget is a server component over one bounded data load
 * (lib/dashboard/overview-data.ts). Vertical-specific widgets (occupancy,
 * stays, capacity) slot in as additional rows keyed off
 * features.dashboard.chartIds; ids without a real data source render nothing.
 */
export async function DashboardOverview({
  locale,
  orgId,
  orgType = OrganizationType.REAL_ESTATE,
}: {
  locale: Locale;
  orgId: string;
  orgType?: OrganizationType;
}) {
  const [{ t }, { t: tOrg }] = await Promise.all([
    getTranslation(locale, 'dashboard'),
    getTranslation(locale, 'orgType'),
  ]);
  const features = getOrganizationFeatures(orgType);
  const data = await getOverviewData(orgId, features);

  const now = new Date(data.generatedAt);
  const nf = new Intl.NumberFormat(locale);
  const ctx: WidgetContext = {
    data,
    t,
    locale,
    base: `/dashboard/organizations/${orgId}`,
    now,
    fmt: (n) => nf.format(n),
  };
  const tz = data.timeZone;

  const hourLabel = (iso: string) =>
    new Intl.DateTimeFormat(locale, { hour: 'numeric', timeZone: tz }).format(
      new Date(iso)
    );
  const dayLabel = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      timeZone: tz,
    }).format(new Date(iso));

  const sum = (key: 'granted' | 'rejected', rows: typeof data.hourly) =>
    rows.reduce((s, r) => s + r[key], 0);
  const h24 = {
    granted: sum('granted', data.hourly),
    rejected: sum('rejected', data.hourly),
  };
  const d14 = {
    granted: sum('granted', data.daily),
    rejected: sum('rejected', data.daily),
  };
  const peak = data.hourly.reduce(
    (best, b) =>
      b.granted + b.rejected > best.granted + best.rejected ? b : best,
    data.hourly[0]
  );
  const peakTotal = peak.granted + peak.rejected;

  const grantedLabel = t('overview.granted', { defaultValue: 'Granted' });
  const rejectedLabel = t('overview.rejected', { defaultValue: 'Rejected' });

  const orgLabelKey = features.terminology.orgLabel.replace(/^orgType:/, '');
  const title = tOrg(orgLabelKey, {
    defaultValue: t('overview.title', { defaultValue: 'Dashboard' }),
  });

  const quickActions = features.dashboard.quickActions
    .map((id) => QUICK_ACTIONS[id])
    .filter(Boolean)
    .filter((a) => a.id !== 'create-qr');

  const emptyFeed = (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-[var(--ds-border-subtle)] px-6 py-8 text-center">
      <ScanLine
        className="h-5 w-5 text-[var(--ds-text-subtlest)]"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-medium text-[var(--ds-text-primary)]">
          {t('overview.noScans', { defaultValue: 'No scans yet' })}
        </p>
        <p className="mt-1 text-xs text-[var(--ds-text-subtlest)]">
          {t(`overview.emptyState.${orgType}`, {
            defaultValue: t('overview.noScansDesc', {
              defaultValue:
                'Create and share a QR code to see access activity here.',
            }),
          })}
        </p>
      </div>
      <Button asChild size="sm" variant="outline">
        <Link href={`${ctx.base}/qrcodes/create`}>
          {t('overview.createFirst', {
            defaultValue: 'Create your first QR code',
          })}
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--ds-text-primary)]">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[var(--ds-text-subtle)]">
            {new Intl.DateTimeFormat(locale, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: tz,
            }).format(now)}
            <span
              className="mx-2 text-[var(--ds-text-subtlest)]"
              aria-hidden="true"
            >
              ·
            </span>
            <span className="text-[var(--ds-text-subtlest)]">
              {t('overview.updatedAt', {
                defaultValue: 'Updated {{time}}',
                time: new Intl.DateTimeFormat(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: tz,
                }).format(now),
              })}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quickActions.map((a) => (
            <Button key={a.id} asChild variant="outline" size="sm">
              <Link href={`${ctx.base}${a.path}`}>
                <a.icon className="me-1.5 h-4 w-4" aria-hidden="true" />
                {t(a.labelKey, { defaultValue: a.fallback })}
              </Link>
            </Button>
          ))}
          <Button asChild size="sm">
            <Link href={`${ctx.base}/qrcodes/create`}>
              <Plus className="me-1.5 h-4 w-4" aria-hidden="true" />
              {t('overview.createQr', { defaultValue: 'Create QR Code' })}
            </Link>
          </Button>
        </div>
      </header>

      <KpiBand ctx={ctx} features={features} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* ── Access activity, last 24h ─────────────────────────────────── */}
        <Panel
          className="xl:col-span-8"
          bodyClassName="flex flex-col"
          title={t('overview.accessActivity', {
            defaultValue: 'Access activity',
          })}
          meta={t('overview.last24h', {
            defaultValue: 'Last 24 hours, by hour',
          })}
          action={{
            href: `${ctx.base}/analytics`,
            label: t('overview.analytics', { defaultValue: 'Analytics' }),
          }}
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <ChartLegend
              items={[
                {
                  label: grantedLabel,
                  className: 'bg-[var(--gf-color-info)]',
                  value: ctx.fmt(h24.granted),
                },
                {
                  label: rejectedLabel,
                  className: 'bg-[var(--gf-color-danger)]',
                  value: ctx.fmt(h24.rejected),
                },
              ]}
            />
            {peakTotal > 0 && (
              <p className="text-xs text-[var(--ds-text-subtlest)]">
                {t('overview.peakHour', {
                  defaultValue: 'Peak {{time}} · {{n}} scans',
                  time: hourLabel(peak.at),
                  n: ctx.fmt(peakTotal),
                })}
              </p>
            )}
          </div>
          <StackedBars
            buckets={data.hourly}
            labelFor={(b) => hourLabel(b.at)}
            tickEvery={4}
            height={220}
            formatNumber={ctx.fmt}
            grantedLabel={grantedLabel}
            rejectedLabel={rejectedLabel}
            summary={t('overview.activitySummary', {
              defaultValue:
                '{{granted}} granted and {{rejected}} rejected scans in the last 24 hours.',
              granted: ctx.fmt(h24.granted),
              rejected: ctx.fmt(h24.rejected),
            })}
          />
        </Panel>

        <GateStatusPanel ctx={ctx} className="xl:col-span-4" />

        <LiveFeed ctx={ctx} className="xl:col-span-7" empty={emptyFeed} />

        <AttentionPanel
          ctx={ctx}
          features={features}
          className="xl:col-span-5"
        />

        {/* ── 14-day trend ──────────────────────────────────────────────── */}
        <Panel
          className="xl:col-span-8"
          bodyClassName="flex flex-col"
          title={t('overview.dailyTrend', { defaultValue: 'Daily trend' })}
          meta={t('overview.last14Days', { defaultValue: 'Last 14 days' })}
        >
          <div className="mb-4">
            <ChartLegend
              items={[
                {
                  label: grantedLabel,
                  className: 'bg-[var(--gf-color-info)]',
                  value: ctx.fmt(d14.granted),
                },
                {
                  label: rejectedLabel,
                  className: 'bg-[var(--gf-color-danger)]',
                  value: ctx.fmt(d14.rejected),
                },
              ]}
            />
          </div>
          <StackedBars
            buckets={data.daily}
            labelFor={(b) => dayLabel(b.at)}
            tickEvery={3}
            height={140}
            formatNumber={ctx.fmt}
            grantedLabel={grantedLabel}
            rejectedLabel={rejectedLabel}
            summary={t('overview.trendSummary', {
              defaultValue:
                '{{granted}} granted and {{rejected}} rejected scans in the last 14 days.',
              granted: ctx.fmt(d14.granted),
              rejected: ctx.fmt(d14.rejected),
            })}
          />
        </Panel>

        <OutcomeMix ctx={ctx} className="xl:col-span-4" />
      </div>
    </div>
  );
}

const QUICK_ACTIONS: Record<
  string,
  {
    id: string;
    path: string;
    labelKey: string;
    fallback: string;
    icon: typeof Plus;
  }
> = {
  'create-qr': {
    id: 'create-qr',
    path: '/qrcodes/create',
    labelKey: 'overview.createQr',
    fallback: 'Create QR Code',
    icon: Plus,
  },
  'add-resident': {
    id: 'add-resident',
    path: '/residents/contacts',
    labelKey: 'overview.addResident',
    fallback: 'Add resident',
    icon: UserPlus,
  },
  'report-incident': {
    id: 'report-incident',
    path: '/team/incidents',
    labelKey: 'overview.reportIncident',
    fallback: 'Incidents',
    icon: ShieldAlert,
  },
};
