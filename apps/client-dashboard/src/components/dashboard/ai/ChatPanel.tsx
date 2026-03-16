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
import { Send, User, Sparkles, Loader2, Paperclip, Mic } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isRtl: boolean;
}

export function ChatPanel({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isRtl,
}: ChatPanelProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const t = (en: string, ar: string) => (isRtl ? ar : en);

  return (
    <Card className="flex flex-col h-[600px] border-[var(--ds-border-discovery,#998DD9)] bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/20">
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
            
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  m.role === 'user' 
                    ? (isRtl ? "mr-auto flex-row-reverse" : "ml-auto flex-row-reverse") 
                    : "mr-auto"
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
                
                <div className={cn(
                  "rounded-2xl px-4 py-2 text-sm leading-relaxed",
                  m.role === 'user'
                    ? "bg-[var(--ds-background-neutral,#F4F5F7)] text-[var(--ds-text,#172B4D)] rounded-tr-none"
                    : "bg-white text-[var(--ds-text,#172B4D)] border border-[var(--ds-border-discovery,#998DD9)] shadow-sm rounded-tl-none"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            
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
                  isRtl ? "pl-28" : "pr-28"
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-[#6B778C]" disabled>
                        <Mic size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Voice (Coming soon)</TooltipContent>
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
