'use client';

import { useState, useEffect, use } from 'react';
import {
  Inbox,
  Search,
  Filter,
  MessageSquare,
  User as UserIcon,
  Clock,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Send,
  ShieldAlert,
  ArrowRight,
  Plus,
  Loader2,
} from 'lucide-react';
import { Button } from '@gate-access/ui/components/ui/button';
import { Input } from '@gate-access/ui/components/ui/input';
import { Badge } from '@gate-access/ui/components/ui/badge';
import { ScrollArea } from '@gate-access/ui/components/ui/scroll-area';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportHubPage(props: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const params = use(props.params);
  const { locale, orgId } = params;

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [isTriaging, setIsTriaging] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [orgId]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/support/tickets?orgId=${orgId}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
        if (data.tickets.length > 0 && !selectedTicket) {
          setSelectedTicket(data.tickets[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      setMsgLoading(true);
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setMsgLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg || !selectedTicket) return;
    try {
      const res = await fetch(
        `/api/support/tickets/${selectedTicket.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newMsg,
            senderType: 'AGENT',
            // senderId: sessionUser.id
          }),
        }
      );
      if (res.ok) {
        setNewMsg('');
        fetchMessages(selectedTicket.id);
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const triggerTriage = async () => {
    if (!selectedTicket) return;
    setIsTriaging(true);
    try {
      const res = await fetch(
        `/api/support/tickets/${selectedTicket.id}/triage`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (data.success) {
        toast.success('AI Triage complete');
        setSelectedTicket(data.ticket);
        fetchTickets();
      }
    } catch (error) {
      toast.error('AI Triage failed');
    } finally {
      setIsTriaging(false);
    }
  };

  const escalateTicket = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(
        `/api/support/tickets/${selectedTicket.id}/escalate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ department: 'DEV', priority: 'HIGH' }),
        }
      );
      if (res.ok) {
        toast.success('Ticket escalated to Development Task');
        fetchTickets();
      }
    } catch (error) {
      toast.error('Escalation failed');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-ds-background-neutral-subtle">
      {/* Sidebar: Ticket List */}
      <aside className="w-96 border-r border-ds-border/40 bg-white flex flex-col">
        <div className="p-6 border-b border-ds-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <Inbox className="w-6 h-6 text-blue-600" />
              Support Hub
            </h1>
            <Badge
              variant="outline"
              className="rounded-full bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold"
            >
              {tickets.length} ACTIVE
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-text-subtle" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 h-10 bg-ds-background-neutral-subtle/50 border-ds-border/20 rounded-xl text-sm"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-ds-border/5">
            {loading ? (
              <div className="p-8 text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-ds-text-subtle">
                  Syncing Global Tickets...
                </p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-5 cursor-pointer transition-all hover:bg-ds-background-neutral-subtle/50 relative group ${selectedTicket?.id === ticket.id ? 'bg-blue-50/50' : ''}`}
                >
                  {selectedTicket?.id === ticket.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                        #{ticket.id.substring(0, 6)} • {ticket.source}
                      </span>
                      <span className="text-[10px] font-bold text-ds-text-subtle">
                        {new Date(ticket.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h3
                      className={`font-bold text-sm truncate ${selectedTicket?.id === ticket.id ? 'text-blue-700' : 'text-ds-text-main'}`}
                    >
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[8px] font-black px-1.5 py-0 h-4 ${
                            ticket.priority === 'CRITICAL'
                              ? 'bg-red-500'
                              : ticket.priority === 'HIGH'
                                ? 'bg-orange-500'
                                : 'bg-blue-500'
                          }`}
                        >
                          {ticket.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[8px] font-bold px-1.5 py-0 h-4 border-ds-border/40"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      {ticket.aiTriageSummary && (
                        <Sparkles className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content: Chat View */}
      <main className="flex-1 flex flex-col bg-white">
        {selectedTicket ? (
          <>
            <header className="h-20 border-b border-ds-border/40 px-8 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-ds-background-neutral-subtle flex items-center justify-center text-ds-text-subtle border border-ds-border/40">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">
                    {selectedTicket.subject}
                  </h2>
                  <p className="text-xs text-ds-text-subtle flex items-center gap-2">
                    <span className="font-bold uppercase tracking-widest text-[10px]">
                      {selectedTicket.organization?.name || 'GateFlow Global'}
                    </span>
                    <span>•</span>
                    <span>
                      Created{' '}
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-ds-border/60 text-[10px] font-bold uppercase tracking-widest h-9"
                  onClick={triggerTriage}
                  disabled={isTriaging}
                >
                  {isTriaging ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-2 text-blue-600" />
                  )}
                  AI Triage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-ds-border/60 text-[10px] font-bold uppercase tracking-widest h-9"
                  onClick={escalateTicket}
                >
                  <ShieldAlert className="w-3 h-3 mr-2 text-red-600" />
                  Escalate
                </Button>
                <div className="w-px h-6 bg-ds-border/10 mx-2" />
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {/* Chat area */}
              <div className="flex-1 flex flex-col bg-ds-background-neutral-subtle/20">
                <ScrollArea className="flex-1 p-8">
                  <div className="max-w-3xl mx-auto space-y-8">
                    <AnimatePresence>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-4 ${msg.senderType === 'AGENT' ? 'flex-row-reverse' : ''}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border border-ds-border/40 ${
                              msg.senderType === 'AGENT'
                                ? 'bg-blue-600 text-white'
                                : msg.senderType === 'AI'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white text-ds-text-subtle'
                            }`}
                          >
                            {msg.senderType === 'AI' ? (
                              <Sparkles className="w-4 h-4" />
                            ) : (
                              msg.sender?.name?.[0] || 'U'
                            )}
                          </div>
                          <div
                            className={`space-y-1 max-w-[80%] ${msg.senderType === 'AGENT' ? 'items-end' : ''}`}
                          >
                            <div
                              className={`p-4 rounded-2xl shadow-sm border border-ds-border/10 ${
                                msg.senderType === 'AGENT'
                                  ? 'bg-blue-600 text-white rounded-tr-none'
                                  : msg.senderType === 'AI'
                                    ? 'bg-indigo-50 border-indigo-100 text-indigo-900 rounded-tl-none italic'
                                    : 'bg-white text-ds-text-main rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                              </p>
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-ds-text-subtle px-1">
                              {msg.senderType} •{' '}
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                <div className="p-6 bg-white border-t border-ds-border/40">
                  <div className="max-w-3xl mx-auto relative">
                    <Textarea
                      placeholder="Type your response here..."
                      className="pr-16 py-4 bg-ds-background-neutral-subtle/30 border-ds-border/20 rounded-2xl min-h-[100px] resize-none focus-visible:ring-blue-600"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                    />
                    <Button
                      className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-10 h-10 p-0"
                      onClick={sendMessage}
                      disabled={!newMsg}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="max-w-3xl mx-auto mt-3 flex items-center justify-between text-[10px] font-bold text-ds-text-subtle uppercase tracking-widest px-2">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                        <Plus className="w-3 h-3" /> Attach File
                      </span>
                      <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                        <Sparkles className="w-3 h-3 text-blue-600" /> AI Draft
                      </span>
                    </div>
                    <span>Enter to send • Shift+Enter for new line</span>
                  </div>
                </div>
              </div>

              {/* Info Sidebar */}
              <aside className="w-80 border-l border-ds-border/40 p-8 space-y-8 bg-white overflow-y-auto ga-scroll">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5" /> Intelligence Panel
                  </h3>
                  {selectedTicket.aiTriageSummary ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4 animate-in fade-in duration-700">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                          AI Summary
                        </p>
                        <p className="text-xs text-blue-900 leading-relaxed italic">
                          &ldquo;{selectedTicket.aiTriageSummary}&rdquo;
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                          Suggested Action
                        </p>
                        <p className="text-xs text-blue-900 leading-relaxed font-bold">
                          {selectedTicket.aiSuggestedAction}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center border-2 border-dashed border-ds-border/40 rounded-2xl space-y-3">
                      <Sparkles className="w-8 h-8 text-ds-text-subtle mx-auto opacity-30" />
                      <p className="text-[10px] text-ds-text-subtle leading-tight font-bold uppercase tracking-wider">
                        Run Triage to analyze sentiment and suggest actions.
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50 text-[10px] font-black uppercase tracking-widest"
                        onClick={triggerTriage}
                      >
                        Compute Now
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    Customer Details
                  </h3>
                  <div className="space-y-4 bg-ds-background-neutral-subtle/30 p-5 rounded-2xl border border-ds-border/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-ds-border/40 flex items-center justify-center font-black text-xs text-blue-600 shadow-sm">
                        JD
                      </div>
                      <div>
                        <p className="font-bold text-sm">John Doe</p>
                        <p className="text-[10px] text-ds-text-subtle font-medium uppercase tracking-widest">
                          Premium Partner
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-ds-border/10" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-ds-text-subtle font-bold uppercase tracking-widest">
                          Organization
                        </span>
                        <span className="font-bold">
                          {selectedTicket.organization?.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-ds-text-subtle font-bold uppercase tracking-widest">
                          Last Access
                        </span>
                        <span className="font-bold">2 hours ago</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-ds-text-subtle font-bold uppercase tracking-widest">
                          Source
                        </span>
                        <span className="font-bold uppercase tracking-tighter">
                          {selectedTicket.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-ds-border/60 text-xs font-bold uppercase tracking-widest flex items-center justify-between group"
                  >
                    History Viewer
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </aside>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-24 h-24 bg-ds-background-neutral-subtle rounded-3xl flex items-center justify-center text-ds-text-subtle opacity-40 border border-ds-border/40 shadow-2xl">
              <Inbox className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Unified Support Hub
              </h2>
              <p className="text-ds-text-subtle max-w-sm mx-auto">
                Select a conversation from the sidebar to begin managing
                customer inquiries with AI assistance.
              </p>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex flex-col items-center gap-1">
                <div className="h-2 w-16 bg-blue-600 rounded-full" />
                <span className="text-[9px] font-bold text-ds-text-subtle uppercase tracking-widest">
                  Real-time
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-2 w-16 bg-indigo-600 rounded-full" />
                <span className="text-[9px] font-bold text-ds-text-subtle uppercase tracking-widest">
                  AI Powered
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Textarea(props: any) {
  return <textarea {...props} />;
}
