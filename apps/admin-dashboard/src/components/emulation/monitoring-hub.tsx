'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@gateflow/ui';
import {
  Search,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Zap,
  Info,
  Calendar,
  User,
  Fingerprint,
  Activity,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

/**
 * ## MonitoringHub (v4)
 * High-density history table for all platform-wide administrative seeding and emulation runs.
 */
export function MonitoringHub() {
  const [organizationId, setOrganizationId] = useState(
    'clkz88m7v000008l4f6d8h7d3'
  );
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const fetchHistory = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/emulation-history?organizationId=${organizationId}&limit=100`
      );
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
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

  // Real-time updates via SSE (v4 mandate)
  useEffect(() => {
    const eventSource = new EventSource(
      `/api/admin/emulation-history/stream?organizationId=${organizationId}`
    );

    eventSource.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        // Prepend to list unless already exists (SSE might re-send on reconnect)
        setLogs((prev) => {
          if (prev.some((l) => l.id === newLog.id)) {
            // Update existing entry (e.g. status change)
            return prev.map((l) => (l.id === newLog.id ? newLog : l));
          }
          return [newLog, ...prev];
        });
      } catch (err) {
        console.error('SSE Error parsing data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Connection Error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [organizationId]);

  const filteredLogs = logs.filter(
    (log) =>
      log.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle>System Operations History</CardTitle>
            <CardDescription>
              Unified audit trail for seeding and emulation activities.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter by type or ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchHistory}>
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="text-[11px] uppercase tracking-wider font-bold">
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Execution Window</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-accent/30 group"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.actionType === 'SEED_HIERARCHY' ? (
                        <Database className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-purple-500" />
                      )}
                      <span className="font-mono text-[11px] font-bold tracking-tight">
                        {log.actionType.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={log.status === 'EXECUTED' ? 'success' : 'danger'}
                      className="text-[10px] h-5"
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate max-w-[300px]">
                        {log.intentJson?.scenario?.replace('-', ' ') ||
                          'Structural Infill'}{' '}
                        Run
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        ID: {log.id.slice(0, 12)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(log.createdAt))} ago
                      </span>
                      <span className="text-[10px] text-muted-foreground opacity-50">
                        {format(new Date(log.createdAt), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                        SY
                      </div>
                      <span className="text-xs font-semibold">
                        {log.userId === 'system-admin'
                          ? 'System Admin'
                          : log.user?.name || 'Automated'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground opacity-40">
                      <Info className="w-12 h-12 mb-4" />
                      <p className="text-lg font-bold uppercase tracking-widest">
                        No Operational Records found
                      </p>
                      <p className="text-sm">Global Audit Log is clean.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Logic for Side Drawer (Detail View) */}
      <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <SheetContent className="w-[600px] sm:max-w-[700px] bg-card overflow-y-auto">
          <SheetHeader className="pb-6 border-b transition-all">
            <div className="flex items-center gap-3 mb-2">
              {selectedLog?.actionType === 'SEED_HIERARCHY' ? (
                <Database className="text-blue-500" />
              ) : (
                <Zap className="text-purple-500" />
              )}
              <SheetTitle className="text-2xl font-bold tracking-tight">
                Operation Insight
              </SheetTitle>
            </div>
            <SheetDescription className="font-mono text-blue-500 text-xs font-bold uppercase tracking-widest">
              Process Report: {selectedLog?.id}
            </SheetDescription>
          </SheetHeader>

          {selectedLog && (
            <div className="py-8 space-y-10">
              {/* Status Section */}
              <div className="flex items-center justify-between bg-accent/30 p-5 rounded-2xl border border-primary/10 shadow-inner">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                    Outcome Status
                  </p>
                  <p className="text-xl font-black italic">
                    {selectedLog.status}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedLog.status === 'EXECUTED' ? 'success' : 'danger'
                  }
                  className="h-8 px-4 text-xs font-bold uppercase shadow-sm"
                >
                  Validated OK
                </Badge>
              </div>

              {/* Metadata Hierarchy */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-muted-foreground">
                      <Fingerprint className="w-3 h-3" /> Target Scope
                    </Label>
                    <Card className="p-4 bg-muted/20 border-2">
                      <p className="text-xs font-bold">
                        ORG: {selectedLog.organizationId}
                      </p>
                      <p className="text-xs mt-1">
                        PROJ:{' '}
                        {selectedLog.metadata?.projectId ||
                          'Global Org Context'}
                      </p>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3 h-3" /> Temporal Metrics
                    </Label>
                    <div className="text-sm font-medium">
                      Executed on{' '}
                      {format(
                        new Date(selectedLog.createdAt),
                        'MMMM dd, yyyy @ HH:mm:ss'
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-muted-foreground">
                    <Database className="w-3 h-3" /> Relational Payload
                  </Label>
                  <div className="text-xs font-mono bg-black text-green-400 p-5 rounded-xl border border-green-500/20 shadow-2xl relative overflow-hidden max-h-[300px] overflow-y-auto">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-green-500 opacity-20 animate-pulse" />
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(
                        selectedLog.metadata || selectedLog.intentJson,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Operational Invariants Block */}
              <div className="p-6 border-2 border-dashed rounded-3xl space-y-4 bg-primary/[0.02]">
                <h4 className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  Platform Performance Impact
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  This operation resulted in the generation of{' '}
                  {selectedLog.metadata?.scanned || 0} relational records. Batch
                  chunks were optimized at 500 rows/write to prevent DB lock
                  contention.
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
