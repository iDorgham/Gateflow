'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  // ADS-compliant components...
} from '@gateflow/ui';
import { EmulationWizard } from './emulation-wizard';
import {
  Activity,
  Clock,
  History,
  MoreVertical,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * ## EmulationHub (v4)
 * Advanced traffic simulation and stress testing control center.
 */
interface EmulationLog {
  id: string;
  status: 'EXECUTED' | 'FAILED';
  actionType: string;
  createdAt: string;
  intentJson?: {
    scenario: string;
    totalScans?: number;
    pastDays?: number;
  };
  metadata?: {
    totalScans?: number;
  };
}

export function EmulationHub() {
  const organizationId = 'clkz88m7v000008l4f6d8h7d3'; // TODO: Context-driven or selector
  const [history, setHistory] = useState<EmulationLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/emulation-history?organizationId=${organizationId}&limit=10`
      );
      const data = await res.json();
      if (data.success) {
        setHistory(
          data.data.filter(
            (l: EmulationLog) => l.actionType === 'EMULATE_TRAFFIC'
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <EmulationWizard organizationId={organizationId} />
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg border-2 border-primary/10 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Emulation Events
              </CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Recent Traffic simulations
              </CardDescription>
            </div>
            <button
              onClick={fetchHistory}
              className={`p-1.5 rounded-full hover:bg-accent transition-colors ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 && !loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                <Activity className="w-10 h-10 text-muted-foreground/20 mb-4" />
                <p className="text-sm font-medium">No Recent Simulations</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Execute your first simulation using the wizard.
                </p>
              </div>
            ) : (
              <div className="divide-y text-[13px]">
                {history.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 hover:bg-accent/30 transition-colors group relative cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.status === 'EXECUTED' ? 'success' : 'danger'
                          }
                          className="text-[9px] font-mono px-1 h-3.5 leading-none"
                        >
                          {log.status === 'EXECUTED'
                            ? 'RUN_COMPLETED'
                            : 'RUN_FAILED'}
                        </Badge>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground opacity-60">
                          /{log.id.slice(-6)}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(log.createdAt))} ago
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <p className="font-semibold leading-tight group-hover:text-blue-500 transition-colors">
                        {log.intentJson?.scenario.replace('-', ' ')} Scenario
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {log.metadata?.totalScans ||
                            log.intentJson?.totalScans}{' '}
                          scans
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span>{log.intentJson?.pastDays} days window</span>
                      </div>
                    </div>

                    {/* Result Summary Bar future expansion */}
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden opacity-30 mt-2">
                      <div className="h-full bg-blue-500 w-[70%]" />
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {history.length > 0 && (
            <div className="p-3 border-t bg-accent/20 text-center">
              <button className="text-xs font-bold text-primary hover:underline uppercase tracking-tighter">
                Enter Monitoring Hub Dashboard
              </button>
            </div>
          )}
        </Card>

        {/* Global Stress Mode Banner */}
        <div className="p-5 border-2 border-blue-500/20 bg-blue-500/5 rounded-xl space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-blue-600">
            <Activity className="w-5 h-5" />
            <h4 className="text-sm font-bold uppercase tracking-tight">
              Platform Load Test
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Global mode enables multiple organization simulation concurrently.
            Contact <b>SysAdmin</b> for permission levels above 100k scans.
          </p>
        </div>
      </div>
    </div>
  );
}
