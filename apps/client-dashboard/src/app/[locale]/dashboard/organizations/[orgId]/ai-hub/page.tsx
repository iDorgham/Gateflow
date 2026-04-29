'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@gate-access/ui';
import {
  MaintenanceHubTable,
  MaintenanceHubRow,
} from '@/components/ai/maintenance-hub-table';
import {
  FailureAnalyticsChart,
  ScanFailureDataPoint,
} from '@/components/ai/failure-analytics-chart';
import { Activity, ShieldCheck, Zap, Cog } from 'lucide-react';

/* ─────────────── Mock Data ─────────────── */

const MOCK_TABLE_DATA: MaintenanceHubRow[] = [
  {
    id: 'clk_89123',
    gateName: 'Main Entrance - West',
    status: 'ASSIGNED',
    priority: 'URGENT',
    reason: 'Repeated Scan Failures (Hardware Timeout)',
    vendorName: 'Global Security Systems',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'clk_89124',
    gateName: 'Service Gate B',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    reason: 'Loop Detector Malfunction',
    vendorName: 'ElectroGate Solutions',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'clk_89125',
    gateName: 'Visitor Portal 1',
    status: 'OPEN',
    priority: 'MEDIUM',
    reason: 'Firmware Update Required',
    createdAt: new Date(Date.now() - 10800000),
  },
  {
    id: 'clk_89126',
    gateName: 'Resident Access 4',
    status: 'RESOLVED',
    priority: 'LOW',
    reason: 'Obstruction in Barrier Path',
    vendorName: 'Local Maintenance Team',
    createdAt: new Date(Date.now() - 86400000),
  },
];

const MOCK_CHART_DATA: ScanFailureDataPoint[] = [
  { time: '00:00', total: 120, failures: 2 },
  { time: '04:00', total: 45, failures: 1 },
  { time: '08:00', total: 450, failures: 8 },
  { time: '12:00', total: 680, failures: 12 },
  { time: '16:00', total: 520, failures: 5 },
  { time: '20:00', total: 310, failures: 3 },
  { time: '23:59', total: 150, failures: 2 },
];

/* ─────────────── Page ─────────────── */

export default function AiHubPage() {
  const { t, i18n } = useTranslation('dashboard');

  return (
    <div className="flex flex-col gap-6 p-1">
      <PageHeader
        title={t('ai.hubTitle', 'Agentic Hub')}
        subtitle={t(
          'ai.hubDescription',
          'Autonomous operations and perimeter diagnostics.'
        )}
        breadcrumbs={[
          { label: 'Dashboard', href: `/${i18n.language}/dashboard` },
          {
            label: 'AI Operations',
            href: `/${i18n.language}/dashboard/gateai`,
          },
          { label: 'Agentic Hub' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <Card className="bg-ds-surface overflow-hidden border-ds-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2 text-ds-text-subtle">
              <Zap size={14} className="text-ds-background-selected-bold" />
              Autonomous Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-[10px] text-ds-text-subtle mt-1">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-ds-surface overflow-hidden border-ds-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2 text-ds-text-subtle">
              <ShieldCheck size={14} className="text-green-500" />
              Perimeter Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.4%</div>
            <p className="text-[10px] text-ds-text-subtle mt-1">
              -0.2% variance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-ds-surface overflow-hidden border-ds-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2 text-ds-text-subtle">
              <Activity size={14} className="text-ds-background-danger-bold" />
              Hardware Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-[10px] text-ds-text-subtle mt-1 text-ds-background-danger-bold">
              Critical attention required
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Monitoring Feed (3/4) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <Card className="border-ds-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Cog size={16} />
                  Autonomous Maintenance Logs
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Real-time feed of AI-triggered work orders and vendor
                  assignments.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-t border-ds-border">
              <MaintenanceHubTable data={MOCK_TABLE_DATA} />
            </CardContent>
          </Card>
        </div>

        {/* Analytics Sidebar (1/4) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <FailureAnalyticsChart data={MOCK_CHART_DATA} />

          <Card className="border-ds-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs">Diagnostic Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ds-text-subtle">Prisma Pool</span>
                <span className="font-mono text-green-500">Active (12/20)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ds-text-subtle">Event Bus</span>
                <span className="font-mono text-green-500">34.2 msg/s</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ds-text-subtle">Hardware Latency</span>
                <span className="font-mono text-orange-500">142ms</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
