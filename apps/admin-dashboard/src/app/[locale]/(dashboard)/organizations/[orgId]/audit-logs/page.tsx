'use client';

import { useState, useEffect, use } from 'react';
import {
  Activity,
  Search,
  Filter,
  Download,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
  Calendar,
  Database,
  Cpu,
  ShieldCheck,
  Eye,
  Loader2,
  Table as TableIcon,
} from 'lucide-react';
import { Button } from '@gate-access/ui/components/ui/button';
import { Input } from '@gate-access/ui/components/ui/input';
import { Badge } from '@gate-access/ui/components/ui/badge';
import { ScrollArea } from '@gate-access/ui/components/ui/scroll-area';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuditLogsPage(props: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const params = use(props.params);
  const { orgId } = params;

  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [orgId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/audit/logs?orgId=${orgId}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <header className="h-20 bg-white border-b border-ds-border/40 px-8 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              Neural Audit Trail
            </h1>
            <p className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-green-500" />
              Sovereign Logging • Law 151/2020 Compliant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-text-subtle" />
            <Input
              placeholder="Filter actions or prompts..."
              className="pl-10 h-10 bg-ds-background-neutral-subtle/50 border-ds-border/20 rounded-xl text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-ds-border/60 text-[10px] font-bold uppercase tracking-widest gap-2"
          >
            <Calendar className="w-4 h-4" /> Custom Range
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border-ds-border/60 text-[10px] font-bold uppercase tracking-widest gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Table View */}
        <div className="flex-1 bg-ds-background-neutral-subtle/20 overflow-hidden flex flex-col p-8">
          <div className="bg-white rounded-[32px] border border-ds-border/40 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-ds-border/10 flex items-center justify-between bg-ds-background-neutral-subtle/5">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">
                    Total Operations
                  </span>
                  <span className="text-sm font-bold">
                    {logs.length} Actions
                  </span>
                </div>
                <div className="w-px h-6 bg-ds-border/10" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">
                    Retention Status
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    Active (365 Days)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold h-6"
                >
                  LIVE REPLAY ENABLED
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 border-b border-ds-border/10">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    <th className="px-8 py-4">Action & ID</th>
                    <th className="px-8 py-4">Intelligence Source</th>
                    <th className="px-8 py-4">Timestamp</th>
                    <th className="px-8 py-4">Outcome</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ds-border/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-ds-text-subtle">
                          Deciphering Neural Logs...
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className={`group hover:bg-ds-background-neutral-subtle/50 transition-colors cursor-pointer ${selectedLog?.id === log.id ? 'bg-blue-50/30' : ''}`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm text-ds-text-main flex items-center gap-2">
                              {log.action}
                              {log.status === 'CONFIRMED' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                              )}
                            </span>
                            <span className="text-[10px] font-medium text-ds-text-subtle truncate max-w-[200px]">
                              ID: {log.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-ds-background-neutral-subtle flex items-center justify-center border border-ds-border/10">
                              <Cpu className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">
                                Gemini 1.5 Flash
                              </span>
                              <span className="text-[9px] text-ds-text-subtle font-bold uppercase tracking-tighter">
                                Probabilistic Engine
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-ds-text-subtle font-medium">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Badge
                            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              log.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : log.status === 'FAILED'
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {log.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-4 h-4 text-ds-text-subtle" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>

        {/* Detail Side Panel */}
        <AnimatePresence>
          {selectedLog && (
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-[450px] bg-white border-l border-ds-border/40 shadow-2xl z-20 flex flex-col"
            >
              <div className="p-8 border-b border-ds-border/40 flex items-center justify-between bg-ds-background-neutral-subtle/10">
                <div className="space-y-1">
                  <h2 className="font-black italic uppercase tracking-tighter text-lg">
                    Log Intelligence
                  </h2>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> Immutable Entry
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedLog(null)}
                  className="rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-8">
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <Info className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                          Action Class
                        </p>
                        <p className="font-black text-xl italic uppercase tracking-tight">
                          {selectedLog.action}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-ds-background-neutral-subtle/30 border border-ds-border/10">
                        <p className="text-[9px] font-black text-ds-text-subtle uppercase tracking-widest mb-1">
                          Status
                        </p>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest">
                          {selectedLog.status}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-ds-background-neutral-subtle/30 border border-ds-border/10">
                        <p className="text-[9px] font-black text-ds-text-subtle uppercase tracking-widest mb-1">
                          Timestamp
                        </p>
                        <p className="text-xs font-bold text-ds-text-main">
                          {new Date(selectedLog.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input/Prompt */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Stimulus / Input
                    </h3>
                    <div className="p-5 rounded-2xl bg-ds-background-neutral-subtle border border-ds-border/10 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                      {selectedLog.prompt}
                    </div>
                  </div>

                  {/* Result/Payload */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                        Neural Result / Payload
                      </h3>
                      <Badge className="text-[8px] bg-indigo-600">JSON</Badge>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
                      <pre>
                        {JSON.stringify(
                          JSON.parse(selectedLog.result || '{}'),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>

                  {/* Context */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Execution Context
                    </h3>
                    <div className="space-y-2 bg-ds-background-neutral-subtle/30 p-5 rounded-2xl border border-ds-border/10">
                      <div className="flex justify-between text-xs">
                        <span className="text-ds-text-subtle font-bold uppercase tracking-widest text-[9px]">
                          Organization
                        </span>
                        <span className="font-bold">
                          {selectedLog.organization?.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-ds-text-subtle font-bold uppercase tracking-widest text-[9px]">
                          Scope
                        </span>
                        <span className="font-bold uppercase tracking-tighter">
                          SYSTEM_WIDE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-ds-border/40">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs h-12 gap-3 shadow-xl shadow-blue-100">
                  <Activity className="w-4 h-4" /> Replay Action
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
