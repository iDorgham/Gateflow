'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import {
  Sparkles,
  Send,
  X,
  MessageSquare,
  History,
  Zap,
  Settings,
  Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AISidePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  isOpen: boolean;
}

export function AISidePanel({
  className,
  onClose,
  isOpen,
  ...props
}: AISidePanelProps) {
  const [messages, setMessages] = React.useState([
    {
      role: 'assistant',
      content: 'Hello! I am your GateFlow assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I noticed a slight increase in traffic at the South Gate. Would you like me to analyze the trends?',
        },
      ]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={cn(
            'fixed right-0 top-0 z-50 h-screen w-96 border-l border-[var(--ds-border-brand)]/20 bg-[var(--gf-color-ai-surface)] shadow-ai-glow backdrop-blur-3xl flex flex-col',
            className
          )}
          {...props}
        >
          {/* AI Mesh Overlay */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'var(--gf-pattern-sentinel)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--gf-color-ai-accent)]/5 to-transparent pointer-events-none" />

          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--ds-border-subtle)] relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--gf-color-ai-accent)] flex items-center justify-center shadow-lg shadow-[var(--gf-color-ai-accent)]/20">
                <Bot className="text-white" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-[var(--ds-text)]">
                  GateAI Assistant
                </span>
                <span className="text-[10px] font-bold text-[var(--gf-color-ai-accent)]">
                  Virtual Lab v4.2
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-[var(--ds-background-neutral-subtle)]"
            >
              <X size={18} />
            </Button>
          </header>

          {/* Tabs / Nav */}
          <div className="px-4 py-2 border-b border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)]/30 flex gap-2 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg h-8 text-[10px] font-black uppercase tracking-tight gap-1.5 bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] shadow-sm"
            >
              <MessageSquare size={12} /> Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg h-8 text-[10px] font-black uppercase tracking-tight gap-1.5 text-[var(--ds-text-subtle)]"
            >
              <History size={12} /> Context
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg h-8 text-[10px] font-black uppercase tracking-tight gap-1.5 text-[var(--ds-text-subtle)]"
            >
              <Zap size={12} /> Insights
            </Button>
          </div>

          {/* Chat Content */}
          <ScrollArea className="flex-1 p-6 relative z-10">
            <div className="flex flex-col gap-6">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    'flex flex-col gap-2 max-w-[85%]',
                    msg.role === 'user'
                      ? 'ml-auto items-end'
                      : 'mr-auto items-start'
                  )}
                >
                  <div
                    className={cn(
                      'p-4 rounded-2xl text-sm leading-relaxed shadow-sm',
                      msg.role === 'user'
                        ? 'bg-[var(--ds-background-brand-bold)] text-white'
                        : 'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text)] border border-[var(--ds-border-subtle)]'
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                    {msg.role === 'user' ? 'Me' : 'GateAI'} • Just now
                  </span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer Input */}
          <footer className="p-6 border-t border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)]/50 relative z-10">
            <div className="flex gap-2 relative">
              <Input
                placeholder="Ask intelligence engine..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="bg-[var(--ds-background-default)] border-[var(--ds-border-subtle)] rounded-xl pr-12 text-sm focus-visible:ring-[var(--gf-color-ai-accent)]"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="absolute right-1 top-1 bottom-1 h-8 w-8 bg-[var(--gf-color-ai-accent)] text-white rounded-lg hover:opacity-90 transition-all border-none"
              >
                <Send size={14} />
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex gap-4">
                <Sparkles
                  size={14}
                  className="text-[var(--gf-color-ai-accent)] opacity-50"
                />
                <Settings
                  size={14}
                  className="text-[var(--ds-text-subtlest)]"
                />
              </div>
              <span className="text-[8px] font-black uppercase text-[var(--ds-text-subtlest)]">
                Powered by Gateflow Cloud
              </span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
