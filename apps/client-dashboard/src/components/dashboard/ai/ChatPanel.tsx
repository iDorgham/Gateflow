'use client';

import * as React from 'react';
import { Message } from 'ai';
import { 
  Button, 
  cn,
  Avatar,
  AvatarFallback,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gate-access/ui';
import { Send, User, Sparkles, Loader2, Paperclip, ThumbsUp, ThumbsDown, Mic, BarChart3, FileText, QrCode } from 'lucide-react';
import { AIChartRenderer, type ChartDataBlock } from './AIChartRenderer';
import { AIReportRenderer, type ReportDataBlock } from './AIReportRenderer';
import { AIScheduleRenderer, type ScheduleDataBlock } from './AIScheduleRenderer';
import { AIConfirmationRenderer, type ActionDataBlock } from './AIConfirmationRenderer';
import { toast } from 'sonner';

// Helper to parse potential chart/report/schedule data from message content
function parseMessageContent(content: string) {
  // Look for JSON blocks specifically tagged or structured as charts, reports, or schedules
  const jsonRegex = /```json\s*(\{[\s\S]*?"type"\s*:\s*"(?:chart|report|schedule|confirm)"[\s\S]*?\})\s*```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = jsonRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text' as const, content: content.slice(lastIndex, match.index) });
    }
    try {
      const config = JSON.parse(match[1]);
      if (config.type === 'chart') {
        parts.push({ type: 'chart' as const, config: config as ChartDataBlock });
      } else if (config.type === 'report') {
        parts.push({ type: 'report' as const, config: config as ReportDataBlock });
      } else if (config.type === 'schedule') {
        parts.push({ type: 'schedule' as const, config: config });
      } else if (config.type === 'confirm') {
        parts.push({ type: 'confirm' as const, config: config as ActionDataBlock });
      }
    } catch (e) {
      parts.push({ type: 'text' as const, content: match[0] });
    }
    lastIndex = jsonRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text' as const, content: content.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text' as const, content }];
}

interface ChatPanelProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isRtl: boolean;
  streamData?: any[];
  onSuggestedPromptClick?: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  { icon: BarChart3, label: 'Analyze last month\'s scans', prompt: 'Show me an analysis of last month\'s scan trends.', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { icon: QrCode, label: 'Generate guest QR', prompt: 'I want to generate a guest QR code for tomorrow.', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  { icon: FileText, label: 'Create security report', prompt: 'Generate a security incident report for the last 7 days.', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  { icon: Sparkles, label: 'Optimize gate flow', prompt: 'How can I optimize the visitor flow at the main gate?', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
];

export function ChatPanel({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isRtl,
  streamData = [],
  onSuggestedPromptClick,
}: ChatPanelProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Track state of AI actions (pending, confirmed, etc.)
  const [actionStates, setActionStates] = React.useState<Record<string, 'pending' | 'confirmed' | 'cancelled' | 'executed' | 'failed'>>({});
  const [executingActions, setExecutingActions] = React.useState<Record<string, boolean>>({});
  const [feedbackGiven, setFeedbackGiven] = React.useState<Record<string, 'THUMBS_UP' | 'THUMBS_DOWN'>>({});

  const handleActionConfirm = async (messageId: string, partIndex: number, data: ActionDataBlock) => {
    const actionKey = `${messageId}-${partIndex}`;
    setExecutingActions(prev => ({ ...prev, [actionKey]: true }));

    try {
      // 1. Create the action log on the server first
      const logRes = await fetch('/api/ai/actions/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: data.actionType,
          title: data.title,
          intentJson: data.intentJson,
          prompt: messages.find(m => m.id === messageId)?.content || '',
        }),
      });

      if (!logRes.ok) throw new Error('Failed to log action');
      const { actionId } = await logRes.json();

      // 2. Execute the action
      const execRes = await fetch('/api/ai/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId,
          actionType: data.actionType,
          intentJson: data.intentJson,
        }),
      });

      if (!execRes.ok) {
        const err = await execRes.json();
        throw new Error(err.error || 'Execution failed');
      }

      setActionStates(prev => ({ ...prev, [actionKey]: 'executed' }));
      toast.success(t('Action executed successfully', 'تم تنفيذ الإجراء بنجاح'));
    } catch (err: any) {
      console.error('>>> [ChatPanel] Action failed:', err);
      setActionStates(prev => ({ ...prev, [actionKey]: 'failed' }));
      toast.error(err.message || t('Action failed', 'فشل تنفيذ الإجراء'));
    } finally {
      setExecutingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleActionCancel = (messageId: string, partIndex: number) => {
    const actionKey = `${messageId}-${partIndex}`;
    setActionStates(prev => ({ ...prev, [actionKey]: 'cancelled' }));
    toast.info(t('Action cancelled', 'تم إلغاء الإجراء'));
  };

  const handleFeedback = async (interactionIdx: number, type: 'THUMBS_UP' | 'THUMBS_DOWN') => {
    const interactionId = streamData?.[interactionIdx]?.actionId;
    if (!interactionId) {
      console.warn('>>> [ChatPanel] No interactionId found for index:', interactionIdx);
      return;
    }

    try {
      const res = await fetch(`/api/ai/actions/${interactionId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: type }),
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      setFeedbackGiven(prev => ({ ...prev, [interactionId]: type }));
      toast.success(t('Thank you for your feedback!', 'شكراً على ملاحظاتك!'));
    } catch (err) {
      console.error('>>> [ChatPanel] Feedback failed:', err);
      toast.error(t('Feedback submission failed', 'فشل إرسال الملاحظات'));
    }
  };

  const t = (en: string, ar: string) => (isRtl ? ar : en);

  return (
    <div className="flex flex-col h-full bg-transparent">

      <div className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-[var(--ds-background-discovery,#EAE6FF)] flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Sparkles size={32} className="text-[var(--ds-text-discovery,#403294)]" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-[var(--ds-text,#172B4D)] dark:text-white">
                    {t('How can I help you today?', 'كيف يمكنني مساعدتك اليوم؟')}
                  </h1>
                  <p className="text-base text-[var(--ds-text-subtle,#6B778C)] max-w-md leading-relaxed">
                    {t('I can help you analyze scans, generate reports, or automate your gate operations in seconds.', 'يمكنني مساعدتك في تحليل المسحات، إنشاء التقارير، أو أتمتة عمليات بواباتك في ثوانٍ.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                  {SUGGESTED_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSuggestedPromptClick?.(item.prompt)}
                      className="flex items-center gap-3 p-4 text-left bg-white dark:bg-[#1C2126] border border-[var(--ds-border,#DFE1E6)] dark:border-[#2C333A] rounded-xl hover:border-[var(--ds-border-selected,#0052CC)] hover:shadow-md transition-all group"
                    >
                      <div className={cn("p-2 rounded-lg shrink-0", item.color)}>
                        <item.icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-[var(--ds-text,#172B4D)] dark:text-[#F4F5F7] group-hover:text-[var(--ds-text-selected,#0052CC)] transition-colors">
                        {t(item.label, item.label)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((m, messageIdx) => {
              // interaction index is roughly floor(idx / 2) because messages alternate User/AI
              // This is a heuristic that works for normal chat flow
              const interactionIdx = Math.floor(messageIdx / 2);
              const interactionId = streamData?.[interactionIdx]?.actionId;

              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    m.role === 'user' 
                      ? (isRtl ? "mr-auto flex-row-reverse" : "ml-auto flex-row-reverse") 
                      : "mr-auto w-full"
                  )}
                >
                  <Avatar className={cn(
                    "h-8 w-8 shrink-0",
                    m.role === 'user' ? "bg-[var(--ds-background-neutral-bold,#44546F)]" : "bg-[var(--ds-background-discovery-bold,#5243AA)]"
                  )}>
                    <AvatarFallback className="text-white text-[10px]">
                      {m.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col gap-1 flex-1 min-w-0 group">
                    {parseMessageContent(m.content).map((part, i) => (
                      <React.Fragment key={`${m.id}-${i}`}>
                        {part.type === 'text' ? (
                          <div className={cn(
                            "rounded-2xl px-4 py-3 text-sm leading-relaxed relative",
                            m.role === 'user'
                              ? "bg-[var(--ds-background-neutral,#F4F5F7)] dark:bg-[#2C333A] text-[var(--ds-text,#172B4D)] dark:text-[#F4F5F7] rounded-tr-none"
                              : "bg-white dark:bg-[#1C2126] text-[var(--ds-text,#172B4D)] dark:text-[#F4F5F7] border border-[var(--ds-border-discovery,#998DD9)] dark:border-[#403294]/50 shadow-sm rounded-tl-none whitespace-pre-wrap"
                          )}>
                            {part.content}
                          </div>
                        ) : part.type === 'chart' ? (
                          <AIChartRenderer config={part.config as ChartDataBlock} />
                        ) : part.type === 'report' ? (
                          <AIReportRenderer config={part.config as ReportDataBlock} isRtl={isRtl} />
                        ) : part.type === 'schedule' ? (
                          <AIScheduleRenderer config={part.config as ScheduleDataBlock} isRtl={isRtl} />
                        ) : (
                          <AIConfirmationRenderer 
                            data={part.config as ActionDataBlock} 
                            status={actionStates[`${m.id}-${i}`] || 'pending'}
                            isExecuting={executingActions[`${m.id}-${i}`]}
                            onConfirm={(data) => handleActionConfirm(m.id, i, data)}
                            onCancel={() => handleActionCancel(m.id, i)}
                          />
                        )}
                      </React.Fragment>
                    ))}

                    {/* Feedback Buttons for AI messages */}
                    {m.role === 'assistant' && !isLoading && interactionId && (
                      <div className={cn(
                        "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1",
                        isRtl ? "justify-end" : "justify-start"
                      )}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6 rounded-full hover:bg-[var(--ds-background-neutral-subtle,#DFE1E6)]",
                            feedbackGiven[interactionId] === 'THUMBS_UP' && "text-green-600 bg-green-50"
                          )}
                          onClick={() => handleFeedback(interactionIdx, 'THUMBS_UP')}
                          disabled={!!feedbackGiven[interactionId]}
                        >
                          <ThumbsUp size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6 rounded-full hover:bg-[var(--ds-background-neutral-subtle,#DFE1E6)]",
                            feedbackGiven[interactionId] === 'THUMBS_DOWN' && "text-red-600 bg-red-50"
                          )}
                          onClick={() => handleFeedback(interactionIdx, 'THUMBS_DOWN')}
                          disabled={!!feedbackGiven[interactionId]}
                        >
                          <ThumbsDown size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex gap-3 mr-auto items-center text-[var(--ds-text-subtle,#6B778C)] animate-pulse">
                <Avatar className="h-8 w-8 bg-[var(--ds-background-discovery-bold,#5243AA)]">
                  <AvatarFallback className="text-white">
                    <Loader2 size={14} className="animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{t('Assistant is thinking...', 'المساعد يفكر...')}</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 m-4 border border-[var(--ds-border,#DFE1E6)]/30 dark:border-[#2C333A] bg-[var(--ds-background-neutral-subtle,#F4F5F7)] dark:bg-[#1C2126] rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={t('Ask Assistant something...', 'اسأل المساعد شيئاً...')}
                className={cn(
                  "w-full bg-white border border-[var(--ds-border-input,#DFE1E6)] rounded-xl px-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] transition-all",
                  isRtl ? "pl-24" : "pr-24"
                )}
                disabled={isLoading}
              />
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center gap-1",
                isRtl ? "left-2" : "right-2"
              )}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-[#6B778C] dark:text-[#A5ADBA] hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Mic size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Voice input (Coming soon)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-[#6B778C] dark:text-[#A5ADBA] hover:bg-gray-100 dark:hover:bg-gray-800" disabled>
                        <Paperclip size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach file (Coming soon)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-8 w-8 bg-[#0052CC] hover:bg-[#0052CC]/90 text-white rounded-lg transition-transform active:scale-95"
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={14} className={isRtl ? "rotate-180" : ""} />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
