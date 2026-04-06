import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Bot, Sparkles, MessageSquare, Send, Zap, Info, Wand2 } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, ScrollArea } from '@gateflow/ui';

const aiPrinciples = [
  {
    title: 'Orchid Glow Protocol',
    description: 'AI surfaces use a unique violet/orchid accent (--gf-color-ai-accent) to distinguish intelligence from standard UI tokens.',
    icon: Wand2,
  },
  {
    title: 'Staggered Entrances',
    description: 'AI-generated content should never "pop" in. Use 0.3s spring transitions with 10px Y-offsets for organic message delivery.',
    icon: Zap,
  },
  {
    title: 'Glassmorphic Intelligence',
    description: 'AI panels use heavy backdrop blurring (3xl) and subtle mesh overlays to feel like a superior cognitive layer over the application.',
    icon: Sparkles,
  },
];

export default function AIElementsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="AI Elements"
        subtitle="GateAI patterns define how artificial intelligence manifests within the GateFlow workspace, emphasizing premium Orchid flows and cognitive depth."
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'AI Elements' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--gf-color-ai-accent)] text-white shadow-lg transition-transform group-hover:rotate-6">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
              {p.title}
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            GateAI Chat Lab
          </h2>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-60">
            Interactive demonstration of AI surface depth and message animation protocols.
          </p>
        </div>
        <AIChatLab />
      </div>

      <section className="p-8 rounded-3xl border border-[var(--gf-color-ai-accent)]/20 bg-gradient-to-br from-[var(--gf-color-ai-accent)]/[0.05] to-transparent relative overflow-hidden group">
        <div className="absolute top-2 right-2 p-2 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
          <Bot size={120} />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--gf-color-ai-accent)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              The Cognitive Layer
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              AI elements should feel like they exist "above" the standard application. This is achieved through the use of <strong>--gf-color-ai-surface</strong> (an ultra-deep charcoal with violet tint) and the <strong>shadow-ai-glow</strong> class, which provides a soft atmospheric purple bloom.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AIChatLab() {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Ready to optimize your gate access protocols. What should we analyze today?', timestamp: 'Just now' },
  ]);
  const [input, setInput] = React.useState('');
  const [isThinking, setIsThinking] = React.useState(false);

  const sendMessage = () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg = { role: 'user', content: input, timestamp: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Simulate AI logic
    setTimeout(() => {
      const response = { 
        role: 'assistant', 
        content: 'I have analyzed the South Gate logs. There is a frequent bottleneck at 08:45 AM. I recommend predictive lanes for pre-verified residents.',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, response]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--gf-color-ai-surface)] shadow-ai-glow overflow-hidden flex flex-col h-[500px]">
      {/* Lab Header */}
      <div className="px-6 py-4 border-b border-[var(--ds-border-subtle)] flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[var(--gf-color-ai-accent)] flex items-center justify-center">
            <Bot className="text-white" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
              GateAI Lab v4
            </span>
            <span className="text-[8px] font-bold text-[var(--gf-color-ai-accent)]">
              ACTIVE COGNITION ENGINE
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className={cn(
                  "flex flex-col gap-2 max-w-[85%]",
                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                )}
              >
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === 'user'
                      ? "bg-[var(--ds-background-brand-bold)] text-white"
                      : "bg-white/5 border border-white/10 text-white/90 backdrop-blur-md"
                  )}
                >
                  {msg.content}
                </div>
                <div className="px-2 flex items-center gap-1.5 opacity-40">
                  <span className="text-[8px] font-black uppercase tracking-tighter text-white">
                    {msg.role === 'user' ? 'Resident ID-42' : 'GateAI Bot'}
                  </span>
                  <span className="text-[8px] text-white"></span>
                  <span className="text-[8px] font-medium text-white">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-auto flex gap-2 items-center px-4 py-2 bg-white/5 rounded-full border border-white/10"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="h-1 w-1 rounded-full bg-[var(--gf-color-ai-accent)]"
                  />
                ))}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--gf-color-ai-accent)]">
                Thinking...
              </span>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-white/10 bg-white/5 mt-auto">
        <div className="flex gap-2 relative">
          <Input 
            placeholder="Instruct the engine..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="bg-black/40 border-white/10 rounded-xl text-white placeholder:text-white/20 px-4 h-11 text-sm focus-visible:ring-[var(--gf-color-ai-accent)] focus-visible:ring-offset-0"
          />
          <Button 
            size="icon" 
            onClick={sendMessage}
            disabled={isThinking}
            className="absolute right-1 top-1 bottom-1 h-9 w-9 bg-[var(--gf-color-ai-accent)] text-white rounded-lg hover:scale-[1.02] shadow-lg shadow-[var(--gf-color-ai-accent)]/20 transition-all active:scale-95"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
