'use client';

/**
 * GateAI Operations Hub v2.0 — Main Page
 *
 * Renders the 3-column `GateAIHubLayout` shell with:
 * - Left: TagSidebar (Context & Selection)
 * - Center: CanvasEditor (Interactive Workspace)
 * - Right: AutomationList (Active scheduled tasks)
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GateAIHubLayout } from '@/components/dashboard/gateai/GateAIHubLayout';
import { TagSidebar } from '@/components/dashboard/gateai/TagSidebar';
import { CanvasEditor } from '@/components/dashboard/gateai/CanvasEditor';
import { AutomationList } from '@/components/dashboard/gateai/AutomationList';
import { PageHeader } from '@gateflow/components';

/* ─────────────── Page ─────────────── */

export default function GateAIHubPage() {
  const { t, i18n } = useTranslation('dashboard');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ar-EG';

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('ai.title', 'AI assistant')}
        subtitle={t(
          'ai.description',
          'Your intelligent operations agent. Ask anything or drag tags to analyze data.'
        )}
        breadcrumbs={[
          { label: 'Dashboard', href: `/${i18n.language}/dashboard` },
          { label: 'AI assistant' },
        ]}
      />

      <GateAIHubLayout
        isRtl={isRtl}
        left={<TagSidebar />}
        center={<CanvasEditor />}
        right={<AutomationList />}
      />
    </div>
  );
}
