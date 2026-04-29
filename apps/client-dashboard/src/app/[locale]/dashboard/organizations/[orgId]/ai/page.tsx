'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatPanel } from '@/components/dashboard/ai/ChatPanel';
import { ChatHistorySidebar } from '@/components/dashboard/ai/ChatHistorySidebar';

export default function GateAIPage() {
  const { t, i18n } = useTranslation('dashboard');
  const isRtl = i18n.language === 'ar';

  const [input, setInput] = React.useState('');
  const [streamData, setStreamData] = React.useState<any[]>([]);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
    }),
    onData: (dataPart) => {
      setStreamData((prev) => [...prev, dataPart]);
    },
  });

  const isLoading = status !== 'ready';

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setStreamData([]);
    setInput('');
    await sendMessage({ text: trimmed });
  };

  return (
    <div className="flex h-full overflow-hidden bg-[var(--ds-background-default)]">
      <ChatHistorySidebar isRtl={isRtl} onNewChat={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--ds-surface)]">
        <div className="flex-1 overflow-hidden w-full flex flex-col items-center">
          <div className="flex-1 w-full max-w-5xl flex flex-col pt-8">
            {error && (
              <div className="p-4 bg-[var(--ds-background-danger-subtle)] text-[var(--ds-text-danger)] rounded-[3px] text-sm mb-4 mx-4 w-full">
                <p className="font-semibold">
                  {(() => {
                    const errData = error.message;
                    if (errData.includes('ai.quotaError'))
                      return t('ai.quotaError');
                    if (errData.includes('ai.chatError'))
                      return t('ai.chatError');
                    return t(
                      'ai.chatError',
                      'Failed to connect to GateAI. Please check your credentials or try again later.'
                    );
                  })()}
                </p>
                <pre className="mt-2 text-[10px] opacity-70">
                  {(error as any).message || error.toString()}
                </pre>
              </div>
            )}

            <ChatPanel
              messages={
                messages as unknown as Parameters<
                  typeof ChatPanel
                >[0]['messages']
              }
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isRtl={isRtl}
              streamData={streamData}
              onSuggestedPromptClick={(prompt) => {
                handleInputChange({ target: { value: prompt } } as any);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
