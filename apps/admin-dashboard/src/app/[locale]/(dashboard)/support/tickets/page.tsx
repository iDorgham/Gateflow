'use client';

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  Plus,
  Clock,
  ChevronRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  Skeleton,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@gateflow/ui';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: string;
  subject: string;
  requester: {
    name: string;
    avatar?: string;
  };
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED';
  assignedTo?: string;
  createdAt: string;
  aiTriage?: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');

  useEffect(() => {
    // Mock fetch for tickets
    setTimeout(() => {
      setTickets([
        {
          id: 'TICK-482',
          subject: 'Gate Scanner Sync Timeout in Hub Dubai-A',
          requester: { name: 'Khalid Al-Sayed' },
          priority: 'URGENT',
          status: 'OPEN',
          assignedTo: 'Dorgham',
          createdAt: '2026-04-29T08:00:00Z',
          aiTriage: 'Critical Infrastructure',
        },
        {
          id: 'TICK-483',
          subject: 'License Key Activation Issue',
          requester: { name: 'James Wilson' },
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          assignedTo: 'Support AI',
          createdAt: '2026-04-29T09:15:00Z',
          aiTriage: 'Billing/Activation',
        },
        {
          id: 'TICK-484',
          subject: 'RTL UI Alignment in Resident App',
          requester: { name: 'Fatima Zahra' },
          priority: 'LOW',
          status: 'WAITING',
          assignedTo: 'Frontend Team',
          createdAt: '2026-04-28T14:30:00Z',
          aiTriage: 'UI/UX Bug',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'URGENT':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'HIGH':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'MEDIUM':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-ds-text-subtler bg-muted border-border/30';
    }
  };

  return (
    <div className="p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <LifeBuoy className="h-8 w-8 text-ds-icon-brand" />
            Support Nexus
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Triaging and resolving ecosystem incidents with AI precision
          </p>
        </div>

        <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Unassigned Tickets',
            value: '12',
            icon: ShieldAlert,
            color: 'text-rose-500',
          },
          {
            label: 'Avg Resolution Time',
            value: '4.2h',
            icon: Clock,
            color: 'text-ds-text-brand',
          },
          {
            label: 'AI Resolution Rate',
            value: '68%',
            icon: Zap,
            color: 'text-amber-500',
          },
        ].map((stat, i) => (
          <Card key={i} className="border-ds-border bg-card/40 border-dashed">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler mb-1">
                  {stat.label}
                </p>
                <h3 className={cn('text-2xl font-black', stat.color)}>
                  {stat.value}
                </h3>
              </div>
              <stat.icon className={cn('h-8 w-8 opacity-20', stat.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-muted/50 border border-border/50 p-1 h-11">
            <TabsTrigger
              value="open"
              className="px-4 text-[10px] font-black uppercase tracking-widest"
            >
              Active Tickets
            </TabsTrigger>
            <TabsTrigger
              value="waiting"
              className="px-4 text-[10px] font-black uppercase tracking-widest"
            >
              Awaiting Action
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="px-4 text-[10px] font-black uppercase tracking-widest"
            >
              Resolved
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtler" />
          <Input
            placeholder="Search by subject or ID..."
            className="pl-10 h-11 text-xs font-bold border-ds-border bg-card/50"
          />
        </div>
      </div>

      <Card className="border-ds-border bg-card/40 backdrop-blur-md overflow-hidden border-dashed">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30 bg-muted/20">
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler w-[100px]">
                  ID
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  Subject & Requester
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  Priority
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  Status
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  Assigned
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="p-4">
                          <Skeleton className="h-12 w-full rounded-xl" />
                        </td>
                      </tr>
                    ))
                : tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="group hover:bg-ds-background-brand-subtle/30 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/en/support/tickets/${ticket.id}`)
                      }
                    >
                      <td className="p-4">
                        <span className="text-[10px] font-black font-mono text-ds-text-subtler">
                          {ticket.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-ds-text group-hover:text-ds-text-brand transition-colors">
                            {ticket.subject}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-ds-text-subtler">
                              {ticket.requester.name}
                            </span>
                            {ticket.aiTriage && (
                              <Badge
                                variant="outline"
                                className="text-[8px] h-4 px-1.5 font-black uppercase border-none bg-ds-background-brand-subtle/50 text-ds-text-brand"
                              >
                                AI: {ticket.aiTriage}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={cn(
                            'text-[8px] font-black uppercase tracking-widest px-2 h-5 border',
                            getPriorityColor(ticket.priority)
                          )}
                        >
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              ticket.status === 'OPEN'
                                ? 'bg-rose-500 animate-pulse'
                                : ticket.status === 'IN_PROGRESS'
                                  ? 'bg-blue-500'
                                  : 'bg-emerald-500'
                            )}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-border/30">
                            <AvatarFallback className="text-[8px] font-black uppercase">
                              {ticket.assignedTo?.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[10px] font-black uppercase text-ds-text-subtler">
                            {ticket.assignedTo || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-ds-text-subtler group-hover:text-ds-text"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
