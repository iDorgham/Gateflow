'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  Message,
  MessageAvatar,
  StreamingIndicator,
  ToolCallCard,
  ChatInputShell,
} from '@gateflow/ai';
import { Badge } from '@gateflow/ui';
import { GalleryItem } from '../../../../components/gallery/GalleryItem';
import { Sparkles, Database } from 'lucide-react';

export default function AIGalleryPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="AI Intelligence"
        subtitle="Agentic UI patterns from @gateflow/ai. Focused on streaming, tool execution, and collaborative chat interfaces."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Components', href: '/components' },
          { label: 'AI' },
        ]}
      />

      <section className="flex flex-col gap-6">
        <GalleryItem
          title="Message"
          description="The core communication block. Supports user and assistant roles, markdown content, and integrated avatars."
          packageName="@gateflow/ai"
          code={`import { Message, MessageAvatar } from '@gateflow/ai';

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Message
        role="user"
        content="Hey GateAI, can you audit the security logs for Zayed City North?"
        avatar={<MessageAvatar role="user" />}
      />
      <Message
        role="assistant"
        content="I&apos;ve analyzed the logs for **Zayed City North**. No anomalies detected in the last 24 hours."
        avatar={<MessageAvatar role="assistant" />}
      />
    </div>
  );
}`}
        >
          <div className="w-full max-w-2xl flex flex-col gap-1">
            <Message
              role="user"
              name="Compound Admin"
              content={
                <p>
                  Hey GateAI, can you audit the security logs for{' '}
                  <span className="font-bold text-[var(--ds-text-brand)]">
                    Zayed City North
                  </span>
                  ? I need a summary of all blocked entries.
                </p>
              }
              avatar={
                <MessageAvatar role="user" className="h-10 w-10 rounded-xl" />
              }
              className="rounded-3xl border border-transparent hover:border-[var(--ds-border-brand)]"
            />

            <Message
              role="assistant"
              name="GateAI Sentinel"
              content={
                <div className="space-y-3">
                  <p>
                    I&apos;ve analyzed the logs for{' '}
                    <span className="font-bold">Zayed City North</span>. Here is
                    the summary:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>
                      Total Logins: <span className="font-bold">1,842</span>
                    </li>
                    <li>
                      Blocked Entries:{' '}
                      <span className="font-bold text-red-500">3</span>{' '}
                      (Unauthorized RFID)
                    </li>
                    <li>
                      System Status:{' '}
                      <span className="font-bold text-green-500">Optimal</span>
                    </li>
                  </ul>
                </div>
              }
              avatar={
                <MessageAvatar
                  role="assistant"
                  className="h-10 w-10 rounded-xl"
                />
              }
              actions={
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 h-4 text-[8px] font-black uppercase tracking-tight bg-blue-500/10 text-blue-500 border-none"
                >
                  Analysis Phase
                </Badge>
              }
              className="rounded-3xl border border-[var(--ds-border-brand)] shadow-lg"
            />
          </div>
        </GalleryItem>

        <GalleryItem
          title="StreamingIndicator"
          description="Visual feedback for real-time model responses. Used to handle network latency and token-by-token rendering."
          packageName="@gateflow/ai"
          code={`import { StreamingIndicator } from '@gateflow/ai';

export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <StreamingIndicator status="reasoning" />
      <span className="text-sm text-muted-foreground italic">Thinking...</span>
    </div>
  );
}`}
        >
          <div className="flex flex-col gap-6 p-8 bg-[var(--ds-background-neutral-subtle)] rounded-3xl border border-[var(--ds-border-subtle)] border-dashed w-full max-w-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-10 w-10 bg-white border border-[var(--ds-border-subtle)] rounded-xl flex items-center justify-center">
                  <Sparkles size={18} className="text-[var(--ds-text-brand)]" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black uppercase tracking-tight text-[var(--ds-text)]">
                  Reasoning Engine
                </span>
                <div className="flex items-center gap-2">
                  <StreamingIndicator />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                    Processing tokens...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GalleryItem>

        <GalleryItem
          title="ToolCallCard"
          description="Interactive UI for agentic tool execution. Displays intent, parameters, and results of automated actions."
          packageName="@gateflow/ai"
          code={`import { ToolCallCard } from '@gateflow/ai';
import { Terminal, Database } from 'lucide-react';

export default function Demo() {
  return (
    <ToolCallCard
      tool="auditLogs"
      status="complete"
      icon={<Database />}
      params={{ region: 'ZE', limit: 10 }}
      result={{ status: 'success', anomalies: 0 }}
    />
  );
}`}
        >
          <div className="w-full max-w-md">
            <ToolCallCard
              name="auditLogs"
              status="success"
              icon={Database}
              arguments={JSON.stringify({ region: 'ZAYED_CITY', limit: 5 })}
              result="Returned 1242 entries. Risk score: 0.02"
            />
          </div>
        </GalleryItem>

        <GalleryItem
          title="ChatInputShell"
          description="The main entry point for user interaction. Optimized for accessibility, mobile gestures, and agent triggers."
          packageName="@gateflow/ai"
          code={`import { ChatInputShell } from '@gateflow/ai';
import { Send, Plus, Command } from 'lucide-react';

export default function Demo() {
  return (
    <ChatInputShell
      placeholder="Ask GateAI anything..."
      leftAction={<Button variant="ghost" size="icon"><Plus /></Button>}
      rightAction={<Button size="icon"><Send /></Button>}
      hint={<div className="flex gap-2"><Command size={10} /> + K to trigger tools</div>}
    />
  );
}`}
        >
          <div className="w-full max-w-xl flex flex-col gap-3">
            <ChatInputShell
              placeholder="Ask GateAI anything..."
              actions={[
                { id: 'tools', label: '⌘K Tools' },
                { id: 'guide', label: '⌘G Guide' },
              ]}
            />
          </div>
        </GalleryItem>
      </section>
    </div>
  );
}
