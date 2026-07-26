'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, type UIMessage } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  getToolName,
  isDataUIPart,
  isFileUIPart,
  isReasoningUIPart,
  isTextUIPart,
  isToolUIPart,
} from 'ai';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Send,
  User,
  Loader2,
  RotateCcw,
  Mic,
  Paperclip,
  Plus,
} from 'lucide-react';
import {
  cn,
  Button,
  AvatarTag,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gateflow/ui';
import type { Locale } from '@/lib/i18n-config';
import { clearLegacyAiTranscript } from '@/lib/ai/transcript-privacy';

// ─── Constants ────────────────────────────────────────────────────────────────

const WELCOME_EN: UIMessage = {
  id: 'welcome',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'Hi! I can create projects, units, QR codes, and more. What would you like to do?',
    },
  ],
};

const WELCOME_AR: UIMessage = {
  id: 'welcome',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'مرحباً! يمكنني إنشاء مشاريع ووحدات ورموز QR والمزيد. بماذا يمكنني مساعدتك؟',
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

// ─── Example prompts ──────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS_EN = [
  'Show organization stats',
  'Create 3 single-use QR codes',
  'List recent scans',
  'List all contacts',
  'Create a new project',
];

const EXAMPLE_PROMPTS_AR = [
  'عرض إحصائيات المنظمة',
  'إنشاء 3 رموز QR للاستخدام مرة واحدة',
  'أحدث عمليات المسح',
  'قائمة جهات الاتصال',
  'إنشاء مشروع جديد',
];

// ─── Component ────────────────────────────────────────────────────────────────

export interface AIAssistantProps {
  locale: Locale;
}

export function AIAssistant({ locale }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [taggedItems, setTaggedItems] = useState<
    { id: string; label: string; type: 'resident' | 'unit' }[]
  >([]);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isRtl = locale.startsWith('ar');
  const prompts = isRtl ? EXAMPLE_PROMPTS_AR : EXAMPLE_PROMPTS_EN;

  // Conversations are memory-only; clear data persisted by older releases.
  useEffect(() => {
    clearLegacyAiTranscript(window.localStorage);
  }, []);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/assistant' }),
    messages: [isRtl ? WELCOME_AR : WELCOME_EN],
    onFinish: () => {
      router.refresh();
    },
    onError: (err: Error) => {
      console.error('AI Assistant: Error', err);
      toast.error(err.message ?? (isRtl ? 'حدث خطأ' : 'Assistant error'));
    },
  });

  const isLoading = status !== 'ready';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setInput(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setTaggedItems([]);
    setInput('');
    void sendMessage({ text: trimmed });
  };

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
    clearLegacyAiTranscript(window.localStorage);
  };

  const sendExample = (prompt: string) => {
    void sendMessage({ text: prompt });
  };

  const hasOnlyWelcome = messages.length === 1 && messages[0]?.id === 'welcome';

  return (
    <div
      className="flex h-full flex-col bg-[var(--ds-surface,#18191a)]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* mediaBubble AI Welcome card */}
        {hasOnlyWelcome && !isLoading && (
          <div className="rounded-[var(--ds-border-radius-400,8px)] bg-[var(--ds-surface-raised,#1f1f21)] border border-[var(--ds-border,#27272a)] shadow-[var(--ds-shadow-raised)] p-6 text-center">
            <div className="flex justify-center mb-4">
              {/* Rovo gradient avatar */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-[var(--ds-border-radius-400,8px)] shadow-[var(--ds-shadow-overlay)]"
                style={{
                  background:
                    'linear-gradient(135deg, var(--ds-surface-raised) 0%, var(--ds-surface) 50%, var(--ds-surface-sunken) 100%)',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z"
                    fill="white"
                    fillOpacity="0.4"
                  />
                  <circle cx="12" cy="12" r="2" fill="white" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <p className="text-sm font-bold text-[var(--ds-text,#FAFAFA)]">
                {isRtl ? 'مساعد GateFlow' : 'GateFlow'}
              </p>
              <span className="rounded-[var(--ds-border-radius-200,4px)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                AI
              </span>
            </div>
            <p className="text-xs text-[var(--ds-text-subtle,#A1A1AA)] mb-5">
              {isRtl
                ? 'اسألني أي شيء عن نظامك'
                : 'Ask me anything about your system'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-subtlest,#71717A)] mb-2">
              {isRtl ? 'اقتراحات' : 'Get started'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendExample(p)}
                  className="rounded-[var(--ds-border-radius-200,4px)] border border-[var(--ds-border)] bg-[var(--ds-surface-sunken)] px-3 py-2 text-xs text-[var(--ds-text-subtle)] transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {!hasOnlyWelcome &&
          messages.map((message: UIMessage) => {
            if (message.id === 'welcome') return null;
            const isUser = message.role === 'user';
            const parts = message.parts ?? [];
            const textParts = parts.filter(isTextUIPart);
            const text = textParts.map((p) => p.text).join('');
            const extraParts = parts.filter((p) => !isTextUIPart(p));
            if (isUser) {
              if (!text) return null;
            } else if (!text && extraParts.length === 0) {
              return null;
            }
            const msgRtl = text ? isArabic(text) : isRtl;

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
                {/* Avatar */}
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isUser ? 'bg-primary text-white' : 'text-white'
                  )}
                  style={
                    !isUser
                      ? {
                          background:
                            'linear-gradient(135deg, var(--ds-surface-raised), var(--ds-surface-sunken))',
                        }
                      : undefined
                  }
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 4L19 8V16L12 20L5 16V8L12 4Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="2" fill="white" />
                    </svg>
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[85%] rounded-[var(--ds-border-radius-400,8px)] px-3.5 py-2.5 text-sm leading-relaxed outline-none space-y-2',
                    isUser
                      ? 'bg-primary text-white shadow-[var(--ds-shadow-raised)]'
                      : 'bg-[var(--ds-surface-raised,#1f1f21)] text-[var(--ds-text,#FAFAFA)] border border-[var(--ds-border,#27272a)] shadow-[var(--ds-shadow-raised)]'
                  )}
                  dir={msgRtl ? 'rtl' : 'ltr'}
                >
                  {textParts.map((part, i) => (
                    <span key={i} className="whitespace-pre-wrap block">
                      {part.text}
                    </span>
                  ))}
                  {!isUser &&
                    extraParts.map((part, i) => (
                      <div
                        key={`extra-${i}`}
                        className={cn(
                          'text-[11px] text-[var(--ds-text-subtle,#A1A1AA)]',
                          (text || i > 0) &&
                            'border-t border-[var(--ds-border,#27272a)] pt-2'
                        )}
                      >
                        {isToolUIPart(part) ? (
                          <span>
                            {getToolName(part)}
                            {(part as { state?: string }).state
                              ? ` · ${(part as { state: string }).state}`
                              : ''}
                          </span>
                        ) : isReasoningUIPart(part) ? (
                          <details>
                            <summary className="cursor-pointer">
                              {isRtl ? 'تفكير النموذج' : 'Model reasoning'}
                            </summary>
                            <pre className="mt-1 whitespace-pre-wrap text-[10px] opacity-90 max-h-32 overflow-auto">
                              {part.text}
                            </pre>
                          </details>
                        ) : isFileUIPart(part) ? (
                          <a
                            href={part.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline"
                          >
                            {part.filename || part.url}
                          </a>
                        ) : isDataUIPart(part) ? (
                          <pre className="text-[10px] max-h-24 overflow-auto opacity-90">
                            {JSON.stringify(part.data, null, 2)}
                          </pre>
                        ) : (
                          <span className="opacity-70">{part.type}</span>
                        )}
                      </div>
                    ))}
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
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
              style={{
                background:
                  'linear-gradient(135deg, var(--ds-surface-raised), var(--ds-surface-sunken))',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4L19 8V16L12 20L5 16V8L12 4Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="2" fill="white" />
              </svg>
            </div>
            <div
              className={cn(
                'flex items-center gap-1 rounded-[var(--ds-border-radius-400,8px)] bg-[var(--ds-surface-raised,#1f1f21)] px-3.5 py-3 border border-[var(--ds-border,#27272a)] shadow-[var(--ds-shadow-raised)]'
              )}
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clear conversation — only when conversation has started */}
      {!hasOnlyWelcome && (
        <div
          className={cn(
            'shrink-0 flex px-4 pb-1',
            isRtl ? 'justify-start' : 'justify-end'
          )}
        >
          <button
            onClick={clearChat}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title={isRtl ? 'مسح المحادثة' : 'Clear conversation'}
          >
            <RotateCcw className="h-3 w-3" />
            {isRtl ? 'مسح' : 'Clear'}
          </button>
        </div>
      )}

      {/* Input */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border/40 p-0 bg-[var(--ds-surface,#18191a)]"
      >
        <TooltipProvider>
          {/* Tagged Context Area */}
          {taggedItems.length > 0 && (
            <div className="px-4 pt-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {taggedItems.map((item) => (
                <AvatarTag
                  key={item.id}
                  label={item.label}
                  onRemove={() =>
                    setTaggedItems((prev) =>
                      prev.filter((i) => i.id !== item.id)
                    )
                  }
                />
              ))}
            </div>
          )}

          <div className="flex flex-col p-4 gap-3">
            <div
              className={cn(
                'relative flex flex-col rounded-[12px] border transition-all duration-300 shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-0',
                'bg-[var(--ds-surface-raised)] border-[var(--ds-border)]'
              )}
            >
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRtl ? 'اسأل شيئاً...' : 'Ask something or tag with @...'
                }
                rows={1}
                disabled={isLoading}
                className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  direction: isRtl ? 'rtl' : 'ltr',
                  minHeight: '48px',
                  maxHeight: '120px',
                }}
              />

              <div
                className={cn(
                  'flex items-center justify-between px-2 pb-2',
                  isRtl && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-1',
                    isRtl && 'flex-row-reverse'
                  )}
                >
                  <Tooltip>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          toast.info(
                            isRtl
                              ? `تم اختيار: ${file.name}`
                              : `Selected: ${file.name}`
                          );
                          // In Phase 3+ we will handle actual upload
                        }
                      }}
                    />
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-8 w-8 text-[var(--ds-icon-subtle,#A1A1AA)] hover:text-[var(--ds-text,#FAFAFA)]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isRtl ? 'إرفاق ملف' : 'Attach file'}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-8 w-8 text-[var(--ds-icon-subtle,#A1A1AA)] hover:text-[var(--ds-text,#FAFAFA)]"
                        onClick={() =>
                          toast.info(
                            isRtl
                              ? 'ميزة الصوت ستتوفر قريباً'
                              : 'Voice feature coming soon'
                          )
                        }
                      >
                        <Mic size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isRtl ? 'تحدث' : 'Voice'}
                    </TooltipContent>
                  </Tooltip>

                  <div className="w-px h-4 bg-[var(--ds-border,#27272a)] mx-1" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-8 w-8 text-[var(--ds-icon-subtle,#A1A1AA)] hover:text-primary"
                        onClick={() => {
                          if (!taggedItems.some((i) => i.id === 'demo-res')) {
                            setTaggedItems((prev) => [
                              ...prev,
                              {
                                id: 'demo-res',
                                label: 'Ahmed V-42',
                                type: 'resident',
                              },
                            ]);
                            if (!input)
                              setInput(
                                isRtl ? 'أنشئ رمز QR لـ ' : 'Create QR for '
                              );
                          }
                        }}
                      >
                        <Plus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isRtl ? 'تاق' : 'Tag'}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Button
                  type="submit"
                  size="compact"
                  variant="brand"
                  disabled={
                    isLoading || (!input.trim() && taggedItems.length === 0)
                  }
                  className="gap-2 font-semibold"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>{isRtl ? 'إرسال' : 'Send'}</span>
                      <Send size={14} className={cn(isRtl && 'rotate-180')} />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div
              className={cn(
                'flex items-center gap-1.5 px-1',
                isRtl && 'flex-row-reverse'
              )}
            >
              <div className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider border border-primary/20">
                GateFlow AI
              </div>
              <span className="text-[10px] text-[var(--ds-text-subtlest,#71717A)]">
                {isRtl
                  ? 'لا يتم حفظ سجل المحادثة على هذا الجهاز؛ تتم إزالته عند إعادة التحميل.'
                  : 'Chat history is not saved on this device and clears on reload.'}
              </span>
            </div>
          </div>
        </TooltipProvider>
      </form>
    </div>
  );
}
