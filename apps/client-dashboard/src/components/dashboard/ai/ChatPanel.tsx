'use client';

import * as React from 'react';
import { Message } from 'ai';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  cn,
  Avatar,
  AvatarFallback,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gate-access/ui';
import { Send, User, Sparkles, Loader2, Paperclip, ThumbsUp, ThumbsDown } from 'lucide-react';
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
}

export function ChatPanel({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isRtl,
  streamData = [],
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
    <Card className="flex flex-col h-full border-[var(--ds-border-discovery,#998DD9)] bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/20 shadow-none">
      <CardHeader className="border-b border-[var(--ds-border-discovery,#998DD9)]/30 py-4">
        <CardTitle className="flex items-center gap-2 text-[var(--ds-text-discovery,#403294)] text-lg">
          <Sparkles className="h-5 w-5" />
          {t('GateAI Assistant', 'مساعد GateAI الذكي')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[300px] text-center gap-2 text-[var(--ds-text-discovery,#403294)]/60">
                <div className="h-12 w-12 rounded-full bg-[var(--ds-background-discovery,#EAE6FF)] flex items-center justify-center mb-2">
                  <Sparkles size={24} className="text-[var(--ds-text-discovery,#403294)]" />
                </div>
                <p className="font-medium text-lg">
                  {t('How can I help you today?', 'كيف يمكنني مساعدتك اليوم؟')}
                </p>
                <p className="text-sm max-w-sm">
                  {t('Ask about reports, visitor trends, or managing your gates.', 'اسأل عن التقارير، اتجاهات الزوار، أو إدارة بواباتك.')}
                </p>
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
                            "rounded-2xl px-4 py-2 text-sm leading-relaxed relative",
                            m.role === 'user'
                              ? "bg-[var(--ds-background-neutral,#F4F5F7)] text-[var(--ds-text,#172B4D)] rounded-tr-none"
                              : "bg-white text-[var(--ds-text,#172B4D)] border border-[var(--ds-border-discovery,#998DD9)] shadow-sm rounded-tl-none whitespace-pre-wrap"
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
                <span className="text-xs">{t('GateAI is thinking...', 'GateAI يفكر...')}</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--ds-border-discovery,#998DD9)]/30 bg-white/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={t('Ask GateAI something...', 'اسأل GateAI شيئاً...')}
                className={cn(
                  "w-full bg-white border border-[var(--ds-border-input,#DFE1E6)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-discovery,#998DD9)] transition-all",
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
                      <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-[#6B778C]" disabled>
                        <Paperclip size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach file (Coming soon)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-8 w-8 bg-[var(--ds-background-discovery-bold,#5243AA)] hover:bg-[var(--ds-background-discovery-bold,#5243AA)]/90 text-white"
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={14} className={isRtl ? "rotate-180" : ""} />
                </Button>
              </div>
            </div>
          </form>
          <p className="mt-2 text-[10px] text-center text-[#6B778C]">
            {t('Powered by mediaBubble AI Intelligence', 'مدعوم من ذكاء ميديا بابل')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
