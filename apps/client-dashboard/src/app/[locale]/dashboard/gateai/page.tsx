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
import { TagSidebar } from '@/components/dashboard/gateai/TagSidebar';
import { CanvasEditor } from '@/components/dashboard/gateai/CanvasEditor';
import { AutomationList } from '@/components/dashboard/gateai/AutomationList';
import { Sparkles, Zap, BarChart3, Tag, BrainCircuit } from 'lucide-react';

/* --- CanvasEditor integrated in page return --- */

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
      left={<TagSidebar />}
      center={<CanvasEditor />}
      right={<AIContextPlaceholder />}
    />
  );
}
