'use client';

/**
 * GateAI Operations Hub v2.0 — Main Page (Phase 1)
 *
 * Renders the 3-column `GateAIHubLayout` shell with placeholder content
 * for the Left (Tags), Center (Canvas), and Right (AI Context) panels.
 *
 * Phase 2 will replace left panel with `TagSidebar`.
 * Phase 3 will replace center with `CanvasEditor`.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GateAIHubLayout,
} from '@/components/dashboard/gateai/GateAIHubLayout';
import { Sparkles, Zap, BarChart3, Tag, BrainCircuit } from 'lucide-react';

/* ─────────────── Center canvas placeholder ─────────────── */

function CanvasPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      {/* Glowing hub icon */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{ background: 'radial-gradient(circle, #ED4B00 0%, transparent 70%)' }}
        />
        <BrainCircuit
          size={72}
          className="relative z-10"
          style={{ color: '#ED4B00' }}
        />
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--ga-text-primary, #F2F3F4)' }}
        >
          GateAI Operations Hub
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--ga-text-muted, rgba(242,243,244,0.55))' }}
        >
          Your intelligent operations workbench is being built.
          The Infinite Canvas will land in Phase 3.
        </p>
      </div>

      {/* Feature roadmap pills */}
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {[
          { icon: Tag, label: 'Intelligent Tags', phase: 'Phase 2' },
          { icon: BarChart3, label: 'Live Canvas', phase: 'Phase 3' },
          { icon: Zap, label: 'Automation Hub', phase: 'Phase 4' },
          { icon: Sparkles, label: 'Motion & RTL', phase: 'Phase 5' },
        ].map(({ icon: Icon, label, phase }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
            style={{
              backgroundColor: 'rgba(2, 0, 53, 0.6)',
              borderColor: 'rgba(237, 75, 0, 0.2)',
              color: 'rgba(242, 243, 244, 0.7)',
            }}
          >
            <Icon size={11} />
            <span>{label}</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ background: 'rgba(237, 75, 0, 0.15)', color: '#ED4B00' }}
            >
              {phase}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Left panel placeholder ─────────────── */

function TagSidebarPlaceholder() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Tag
          size={14}
          style={{ color: '#ED4B00' }}
        />
        <span
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--ga-text-muted, rgba(242,243,244,0.55))' }}
        >
          Tags
        </span>
      </div>
      {/* Skeleton tag rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-7 rounded-md animate-pulse"
          style={{
            background: `rgba(237, 75, 0, ${0.04 + i * 0.01})`,
            width: `${70 + i * 5}%`,
          }}
        />
      ))}
      <p
        className="mt-2 text-[11px] leading-relaxed"
        style={{ color: 'var(--ga-text-muted, rgba(242,243,244,0.55))' }}
      >
        Tag workspace arrives in Phase 2.
      </p>
    </div>
  );
}

/* ─────────────── Right panel placeholder ─────────────── */

function AIContextPlaceholder() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Sparkles
          size={14}
          style={{ color: '#ED4B00' }}
        />
        <span
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--ga-text-muted, rgba(242,243,244,0.55))' }}
        >
          AI Context
        </span>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-lg border animate-pulse"
          style={{
            background: 'rgba(2, 0, 53, 0.4)',
            borderColor: 'rgba(237, 75, 0, 0.1)',
          }}
        />
      ))}
      <p
        className="mt-2 text-[11px] leading-relaxed"
        style={{ color: 'var(--ga-text-muted, rgba(242,243,244,0.55))' }}
      >
        Live analytics blocks arrive in Phase 3.
      </p>
    </div>
  );
}

/* ─────────────── Page ─────────────── */

export default function GateAIHubPage() {
  const { i18n } = useTranslation('dashboard');
  const isRtl = i18n.language === 'ar';

  return (
    <GateAIHubLayout
      isRtl={isRtl}
      left={<TagSidebarPlaceholder />}
      center={<CanvasPlaceholder />}
      right={<AIContextPlaceholder />}
    />
  );
}
