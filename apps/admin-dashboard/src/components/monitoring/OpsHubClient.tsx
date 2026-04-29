'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Badge,
  cn,
  DynamicTable,
  Column,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  ScrollArea,
} from '@gateflow/ui';
import {
  Activity,
  Zap,
  Database,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Clipboard,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface EmulationLog {
  id: string;
  actionType: string;
  status: string;
  organizationId: string;
  createdAt: string;
  result: Record<string, any> | null;
  metadata: Record<string, any> | null;
  intentJson: Record<string, any> | null;
}

function EmulationDetailDrawer({
  log,
  onClose,
  locale,
}: {
  log: EmulationLog | null;
  onClose: () => void;
  locale: string;
}) {
  if (!log) return null;

  return (
    <Sheet open={!!log} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="sm:max-w-md bg-ds-background-neutral border-l border-ds-border shadow-2xl p-0 flex flex-col h-full animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full bg-ds-background-default">
          <SheetHeader className="p-6 border-b border-ds-border bg-ds-background-subtle/40">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={cn(
                  'p-2.5 rounded-2xl shadow-sm border border-ds-border/50',
                  log.actionType === 'EMULATE_TRAFFIC'
                    ? 'bg-ds-background-brand-bold text-white'
                    : 'bg-ds-background-selected text-ds-text-selected'
                )}
              >
                {log.actionType === 'EMULATE_TRAFFIC' ? (
                  <Zap className="h-6 w-6" />
                ) : (
                  <Database className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-base font-black uppercase tracking-tight truncate">
                  {log.actionType}
                </SheetTitle>
                <SheetDescription className="text-[10px] font-mono font-bold text-ds-text-subtlest mt-0.5 uppercase tracking-widest">
                  Process ID: #{log.id.slice(0, 8)}
                </SheetDescription>
              </div>
            </div>

            <Badge
              className={cn(
                'w-fit h-6 px-3.5 font-black text-[10px] uppercase tracking-widest italic border-none',
                log.status === 'SUCCESS' || log.status === 'EXECUTED'
                  ? 'bg-ds-background-success-subtle text-ds-text-success'
                  : log.status === 'FAILED'
                    ? 'bg-ds-background-danger-subtle text-ds-text-danger'
                    : 'bg-ds-background-subtle text-ds-text-subtle'
              )}
            >
              {log.status}
            </Badge>
          </SheetHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="flex flex-col gap-8">
              {/* Context Section */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest pb-2 border-b border-ds-border/50">
                  Transaction Context
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] font-black text-ds-text-subtle uppercase tracking-wider">
                      Target Entity
                    </p>
                    <Link
                      href={`/${locale}/organizations/${log.organizationId}`}
                      className="text-xs font-bold text-ds-text-brand hover:text-ds-text-brand-bold transition-colors flex items-center gap-1.5 mt-0.5"
                    >
                      {log.organizationId || 'System Global'}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] font-black text-ds-text-subtle uppercase tracking-wider">
                      Timestamp
                    </p>
                    <p className="text-xs font-bold tabular-nums text-ds-text mt-0.5">
                      {new Date(log.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulation Result Section */}
              {log.actionType === 'EMULATE_TRAFFIC' && log.result && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest pb-2 border-b border-ds-border/50">
                    Operation Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-ds-background-subtle/50 rounded-2xl p-4 border border-ds-border/30 text-center">
                      <TrendingUp className="h-4 w-4 text-ds-text-brand mx-auto mb-2 opacity-50" />
                      <p className="text-xl font-black italic text-ds-text leading-none">
                        {log.result.totalScans || 0}
                      </p>
                      <p className="text-[8px] font-black text-ds-text-subtlest uppercase tracking-widest mt-2">
                        Total Scans
                      </p>
                    </div>
                    <div className="bg-ds-background-subtle/50 rounded-2xl p-4 border border-ds-border/30 text-center">
                      <Activity className="h-4 w-4 text-ds-text-brand mx-auto mb-2 opacity-50" />
                      <p className="text-xl font-black italic text-ds-text leading-none">
                        {log.result.scannersCount || 0}
                      </p>
                      <p className="text-[8px] font-black text-ds-text-subtlest uppercase tracking-widest mt-2">
                        Active Units
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payload Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-ds-border/50 pb-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest">
                    Request Payload
                  </h4>
                  <Button
                    variant="subtle"
                    size="sm"
                    className="h-6 px-2.5 text-[9px] font-black uppercase gap-1.5 transition-all hover:bg-ds-background-selected hover:text-ds-text-selected"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(log.metadata || log.intentJson, null, 2)
                      )
                    }
                  >
                    <Clipboard className="h-3 w-3" /> Copy Path
                  </Button>
                </div>
                <div className="rounded-2xl bg-ds-background-neutral border border-ds-border p-4 shadow-inner">
                  <pre className="text-[10px] font-mono text-ds-text leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                    {JSON.stringify(log.metadata || log.intentJson, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function OpsHubClient({ locale }: { locale: string }) {
  const { t } = useTranslation('admin');
  const [logs, setLogs] = React.useState<EmulationLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<EmulationLog | null>(
    null
  );

  const fetchHistory = React.useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/admin/emulation-history?limit=50`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHistory(true);
    const interval = setInterval(() => fetchHistory(false), 8_000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  const columns = React.useMemo<Column<EmulationLog>[]>(
    () => [
      {
        key: 'action',
        label: t('admin:monitoring.hub.table.action'),
        render: (log) => (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-8 w-8 rounded-xl flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-ds-border/50',
                log.actionType === 'EMULATE_TRAFFIC'
                  ? 'bg-ds-background-brand-bold text-white'
                  : 'bg-ds-background-selected text-ds-text-selected'
              )}
            >
              {log.actionType === 'EMULATE_TRAFFIC' ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Database className="h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-black text-[11px] uppercase tracking-tight text-ds-text">
                {log.actionType}
              </span>
              <span className="text-[9px] font-bold text-ds-text-subtlest uppercase tracking-widest">
                ID: {log.id.slice(0, 8)}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'organization',
        label: 'Target Context',
        render: (log) => (
          <Link
            href={`/${locale}/organizations/${log.organizationId}`}
            className="flex items-center gap-2 group/ctx"
          >
            <div className="h-5 w-5 rounded-md bg-ds-background-neutral flex items-center justify-center border border-ds-border group-hover/ctx:bg-ds-background-selected transition-colors">
              <ExternalLink className="h-2.5 w-2.5 text-ds-text-subtlest group-hover/ctx:text-ds-text-selected" />
            </div>
            <span className="font-mono text-[10px] font-bold text-ds-text-subtle group-hover/ctx:text-ds-text-selected transition-colors">
              {log.organizationId || 'Global System'}
            </span>
          </Link>
        ),
      },
      {
        key: 'status',
        label: t('admin:monitoring.hub.table.status'),
        render: (log) => (
          <Badge
            className={cn(
              'h-5 px-2 font-black text-[9px] uppercase tracking-[0.1em] italic border-none',
              log.status === 'SUCCESS' || log.status === 'EXECUTED'
                ? 'bg-ds-background-success-subtle text-ds-text-success'
                : log.status === 'FAILED'
                  ? 'bg-ds-background-danger-subtle text-ds-text-danger'
                  : 'bg-ds-background-subtle text-ds-text-subtle'
            )}
          >
            {log.status}
          </Badge>
        ),
      },
      {
        key: 'impact',
        label: 'High-Density Metrics',
        render: (log) => {
          if (log.actionType === 'EMULATE_TRAFFIC' && log.result?.totalScans) {
            return (
              <div className="flex items-center gap-2 group/impact">
                <div className="flex -space-x-1.5 shrink-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-4 rounded-full border border-ds-background-default bg-ds-background-brand-bold/20 flex items-center justify-center"
                    >
                      <Zap className="h-2 w-2 text-ds-text-brand" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-black text-ds-text leading-none italic uppercase">
                  {log.result.totalScans} Simulated Scans
                </span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2 opacity-50">
              <div className="h-1 w-8 bg-ds-border rounded-full" />
              <span className="text-[9px] font-black text-ds-text-subtlest uppercase tracking-widest">
                N/A
              </span>
            </div>
          );
        },
      },
      {
        key: 'timestamp',
        label: t('admin:monitoring.hub.table.timestamp'),
        render: (log) => (
          <div className="flex items-center gap-2 text-ds-text-subtle tabular-nums text-[10px] font-bold">
            <Clock className="h-3 w-3 text-ds-text-brand" />
            {new Date(log.createdAt).toLocaleString(locale, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
            <span className="text-ds-text-subtlest font-medium opacity-50 ml-1">
              (
              {new Date(log.createdAt).toLocaleDateString(locale, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
              )
            </span>
          </div>
        ),
      },
      {
        key: 'actions',
        label: '',
        align: 'right',
        render: (log) => (
          <Button
            variant="subtle"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-ds-background-selected hover:text-ds-text-selected rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLog(log);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [t, locale]
  );

  const stats = [
    {
      label: 'Network Load',
      value: '14.2k',
      trend: '+12%',
      sub: 'Simulated scans / 7d',
      icon: Zap,
      color: 'text-ds-text-brand',
      bg: 'bg-ds-background-brand-bold/10',
    },
    {
      label: 'Emulation Clusters',
      value: logs.some((l) => l.status === 'RUNNING') ? 'SYNCING' : 'READY',
      trend: 'Gaussian',
      sub: 'Active load simulation',
      icon: Activity,
      color: 'text-ds-text-selected',
      bg: 'bg-ds-background-selected/10',
    },
    {
      label: 'Success Rate',
      value: '100%',
      trend: 'OPTIMAL',
      sub: 'Platform health score',
      icon: CheckCircle2,
      color: 'text-ds-text-success',
      bg: 'bg-ds-background-success-subtle',
    },
  ];

  return (
    <div className="flex flex-col gap-8 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full">
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
        {stats.map((s, i) => (
          <div
            key={i}
            className="relative group p-6 rounded-[2rem] border border-ds-border bg-ds-background-default shadow-sm hover:border-ds-border-selected transition-all duration-300 hover:shadow-md"
          >
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'p-3 rounded-2xl transition-all group-hover:scale-110',
                    s.bg,
                    s.color
                  )}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest',
                    s.color === 'text-ds-text-success'
                      ? 'bg-ds-background-success-subtle text-ds-text-success'
                      : 'bg-ds-background-selected/10 text-ds-text-selected'
                  )}
                >
                  {s.trend}
                </div>
              </div>
              <div className="flex flex-col gap-0.5 mt-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest leading-tight">
                  {s.label}
                </span>
                <span className="text-3xl font-black italic tracking-tighter text-ds-text leading-none">
                  {s.value}
                </span>
                <p className="text-[10px] font-medium text-ds-text-subtlest mt-1">
                  {s.sub}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
              <TrendingUp className="h-16 w-16 rotate-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Operational Table */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black uppercase tracking-tight text-ds-text">
                  Operational Audit Log
                </h2>
                <div className="h-1.5 w-1.5 rounded-full bg-ds-text-selected animate-pulse" />
              </div>
              {isRefreshing && (
                <div className="flex items-center gap-2 px-3 py-1 bg-ds-background-selected/10 rounded-full border border-ds-border/50">
                  <Loader2 className="h-3 w-3 animate-spin text-ds-text-selected" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ds-text-selected">
                    Live Stream
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-ds-text-subtlest">
                <div className="h-2 w-2 rounded-full bg-ds-background-brand-bold" />{' '}
                Emulation
                <div className="h-2 w-2 rounded-full bg-ds-background-selected ml-2" />{' '}
                Seeding
              </div>
            </div>
          </div>

          <div className="bg-ds-background-default border border-ds-border rounded-[2rem] shadow-sm overflow-hidden group/table">
            <DynamicTable
              columns={columns}
              items={logs}
              isLoading={loading && logs.length === 0}
              onRowClick={(log) => setSelectedLog(log)}
              rowClassName={() =>
                'group transition-all hover:bg-ds-background-subtle/50 cursor-pointer h-16 border-b border-ds-border/30 last:border-none'
              }
              emptyState={
                <div className="py-32 text-center flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-[2rem] bg-ds-background-subtle flex items-center justify-center border border-ds-border rotate-12">
                    <Activity className="h-10 w-10 text-ds-text-subtlest opacity-40 -rotate-12" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-tight text-ds-text">
                      Void Protocol Initialized
                    </p>
                    <p className="text-xs text-ds-text-subtlest font-medium">
                      No operational logs found in the primary datacenter.
                    </p>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* Tactical Actions Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-ds-background-brand-bold text-white shadow-xl shadow-ds-background-brand-bold/20 border border-ds-background-brand-bold group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Control Center
              </h3>
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
            <p className="text-[11px] font-bold text-white/80 leading-relaxed">
              Monitoring all 2026 Admin Emulation & Advanced Seeding activities.
              All actions are signed by system-admin.
            </p>
            <div className="mt-2 p-3 bg-white/10 rounded-2xl border border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-3 text-[10px] font-bold text-white/90">
                <CheckCircle2 className="h-3 w-3 text-white" />
                Immutable Audit Trace
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-white/90">
                <CheckCircle2 className="h-3 w-3 text-white" />
                Gaussian Load Balancing
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-[2rem] border border-ds-border bg-ds-background-default shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest">
              Task Execution
            </h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  href: `/${locale}/monitoring/seeding`,
                  icon: Database,
                  title: 'Seed Tenant',
                  desc: 'Bulk initialize units',
                  accent: 'hover:border-ds-border-brand',
                },
                {
                  href: `/${locale}/monitoring/emulation`,
                  icon: Zap,
                  title: 'Emulate Traffic',
                  desc: 'Simulation Protocol',
                  accent: 'hover:border-ds-border-selected',
                },
              ].map((task, idx) => (
                <Link
                  key={idx}
                  href={task.href}
                  className={cn(
                    'group/btn flex items-center gap-4 p-3 rounded-2xl border border-ds-border bg-ds-background-subtle/30 transition-all duration-300',
                    task.accent
                  )}
                >
                  <div className="h-10 w-10 rounded-xl bg-ds-background-default flex items-center justify-center border border-ds-border group-hover/btn:scale-110 transition-transform">
                    <task.icon className="h-5 w-5 text-ds-text-subtlest group-hover/btn:text-ds-text" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight text-ds-text">
                      {task.title}
                    </span>
                    <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest leading-none">
                      {task.desc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Card className="border-ds-border bg-ds-background-neutral-subtle/50 p-4 border-dashed rounded-[2rem]">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-ds-text-subtlest mt-0.5 shrink-0" />
              <p className="text-[10px] text-ds-text-subtlest font-bold leading-relaxed uppercase">
                System health is currently at 99.8%. Emulation protocols are
                running within predefined safety thresholds.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <EmulationDetailDrawer
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        locale={locale}
      />
    </div>
  );
}
