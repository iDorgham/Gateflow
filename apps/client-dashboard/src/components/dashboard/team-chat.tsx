'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { Button, Input, cn } from '@gate-access/ui';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

interface ChatUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface ChatMsg {
  id: string;
  content: string;
  createdAt: string;
  user: ChatUser;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

interface TeamChatProps {
  currentUserId: string;
}

export function TeamChat({ currentUserId }: TeamChatProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages
  async function loadMessages() {
    try {
      const res = await fetch('/api/chat');
      const json = await res.json() as { success: boolean; data?: ChatMsg[] };
      if (json.success && json.data) {
        // API returns newest-first; reverse for display
        setMessages(json.data.slice().reverse());
      }
    } catch {
      // silent on poll failure
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    // Poll every 10 seconds
    pollRef.current = setInterval(loadMessages, 10_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;
    setNewMessage('');

    startTransition(async () => {
      const res = await csrfFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      const data = await res.json() as { success: boolean; data?: ChatMsg; error?: string };
      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data!]);
      } else {
        toast.error(data.error ?? 'Failed to send message');
        setNewMessage(content); // restore input
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isPending && newMessage.trim()) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex h-full flex-col bg-card" aria-label="Team chat">

      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3 bg-muted/20">
        <MessageSquare className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="text-xs font-black uppercase tracking-widest">Team Chat</span>
        <span className="ml-auto text-[10px] text-muted-foreground/60 font-medium">
          Refreshes every 10s
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-foreground">No messages yet</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Start the conversation with your team.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user.id === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn('flex items-end gap-2', isMe ? 'flex-row-reverse' : 'flex-row')}
              >
                {/* Avatar */}
                {!isMe && (
                  <div
                    className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary"
                    title={msg.user.name}
                    aria-hidden="true"
                  >
                    {msg.user.avatarUrl ? (
                      <img src={msg.user.avatarUrl} alt={msg.user.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      getInitials(msg.user.name)
                    )}
                  </div>
                )}

                <div className={cn('flex flex-col gap-0.5 max-w-[80%]', isMe && 'items-end')}>
                  {/* Sender name + time */}
                  {!isMe && (
                    <span className="text-[10px] text-muted-foreground font-bold px-1">
                      {msg.user.name}
                    </span>
                  )}

                  {/* Bubble */}
                  <div
                    className={cn(
                      'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap',
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted/50 text-foreground border border-border/50 rounded-bl-sm'
                    )}
                  >
                    {msg.content}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-muted-foreground/50 px-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send form */}
      <form
        onSubmit={handleSend}
        className="shrink-0 border-t border-border p-3 bg-muted/10"
      >
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message the team…"
            className="h-9 rounded-2xl text-xs flex-1"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !newMessage.trim()}
            className="h-9 w-9 rounded-xl shrink-0"
            aria-label="Send message"
          >
            {isPending
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Send className="h-3.5 w-3.5" />
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
