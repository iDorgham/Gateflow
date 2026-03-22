'use client';

/**
 * GateAI Operations Hub v2.0 — Phase 1: Foundation & Secure Shell
 *
 * 3-column responsive layout with Glassmorphism + Dot-grid aesthetic
 * Design tokens: Navy #020035 (--ga-navy) / Kimchi Orange #ED4B00 (--ga-orange)
 *
 * Security: layout only renders if session is confirmed; org scoping
 * validated by the parent server component (layout.tsx).
 */

import * as React from 'react';
import { cn } from '@gate-access/ui';
import { Menu, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { gaLayoutSpring } from './GateAITokens';

/* ─────────────── Design Tokens (scoped to GateAI Hub) ─────────────── */

const hubStyles = `
  :root {
    --ga-navy:          #18191a; /* Base gray */
    --ga-orange:        var(--primary, #F97316);
    --ga-navy-glass:    rgba(22, 26, 29, 0.4);
    --ga-navy-border:   var(--ds-border, #DFE1E6);
    --ga-dot-color:     transparent;
    --ga-dot-size:      28px;
    --ga-panel-bg:      var(--ds-background-default, #18191a);
    --ga-panel-border:  var(--ds-border, #DFE1E6);
    --ga-highlight:     var(--primary, #F97316);
    --ga-text-primary:  var(--ds-text, #FAFBFC);
    --ga-text-muted:    var(--ds-text-subtle, #A1A1AA);
    --ga-text-accent:   var(--primary, #F97316);
    --ga-scrollbar:     rgba(82, 82, 91, 0.2);
  }

  .ga-hub-root {
    background-color: transparent;
    min-height: 100%;
  }

  .ga-panel {
    background: var(--ga-panel-bg);
    border-inline-end: 1px solid var(--ga-panel-border);
  }

  .ga-panel-right {
    background: var(--ga-panel-bg);
    border-inline-start: 1px solid var(--ga-panel-border);
  }

  .ga-canvas {
    background: transparent;
  }

  /* Scrollbar styling */
  .ga-scroll::-webkit-scrollbar { width: 5px; }
  .ga-scroll::-webkit-scrollbar-track { background: transparent; }
  .ga-scroll::-webkit-scrollbar-thumb { background: var(--ga-scrollbar); border-radius: 9999px; }
`;

/* ─────────────── Sub-components ─────────────── */

interface LeftPanelProps {
  children?: React.ReactNode;
  isRtl?: boolean;
}

export function GateAILeftPanel({ children, isRtl: _isRtl }: LeftPanelProps) {
  return (
    <aside
      className={cn(
        'ga-panel ga-scroll flex flex-col shrink-0 w-64 h-full overflow-y-auto'
      )}
      aria-label="Assistant Tags & Navigation"
    >
      {children ?? (
        <div className="flex flex-col gap-3 p-4">
          {/* Empty state placeholder */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ga-text-muted)]">
            Tags & Filters
          </p>
          <div className="rounded-lg border border-[var(--ga-navy-border)] p-3 text-xs text-[var(--ga-text-muted)]">
            Tag workspace coming in Phase 2.
          </div>
        </div>
      )}
    </aside>
  );
}

interface RightPanelProps {
  children?: React.ReactNode;
  isRtl?: boolean;
}

export function GateAIRightPanel({ children, isRtl: _isRtl }: RightPanelProps) {
  return (
    <aside
      className={cn(
        'ga-panel-right ga-scroll flex flex-col shrink-0 w-72 h-full overflow-y-auto'
      )}
      aria-label="Assistant Context & Info"
    >
      {children ?? (
        <div className="flex flex-col gap-3 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ga-text-muted)]">
            AI Context
          </p>
          <div className="rounded-lg border border-[var(--ga-navy-border)] p-3 text-xs text-[var(--ga-text-muted)]">
            Live analytics blocks coming in Phase 3.
          </div>
        </div>
      )}
    </aside>
  );
}

interface CenterCanvasProps {
  children?: React.ReactNode;
}

export function GateAICenterCanvas({ children }: CenterCanvasProps) {
  return (
    <main
      className="ga-canvas ga-scroll flex flex-1 flex-col min-h-0 overflow-y-auto"
      aria-label="Assistant Operations Canvas"
    >
      {children}
    </main>
  );
}

/* ─────────────── Root Hub Layout ─────────────── */

interface GateAIHubLayoutProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  isRtl?: boolean;
  className?: string;
}

export function GateAIHubLayout({
  left,
  center,
  right,
  isRtl = false,
  className,
}: GateAIHubLayoutProps) {
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);
  const shouldReduceMotion = useReducedMotion();

  const springConfig = gaLayoutSpring;

  React.useEffect(() => {
    // Inject scoped CSS vars once
    const styleId = 'ga-hub-tokens';
    if (!document.getElementById(styleId)) {
      const el = document.createElement('style');
      el.id = styleId;
      el.textContent = hubStyles;
      document.head.appendChild(el);
    }
    return () => {
      // Cleanup on unmount
      document.getElementById(styleId)?.remove();
    };
  }, []);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={cn(
        'ga-hub-root flex h-[calc(100vh-180px)] overflow-hidden rounded-xl border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-default,#FFFFFF)]',
        className
      )}
    >
      {/* ── Toggle button: left panel (mobile) ── */}
      <button
        type="button"
        onClick={() => setLeftOpen((v) => !v)}
        className={cn(
          'absolute z-20 top-3',
          isRtl ? 'right-3' : 'left-3',
          'lg:hidden rounded-md p-1.5 text-[var(--ga-text-muted)] hover:text-[var(--ga-orange)] bg-[var(--ga-navy-glass)] border border-[var(--ga-navy-border)] transition-colors'
        )}
        aria-label={leftOpen ? 'Close tag panel' : 'Open tag panel'}
      >
        {leftOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* ── Left Panel (Tags & Nav) ── */}
      <motion.div
        initial={false}
        animate={{ 
          width: leftOpen ? 256 : 0,
          opacity: leftOpen ? 1 : 0
        }}
        transition={shouldReduceMotion ? { duration: 0 } : springConfig}
        className="shrink-0 lg:block overflow-hidden"
        aria-hidden={!leftOpen}
      >
        <GateAILeftPanel isRtl={isRtl}>{left}</GateAILeftPanel>
      </motion.div>

      {/* ── Center Canvas ── */}
      <GateAICenterCanvas>{center}</GateAICenterCanvas>

      {/* ── Right Panel (AI Context) ── */}
      <motion.div
        initial={false}
        animate={{ 
          width: rightOpen ? 288 : 0,
          opacity: rightOpen ? 1 : 0
        }}
        transition={shouldReduceMotion ? { duration: 0 } : springConfig}
        className="shrink-0 hidden lg:block overflow-hidden"
        aria-hidden={!rightOpen}
      >
        <GateAIRightPanel isRtl={isRtl}>{right}</GateAIRightPanel>
      </motion.div>

      {/* ── Toggle button: right panel (desktop) ── */}
      <button
        type="button"
        onClick={() => setRightOpen((v) => !v)}
        className={cn(
          'absolute z-20 top-3',
          isRtl ? 'left-3' : 'right-3',
          'hidden lg:flex items-center justify-center rounded-md p-1.5 text-[var(--ga-text-muted)] hover:text-[var(--ga-orange)] bg-[var(--ga-navy-glass)] border border-[var(--ga-navy-border)] transition-colors'
        )}
        aria-label={rightOpen ? 'Collapse context panel' : 'Expand context panel'}
      >
        {rightOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
    </div>
  );
}
