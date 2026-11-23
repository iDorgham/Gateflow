import Link from 'next/link';
import { cn } from '@gateflow/ui';
import { ShieldAlert, Wrench, UserRound } from 'lucide-react';
import type { OrganizationFeatures } from '@gate-access/types';
import type { TranslationFunction } from '@/lib/i18n';
import type {
  OverviewData,
  GateLiveState,
} from '@/lib/dashboard/overview-data';
import {
  Panel,
  PanelEmpty,
  StatusChip,
  TONE,
  scanStatusTone,
  relativeTime,
  type Tone,
} from './panel';

export interface WidgetContext {
  data: OverviewData;
  t: TranslationFunction;
  locale: string;
  base: string; // /dashboard/organizations/<orgId>
  now: Date;
  fmt: (n: number) => string;
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI band: one surface, hairline-divided cells (not a grid of identical cards)
// ─────────────────────────────────────────────────────────────────────────────

interface KpiCell {
  id: string;
  label: string;
  value: string;
  sub: React.ReactNode;
  href: string;
  tone?: Tone;
}

/**
 * Config KPIs (features.dashboard.kpiIds) that have a real data source.
 * Ids without one (current-capacity, total-members, …) are skipped rather than
 * rendered as a fake zero. New org types/hospitality add entries here.
 */
function configKpi(
  id: string,
  ctx: WidgetContext,
  features: OrganizationFeatures
): KpiCell | null {
  const { data, t, base, fmt } = ctx;
  const d = data.totals;
  switch (id) {
    case 'active-qr':
      return {
        id,
        label: t('overview.activeQRs', { defaultValue: 'Active QR Codes' }),
        value: fmt(d.activeQRs),
        sub: t('overview.sub.activeQRs', { defaultValue: 'Across all gates' }),
        href: `${base}/qrcodes`,
      };
    case 'active-gates':
      return null; // covered by the "Gates live" cell
    case 'team-members':
      return {
        id,
        label: t('overview.teamMembers', { defaultValue: 'Team Members' }),
        value: fmt(d.teamSize),
        sub: t('overview.sub.teamMembers', {
          defaultValue: 'In your organization',
        }),
        href: `${base}/team`,
      };
    case 'active-residents':
    case 'active-students':
      if (d.residents === null) return null;
      return {
        id,
        label:
          id === 'active-students'
            ? t('overview.students', { defaultValue: 'Students' })
            : t('overview.residents', { defaultValue: 'Residents' }),
        value: fmt(d.residents),
        sub:
          id === 'active-students'
            ? t('overview.sub.activeStudents', { defaultValue: 'Enrolled' })
            : t('overview.sub.activeResidents', {
                defaultValue: 'With linked units',
              }),
        href: `${base}/residents/contacts`,
      };
    case 'open-maintenance':
      if (d.openMaintenance === null || !features.flags.maintenanceModule)
        return null;
      return {
        id,
        label: t('overview.openMaintenance', { defaultValue: 'Open Requests' }),
        value: fmt(d.openMaintenance),
        sub: t('overview.sub.openMaintenance', {
          defaultValue: 'Pending action',
        }),
        href: `${base}/maintenance`,
        tone: d.openMaintenance > 0 ? 'warning' : undefined,
      };
    case 'security-incidents':
      return {
        id,
        label: t('overview.securityIncidents', { defaultValue: 'Incidents' }),
        value: fmt(d.openIncidents),
        sub: t('overview.sub.securityIncidents', {
          defaultValue: 'Requires attention',
        }),
        href: `${base}/team/incidents`,
        tone: d.openIncidents > 0 ? 'danger' : undefined,
      };
    default:
      return null;
  }
}

export function KpiBand({
  ctx,
  features,
}: {
  ctx: WidgetContext;
  features: OrganizationFeatures;
}) {
  const { data, t, base, fmt } = ctx;
  const d = data.totals;

  const vsAvg =
    d.avgDaily7d > 0
      ? ((d.scansToday - d.avgDaily7d) / d.avgDaily7d) * 100
      : null;
  const rejectRate =
    d.scansToday > 0 ? (d.rejectedToday / d.scansToday) * 100 : 0;

  const core: KpiCell[] = [
    {
      id: 'scans-today',
      label: t('overview.scansToday', { defaultValue: 'Scans Today' }),
      value: fmt(d.scansToday),
      sub:
        vsAvg === null ? (
          t('overview.sub.noBaseline', {
            defaultValue: 'No 7-day baseline yet',
          })
        ) : (
          <>
            <span
              className={cn(
                'font-medium tabular-nums',
                vsAvg >= 0 ? TONE.success.text : TONE.warning.text
              )}
            >
              {vsAvg >= 0 ? '+' : '−'}
              {fmt(Math.abs(Math.round(vsAvg)))}%
            </span>{' '}
            {t('overview.sub.vsAvg', { defaultValue: 'vs 7-day average' })}
          </>
        ),
      href: `${base}/scans`,
    },
    {
      id: 'rejected-today',
      label: t('overview.rejectedToday', { defaultValue: 'Rejected Today' }),
      value: fmt(d.rejectedToday),
      sub: t('overview.sub.rejectRate', {
        defaultValue: '{{rate}}% of today’s scans',
        rate: fmt(Math.round(rejectRate * 10) / 10),
      }),
      href: `${base}/scans`,
      tone: d.rejectedToday > 0 ? 'danger' : undefined,
    },
    {
      id: 'gates-live',
      label: t('overview.gatesLive', { defaultValue: 'Gates Live' }),
      value: `${fmt(d.liveGates)}/${fmt(d.activeGates)}`,
      sub: t('overview.sub.guardsOnDuty', {
        defaultValue: 'Guards on duty: {{n}}',
        n: fmt(d.guardsOnDuty),
      }),
      href: `${base}/gates`,
    },
  ];

  const fallbacks = ['active-qr', 'security-incidents', 'team-members'];
  const extra: KpiCell[] = [];
  for (const id of [...features.dashboard.kpiIds, ...fallbacks]) {
    if (extra.length === 3) break;
    if (extra.some((c) => c.id === id)) continue;
    const cell = configKpi(id, ctx, features);
    if (cell) extra.push(cell);
  }

  const cells = [...core, ...extra];

  return (
    <section
      aria-label={t('overview.keyMetrics', { defaultValue: 'Key metrics' })}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] md:grid-cols-3 xl:grid-cols-6"
    >
      {cells.map((c) => (
        <Link
          key={c.id}
          href={c.href}
          className="group flex min-w-0 flex-col gap-1 bg-[var(--ds-surface)] px-4 py-3.5 transition-colors hover:bg-[var(--ds-surface-raised)] focus-visible:relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <span className="truncate text-xs font-medium text-[var(--ds-text-subtle)]">
            {c.label}
          </span>
          <span
            className={cn(
              'text-2xl font-semibold leading-8 tabular-nums tracking-tight text-[var(--ds-text-primary)]',
              c.tone && TONE[c.tone].text
            )}
          >
            {c.value}
          </span>
          <span className="truncate text-xs text-[var(--ds-text-subtlest)]">
            {c.sub}
          </span>
        </Link>
      ))}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gate status
// ─────────────────────────────────────────────────────────────────────────────

const GATE_TONE: Record<GateLiveState, Tone> = {
  live: 'success',
  idle: 'info',
  quiet: 'neutral',
};

export function GateStatusPanel({
  ctx,
  className,
}: {
  ctx: WidgetContext;
  className?: string;
}) {
  const { data, t, base, locale, now, fmt } = ctx;
  const max = Math.max(1, ...data.gates.map((g) => g.scansToday));
  return (
    <Panel
      className={className}
      title={t('overview.gateStatus', { defaultValue: 'Gate status' })}
      meta={t('overview.gateStatusMeta', {
        defaultValue: 'Live = a scan in the last 10 minutes',
      })}
      action={{
        href: `${base}/gates`,
        label: t('overview.viewAll', { defaultValue: 'View all' }),
      }}
    >
      {data.gates.length === 0 ? (
        <PanelEmpty>
          {t('overview.noGates', { defaultValue: 'No active gates yet.' })}
        </PanelEmpty>
      ) : (
        <ul className="-mx-2 flex flex-col">
          {data.gates.map((g) => (
            <li
              key={g.id}
              className="rounded-md px-2 py-1.5 hover:bg-[var(--ds-surface-sunken)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      TONE[GATE_TONE[g.state]].dot,
                      g.state === 'live' && 'motion-safe:animate-pulse'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm font-medium text-[var(--ds-text-primary)]">
                    {g.name}
                  </span>
                  {g.location && (
                    <span className="hidden truncate text-xs text-[var(--ds-text-subtlest)] 2xl:inline">
                      {g.location}
                    </span>
                  )}
                  <span className="sr-only">
                    {t(`overview.gateState.${g.state}`, {
                      defaultValue: g.state,
                    })}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--ds-text-primary)]">
                  {fmt(g.scansToday)}
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--ds-surface-sunken)] ms-4">
                <div
                  className="h-full rounded-full bg-[var(--gf-color-info)]"
                  style={{ width: `${(g.scansToday / max) * 100}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between gap-2 ps-4 text-[11px] text-[var(--ds-text-subtlest)]">
                <span className="inline-flex min-w-0 items-center gap-1 truncate">
                  <UserRound className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {g.guardName ??
                      t('overview.noGuard', {
                        defaultValue: 'No guard on shift',
                      })}
                  </span>
                </span>
                <span className="shrink-0">
                  {g.lastScanAt
                    ? relativeTime(g.lastScanAt, now, locale)
                    : t('overview.noScans7d', {
                        defaultValue: 'No scans in 7 days',
                      })}
                  {g.rejectedToday > 0 && (
                    <span className="ms-2 font-medium text-[var(--ds-text-subtle)]">
                      {t('overview.rejectedCount', {
                        defaultValue: '{{n}} rejected',
                        n: fmt(g.rejectedToday),
                      })}
                    </span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Live access feed
// ─────────────────────────────────────────────────────────────────────────────

export function LiveFeed({
  ctx,
  className,
  empty,
}: {
  ctx: WidgetContext;
  className?: string;
  empty: React.ReactNode;
}) {
  const { data, t, base, locale, now } = ctx;
  return (
    <Panel
      className={className}
      title={t('overview.recentActivity', {
        defaultValue: 'Recent Scan Activity',
      })}
      meta={t('overview.recentActivityMeta', {
        defaultValue: 'Latest scans across all gates',
      })}
      action={{
        href: `${base}/scans`,
        label: t('overview.viewAll', { defaultValue: 'View all' }),
      }}
      bodyClassName="px-0 pb-2"
    >
      {data.feed.length === 0 ? (
        <div className="px-5 pb-3">{empty}</div>
      ) : (
        <table className="w-full table-fixed text-sm">
          <thead className="sr-only">
            <tr>
              <th>{t('overview.col.status', { defaultValue: 'Status' })}</th>
              <th>{t('overview.col.gate', { defaultValue: 'Gate' })}</th>
              <th>{t('overview.col.pass', { defaultValue: 'Pass' })}</th>
              <th>{t('overview.col.time', { defaultValue: 'Time' })}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ds-border-subtle)]">
            {data.feed.map((s) => {
              const tone = scanStatusTone(s.status);
              return (
                <tr key={s.id} className="hover:bg-[var(--ds-surface-sunken)]">
                  <td className="w-[112px] py-2.5 ps-5 align-middle">
                    <StatusChip tone={tone}>
                      {t(`overview.scanStatus.${s.status}`, {
                        defaultValue: s.status.replace(/_/g, ' '),
                      })}
                    </StatusChip>
                  </td>
                  <td className="truncate px-3 py-2.5 align-middle font-medium text-[var(--ds-text-primary)]">
                    {s.gateName ?? '—'}
                  </td>
                  <td className="hidden truncate px-3 py-2.5 align-middle text-xs text-[var(--ds-text-subtle)] sm:table-cell">
                    {s.qrType &&
                      t(`overview.qrType.${s.qrType}`, {
                        defaultValue: s.qrType,
                      })}
                    {s.code && (
                      <span className="ms-2 font-mono text-[11px] text-[var(--ds-text-subtlest)]">
                        <bdi dir="ltr">…{s.code.slice(-6)}</bdi>
                      </span>
                    )}
                  </td>
                  <td className="w-[96px] py-2.5 pe-5 text-end align-middle text-xs tabular-nums text-[var(--ds-text-subtlest)]">
                    <time
                      dateTime={s.scannedAt}
                      title={new Date(s.scannedAt).toLocaleString(locale, {
                        timeZone: data.timeZone,
                      })}
                    >
                      {relativeTime(s.scannedAt, now, locale)}
                    </time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Needs attention: open incidents + urgent work orders + maintenance pipeline
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_TONE = {
  critical: 'danger',
  high: 'warning',
  normal: 'info',
} as const;

export function AttentionPanel({
  ctx,
  features,
  className,
}: {
  ctx: WidgetContext;
  features: OrganizationFeatures;
  className?: string;
}) {
  const { data, t, base, locale, now, fmt } = ctx;
  const showMaintenance =
    features.flags.maintenanceModule && data.maintenanceByStatus.length > 0;
  const pipeline = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_PARTS'].map(
    (s) => ({
      status: s,
      count: data.maintenanceByStatus.find((m) => m.status === s)?.count ?? 0,
    })
  );
  const pipelineTotal = pipeline.reduce((a, b) => a + b.count, 0);

  return (
    <Panel
      className={className}
      title={t('overview.needsAttention', { defaultValue: 'Needs attention' })}
      meta={t('overview.needsAttentionMeta', {
        defaultValue: '{{incidents}} open incidents',
        incidents: fmt(data.totals.openIncidents),
      })}
      action={{
        href: `${base}/team/incidents`,
        label: t('overview.viewAll', { defaultValue: 'View all' }),
      }}
    >
      <div className="flex h-full flex-col gap-4">
        {data.attention.length === 0 ? (
          <PanelEmpty>
            {t('overview.allClear', {
              defaultValue: 'All clear. No open incidents or urgent requests.',
            })}
          </PanelEmpty>
        ) : (
          <ul className="-mx-2 flex flex-col">
            {data.attention.map((a) => {
              const Icon = a.kind === 'incident' ? ShieldAlert : Wrench;
              const tone = SEVERITY_TONE[a.severity];
              return (
                <li key={`${a.kind}-${a.id}`}>
                  <Link
                    href={
                      a.kind === 'incident'
                        ? `${base}/team/incidents`
                        : `${base}/maintenance`
                    }
                    className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-[var(--ds-surface-sunken)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                        TONE[tone].chip
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[var(--ds-text-primary)]">
                        {a.title}
                      </span>
                      <span className="block truncate text-[11px] text-[var(--ds-text-subtlest)]">
                        {[
                          t(`overview.attentionStatus.${a.status}`, {
                            defaultValue: a.status.replace(/_/g, ' '),
                          }),
                          a.context,
                          relativeTime(a.createdAt, now, locale),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {showMaintenance && (
          <div className="mt-auto border-t border-[var(--ds-border-subtle)] pt-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--ds-text-subtle)]">
                {t('overview.maintenancePipeline', {
                  defaultValue: 'Maintenance pipeline',
                })}
              </span>
              <Link
                href={`${base}/maintenance`}
                className="tabular-nums text-[var(--ds-text-subtlest)] hover:text-[var(--ds-text-primary)]"
              >
                {t('overview.openCount', {
                  defaultValue: '{{n}} open',
                  n: fmt(pipelineTotal),
                })}
              </Link>
            </div>
            <dl className="grid grid-cols-4 gap-2">
              {pipeline.map((p) => (
                <div
                  key={p.status}
                  className="rounded-md bg-[var(--ds-surface-sunken)] px-2 py-1.5"
                >
                  <dt className="truncate text-[10px] text-[var(--ds-text-subtlest)]">
                    {t(`overview.maintenanceStatus.${p.status}`, {
                      defaultValue: p.status.replace(/_/g, ' '),
                    })}
                  </dt>
                  <dd className="text-sm font-semibold tabular-nums text-[var(--ds-text-primary)]">
                    {fmt(p.count)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Outcome mix (7 days)
// ─────────────────────────────────────────────────────────────────────────────

export function OutcomeMix({
  ctx,
  className,
}: {
  ctx: WidgetContext;
  className?: string;
}) {
  const { data, t, base, fmt, locale } = ctx;
  const total = data.statusMix.reduce((s, r) => s + r.count, 0);
  const pct = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(total ? n / total : 0);

  return (
    <Panel
      className={className}
      title={t('overview.outcomeMix', { defaultValue: 'Scan outcomes' })}
      meta={t('overview.last7Days', { defaultValue: 'Last 7 days' })}
      action={{
        href: `${base}/analytics`,
        label: t('overview.analytics', { defaultValue: 'Analytics' }),
      }}
    >
      {total === 0 ? (
        <PanelEmpty>
          {t('overview.noScans7dShort', {
            defaultValue: 'No scans in the last 7 days.',
          })}
        </PanelEmpty>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums text-[var(--ds-text-primary)]">
                {pct(
                  data.statusMix.find((s) => s.status === 'SUCCESS')?.count ?? 0
                )}
              </span>
              <span className="text-xs text-[var(--ds-text-subtlest)]">
                {t('overview.grantRate', {
                  defaultValue: 'granted of {{n}} scans',
                  n: fmt(total),
                })}
              </span>
            </div>
            <div
              className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-[var(--ds-surface-sunken)]"
              aria-hidden="true"
            >
              {data.statusMix.map((s) => (
                <div
                  key={s.status}
                  className={cn('h-full', TONE[scanStatusTone(s.status)].dot)}
                  style={{ width: `${(s.count / total) * 100}%` }}
                />
              ))}
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {data.statusMix.map((s) => (
              <li
                key={s.status}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="inline-flex items-center gap-2 text-[var(--ds-text-subtle)]">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-[2px]',
                      TONE[scanStatusTone(s.status)].dot
                    )}
                    aria-hidden="true"
                  />
                  {t(`overview.scanStatus.${s.status}`, {
                    defaultValue: s.status.replace(/_/g, ' '),
                  })}
                </span>
                <span className="tabular-nums text-[var(--ds-text-primary)]">
                  {fmt(s.count)}
                  <span className="ms-2 inline-block w-12 text-end text-[var(--ds-text-subtlest)]">
                    {pct(s.count)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
