'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
  // ADS-compliant components...
} from '@gate-access/ui';
import { SeedingWizard } from './seeding-wizard';
import {
  Database,
  Clock,
  History,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * ## SeedingHub (v4)
 * Advanced organizational hierarchy and data seeding control center.
 */
export function SeedingHub() {
  const [organizationId, setOrganizationId] = useState(
    'clkz88m7v000008l4f6d8h7d3'
  ); // TODO: Context-driven or selector
  const [history, setHistory] = useState<any[]>([]);
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
          data.data.filter((l: any) => l.actionType === 'SEED_HIERARCHY')
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
        <SeedingWizard organizationId={organizationId} />
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg border-2 border-primary/10 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Seeding Events
              </CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Recent Structural Ops
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
                <Database className="w-10 h-10 text-muted-foreground/20 mb-4" />
                <p className="text-sm font-medium">No Recent Runs</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Execute your first seeding run using the wizard.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {history.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 hover:bg-accent/30 transition-colors group relative cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.status === 'EXECUTED' ? 'success' : 'danger'
                          }
                          className="text-[10px] font-mono px-1 h-4"
                        >
                          {log.status}
                        </Badge>
                        <span className="text-xs font-mono font-medium text-muted-foreground">
                          /{log.id.slice(-6)}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(log.createdAt))} ago
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold truncate leading-tight group-hover:text-blue-500 transition-colors">
                        Hierarchy Seeding:{' '}
                        {log.intentJson?.projectId || 'Global'}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 italic">
                        Ranges: {log.intentJson?.ranges?.minPhases}-
                        {log.intentJson?.ranges?.maxPhases} phases,{' '}
                        {log.intentJson?.ranges?.minBuildings}-
                        {log.intentJson?.ranges?.maxBuildings} bldgs
                      </p>
                    </div>
                    {/* Hover detail preview - simple tooltip or expanded card future */}
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
                View Full Seeding AuditLog
              </button>
            </div>
          )}
        </Card>

        {/* Security / Safety Mandates block */}
        <div className="p-5 border-2 border-yellow-500/20 bg-yellow-500/5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-yellow-600">
            <span className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center font-bold font-mono text-[10px]">
              !
            </span>
            <h4 className="text-sm font-bold uppercase tracking-tight">
              Security Constraints
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <li className="flex gap-2">
              <span className="text-yellow-500">•</span>
              Rate Limited: 10 structural runs per hour (Platform Limit).
            </li>
            <li className="flex gap-2 text-primary font-medium">
              <span className="text-yellow-500">•</span>
              Audit mandatory: Every run is signed with <b>system-admin</b>{' '}
              actor.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
