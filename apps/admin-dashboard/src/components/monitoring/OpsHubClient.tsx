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
  Button
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
  ShieldAlert
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

export function OpsHubClient({ locale }: { locale: string }) {
  const { t } = useTranslation('admin');
  const [logs, setLogs] = React.useState<EmulationLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const fetchHistory = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/emulation-history?limit=50`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 60_000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  const columns = React.useMemo<Column<EmulationLog>[]>(() => [
    {
      key: 'action',
      label: t('admin:monitoring.hub.table.action'),
      render: (log) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-1.5 rounded-lg",
            log.actionType === 'EMULATE_TRAFFIC' ? "bg-ds-background-selected/10 text-ds-text-selected" : "bg-ds-background-brand-bold/10 text-ds-text-brand"
          )}>
            {log.actionType === 'EMULATE_TRAFFIC' ? <Zap className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
          </div>
          <span className="font-bold text-xs uppercase tracking-tight">{log.actionType}</span>
        </div>
      )
    },
    {
      key: 'organization',
      label: t('admin:monitoring.hub.table.organization'),
      render: (log) => <span className="font-mono text-[10px] text-ds-text-subtle">{log.organizationId || 'System'}</span>
    },
    {
      key: 'status',
      label: t('admin:monitoring.hub.table.status'),
      render: (log) => (
        <Badge 
          variant={log.status === 'SUCCESS' ? 'success' : 'subtle'} 
          className="h-5 px-2 font-black text-[9px] uppercase tracking-wider"
        >
          {log.status}
        </Badge>
      )
    },
    {
      key: 'timestamp',
      label: t('admin:monitoring.hub.table.timestamp'),
      render: (log) => (
        <div className="flex items-center gap-2 text-ds-text-subtle tabular-nums text-[11px]">
          <Clock className="h-3 w-3 opacity-50" />
          {new Date(log.createdAt).toLocaleString(locale)}
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (log) => (
        <Button variant="subtle" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
           <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      )
    }
  ], [t, locale]);

  const stats = [
    { label: t('admin:monitoring.hub.stats.total_scans'), value: '14.2k', sub: '+1.2k today', icon: Zap },
    { label: t('admin:monitoring.hub.stats.active_runs'), value: '0', sub: 'Last run 5m ago', icon: Activity },
    { label: t('admin:monitoring.hub.stats.successful_seeds'), value: '89', sub: '99% system health', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="border-ds-border bg-ds-background-default shadow-sm overflow-hidden group hover:border-ds-border-selected transition-colors">
            <CardContent className="p-6">
               <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">{s.label}</p>
                    <h3 className="text-2xl font-black text-ds-text leading-none italic">{s.value}</h3>
                    <p className="text-[10px] font-medium text-ds-text-success">{s.sub}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-ds-background-neutral-subtle flex items-center justify-center text-ds-text-subtle group-hover:bg-ds-background-selected/10 group-hover:text-ds-text-selected transition-all">
                     <s.icon className="h-5 w-5" />
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
              <h3 className="text-xs font-black uppercase tracking-widest text-ds-text flex items-center gap-2">
                 <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                 Operational History
              </h3>
              <div className="flex items-center gap-4">
                 <Link href={`/${locale}/monitoring/emulation`} className="text-[10px] font-black text-ds-text-selected hover:underline uppercase tracking-widest flex items-center gap-1">
                    Start Emulation <ArrowRight className="h-3 w-3" />
                 </Link>
                 <Link href={`/${locale}/monitoring/seeding`} className="text-[10px] font-black text-ds-text-selected hover:underline uppercase tracking-widest flex items-center gap-1">
                    Mass Seeding <ArrowRight className="h-3 w-3" />
                 </Link>
              </div>
           </div>

           <div className="bg-ds-background-default border border-ds-border rounded-xl shadow-sm overflow-hidden">
             <DynamicTable 
               columns={columns}
               items={logs}
               loading={loading && logs.length === 0}
               emptyState={
                 <div className="py-20 text-center flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center">
                       <Zap className="h-8 w-8 text-ds-text-subtlest opacity-50" />
                    </div>
                    <p className="text-sm font-bold text-ds-text-subtle">No operational activity detected in the audit log.</p>
                 </div>
               }
             />
           </div>
        </div>

        {/* Real-time Intel / Actions */}
        <div className="space-y-6">
           <Card className="border-ds-background-brand-bold/20 bg-ds-background-brand-bold/5">
              <CardHeader className="pb-2">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-ds-text-brand flex items-center gap-2">
                    <ShieldAlert className="h-3 w-3" />
                    Ops Hub Intel
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-[11px] font-medium text-ds-text-subtle leading-relaxed">
                    This hub monitoring all 2026 Admin Emulation & Advanced Seeding activities. All actions are immutable and signed by <span className="font-bold text-ds-text">system-admin</span>.
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
              <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Platform Quick Tasks</h3>
              <div className="grid grid-cols-1 gap-3">
                 <Button variant="outline" className="justify-start h-12 rounded-xl group/btn" asChild>
                    <Link href={`/${locale}/monitoring/seeding`}>
                      <Database className="h-4 w-4 mr-3 text-ds-text-subtlest group-hover/btn:text-ds-text-brand" />
                      <div className="flex flex-col items-start">
                         <span className="text-xs font-bold leading-tight">Seed Tenant</span>
                         <span className="text-[9px] text-ds-text-subtlest font-medium">Bulk initialize units & contacts</span>
                      </div>
                    </Link>
                 </Button>
                 <Button variant="outline" className="justify-start h-12 rounded-xl group/btn" asChild>
                    <Link href={`/${locale}/monitoring/emulation`}>
                      <Zap className="h-4 w-4 mr-3 text-ds-text-subtlest group-hover/btn:text-ds-text-selected" />
                      <div className="flex flex-col items-start">
                         <span className="text-xs font-bold leading-tight">Emulate Traffic</span>
                         <span className="text-[9px] text-ds-text-subtlest font-medium">Rush-hour simulation (Gaussian)</span>
                      </div>
                    </Link>
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
