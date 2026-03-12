'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Badge, cn } from '@gate-access/ui';
import {
  Database,
  Zap,
  Activity,
  Building2,
  Users,
  Clock,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ServiceStatusCard } from './ServiceStatusCard';
import { LiveMetricsGrid } from './LiveMetricsGrid';

interface HealthData {
  timestamp: string;
  services: {
    database: { status: 'ok' | 'error'; latencyMs: number; message?: string };
    redis: { status: 'ok' | 'error' | 'unconfigured'; latencyMs?: number; message?: string };
  };
  metrics: {
    scansLastHour: number;
    failedScansLastHour: number;
    errorRate: number;
    activeScanners: number;
    pendingQueueEstimate: number;
  };
  platform: {
    totalOrgs: number;
    totalUsers: number;
    uptime: number;
  };
}

interface MonitoringClientProps {
  webhookFailures: {
    id: string;
    event: string;
    url: string;
    orgName: string;
    attemptCount: number;
    lastAttemptAt: string | null;
  }[];
  totalWebhookFailed: number;
  locale: string;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function MonitoringClient({ webhookFailures, totalWebhookFailed, locale }: MonitoringClientProps) {
  const params = useParams();
  const localeParam = (params?.locale as string) ?? locale;
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`/${localeParam}/api/admin/health`);
      if (!res.ok) return;
      const data = await res.json() as { success: boolean; data?: HealthData } & HealthData;
      // Route returns the data directly (not wrapped in data)
      setHealth(data);
      setLastUpdated(new Date());
    } catch {
      // silent on poll failure
    } finally {
      setLoading(false);
    }
  }, [localeParam]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const errorRatePct = health ? Math.round(health.metrics.errorRate * 100) : 0;

  const liveMetrics = health ? [
    {
      label: 'Scans / Hour',
      value: health.metrics.scansLastHour,
      sub: `${health.metrics.failedScansLastHour} failed`,
      highlight: health.metrics.scansLastHour > 0 ? 'ok' as const : 'neutral' as const,
    },
    {
      label: 'Error Rate',
      value: `${errorRatePct}%`,
      sub: `${health.metrics.failedScansLastHour} failed scans`,
      highlight: errorRatePct > 10 ? 'danger' as const : errorRatePct > 2 ? 'warning' as const : 'ok' as const,
    },
    {
      label: 'Active Scanners',
      value: health.metrics.activeScanners,
      sub: 'last 15 min',
      highlight: 'neutral' as const,
    },
    {
      label: 'Recent Queue',
      value: health.metrics.pendingQueueEstimate,
      sub: 'scans last 5 min',
      highlight: 'neutral' as const,
    },
  ] : [];

  const platformMetrics = health ? [
    { label: 'Organizations', value: health.platform.totalOrgs, highlight: 'neutral' as const },
    { label: 'Users', value: health.platform.totalUsers, highlight: 'neutral' as const },
    { label: 'Uptime', value: formatUptime(health.platform.uptime), sub: 'process uptime', highlight: 'ok' as const },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Last updated + refresh info */}
      <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', loading && 'animate-pulse')}>
        <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
        <span>
          {lastUpdated
            ? `Last updated ${lastUpdated.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · auto-refreshes every 30s`
            : 'Loading…'}
        </span>
      </div>

      {/* Service status cards */}
      {health && (
        <div className="grid gap-4 sm:grid-cols-2">
          <ServiceStatusCard
            label="PostgreSQL Database"
            status={health.services.database.status}
            latencyMs={health.services.database.latencyMs}
            message={health.services.database.message}
            icon={Database}
          />
          <ServiceStatusCard
            label="Redis Cache"
            status={health.services.redis.status}
            latencyMs={health.services.redis.latencyMs}
            message={health.services.redis.message ?? (health.services.redis.status === 'unconfigured' ? 'Set UPSTASH_REDIS_REST_URL to enable' : undefined)}
            icon={Zap}
          />
        </div>
      )}

      {/* Live metrics */}
      {liveMetrics.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scan Metrics</p>
          <LiveMetricsGrid metrics={liveMetrics} />
        </div>
      )}

      {/* Platform snapshot */}
      {platformMetrics.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform Snapshot</p>
          <LiveMetricsGrid metrics={platformMetrics} />
        </div>
      )}

      {/* Webhook health */}
      <Card className="shadow-md">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Webhook Health
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Recent failed webhook deliveries</p>
            </div>
            <Badge className={cn(
              'font-bold text-[11px] border-none',
              totalWebhookFailed === 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            )}>
              {totalWebhookFailed === 0 ? (
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> All healthy</span>
              ) : (
                <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {totalWebhookFailed} failed</span>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {webhookFailures.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
              <p className="font-medium text-sm">No webhook failures</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                    <th className="px-5 py-3 text-left">Organization</th>
                    <th className="px-5 py-3 text-left">Event</th>
                    <th className="px-5 py-3 text-left">Endpoint</th>
                    <th className="px-5 py-3 text-center">Attempts</th>
                    <th className="px-5 py-3 text-right">Last Attempt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {webhookFailures.map((d) => (
                    <tr key={d.id} className="hover:bg-red-500/5 transition-colors">
                      <td className="px-5 py-3 text-xs font-bold text-foreground">{d.orgName}</td>
                      <td className="px-5 py-3">
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase">{d.event}</Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground font-mono truncate max-w-[180px]">{d.url}</td>
                      <td className="px-5 py-3 text-center text-xs font-black text-red-600 dark:text-red-400">{d.attemptCount}</td>
                      <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                        {d.lastAttemptAt ? new Date(d.lastAttemptAt).toLocaleDateString(locale) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
