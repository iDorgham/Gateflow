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

// ─── Colour palettes ──────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: '#22c55e',
  FAILED: '#ef4444',
  EXPIRED: '#f59e0b',
  MAX_USES_REACHED: '#f97316',
  INACTIVE: '#94a3b8',
  DENIED: '#8b5cf6',
};

const QR_TYPE_COLORS: Record<string, string> = {
  SINGLE: '#3b82f6',
  RECURRING: '#8b5cf6',
  PERMANENT: '#14b8a6',
};

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gateRateColor(rate: number): string {
  if (rate >= 80) return '#22c55e';
  if (rate >= 50) return '#f59e0b';
  return '#ef4444';
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
  const maxHeatCount = Math.max(...heatmap.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      {/* Scans over time — Line chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scans Over Time</CardTitle>
          <CardDescription>All scan attempts including failures.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={daily} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Scans"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6' }}
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
            <CardTitle className="text-base">Top Gates by Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {topGates.length === 0 ? (
              <p className="text-sm text-slate-400">No gate activity yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={topGates}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#475569' }}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="scans" name="Scans" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Role breakdown — Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scans by Role</CardTitle>
          </CardHeader>
          <CardContent>
            {roleBreakdown.length === 0 ? (
              <p className="text-sm text-slate-400">No role data available.</p>
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
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, String(name).replace(/_/g, ' ')]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Legend
                    formatter={(value) => String(value).replace(/_/g, ' ')}
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
            <CardTitle className="text-base">Scans by QR Type</CardTitle>
            <CardDescription>Single-use, recurring, and permanent access codes.</CardDescription>
          </CardHeader>
          <CardContent>
            {qrTypeBreakdown.length === 0 ? (
              <p className="text-sm text-slate-400">No scan data in this period.</p>
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
                        fill={QR_TYPE_COLORS[entry.type] ?? '#94a3b8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      String(name).charAt(0) + String(name).slice(1).toLowerCase(),
                    ]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Legend
                    formatter={(value) =>
                      String(value).charAt(0) + String(value).slice(1).toLowerCase()
                    }
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
            <CardTitle className="text-base">Gate Success Rate</CardTitle>
            <CardDescription>% of scans that were successful per gate.</CardDescription>
          </CardHeader>
          <CardContent>
            {gateSuccessRates.length === 0 ? (
              <p className="text-sm text-slate-400">No gate activity in this period.</p>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#475569' }}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip
                    formatter={(value, _name, props) => {
                      const { successes, total } = props.payload as GateSuccessRate;
                      return [`${successes} / ${total} (${value}%)`, 'Success rate'];
                    }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="rate" name="Success %" radius={[0, 4, 4, 0]}>
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
            <CardTitle className="text-base">Status Breakdown (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(80, statusBreakdown.length * 44)}>
              <BarChart
                data={statusBreakdown.map((s) => ({ status: s.status.replace(/_/g, ' '), count: s._count }))}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="status"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" name="Scans" radius={[0, 4, 4, 0]}>
                  {statusBreakdown.map((s) => (
                    <Cell
                      key={s.status}
                      fill={STATUS_COLORS[s.status] ?? '#94a3b8'}
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
            <CardTitle className="text-base">Peak Hours Heatmap</CardTitle>
            <CardDescription>Scan intensity by day of week and hour.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[560px]">
              {/* Hour labels */}
              <div className="mb-1 flex">
                <div className="w-10 shrink-0" />
                {Array.from({ length: 24 }, (_, h) => (
                  <div
                    key={h}
                    className="flex-1 text-center text-[9px] text-slate-400"
                    style={{ minWidth: 18 }}
                  >
                    {h % 4 === 0 ? `${h}h` : ''}
                  </div>
                ))}
              </div>

              {/* Rows: one per DOW */}
              {DOW_LABELS.map((day, dow) => (
                <div key={dow} className="flex items-center">
                  <div className="w-10 shrink-0 text-right pr-2 text-[10px] text-slate-500">{day}</div>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const cell = heatmap.find((c) => c.dow === dow && c.hour === hour);
                    const intensity = cell ? cell.count / maxHeatCount : 0;
                    return (
                      <div
                        key={hour}
                        title={cell ? `${day} ${hour}:00 — ${cell.count} scans` : undefined}
                        className="m-[1px] flex-1 rounded-sm"
                        style={{
                          minWidth: 16,
                          height: 16,
                          backgroundColor: intensity > 0
                            ? `rgba(59,130,246,${Math.max(0.08, intensity)})`
                            : '#f1f5f9',
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
