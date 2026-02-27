'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, type Message } from 'ai/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@gate-access/ui';
import { Button } from '@gate-access/ui';
import type { Locale } from '@/lib/i18n-config';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'gateflow-ai-chat-v1';

const WELCOME_EN: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I can create projects, units, QR codes, and more. What would you like to do?",
  createdAt: new Date(0),
};

const WELCOME_AR: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'مرحباً! يمكنني إنشاء مشاريع ووحدات ورموز QR والمزيد. بماذا يمكنني مساعدتك؟',
  createdAt: new Date(0),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function msgText(content: Message['content']): string {
  return typeof content === 'string' ? content : '';
}

function loadMessages(isRtl: boolean): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [isRtl ? WELCOME_AR : WELCOME_EN];
}

// ─── Example prompts ──────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS_EN = [
  'Show me project stats',
  'List recent scans',
  'Create a new project',
];

const EXAMPLE_PROMPTS_AR = [
  'عرض إحصائيات المشروع',
  'أحدث عمليات المسح',
  'إنشاء مشروع جديد',
];

// ─── Component ────────────────────────────────────────────────────────────────

export interface AIAssistantProps {
  locale: Locale;
}

export function AIAssistant({ locale }: AIAssistantProps) {
  const [hydrated, setHydrated] = useState(false);
  const [storedMessages, setStoredMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isRtl = locale.startsWith('ar');
  const prompts = isRtl ? EXAMPLE_PROMPTS_AR : EXAMPLE_PROMPTS_EN;

  // Hydrate from localStorage on mount
  useEffect(() => {
    setStoredMessages(loadMessages(isRtl));
    setHydrated(true);
  }, [isRtl]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } =
    useChat({
      api: '/api/ai/assistant',
      initialMessages: hydrated ? storedMessages : [isRtl ? WELCOME_AR : WELCOME_EN],
      onFinish: (message) => {
        console.log('AI Assistant: Finished', message);
        router.refresh();
      },
      onError: (err) => {
        console.error('AI Assistant: Error', err);
        toast.error(err.message ?? (isRtl ? 'حدث خطأ' : 'Assistant error'));
      },
    });

  useEffect(() => {
    console.log('AI Assistant: Messages updated', messages);
  }, [messages]);

  // Sync stored messages into useChat after hydration
  useEffect(() => {
    if (hydrated && storedMessages.length > 0) {
      setMessages(storedMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages, hydrated]);

  // Auto-scroll to bottom
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
    const welcome = isRtl ? WELCOME_AR : WELCOME_EN;
    setMessages([welcome]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([welcome]));
    } catch {
      // ignore
    }
  };

  const sendExample = (prompt: string) => {
    append({ role: 'user', content: prompt });
  };

  const hasOnlyWelcome = messages.length === 1 && messages[0]?.id === 'welcome';

  return (
    <div
      className="flex h-full flex-col bg-card"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header Info */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold leading-none">
              {isRtl ? 'مساعد GateFlow' : 'GateFlow Assistant'}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {isRtl ? 'اسألني أي شيء عن مشروعك' : 'Ask me anything about your project'}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={isRtl ? 'مسح المحادثة' : 'Clear conversation'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const text = msgText(message.content);
          const msgRtl = isArabic(text);
          if (!text) return null;

          return (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                isUser
                  ? isRtl
                    ? 'flex-row'
                    : 'flex-row-reverse'
                  : isRtl
                  ? 'flex-row-reverse'
                  : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  isUser ? 'bg-primary' : 'bg-muted'
                )}
              >
                {isUser ? (
                  <User className="h-3 w-3 text-primary-foreground" />
                ) : (
                  <Bot className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
                  isUser
                    ? cn(
                        'bg-primary text-primary-foreground',
                        isRtl ? 'rounded-bl-sm' : 'rounded-br-sm'
                      )
                    : cn(
                        'bg-muted/50 text-foreground border border-border/50',
                        isRtl ? 'rounded-br-sm' : 'rounded-bl-sm'
                      )
                )}
                dir={msgRtl ? 'rtl' : 'ltr'}
              >
                {text}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div
            className={cn(
              'flex items-end gap-2',
              isRtl ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
              <Bot className="h-3 w-3 text-muted-foreground" />
            </div>
            <div
              className={cn(
                'flex items-center gap-1 rounded-2xl bg-muted/50 px-3.5 py-3 border border-border/50',
                isRtl ? 'rounded-br-sm' : 'rounded-bl-sm'
              )}
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Example prompts */}
        {hasOnlyWelcome && !isLoading && (
          <div className="mt-2 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              {isRtl ? 'اقتراحات' : 'Get Started'}
            </p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendExample(p)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground hover:shadow-sm"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border p-4 bg-muted/10"
      >
        <div
          className={cn(
            'flex items-end gap-2',
            isRtl ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isRtl ? 'اسأل شيئاً...' : 'Ask something...'
            }
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 shadow-sm transition-all"
            style={{
              direction: isRtl ? 'rtl' : 'ltr',
              minHeight: '42px',
              maxHeight: '120px',
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-[42px] w-[42px] shrink-0 rounded-xl shadow-sm transition-transform active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className={cn('h-4 w-4', isRtl && 'rotate-180')} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
