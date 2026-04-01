'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap } from 'lucide-react';

import { useTranslation } from '../hooks/use-translation';

interface FAQ {
  q: string;
  a: string;
}

interface ComponentsDictionary {
  chatWidget?: {
    faqs?: FAQ[];
    [key: string]: any;
  };
  [key: string]: any;
}

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { t, dict } = useTranslation('components');
  const componentsDict = dict as ComponentsDictionary;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: t('chatWidget.botWelcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
        50
      );
    }
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: Date.now(), role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(
      () => {
        const faqs = componentsDict.chatWidget?.faqs || [];
        const replyObj = faqs.find((f) => f.q === trimmed);
        const reply = replyObj?.a ?? t('chatWidget.botFallback');

        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, role: 'bot', text: reply },
        ]);
        setTyping(false);
      },
      700 + Math.random() * 500
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ds-background-brand-bold text-ds-text-inverse shadow-[0_8px_24px_rgba(237,75,0,0.3)] hover:opacity-90 hover:scale-105 transition-all duration-200 ${
          open
            ? 'opacity-0 pointer-events-none scale-90'
            : 'opacity-100 scale-100'
        }`}
        aria-label={t('chatWidget.ariaOpen')}
      >
        <MessageCircle size={24} />
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col w-80 sm:w-[22rem] rounded-2xl border border-ds-border bg-ds-surface shadow-2xl transition-all duration-300 origin-bottom-right ${
          open
            ? 'scale-100 opacity-100'
            : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: 520 }}
      >
        <div className="flex items-center gap-3 rounded-t-2xl bg-ds-background-brand-bold px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Zap size={15} className="text-ds-text-inverse" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-ds-text-inverse">
              {t('chatWidget.header')}
            </p>
            <p className="text-xs text-ds-text-inverse opacity-80 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ds-background-success-bold inline-block" />
              {t('chatWidget.onlineStatus')}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-ds-text-inverse opacity-80 hover:bg-white/10 transition-colors"
            aria-label={t('chatWidget.ariaClose')}
          >
            <X size={15} />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ minHeight: 180, maxHeight: 280 }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-ds-background-brand-bold text-ds-text-inverse rounded-br-sm'
                    : 'bg-ds-surface-raised border border-ds-border text-ds-text-heading rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-ds-surface-raised border border-ds-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <span className="flex gap-1 items-center">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full bg-ds-text-subtle animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 2 && !typing && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {(componentsDict.chatWidget?.faqs || [])
              .map((faq) => faq.q)
              .map((q: string) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs rounded-full border border-ds-border bg-ds-surface text-ds-text-subtle px-3 py-1 hover:bg-ds-surface-raised transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-ds-border bg-ds-surface-sunken rounded-b-2xl">
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
              placeholder={t('chatWidget.placeholder')}
              className="flex-1 rounded-xl border border-ds-border bg-ds-surface px-3 py-2 text-sm text-ds-text-heading placeholder:text-ds-text-subtlest outline-none focus:ring-2 focus:ring-ds-border-focused focus:border-transparent transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ds-background-brand-bold text-ds-text-inverse disabled:opacity-40 hover:opacity-90 transition-all shadow-sm"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
