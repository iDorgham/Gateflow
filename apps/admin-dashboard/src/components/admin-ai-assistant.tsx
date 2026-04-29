'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, type UIMessage } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  getToolName,
  isDataUIPart,
  isReasoningUIPart,
  isTextUIPart,
  isToolUIPart,
  type DataUIPart,
} from 'ai';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Send,
  Bot,
  User,
  Loader2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  Square,
  Wand2,
  Terminal,
  Activity,
  History,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, Button } from '@gate-access/ui';
import type { Locale } from '@/lib/i18n/i18n-config';
import { useTranslation } from 'react-i18next';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'gateflow-admin-ai-chat-v2';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadMessages(): UIMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UIMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [];
}

/**
 * A very simple markdown-lite renderer for basic bold, code and lists
 * since we can't install react-markdown in this restricted environment.
 */
function SimpleMarkdown({ content }: { content: string }) {
  if (!content) return null;

  // Basic split by line to handle lists and paragraphs
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Horizontal rule
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={i} className="border-border/40 my-2" />;
        }

        // List item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 pl-2">
              <span className="text-primary mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
              <span className="flex-1">
                {renderInline(trimmed.substring(2))}
              </span>
            </div>
          );
        }

        // Header
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={i} className="text-sm font-bold mt-3 mb-1 text-foreground">
              {renderInline(trimmed.substring(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={i}
              className="text-base font-bold mt-4 mb-2 text-foreground"
            >
              {renderInline(trimmed.substring(3))}
            </h3>
          );
        }

        // Empty line
        if (!trimmed) return <div key={i} className="h-2" />;

        return (
          <p key={i} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  // Very simplistic inline processing for **bold** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.substring(2, part.length - 2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="bg-muted px-1.5 py-0.5 rounded text-[12px] font-mono border border-border/40 text-primary-foreground/90"
        >
          {part.substring(1, part.length - 1)}
        </code>
      );
    }
    return part;
  });
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ds-background-brand-subtle animate-pulse">
        <Bot className="h-4 w-4 text-ds-text-brand" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl bg-ds-surface-sunken p-3 border border-ds-border/40 rounded-bl-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ds-text-subtle [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ds-text-subtle [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ds-text-subtle" />
      </div>
    </motion.div>
  );
}

function ToolInvocCard({ part }: { part: any }) {
  const toolName = getToolName(part);
  const state = part.state;
  const isComplete =
    state === 'output-available' ||
    (state as string) === 'result' ||
    (state as string) === 'call';

  return (
    <div className="rounded-xl border border-ds-border/40 bg-ds-surface-overlay p-2.5 my-1 shadow-sm overflow-hidden group transition-all hover:bg-ds-surface-raised active:scale-[0.99]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'p-1.5 rounded-lg shrink-0',
              isComplete
                ? 'bg-ds-surface-selected text-ds-text-selected'
                : 'bg-muted text-muted-foreground animate-pulse'
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle leading-none">
              Tool Call
            </span>
            <span className="text-xs font-bold text-ds-text truncate max-w-[180px]">
              {toolName}
            </span>
          </div>
        </div>
        {!isComplete && (
          <Loader2 className="h-3 w-3 animate-spin text-ds-text-subtle" />
        )}
        {isComplete && <Check className="h-3 w-3 text-ds-text-accent-green" />}
      </div>

      {isDataUIPart(part) && (part as DataUIPart<any>).data && (
        <div className="mt-2 text-[10px] bg-ds-surface-sunken/40 rounded-md p-2 font-mono overflow-x-auto border border-ds-border/20 text-ds-text-subtle max-h-32">
          <pre>{JSON.stringify(part.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface AdminAIAssistantProps {
  locale: Locale;
}

export function AdminAIAssistant({ locale: _locale }: AdminAIAssistantProps) {
  const { t } = useTranslation();
  const [hydrated, setHydrated] = useState(false);
  const [storedMessages, setStoredMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setStoredMessages(loadMessages());
    setHydrated(true);
  }, []);

  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/admin/ai/assistant`,
    }),
    messages: [],
    onFinish: () => {
      router.refresh();
    },
    onError: (err: Error) => {
      console.error('Admin AI error:', err);
      toast.error(err.message ?? 'Assistant error');
    },
  });

  const isLoading = status !== 'ready';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    if (formRef.current)
      formRef.current.querySelector('textarea')!.style.height = '48px';
    void sendMessage({ text: trimmed });
  };

  // Sync from localStorage after hydration
  useEffect(() => {
    if (hydrated && storedMessages.length > 0) setMessages(storedMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        /* ignore */
      }
    }
  }, [messages, hydrated]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && input.trim()) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  const EXAMPLES = [
    { key: 'metrics', icon: Activity },
    { key: 'orgs', icon: History },
    { key: 'scans', icon: Wand2 },
    { key: 'plans', icon: Info },
  ];

  return (
    <div className="flex h-full flex-col bg-background relative border-none">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--ds-background-brand-subtle),transparent)] opacity-30 pointer-events-none" />

      {/* Messages */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 scrollbar-hide relative z-10">
        {/* Empty state / Welcome */}
        <AnimatePresence>
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-3xl border border-border bg-card p-8 text-center shadow-lg"
            >
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-ds-background-brand-bold/20 blur-xl animate-pulse" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-ds-background-brand-bold text-white shadow-xl shadow-ds-background-brand-bold/20">
                    <Sparkles className="h-10 w-10" />
                  </div>
                </div>
              </div>
              <h2 className="mb-2 text-lg font-black uppercase tracking-tight text-ds-text">
                {t('ai:title', 'GateFlow Admin AI')}
              </h2>
              <p className="mb-8 text-xs text-ds-text-subtle max-w-[240px] mx-auto leading-relaxed">
                {t(
                  'ai:welcome',
                  'Hi! I have read-only access to platform data.'
                )}
              </p>

              <div className="grid grid-cols-1 gap-2">
                {EXAMPLES.map(({ key, icon: Icon }) => {
                  const label = t(`ai:examplePrompts.${key}`);
                  return (
                    <button
                      key={key}
                      onClick={() => void sendMessage({ text: label })}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-left transition-all hover:translate-y-[-2px] hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ds-background-subtle group-hover:bg-ds-background-brand-subtle group-hover:text-ds-text-brand transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-ds-text-subtle group-hover:text-ds-text transition-colors">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message bubbles */}
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === 'user';
            const parts = message.parts ?? [];
            const textParts = parts.filter(isTextUIPart);
            const textContent = textParts.map((p) => p.text).join('\n');
            const otherParts = parts.filter((p) => !isTextUIPart(p));

            if (!isUser && !textContent && otherParts.length === 0 && isLoading)
              return null;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                className={cn(
                  'flex gap-3 group',
                  isUser ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-sm border border-ds-border/40 transition-transform group-hover:scale-105',
                    isUser
                      ? 'bg-ds-background-accent-teal text-white'
                      : 'bg-ds-background-brand-subtle text-ds-text-brand'
                  )}
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                {/* Content Area */}
                <div
                  className={cn(
                    'flex flex-col gap-1.5 max-w-[85%]',
                    isUser ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all relative overflow-hidden',
                      isUser
                        ? 'bg-ds-background-accent-teal text-white rounded-tr-sm'
                        : 'bg-card text-ds-text border border-border rounded-tl-sm'
                    )}
                  >
                    {/* Glass effect for bot */}
                    {!isUser && (
                      <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
                    )}

                    <SimpleMarkdown content={textContent} />

                    {!isUser && otherParts.length > 0 && (
                      <div
                        className={cn(
                          'mt-3 space-y-2',
                          textContent && 'pt-3 border-t border-ds-border/40'
                        )}
                      >
                        {otherParts.map((part: any, i) => {
                          if (isToolUIPart(part))
                            return <ToolInvocCard key={i} part={part} />;
                          if (isReasoningUIPart(part))
                            return (
                              <details
                                key={i}
                                className="group/reasoning rounded-lg bg-ds-surface-sunken p-2 border border-ds-border/20"
                              >
                                <summary className="flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase tracking-wider text-ds-text-subtle select-none">
                                  <ChevronDown className="h-3 w-3 transition-transform group-open/reasoning:rotate-180" />
                                  {t('ai:reasoning', 'Reasoning')}
                                </summary>
                                <div className="mt-2 text-[11px] text-ds-text-subtle/80 font-mono leading-tight whitespace-pre-wrap pl-4 border-l border-ds-border/40">
                                  {part.text}
                                </div>
                              </details>
                            );
                          return null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions (visible on hover) */}
                  {!isUser && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pl-1">
                      <button
                        onClick={() => handleCopy(message.id, textContent)}
                        className="text-[10px] font-bold text-ds-text-subtle hover:text-ds-text flex items-center gap-1 bg-ds-surface-sunken px-2 py-0.5 rounded-full border border-ds-border/20"
                      >
                        {copiedId === message.id ? (
                          <Check className="h-2.5 w-2.5" />
                        ) : (
                          <Copy className="h-2.5 w-2.5" />
                        )}
                        {copiedId === message.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && <ThinkingBubble />}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-2 flex justify-between items-center relative z-20">
        <div className="flex gap-2">
          {isLoading && (
            <button
              onClick={stop}
              className="flex items-center gap-1.5 rounded-full bg-ds-surface-sunken border border-ds-border/40 px-2.5 py-1 text-[10px] font-bold text-ds-text-subtle transition-all hover:bg-ds-background-danger-subtle hover:text-ds-text-danger hover:border-ds-border-danger"
            >
              <Square className="h-2.5 w-2.5" fill="currentColor" />
              Stop
            </button>
          )}
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 rounded-full bg-ds-surface-sunken border border-ds-border/40 px-2.5 py-1 text-[10px] font-bold text-ds-text-subtle transition-all hover:bg-ds-surface-selected hover:text-ds-text-selected hover:border-ds-border-selected"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            {t('ai:clear', 'Clear')}
          </button>
        )}
      </div>

      {/* Input Area */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border bg-card p-4 relative z-30"
      >
        <div className="flex items-end gap-2 bg-background border border-border/60 rounded-2xl p-1 shadow-sm focus-within:border-primary/50 transition-all">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t('ai:placeholder', 'Ask about platform data…')}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent px-3 py-3 text-sm focus:outline-none disabled:opacity-50 min-h-[48px]"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className={cn(
              'h-10 w-10 shrink-0 rounded-xl transition-all shadow-md active:scale-95 mb-0.5 mr-0.5',
              isLoading
                ? 'bg-ds-background-subtle'
                : 'bg-ds-background-brand-bold text-white hover:shadow-lg'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-2 px-1 flex items-center justify-center gap-1.5 opacity-40 group hover:opacity-80 transition-opacity">
          <Sparkles className="h-2.5 w-2.5 text-ds-text-brand" />
          <span className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">
            Powered by GateFlow Intelligence x Gemini
          </span>
        </div>
      </form>
    </div>
  );
}
