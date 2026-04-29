'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ScrollArea,
  Separator,
  cn
} from '@gate-access/ui';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  FileJson,
  User as UserIcon,
  ChevronRight,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogEntry {
  id: string;
  action: string;
  prompt: string;
  reasoning: string;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'REJECTED';
  department: string;
  userId: string;
  userName: string;
  createdAt: string;
  payload: any;
}

/**
 * AI Audit Trail Viewer
 * 
 * A high-transparency log viewer for all AI-driven actions.
 * Enables compliance auditing, reasoning inspection, and 
 * historical action tracking across the platform.
 */
export function AuditTrailViewer({ logs }: { logs: AuditLogEntry[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reasoning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Log List */}
      <div className={cn("flex flex-col gap-6", selectedLog ? "lg:col-span-8" : "lg:col-span-12")}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight">AI Audit Trail</h1>
            <p className="text-[10px] text-ds-text-subtle font-bold uppercase tracking-widest">Append-only compliance log</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtle" />
              <Input 
                placeholder="Search actions or reasoning..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-xs bg-ds-background-neutral-subtle/20 border-ds-border/40"
              />
            </div>
            <Button variant="outline" className="font-bold text-[10px] tracking-widest uppercase gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button className="bg-ds-background-neutral-bold font-bold text-[10px] tracking-widest uppercase gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <Card className="border-ds-border/40 overflow-hidden flex-1">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="bg-ds-background-neutral-subtle/30 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">User</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Action</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Reasoning Summary</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className={cn(
                      "group cursor-pointer hover:bg-ds-background-neutral-subtle/10",
                      selectedLog?.id === log.id && "bg-ds-background-brand-subtle/10"
                    )}
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell className="font-mono text-[10px] opacity-60">
                      {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-ds-background-neutral-subtle/40 flex items-center justify-center">
                          <UserIcon className="h-3 w-3 opacity-60" />
                        </div>
                        <span className="text-xs font-bold">{log.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-ds-background-neutral-subtle/30 border-none">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-[11px] text-ds-text-subtle font-medium italic">
                      &quot;{log.reasoning}&quot;
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {log.status === 'CONFIRMED' ? (
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        ) : log.status === 'REJECTED' ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-orange-500" />
                        )}
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          log.status === 'CONFIRMED' ? "text-green-500" : log.status === 'REJECTED' ? "text-red-500" : "text-orange-500"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ChevronRight className={cn(
                        "h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity",
                        selectedLog?.id === log.id && "opacity-100 text-ds-text-brand"
                      )} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>

      {/* Detail Panel */}
      {selectedLog && (
        <Card className="lg:col-span-4 border-ds-border-brand/20 bg-ds-background-brand-subtle/5 flex flex-col h-full overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <CardHeader className="border-b border-ds-border/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Action Details</CardTitle>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedLog(null)}>
                <Plus className="h-4 w-4 rotate-45" />
              </Button>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">AI Reasoning</label>
                <div className="p-4 rounded-xl bg-white border border-ds-border/20 text-xs leading-relaxed font-medium italic">
                  &quot;{selectedLog.reasoning}&quot;
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Payload Inspection</label>
                <div className="p-4 rounded-xl bg-ds-background-neutral-subtle/30 border border-ds-border/10">
                  <pre className="text-[10px] font-mono whitespace-pre-wrap overflow-x-auto text-ds-text-subtle">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>
              </div>

              <Separator className="bg-ds-border/30" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">Department</p>
                  <p className="text-xs font-bold">{selectedLog.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">ID</p>
                  <p className="text-[10px] font-mono opacity-60">{selectedLog.id}</p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                 <Button className="flex-1 h-12 bg-ds-background-brand-bold font-bold text-[10px] tracking-widest uppercase">
                   Approve Action
                 </Button>
                 <Button variant="outline" className="flex-1 h-12 border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold text-[10px] tracking-widest uppercase">
                   Revert
                 </Button>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
