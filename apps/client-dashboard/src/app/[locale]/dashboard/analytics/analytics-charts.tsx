'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@gate-access/ui';
import { useTranslation } from 'react-i18next';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DailyCount {
  date: string; // ISO string for serialisation
  count: number;
}

export interface StatusCount {
  status: string;
  _count: number;
}

export interface GateCount {
  name: string;
  scans: number;
}

export interface HeatmapCell {
  dow: number; // 0=Sun … 6=Sat
  hour: number; // 0–23
  count: number;
}

export interface RoleCount {
  role: string;
  count: number;
}

export interface QRTypeCount {
  type: string; // SINGLE | RECURRING | PERMANENT
  count: number;
}

export interface GateSuccessRate {
  name: string;
  successes: number;
  total: number;
  rate: number; // 0–100
}

export interface AnalyticsChartsProps {
  daily: DailyCount[];
  statusBreakdown: StatusCount[];
  topGates: GateCount[];
  heatmap: HeatmapCell[];
  roleBreakdown: RoleCount[];
  qrTypeBreakdown: QRTypeCount[];
  gateSuccessRates: GateSuccessRate[];
  dateLabel: string;
}

// ─── Colour palettes (design tokens: --chart-1 to --chart-5, --success, --warning, --destructive, --muted-foreground) ───

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'hsl(var(--success))',
  FAILED: 'hsl(var(--destructive))',
  EXPIRED: 'hsl(var(--warning))',
  MAX_USES_REACHED: 'hsl(var(--warning))',
  INACTIVE: 'hsl(var(--muted-foreground))',
  DENIED: 'hsl(var(--chart-4))',
};

const QR_TYPE_COLORS: Record<string, string> = {
  SINGLE: 'hsl(var(--chart-1))',
  RECURRING: 'hsl(var(--chart-2))',
  PERMANENT: 'hsl(var(--chart-3))',
};

const DOW_LABELS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gateRateColor(rate: number): string {
  if (rate >= 80) return 'hsl(var(--success))';
  if (rate >= 50) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
}

// ─── AnalyticsCharts ──────────────────────────────────────────────────────────

export function AnalyticsCharts({
  daily,
  statusBreakdown,
  topGates,
  heatmap,
  roleBreakdown,
  qrTypeBreakdown,
  gateSuccessRates,
}: AnalyticsChartsProps) {
  const { t } = useTranslation('dashboard');
  const maxHeatCount = Math.max(...heatmap.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      {/* Scans over time — Line chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('analytics.scansOverTime')}</CardTitle>
          <CardDescription>{t('analytics.scansOverTimeDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={daily} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name={t('analytics.scans')}
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ r: 3, fill: 'hsl(var(--chart-1))' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 1: Top gates + Role breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Top gates — Horizontal bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('analytics.topGates')}</CardTitle>
          </CardHeader>
          <CardContent>
            {topGates.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('analytics.noGateActivity')}</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={topGates}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="scans" name={t('analytics.scans')} fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Role breakdown — Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('analytics.scansByRole')}</CardTitle>
          </CardHeader>
          <CardContent>
            {roleBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('analytics.noRoleData')}</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={roleBreakdown}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={72}
                    innerRadius={36}
                    label={({ role, percent }) =>
                      `${role?.replace(/_/g, ' ')} ${Math.round((percent ?? 0) * 100)}%`
                    }
                    labelLine={false}
                  >
                    {roleBreakdown.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, String(name).replace(/_/g, ' ')]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend
                    formatter={(value) => t(`overview.roles.${value}`, { defaultValue: String(value).replace(/_/g, ' ') })}
                    iconSize={10}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: QR Type breakdown + Gate success rates */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* QR Type breakdown — Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('analytics.scansByQrType')}</CardTitle>
            <CardDescription>{t('analytics.qrTypeDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {qrTypeBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('analytics.noScanDataInRange')}</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={qrTypeBreakdown}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={72}
                    innerRadius={36}
                    label={({ type, percent }) =>
                      `${String(type).charAt(0) + String(type).slice(1).toLowerCase()} ${Math.round((percent ?? 0) * 100)}%`
                    }
                    labelLine={false}
                  >
                    {qrTypeBreakdown.map((entry) => (
                      <Cell
                        key={entry.type}
                        fill={QR_TYPE_COLORS[entry.type] ?? 'hsl(var(--muted-foreground))'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      String(name).charAt(0) + String(name).slice(1).toLowerCase(),
                    ]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend
                    formatter={(value) => t(`qrcodes.types.${value}`, { defaultValue: String(value).charAt(0) + String(value).slice(1).toLowerCase() })}
                    iconSize={10}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gate success rates — Horizontal bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('analytics.gateSuccessRate')}</CardTitle>
            <CardDescription>{t('analytics.gateSuccessRateDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {gateSuccessRates.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('analytics.noGateActivityInRange')}</p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(120, gateSuccessRates.length * 32)}
              >
                <BarChart
                  data={gateSuccessRates}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip
                    formatter={(value, _name, props) => {
                      const { successes, total } = props.payload as GateSuccessRate;
                      return [`${successes} / ${total} (${value}%)`, t('analytics.successRateLabel')];
                    }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="rate" name={t('analytics.successPct')} radius={[0, 4, 4, 0]}>
                    {gateSuccessRates.map((entry) => (
                      <Cell key={entry.name} fill={gateRateColor(entry.rate)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status breakdown — Horizontal bars */}
      {statusBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('analytics.statusBreakdown30d')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(80, statusBreakdown.length * 44)}>
              <BarChart
                data={statusBreakdown.map((s) => ({ status: s.status.replace(/_/g, ' '), count: s._count }))}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="status"
                  tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" name={t('analytics.scans')} radius={[0, 4, 4, 0]}>
                  {statusBreakdown.map((s) => (
                    <Cell
                      key={s.status}
                      fill={STATUS_COLORS[s.status] ?? 'hsl(var(--muted-foreground))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Peak hours heatmap — DOW × hour grid */}
      {heatmap.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('analytics.peakHoursHeatmap')}</CardTitle>
            <CardDescription>{t('analytics.peakHoursDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[560px]">
              {/* Hour labels */}
              <div className="mb-1 flex">
                <div className="w-10 shrink-0" />
                {Array.from({ length: 24 }, (_, h) => (
                  <div
                    key={h}
                    className="flex-1 text-center text-[9px] text-muted-foreground"
                    style={{ minWidth: 18 }}
                  >
                    {h % 4 === 0 ? t('analytics.hourLabel', { h }) : ''}
                  </div>
                ))}
              </div>

              {/* Rows: one per DOW */}
              {DOW_LABELS.map((dayKey, dow) => (
                <div key={dow} className="flex items-center">
                  <div className="w-10 shrink-0 text-right pr-2 text-[10px] text-muted-foreground">{t(`analytics.daysOfWeek.${dayKey}`)}</div>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const cell = heatmap.find((c) => c.dow === dow && c.hour === hour);
                    const intensity = cell ? cell.count / maxHeatCount : 0;
                    const dayLabel = t(`analytics.daysOfWeek.${dayKey}`);
                    return (
                      <div
                        key={hour}
                        title={cell ? `${dayLabel} ${hour}:00 — ${cell.count} ${t('analytics.scans')}` : undefined}
                        className="m-[1px] flex-1 rounded-sm"
                        style={{
                          minWidth: 16,
                          height: 16,
                          backgroundColor: intensity > 0
                            ? `rgba(var(--primary-rgb),${Math.max(0.08, intensity)})`
                            : 'hsl(var(--muted))',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
