'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap } from 'lucide-react';

const QUICK_QUESTIONS = [
  'How does offline scanning work?',
  'Can I try GateFlow for free?',
  'How many gates can I manage?',
  'Is my data secure?',
];

const AUTO_REPLIES: Record<string, string> = {
  'How does offline scanning work?':
    "GateFlow's scanner app queues scans locally with AES-256 encryption when offline. Once reconnected, it automatically syncs to the dashboard with deduplication. No scan is ever lost.",
  'Can I try GateFlow for free?':
    'Yes! Our Starter plan is free for up to 1 gate and 500 scans/month — no credit card needed. Visit our pricing page to compare plans.',
  'How many gates can I manage?':
    'Starter: 1 gate. Pro: up to 10 gates. Enterprise: unlimited gates. You can also add individual gates for a monthly add-on fee.',
  'Is my data secure?':
    'All QR codes are HMAC-SHA256 signed. Offline data uses AES-256 encryption. API access uses short-lived JWT tokens (15-min expiry) with rotation. We follow zero-trust principles throughout.',
};

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: "Hi! I'm GateFlow's help assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: Date.now(), role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply =
        AUTO_REPLIES[trimmed] ??
        'Thanks for your question! Our team will get back to you shortly. For immediate help, visit our Help Center or email hello@gateflow.io.';
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: reply }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-600 hover:scale-105 transition-all duration-200 ${
          open ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
        }`}
        aria-label="Open help chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col w-80 sm:w-[22rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 origin-bottom-right ${
          open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: 520 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 rounded-t-2xl bg-indigo-700 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Zap size={15} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">GateFlow Help</p>
            <p className="text-xs text-indigo-200 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
              Online
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-indigo-200 hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X size={15} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ minHeight: 180, maxHeight: 280 }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-700 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="flex gap-1 items-center">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length <= 2 && !typing && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-white disabled:opacity-40 hover:bg-indigo-600 transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
