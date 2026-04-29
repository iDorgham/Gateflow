'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Button,
  Switch,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn
} from '@gate-access/ui';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings2, 
  Activity, 
  Plus, 
  AlertTriangle,
  History,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface BotRule {
  id: string;
  name: string;
  department: string;
  enabled: boolean;
  autoExecute: boolean;
  triggerEvent: string;
  lastRun?: string;
  executionCount: number;
}

interface BotManagerProps {
  initialRules: BotRule[];
  translations: any;
}

/**
 * Task Bot Manager
 * 
 * Interface for configuring rule-based AI automation bots.
 * Supports enabling/disabling rules, monitoring execution history,
 * and configuring HiTL auto-execute gates.
 */
export function BotManager({ initialRules, translations }: BotManagerProps) {
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <Bot className="h-8 w-8 text-ds-text-brand" />
            Automation Bots
          </h1>
          <p className="text-ds-text-subtle text-sm">
            Configure agentic rules to automate task generation across your organization.
          </p>
        </div>
        <Button className="h-12 px-6 bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover font-bold uppercase tracking-widest gap-2">
          <Plus className="h-4 w-4" />
          Create New Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-ds-border/40 overflow-hidden">
            <CardHeader className="bg-ds-background-neutral-subtle/30 border-b border-ds-border/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-ds-text-subtle">Active Automation Rules</CardTitle>
                <Badge variant="outline" className="font-bold text-[10px] tracking-widest bg-ds-background-default">
                  {rules.length} RULES DEFINED
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-ds-background-neutral-subtle/10">
                  <TableRow className="hover:bg-transparent border-ds-border/20">
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle h-10 px-6">Status</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle h-10">Rule Name & Trigger</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle h-10">Department</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle h-10">HiTL Gate</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle h-10 text-right px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id} className="group border-ds-border/20 hover:bg-ds-background-neutral-subtle/20 transition-colors">
                      <TableCell className="px-6">
                        <Switch 
                          checked={rule.enabled} 
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold">{rule.name}</span>
                          <span className="text-[10px] text-ds-text-subtle font-medium flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            EVENT: {rule.triggerEvent}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-bold tracking-tighter bg-ds-background-neutral-subtle/30 border-none">
                          {rule.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[8px] font-black tracking-widest px-2 py-0.5",
                            rule.autoExecute 
                              ? "bg-red-500/10 text-red-500 border-red-500/20" 
                              : "bg-green-500/10 text-green-500 border-green-500/20"
                          )}
                        >
                          {rule.autoExecute ? 'AUTO-RUN' : 'HiTL REQUIRED'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-ds-background-default">
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Bot Activity Log */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <History className="h-4 w-4 text-ds-text-subtle" />
              <span className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">Recent Bot Activity</span>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-ds-background-neutral-subtle/20 border border-ds-border/30">
                  <div className={cn(
                    "mt-1 p-2 rounded-lg",
                    i === 3 ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500"
                  )}>
                    {i === 3 ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">Rule Executed: Lead Scoring Threshold Reached</p>
                      <span className="text-[10px] text-ds-text-subtle">24m ago</span>
                    </div>
                    <p className="text-xs text-ds-text-subtle">
                      Created task: <span className="text-ds-text font-medium">Follow up with Al Rimal Development Team</span>
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <Badge variant="outline" className="text-[8px] font-black bg-ds-background-default border-none">
                        STATUS: {i === 3 ? 'PENDING_REVIEW' : 'CONFIRMED'}
                      </Badge>
                      {i === 3 && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-[9px] font-black bg-ds-background-brand-subtle text-ds-text-brand">APPROVE</Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-[9px] font-black text-ds-text-subtle">IGNORE</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-ds-border-brand/30 bg-ds-background-brand-subtle/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ds-text-brand" />
                <CardTitle className="text-sm font-black uppercase tracking-widest text-ds-text-brand">Bot Health Monitor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-ds-text-subtle uppercase tracking-widest">Rate Limit Score</p>
                  <p className="text-2xl font-black">98%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-ds-text-subtle uppercase tracking-widest">Bot Precision</p>
                  <p className="text-2xl font-black">4.9<span className="text-xs text-ds-text-subtle">/5</span></p>
                </div>
              </div>
              <Separator className="bg-ds-border-brand/20" />
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-ds-text-subtle italic">
                    "Sales follow-up rule" is approaching the hourly rate limit (8/10). No intervention required yet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-ds-border/40">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-ds-text-subtle">Departmental Quotas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Sales', val: 75, color: 'bg-green-500' },
                { name: 'Marketing', val: 40, color: 'bg-blue-500' },
                { name: 'Support', val: 92, color: 'bg-orange-500' }
              ].map(dept => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>{dept.name}</span>
                    <span>{dept.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-ds-background-neutral-subtle rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", dept.color)} style={{ width: `${dept.val}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
