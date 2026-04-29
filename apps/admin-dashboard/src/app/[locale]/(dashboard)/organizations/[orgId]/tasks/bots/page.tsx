'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  Bot,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Skeleton,
  cn,
} from '@gateflow/ui';
import { useParams } from 'next/navigation';

interface BotRun {
  id: string;
  bot: {
    name: string;
  };
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  input: any;
  output: any;
}

export default function TaskBotsPage() {
  const params = useParams();
  const [runs, setRuns] = useState<BotRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for bot runs
    setTimeout(() => {
      setRuns([
        {
          id: 'run-1',
          bot: { name: 'Blog Writer' },
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
          input: { topic: 'Smart Gate Trends' },
          output: { postId: 'post-1' },
        },
        {
          id: 'run-2',
          bot: { name: 'LP Generator' },
          status: 'FAILED',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          input: { audience: 'Developers' },
          output: { error: 'Timeout' },
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Bot className="h-8 w-8 text-ds-icon-brand" />
            AI Bot Activity
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Audit log and performance tracking for task automation agents
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ds-text-subtler" />
            <Input
              placeholder="Filter by bot or status..."
              className="pl-9 h-10 text-xs font-bold border-ds-border bg-card"
            />
          </div>
          <Button
            variant="outline"
            className="h-10 border-ds-border gap-2 text-[10px] font-black uppercase tracking-widest px-4"
          >
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Executions', value: '482', color: 'text-ds-text' },
          { label: 'Success Rate', value: '98.2%', color: 'text-emerald-500' },
          {
            label: 'Avg. Run Time',
            value: '1.4s',
            color: 'text-ds-text-brand',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-ds-border bg-card/50 shadow-sm overflow-hidden border-dashed"
          >
            <CardContent className="p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                {stat.label}
              </p>
              <h3 className={cn('text-3xl font-black mt-2', stat.color)}>
                {stat.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler flex items-center gap-2">
          <Clock className="h-4 w-4" /> Recent Executions
        </h2>

        <div className="space-y-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))
            : runs.map((run) => (
                <Card
                  key={run.id}
                  className="border-ds-border bg-card/60 backdrop-blur-sm group hover:border-ds-border-brand/30 transition-colors"
                >
                  <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0',
                          run.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        )}
                      >
                        {run.status === 'COMPLETED' ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <XCircle className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black uppercase tracking-tight">
                            {run.bot.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[8px] font-black uppercase tracking-widest px-1.5 h-4 border-none',
                              run.status === 'COMPLETED'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-rose-500/10 text-rose-500'
                            )}
                          >
                            {run.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] font-bold text-ds-text-subtle mt-0.5">
                          Executed {new Date(run.createdAt).toLocaleString()} •
                          Input: {JSON.stringify(run.input)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        className="h-9 px-4 text-[9px] font-black uppercase tracking-widest text-ds-text-subtler group-hover:text-ds-text"
                      >
                        View Payload
                      </Button>
                      <Button
                        variant="outline"
                        className="h-9 px-4 border-ds-border text-[9px] font-black uppercase tracking-widest gap-2"
                      >
                        Review Output <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}
