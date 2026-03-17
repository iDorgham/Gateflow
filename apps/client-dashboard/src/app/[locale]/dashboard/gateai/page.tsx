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
import {
  GateAIHubLayout,
} from '@/components/dashboard/gateai/GateAIHubLayout';
import { TagSidebar } from '@/components/dashboard/gateai/TagSidebar';
import { CanvasEditor } from '@/components/dashboard/gateai/CanvasEditor';
import { AutomationList } from '@/components/dashboard/gateai/AutomationList';

/* ─────────────── Page ─────────────── */

export default function GateAIHubPage() {
  const { i18n } = useTranslation('dashboard');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ar-EG';

  return (
    <GateAIHubLayout
      isRtl={isRtl}
      left={<TagSidebar />}
      center={<CanvasEditor />}
      right={<AutomationList />}
    />
  );
}
