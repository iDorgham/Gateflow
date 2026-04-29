'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Paperclip,
  MoreVertical,
  User,
  Bot,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Avatar,
  AvatarFallback,
  Textarea,
  cn,
  Separator,
} from '@gateflow/ui';
import { useParams, useRouter } from 'next/navigation';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reply, setReply] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'Khalid Al-Sayed',
      role: 'USER',
      content:
        'Hello, our gate scanner in Hub Dubai-A has stopped syncing. It shows a red status light and "Timeout" in the local log.',
      timestamp: '2026-04-29T08:00:00Z',
    },
    {
      id: 2,
      sender: 'GateFlow AI',
      role: 'BOT',
      content:
        'I have analyzed the Hub Dubai-A scanner logs. The timeout appears to be caused by a firmware mismatch after the last regional update. I recommend performing a remote reset via the Gates Hub.',
      timestamp: '2026-04-29T08:05:00Z',
    },
    {
      id: 3,
      sender: 'Dorgham',
      role: 'ADMIN',
      content:
        'Checking the regional fabric now. Khalid, please stand by while I initiate the remote reset sequence.',
      timestamp: '2026-04-29T08:10:00Z',
    },
  ];

  return (
    <div className="p-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 border border-border/30 rounded-xl"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black uppercase tracking-tight">
                {params.ticketId}
              </h1>
              <Badge className="bg-rose-500/10 text-rose-500 border-none font-black text-[9px] uppercase tracking-widest px-2 h-5">
                URGENT
              </Badge>
              <Badge
                variant="outline"
                className="text-[9px] font-black uppercase tracking-widest px-2 h-5 border-border/40 bg-muted/30"
              >
                OPEN
              </Badge>
            </div>
            <p className="text-sm font-bold text-ds-text-subtle mt-0.5">
              Gate Scanner Sync Timeout in Hub Dubai-A
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 border-ds-border text-[10px] font-black uppercase tracking-widest px-4"
          >
            Close Ticket
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-ds-text-subtler"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Thread View */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <Card className="flex-1 border-ds-border bg-card/40 backdrop-blur-md overflow-hidden border-dashed flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-4',
                    msg.role === 'USER' ? 'flex-row' : 'flex-row-reverse'
                  )}
                >
                  <Avatar className="h-10 w-10 border border-border/30 rounded-xl shrink-0">
                    <AvatarFallback
                      className={cn(
                        'font-black text-xs',
                        msg.role === 'BOT'
                          ? 'bg-amber-500 text-white'
                          : 'bg-ds-background-brand-bold text-ds-icon-inverse'
                      )}
                    >
                      {msg.role === 'BOT' ? (
                        <Bot className="h-5 w-5" />
                      ) : (
                        msg.sender.substring(0, 2)
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={cn(
                      'flex flex-col gap-1.5 max-w-[80%]',
                      msg.role === 'USER' ? 'items-start' : 'items-end'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {msg.sender}
                      </span>
                      <span className="text-[9px] font-bold text-ds-text-subtler">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      className={cn(
                        'p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm',
                        msg.role === 'USER'
                          ? 'bg-muted/50 border border-border/20 rounded-tl-none'
                          : msg.role === 'BOT'
                            ? 'bg-amber-500/10 border border-amber-500/20 text-ds-text rounded-tr-none'
                            : 'bg-ds-background-brand-bold text-ds-icon-inverse rounded-tr-none'
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border/30 bg-muted/20">
              <div className="relative">
                <Textarea
                  placeholder="Type your reply here..."
                  className="min-h-[120px] bg-card/50 border-ds-border text-xs font-bold p-4 pb-12 rounded-xl focus:ring-ds-background-brand-bold/20"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-ds-text-subtler hover:bg-muted"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Button className="h-8 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[9px] px-4 gap-2">
                    Send Reply <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pb-6">
          <Card className="border-ds-border bg-card/40 border-dashed">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
                  AI Triage Recommendation
                </h4>
                <div className="p-4 rounded-xl bg-ds-background-brand-subtle/50 border border-ds-border-brand/20 space-y-3">
                  <div className="flex items-center gap-2 text-ds-text-brand">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-tight">
                      Critical Infrastructure
                    </span>
                  </div>
                  <p className="text-[11px] font-bold leading-relaxed opacity-70">
                    High probability of hardware-software desync. Recommend
                    prioritizing Regional Admin escalation.
                  </p>
                  <Button className="w-full h-8 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[9px]">
                    Apply AI Routing
                  </Button>
                </div>
              </div>

              <Separator className="bg-border/30" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
                  Ticket Attributes
                </h4>
                <div className="space-y-3">
                  <Attribute
                    label="Assigned Agent"
                    value="Dorgham"
                    icon={<User className="h-3 w-3" />}
                  />
                  <Attribute
                    label="Priority"
                    value="URGENT"
                    icon={<ShieldAlert className="h-3 w-3 text-rose-500" />}
                  />
                  <Attribute
                    label="SLA Remaining"
                    value="1h 12m"
                    icon={<Clock className="h-3 w-3 text-amber-500" />}
                  />
                  <Attribute
                    label="Status"
                    value="OPEN"
                    icon={<Info className="h-3 w-3" />}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  className="w-full h-10 border-ds-border text-[10px] font-black uppercase tracking-widest gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Mark Resolved
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-ds-border bg-amber-500/5 border-dashed">
            <CardContent className="p-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Related Knowledge
              </h4>
              <div className="space-y-3">
                {[
                  'Gate Scanner Sync Best Practices',
                  'Dubai-A Cluster Manual Override',
                  'Firmware Desync Resolution Path',
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-ds-text-subtle group-hover:text-amber-500 transition-colors truncate">
                      {item}
                    </span>
                    <ArrowLeft className="h-3 w-3 rotate-180 opacity-40 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Attribute({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
        {label}
      </span>
      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase">
        {icon}
        {value}
      </div>
    </div>
  );
}
