'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
} from '@gate-access/ui';
import {
  Activity,
  Zap,
  Database,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  MoreHorizontal,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Clipboard,
  History,
} from 'lucide-react';
import Link from 'next/link';

interface EmulationLog {
  id: string;
  actionType: string;
  status: string;
  organizationId: string;
  createdAt: string;
  result: any;
  metadata: any;
  intentJson: any;
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
      <SheetContent className="sm:max-w-md bg-white border-l border-ds-border shadow-2xl p-0 flex flex-col h-full">
        <SheetHeader className="p-6 border-b border-ds-border-subtle bg-ds-background-neutral-subtle/50">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                'p-2 rounded-xl',
                log.actionType === 'EMULATE_TRAFFIC'
                  ? 'bg-ds-background-selected/15 text-ds-text-selected'
                  : 'bg-ds-background-brand-bold/15 text-ds-text-brand'
              )}
            >
              {log.actionType === 'EMULATE_TRAFFIC' ? (
                <Zap className="h-5 w-5" />
              ) : (
                <Database className="h-5 w-5" />
              )}
            </div>
            <div>
              <SheetTitle className="text-sm font-black uppercase tracking-widest">
                {log.actionType}
              </SheetTitle>
              <SheetDescription className="text-[10px] font-mono opacity-60">
                {log.id}
              </SheetDescription>
            </div>
          </div>
          <Badge
            variant={
              log.status === 'SUCCESS' || log.status === 'EXECUTED'
                ? 'success'
                : log.status === 'FAILED'
                  ? 'danger'
                  : 'subtle'
            }
            className="w-fit h-6 px-3 font-black text-[10px] uppercase tracking-widest italic"
          >
            {log.status}
          </Badge>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest border-b border-ds-border-subtle pb-1">
                Context
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-ds-text-subtle uppercase">
                    Organization
                  </p>
                  <Link
                    href={`/${locale}/organizations/${log.organizationId}`}
                    className="text-xs font-mono text-ds-text-selected hover:underline flex items-center gap-1 mt-1"
                  >
                    {log.organizationId}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ds-text-subtle uppercase">
                    Timestamp
                  </p>
                  <p className="text-xs font-medium tabular-nums mt-1">
                    {new Date(log.createdAt).toLocaleString(locale)}
                  </p>
                </div>
              </div>
            </div>

            {/* Results Summary if Emulation */}
            {log.actionType === 'EMULATE_TRAFFIC' && log.result && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest border-b border-ds-border-subtle pb-1">
                  Simulation Results
                </h4>
                <div className="bg-ds-background-neutral-subtle/30 rounded-xl p-4 border border-ds-border-subtle grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-black italic">
                      {log.result.totalScans || 0}
                    </p>
                    <p className="text-[9px] font-bold text-ds-text-subtlest uppercase">
                      Scans Generated
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black italic">
                      {log.result.scannersCount || 0}
                    </p>
                    <p className="text-[9px] font-bold text-ds-text-subtlest uppercase">
                      Active Units
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* JSON Audit */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-ds-border-subtle pb-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                  Audit Trace (JSON)
                </h4>
                <Button
                  variant="subtle"
                  size="sm"
                  className="h-5 px-2 text-[9px] font-bold uppercase gap-1"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      JSON.stringify(log.metadata || log.intentJson, null, 2)
                    )
                  }
                >
                  <Clipboard className="h-2.5 w-2.5" /> Copy
                </Button>
              </div>
              <pre className="p-4 rounded-xl bg-ds-background-neutral text-[11px] font-mono text-ds-text overflow-x-auto border border-ds-border">
                {JSON.stringify(log.metadata || log.intentJson, null, 2)}
              </pre>
            </div>
          </div>
        </ScrollArea>
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
    const interval = setInterval(() => fetchHistory(false), 8_000); // Poll every 8s for Phase 3 parity
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
                'p-1.5 rounded-lg',
                log.actionType === 'EMULATE_TRAFFIC'
                  ? 'bg-ds-background-selected/10 text-ds-text-selected'
                  : 'bg-ds-background-brand-bold/10 text-ds-text-brand'
              )}
            >
              {log.actionType === 'EMULATE_TRAFFIC' ? (
                <Zap className="h-3.5 w-3.5" />
              ) : (
                <Database className="h-3.5 w-3.5" />
              )}
            </div>
            <span className="font-bold text-xs uppercase tracking-tight">
              {log.actionType}
            </span>
          </div>
        ),
      },
      {
        key: 'organization',
        label: t('admin:monitoring.hub.table.organization'),
        render: (log) => (
          <Link
            href={`/${locale}/organizations/${log.organizationId}`}
            className="font-mono text-[10px] text-ds-text-subtle hover:text-ds-text-selected transition-colors"
          >
            {log.organizationId || 'System'}
          </Link>
        ),
      },
      {
        key: 'status',
        label: t('admin:monitoring.hub.table.status'),
        render: (log) => (
          <Badge
            variant={
              log.status === 'SUCCESS' || log.status === 'EXECUTED'
                ? 'success'
                : log.status === 'FAILED'
                  ? 'danger'
                  : 'subtle'
            }
            className="h-5 px-2 font-black text-[9px] uppercase tracking-wider"
          >
            {log.status}
          </Badge>
        ),
      },
      {
        key: 'metrics',
        label: 'Impact',
        render: (log) => {
          if (log.actionType === 'EMULATE_TRAFFIC' && log.result?.totalScans) {
            return (
              <div className="flex items-center gap-1.5 text-ds-text-subtlest font-black text-[9px] uppercase">
                <Zap className="h-2.5 w-2.5" />
                {log.result.totalScans} scans
              </div>
            );
          }
          return <span className="text-[10px] text-ds-text-subtlest">—</span>;
        },
      },
      {
        key: 'timestamp',
        label: t('admin:monitoring.hub.table.timestamp'),
        render: (log) => (
          <div className="flex items-center gap-2 text-ds-text-subtle tabular-nums text-[11px]">
            <Clock className="h-3 w-3 opacity-50" />
            {new Date(log.createdAt).toLocaleString(locale)}
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
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLog(log);
            }}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        ),
      },
    ],
    [t, locale]
  );

  const stats = [
    {
      label: t('admin:monitoring.hub.stats.total_scans'),
      value: '14.2k',
      sub: '+1.2k today',
      icon: Zap,
    },
    {
      label: t('admin:monitoring.hub.stats.active_runs'),
      value: logs.some((l) => l.status === 'RUNNING') ? 'Active' : '0',
      sub: 'Gaussian Simulation',
      icon: Activity,
    },
    {
      label: t('admin:monitoring.hub.stats.successful_seeds'),
      value: '89',
      sub: '99% system health',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Card
            key={i}
            className="border-ds-border bg-ds-background-default shadow-sm overflow-hidden group hover:border-ds-border-selected transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {s.label}
                  </p>
                  {s.value === 'Active' ? (
                    <div className="flex items-center gap-2 h-7 animate-pulse">
                      <Loader2 className="h-4 w-4 animate-spin text-ds-text-selected" />
                      <span className="text-xs font-bold text-ds-text-selected uppercase">
                        Syncing...
                      </span>
                    </div>
                  ) : (
                    <h3 className="text-2xl font-black text-ds-text leading-none italic">
                      {s.value}
                    </h3>
                  )}
                  <p className="text-[10px] font-medium text-ds-text-success tabular-nums">
                    {s.sub}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-ds-background-neutral-subtle flex items-center justify-center text-ds-text-subtle group-hover:bg-ds-background-selected/10 group-hover:text-ds-text-selected transition-all">
                  <s.icon
                    className={cn(
                      'h-5 w-5',
                      isRefreshing &&
                        s.label.includes('active') &&
                        'animate-pulse'
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main History Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-ds-text flex items-center gap-2">
                <History
                  className={cn('h-3 w-3', isRefreshing && 'animate-spin')}
                />
                Operational History
              </h3>
              {isRefreshing && (
                <Badge
                  variant="subtle"
                  className="text-[8px] font-black uppercase tracking-widest px-2 h-4 bg-ds-background-selected/10 text-ds-text-selected border-none animate-pulse"
                >
                  Live Sync
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/monitoring/emulation`}
                className="text-[10px] font-black text-ds-text-selected hover:underline uppercase tracking-widest flex items-center gap-1"
              >
                Start Emulation <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href={`/${locale}/monitoring/seeding`}
                className="text-[10px] font-black text-ds-text-selected hover:underline uppercase tracking-widest flex items-center gap-1"
              >
                Mass Seeding <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="bg-ds-background-default border border-ds-border rounded-xl shadow-sm overflow-hidden">
            <DynamicTable
              columns={columns}
              items={logs}
              loading={loading && logs.length === 0}
              onRowClick={(log) => setSelectedLog(log)}
              emptyState={
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center">
                    <Zap className="h-8 w-8 text-ds-text-subtlest opacity-50" />
                  </div>
                  <p className="text-sm font-bold text-ds-text-subtle">
                    No operational activity detected in the audit log.
                  </p>
                </div>
              }
            />
          </div>
        </div>

        {/* Real-time Intel / Actions (Stay as Ph2) */}
        <div className="space-y-6">
          <Card className="border-ds-background-brand-bold/20 bg-ds-background-brand-bold/5 shadow-inner">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-ds-text-brand flex items-center gap-2">
                <ShieldAlert className="h-3 w-3" />
                Ops Hub Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] font-medium text-ds-text-subtle leading-relaxed">
                This hub monitoring all 2026 Admin Emulation & Advanced Seeding
                activities. All actions are immutable and signed by{' '}
                <span className="font-bold text-ds-text">system-admin</span>.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtle">
                  <div className="h-1 w-1 bg-ds-text-brand rounded-full" />
                  Bypasses organization-level soft deletes
                </li>
                <li className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtle">
                  <div className="h-1 w-1 bg-ds-text-brand rounded-full" />
                  Full support for Red Sea data libraries
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-ds-background-default border border-ds-border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
              Platform Tasks
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="justify-start h-12 rounded-xl group/btn"
                asChild
              >
                <Link href={`/${locale}/monitoring/seeding`}>
                  <Database className="h-4 w-4 mr-3 text-ds-text-subtlest group-hover/btn:text-ds-text-brand" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs font-bold leading-tight">
                      Seed Tenant
                    </span>
                    <span className="text-[9px] text-ds-text-subtlest font-medium">
                      Bulk initialize units & contacts
                    </span>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-12 rounded-xl group/btn"
                asChild
              >
                <Link href={`/${locale}/monitoring/emulation`}>
                  <Zap className="h-4 w-4 mr-3 text-ds-text-subtlest group-hover/btn:text-ds-text-selected" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs font-bold leading-tight">
                      Emulate Traffic
                    </span>
                    <span className="text-[9px] text-ds-text-subtlest font-medium">
                      Rush-hour simulation (Gaussian)
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
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
