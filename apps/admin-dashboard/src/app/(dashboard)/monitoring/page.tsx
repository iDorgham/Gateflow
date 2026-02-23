import { requireAdmin } from '../../../lib/admin-auth';
import { prisma } from '@gate-access/db';
import {
  Activity,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  Users,
  QrCode,
  DoorOpen,
  ScanLine,
  Key,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, cn } from '@gate-access/ui';

export const metadata = { title: 'Monitoring' };

export default async function MonitoringPage() {
  requireAdmin();

  const now = new Date();

  // ── DB health check ────────────────────────────────────────────────────────
  let dbHealthy = false;
  let dbLatencyMs = 0;
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
    dbHealthy = true;
  } catch {
    dbHealthy = false;
  }

  // ── Model record counts ────────────────────────────────────────────────────
  const [
    orgCount,
    userCount,
    gateCount,
    qrCount,
    scanCount,
    apiKeyCount,
    webhookCount,
    webhookDeliveryFailed,
    lastScan,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.gate.count(),
    prisma.qRCode.count(),
    prisma.scanLog.count(),
    prisma.apiKey.count(),
    prisma.webhook.count({ where: { deletedAt: null } }),
    prisma.webhookDelivery.count({ where: { status: 'FAILED' } }),
    prisma.scanLog.findFirst({ orderBy: { scannedAt: 'desc' }, select: { scannedAt: true } }),
  ]);

  // ── Scan rate: last hour ───────────────────────────────────────────────────
  const oneHourAgo = new Date(now.getTime() - 3_600_000);
  const scansLastHour = await prisma.scanLog.count({ where: { scannedAt: { gte: oneHourAgo } } });

  // ── Recent webhook failures ────────────────────────────────────────────────
  const recentFailedDeliveries = await prisma.webhookDelivery.findMany({
    where: { status: 'FAILED' },
    orderBy: { lastAttemptAt: 'desc' },
    take: 5,
    select: {
      id: true,
      event: true,
      statusCode: true,
      attemptCount: true,
      lastAttemptAt: true,
      webhook: { select: { url: true, organization: { select: { name: true } } } },
    },
  });

  const modelCounts = [
    { label: 'Organizations', count: orgCount, icon: Building2, color: 'text-blue-600 bg-blue-500/10' },
    { label: 'Users', count: userCount, icon: Users, color: 'text-violet-600 bg-violet-500/10' },
    { label: 'Gates', count: gateCount, icon: DoorOpen, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'QR Codes', count: qrCount, icon: QrCode, color: 'text-amber-600 bg-amber-500/10' },
    { label: 'Scan Logs', count: scanCount, icon: ScanLine, color: 'text-rose-600 bg-rose-500/10' },
    { label: 'API Keys', count: apiKeyCount, icon: Key, color: 'text-slate-600 bg-slate-500/10' },
    { label: 'Webhooks', count: webhookCount, icon: Globe, color: 'text-cyan-600 bg-cyan-500/10' },
  ];

  const lastScanAge = lastScan
    ? Math.round((now.getTime() - lastScan.scannedAt.getTime()) / 60_000)
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Monitoring</h1>
        <p className="text-muted-foreground mt-1">Platform health, database vitals, and service status.</p>
      </div>

      {/* Health status cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Database */}
        <Card className={cn(
          'shadow-md border-2 transition-colors',
          dbHealthy ? 'border-emerald-500/20' : 'border-red-500/20'
        )}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg',
                dbHealthy ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
              )}>
                <Database className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-foreground uppercase tracking-wider">PostgreSQL</p>
                <p className={cn('text-xs font-bold mt-0.5', dbHealthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                  {dbHealthy ? `Operational · ${dbLatencyMs}ms` : 'Connection Failed'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan throughput */}
        <Card className="shadow-md border-2 border-blue-500/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-foreground uppercase tracking-wider">Scan Rate</p>
                <p className="text-xs font-bold mt-0.5 text-blue-600 dark:text-blue-400">
                  {scansLastHour.toLocaleString()} scans / hour
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last scan */}
        <Card className="shadow-md border-2 border-amber-500/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-foreground uppercase tracking-wider">Last Scan</p>
                <p className="text-xs font-bold mt-0.5 text-amber-600 dark:text-amber-400">
                  {lastScanAge === null
                    ? 'No scans yet'
                    : lastScanAge < 1
                    ? 'Less than a minute ago'
                    : lastScanAge < 60
                    ? `${lastScanAge}m ago`
                    : `${Math.round(lastScanAge / 60)}h ago`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database record counts */}
      <Card className="shadow-md">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Database Record Counts
          </CardTitle>
          <p className="text-xs text-muted-foreground">Total rows per model (including soft-deleted records).</p>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modelCounts.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-3 rounded-xl p-4 bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
              >
                <div className={cn('p-2 rounded-lg', m.color)}>
                  <m.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-bold text-foreground">{m.count.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhook health */}
      <Card className="shadow-md">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Webhook Delivery Health
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Recent delivery failures across all organizations.</p>
            </div>
            <Badge
              className={cn(
                'font-bold text-[11px]',
                webhookDeliveryFailed === 0
                  ? 'bg-emerald-500 text-white border-none'
                  : 'bg-red-500 text-white border-none'
              )}
            >
              {webhookDeliveryFailed === 0 ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  All Healthy
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {webhookDeliveryFailed} Failed
                </span>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentFailedDeliveries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
              <p className="font-medium text-sm">No webhook failures — all deliveries succeeded.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                    <th className="px-6 py-3 text-left">Organization</th>
                    <th className="px-6 py-3 text-left">Event</th>
                    <th className="px-6 py-3 text-left">Endpoint</th>
                    <th className="px-6 py-3 text-center">Attempts</th>
                    <th className="px-6 py-3 text-right">Last Attempt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentFailedDeliveries.map((d) => (
                    <tr key={d.id} className="hover:bg-red-500/5 transition-colors">
                      <td className="px-6 py-3 text-xs font-bold text-foreground">
                        {d.webhook.organization.name}
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                          {d.event}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                        {d.webhook.url}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">{d.attemptCount}</span>
                      </td>
                      <td className="px-6 py-3 text-right text-xs text-muted-foreground">
                        {d.lastAttemptAt
                          ? d.lastAttemptAt.toLocaleDateString()
                          : '—'}
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
