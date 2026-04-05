'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Filter,
  Clock,
  User as UserIcon,
  Building,
  Settings,
  ChevronRight,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileJson,
  Calendar,
  Layers,
  ArrowUpDown,
  Layout as LayoutIcon,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Label,
  cn,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@gate-access/ui';
import { format } from 'date-fns';

/**
 * Universal Audit Trail Viewer
 * High-performance, high-density table for tracking all AI/Human actions.
 * Consumes AiActionLog and AuditLog tables.
 */
export function AuditTrailViewer() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [selectedLog, setSelectedLog] = React.useState<any>(null);
  const [search, setSearch] = React.useState('');
  const [filterType, setFilterType] = React.useState('ALL');

  // Fetch Logic (Stubized for brevity)
  React.useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/audit-logs'); // Hypothetical unified endpoint
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      (filterType === 'ALL' || l.action === filterType) &&
      (l.prompt?.toLowerCase().includes(search.toLowerCase()) ||
        l.result?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between px-6 py-4 bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-border/30">
            <Shield className="h-5 w-5 text-emerald-500" />
            <h1 className="text-sm font-black uppercase tracking-tighter">
              Ops Audit Trail
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-muted/30 px-3 h-10 rounded-xl border border-border/20 max-w-md w-80">
            <Search className="h-4 w-4 text-ds-text-subtler" />
            <input
              className="bg-transparent border-none outline-none text-[11px] font-bold w-full placeholder:opacity-50"
              placeholder="Search reasoning, payload, or IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                'cursor-pointer hover:bg-primary transition-colors text-[9px] font-black uppercase tracking-widest px-3 h-6',
                filterType === 'ALL'
                  ? 'bg-primary'
                  : 'bg-muted text-ds-text-subtler'
              )}
              onClick={() => setFilterType('ALL')}
            >
              ALL
            </Badge>
            <Badge
              className={cn(
                'cursor-pointer hover:bg-primary transition-colors text-[9px] font-black uppercase tracking-widest px-3 h-6',
                filterType === 'CRM'
                  ? 'bg-primary'
                  : 'bg-muted text-ds-text-subtler'
              )}
              onClick={() => setFilterType('CRM')}
            >
              CRM
            </Badge>
            <Badge
              className={cn(
                'cursor-pointer hover:bg-primary transition-colors text-[9px] font-black uppercase tracking-widest px-3 h-6',
                filterType === 'CMS'
                  ? 'bg-primary'
                  : 'bg-muted text-ds-text-subtler'
              )}
              onClick={() => setFilterType('CMS')}
            >
              CMS
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Download className="h-4 w-4" /> Export intelligence
          </Button>
        </div>
      </div>

      {/* DENSE DATA TABLE */}
      <Card className="flex-1 border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden flex flex-col shadow-inner">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/30 border-b border-border/30 text-[9px] font-black uppercase tracking-widest text-ds-text-subtler">
          <div className="col-span-2 flex items-center gap-2">
            Timestamp <ArrowUpDown className="h-2.5 w-2.5" />
          </div>
          <div className="col-span-2">Department / Action</div>
          <div className="col-span-4">Operation Reasoning</div>
          <div className="col-span-2">Entity Context</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">View</div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/20">
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                layout
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => setSelectedLog(log)}
              >
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className="text-[10px] font-black font-mono">
                    {format(new Date(log.createdAt), 'dd.MM HH:mm:ss')}
                  </span>
                  <span className="text-[9px] font-bold text-ds-text-subtler uppercase tracking-tight">
                    Asia/Riyadh TZ
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <LayoutIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      {log.action}
                    </span>
                    <span className="text-[9px] font-bold text-ds-text-subtler uppercase">
                      MARKETING HUB
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <p className="text-[10px] font-bold leading-relaxed line-clamp-1 italic text-ds-text-subtle">
                    &quot;{log.prompt}&quot;
                  </p>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <Building className="h-3 w-3 text-ds-text-subtler opacity-40" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtler truncate max-w-[150px]">
                    {log.organizationId}
                  </span>
                </div>

                <div className="col-span-1">
                  <Badge
                    className={cn(
                      'text-[8px] font-black uppercase border-none',
                      log.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : log.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                    )}
                  >
                    {log.status}
                  </Badge>
                </div>

                <div className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="h-96 flex flex-col items-center justify-center opacity-20 filter grayscale">
                <Layers className="h-12 w-12 mb-4" />
                <p className="text-sm font-black uppercase tracking-[0.2em]">
                  No operational records found
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 bg-muted/20 border-t border-border/30 px-6 flex justify-between items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtler">
            {filteredLogs.length} Records Loaded
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-4 text-[9px] font-black uppercase tracking-widest"
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-4 text-[9px] font-black uppercase tracking-widest"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* DETAIL DRAWER */}
      <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <SheetContent className="w-[500px] sm:w-[600px] border-l border-border/50 backdrop-blur-xl bg-card/60">
          <SheetHeader className="pb-8 border-b border-border/30">
            <SheetTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-3">
              <Shield className="h-4 w-4 text-primary" /> Intelligence Report
              Detail
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-8rem)] pt-8">
            {selectedLog && (
              <div className="space-y-8 pb-12">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                    AI Reasoning & Prompt
                  </Label>
                  <Card className="bg-muted/40 border-border/30">
                    <CardContent className="p-4 text-xs font-bold leading-relaxed text-ds-text-subtle italic">
                      &ldquo;{selectedLog.prompt}&rdquo;
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                    Execution Result
                  </Label>
                  <div className="flex gap-3">
                    <div className="h-10 w-1 bg-emerald-500 rounded-full" />
                    <p className="text-xs font-black uppercase tracking-tight leading-relaxed">
                      {selectedLog.result}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-2">
                    <XCircle className="h-3 w-3" /> Security & Origin
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                      <p className="text-[9px] font-black uppercase text-ds-text-subtler">
                        Org Context
                      </p>
                      <p className="text-[10px] font-black uppercase">
                        {selectedLog.organizationId}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                      <p className="text-[9px] font-black uppercase text-ds-text-subtler">
                        User Principal
                      </p>
                      <p className="text-[10px] font-black uppercase">
                        {selectedLog.userId || 'AI AUTOMATION'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-2">
                    <FileJson className="h-3 w-3" /> Raw Intelligence Payload
                  </Label>
                  <pre className="p-6 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[9px] leading-normal overflow-x-hidden border border-emerald-500/20 shadow-2xl">
                    {JSON.stringify(
                      JSON.parse(selectedLog.metadata || '{}'),
                      null,
                      2
                    )}
                  </pre>
                </div>

                <Separator className="bg-border/30" />

                <div className="flex gap-4">
                  <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] h-12 gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Re-Confirm Action
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-black uppercase tracking-widest text-[10px] h-12 gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" /> Challenge Logic
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
