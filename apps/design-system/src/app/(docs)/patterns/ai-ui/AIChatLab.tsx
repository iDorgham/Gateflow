'use client';

import * as React from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  Database,
  Workflow,
} from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, ScrollArea } from '@gateflow/ui';
import { ToolCallCard } from '@gateflow/ai/components/ToolCallCard';

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content:
      'GateAI Cognitive Engine v7 initialized. How can I assist with your workspace protocols today?',
    type: 'text',
  },
  {
    role: 'user',
    content:
      'Analyze the access patterns for the North Gate for the last 48 hours.',
    type: 'text',
  },
  {
    role: 'assistant',
    name: 'database_query',
    status: 'success' as const,
    arguments: { gate: 'North', range: '48h', metric: 'access_count' },
    result: 'Found 1,284 successful entries and 12 rejected attempts.',
    type: 'tool',
  },
  {
    role: 'assistant',
    content:
      'I have analyzed the patterns. There is a 15% increase in visitor traffic between 07:00 and 09:00. Should I provision an additional guest lane?',
    type: 'text',
  },
];

export default function AIChatLab() {
  const [messages, setMessages] = React.useState(INITIAL_MESSAGES);
  const [input, setInput] = React.useState('');
  const [isThinking, setIsThinking] = React.useState(false);

  const sendMessage = () => {
    if (!input.trim() || isThinking) return;

    const userMsg = { role: 'user', content: input, type: 'text' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const response = {
        role: 'assistant',
        content:
          'I have synchronized your request with the security controller. The additional lane has been scheduled for tomorrow morning.',
        type: 'text',
      };
      setMessages((prev) => [...prev, response]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-[2.5rem] border border-[var(--ds-border-bold)] bg-[var(--gf-color-ai-surface)] shadow-ai-glow overflow-hidden flex flex-col h-[650px] relative">
      {/* Abstract Cognitive Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] inset-inline-start-[-10%] w-[40%] h-[40%] bg-[var(--gf-color-ai-accent)] blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] inset-inline-end-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full mix-blend-screen opacity-50" />
      </div>

      {/* Lab Header */}
      <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[var(--gf-color-ai-accent)] flex items-center justify-center shadow-lg shadow-[var(--gf-color-ai-accent)]/40 group">
            <Bot
              className="text-white group-hover:scale-110 transition-transform"
              size={20}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-widest text-white">
              GateAI Cognition Lab
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-[var(--gf-color-ai-accent)] uppercase tracking-tighter">
                Synchronized with Global Hub
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1">
            {[Terminal, Database, Workflow].map((Icon, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded-lg bg-white/5 text-white/30 border border-white/5"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full border border-white/20 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-8 relative z-10">
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className={cn(
                  'flex flex-col gap-3',
                  msg.role === 'user' ? 'items-end ms-12' : 'items-start me-12'
                )}
              >
                {msg.type === 'tool' ? (
                  <ToolCallCard
                    name={msg.name || ''}
                    status={msg.status || 'success'}
                    arguments={msg.arguments}
                    result={msg.result}
                    className="w-full bg-white/[0.03] border-white/10 text-white/90 backdrop-blur-md"
                  />
                ) : (
                  <div
                    className={cn(
                      'px-5 py-4 rounded-3xl text-sm font-bold leading-relaxed shadow-xl',
                      msg.role === 'user'
                        ? 'bg-[var(--ds-background-brand-bold)] text-white'
                        : 'bg-white/[0.05] border border-white/10 text-white/90 backdrop-blur-md relative overflow-hidden group'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="absolute top-0 inset-inline-start-0 w-1 h-full bg-[var(--gf-color-ai-accent)] shadow-[2px_0_10px_var(--gf-color-ai-accent)] shadow-ai-glow opacity-50" />
                    )}
                    {msg.content}
                  </div>
                )}
                <div className="px-2 flex items-center gap-2 opacity-50">
                  <span className="text-[9px] font-black uppercase tracking-tighter text-white">
                    {msg.role === 'user' ? 'Operator X-9' : 'GateAI Unit'}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="text-[9px] font-medium text-white">
                    0.0{i}s
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="me-auto flex gap-3 items-center px-5 py-3 bg-white/[0.05] rounded-full border border-white/10 backdrop-blur-md shadow-xl"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-[var(--gf-color-ai-accent)] shadow-[0_0_8px_var(--gf-color-ai-accent)]"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--gf-color-ai-accent)]">
                Synthesizing Response...
              </span>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-8 border-t border-white/10 bg-black/40 backdrop-blur-2xl mt-auto relative z-10">
        <div className="flex gap-3 relative max-w-2xl mx-auto">
          <Input
            placeholder="Instruct the engine..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="bg-white/[0.05] border-white/10 rounded-[1.25rem] text-white placeholder:text-white/20 px-6 h-14 text-sm font-bold shadow-inner focus-visible:ring-[var(--gf-color-ai-accent)] focus-visible:ring-offset-0 transition-all focus:bg-white/[0.08]"
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={isThinking}
            className="absolute inset-inline-end-1.5 top-1.5 bottom-1.5 h-11 w-11 bg-[var(--gf-color-ai-accent)] text-white rounded-xl shadow-2xl shadow-[var(--gf-color-ai-accent)]/40 hover:scale-[1.05] transition-all active:scale-95 group"
          >
            <Send
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles size={10} className="text-[var(--gf-color-ai-accent)]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
              Llama 3 70B Orchestrator
            </span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-2">
            <Workflow size={10} className="text-[var(--gf-color-ai-accent)]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
              Auto-Tool Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
