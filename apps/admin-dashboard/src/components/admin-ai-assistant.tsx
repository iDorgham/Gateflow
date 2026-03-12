'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, type Message } from 'ai/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Send, Bot, User, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { cn, Button } from '@gate-access/ui';
import type { Locale } from '@/lib/i18n/i18n-config';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'gateflow-admin-ai-chat-v1';

const WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi! I have read-only access to platform data. Ask me about organizations, users, scans, or platform health.',
  createdAt: new Date(0),
};

const EXAMPLE_PROMPTS = [
  'Show platform metrics',
  'List recent organizations',
  'Scan activity today',
  'How many PRO orgs?',
  'Search for user admin',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function msgText(content: Message['content']): string {
  return typeof content === 'string' ? content : '';
}

function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [WELCOME_MSG];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [WELCOME_MSG];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AdminAIAssistantProps {
  locale: Locale;
}

export function AdminAIAssistant({ locale }: AdminAIAssistantProps) {
  const [hydrated, setHydrated] = useState(false);
  const [storedMessages, setStoredMessages] = useState<Message[]>([WELCOME_MSG]);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setStoredMessages(loadMessages());
    setHydrated(true);
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append,
  } = useChat({
    api: `/${locale}/api/admin/ai/assistant`,
    initialMessages: hydrated ? storedMessages : [WELCOME_MSG],
    onFinish: () => { router.refresh(); },
    onError: (err) => {
      console.error('Admin AI error:', err);
      toast.error(err.message ?? 'Assistant error');
    },
  });

  // Sync from localStorage after hydration
  useEffect(() => {
    if (hydrated && storedMessages.length > 0) setMessages(storedMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated && messages.length > 0) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { /* ignore */ }
    }
  }, [messages, hydrated]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && input.trim()) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MSG]);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([WELCOME_MSG])); } catch { /* ignore */ }
  };

  const hasOnlyWelcome = messages.length === 1 && messages[0]?.id === 'welcome';

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">

        {/* Welcome card */}
        {hasOnlyWelcome && !isLoading && (
          <div className="rounded-2xl bg-muted/20 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <p className="text-sm font-black uppercase tracking-tight text-foreground">GateFlow Admin AI</p>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Gemini</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5">Read-only platform intelligence</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Get Started</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => append({ role: 'user', content: p })}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground hover:shadow-md active:scale-95"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {!hasOnlyWelcome && messages.map((message) => {
          if (message.id === 'welcome') return null;
          const isUser = message.role === 'user';
          const text = msgText(message.content);
          if (!text) return null;

          return (
            <div
              key={message.id}
              className={cn('flex items-end gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}
            >
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', isUser ? 'bg-primary' : 'bg-muted')}>
                {isUser
                  ? <User className="h-4 w-4 text-primary-foreground" />
                  : <Bot className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted/50 text-foreground border border-border/50 rounded-bl-sm'
                )}
              >
                <span className="whitespace-pre-wrap">{text}</span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-end gap-2 flex-row">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Bot className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-muted/50 px-3.5 py-3 border border-border/50 rounded-bl-sm">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clear button — only when conversation started */}
      {!hasOnlyWelcome && (
        <div className="shrink-0 flex justify-end px-4 pb-1">
          <button
            onClick={clearChat}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}

      {/* Input */}
      <form ref={formRef} onSubmit={handleSubmit} className="shrink-0 border-t border-border p-4 bg-muted/10">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about platform data…"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 shadow-sm transition-all"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-11 w-11 shrink-0 rounded-2xl shadow-sm transition-transform active:scale-95"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
