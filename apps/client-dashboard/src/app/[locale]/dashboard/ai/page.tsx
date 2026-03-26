'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '@ai-sdk/react';
import { ChatPanel } from '@/components/dashboard/ai/ChatPanel';
import { ChatHistorySidebar } from '@/components/dashboard/ai/ChatHistorySidebar';

export default function GateAIPage() {
  const { t, i18n } = useTranslation('dashboard');
  const isRtl = i18n.language === 'ar';

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    data,
  } = useChat({
    api: '/api/ai/chat',
  });

  return (
    <div className="flex h-full overflow-hidden bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[var(--ds-background-default,#161A1D)]">
      <ChatHistorySidebar isRtl={isRtl} onNewChat={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--ds-surface,#FFFFFF)] dark:bg-[var(--ds-surface,#161A1D)]">
        <div className="flex-1 overflow-hidden w-full flex flex-col items-center">
          <div className="flex-1 w-full max-w-5xl flex flex-col pt-8">
            {error && (
              <div className="p-4 bg-[var(--ds-background-danger,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)] rounded-[3px] text-sm mb-4 mx-4 w-full">
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
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isRtl={isRtl}
              streamData={data as any[]}
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
