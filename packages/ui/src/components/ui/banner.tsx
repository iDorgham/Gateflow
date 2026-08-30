'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * GateFlow Banner (Institutional Flag/Announcement)
 * Full-width, prominent status messages with single CTA and dismissible trigger.
 */
const bannerVariants = cva(
  'relative flex w-full items-center justify-between gap-4 px-4 py-3 text-sm font-medium transition-all text-start',
  {
    variants: {
      tone: {
        primary: 'bg-[var(--ds-color-primary-subtle)] text-[var(--ds-text-brand)] border-b border-[var(--ds-color-primary)]/20',
        info: 'bg-blue-500/10 text-[var(--ds-color-info)] border-b border-blue-500/20',
        warning: 'bg-amber-500/10 text-[var(--ds-color-warning)] border-b border-amber-500/20',
        danger: 'bg-rose-500/10 text-[var(--ds-color-danger)] border-b border-rose-500/20',
        aiLab: 'bg-purple-500/10 text-[var(--ds-color-ai-lab)] border-b border-purple-500/20',
      },
    },
    defaultVariants: {
      tone: 'info',
    },
  }
);

const iconMap = {
  primary: Sparkles,
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  aiLab: Sparkles,
};

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title?: string;
  action?: React.ReactNode;
  isDismissible?: boolean;
  onDismiss?: () => void;
}

export function Banner({
  className,
  tone = 'info',
  title,
  action,
  isDismissible,
  onDismiss,
  children,
  ...props
}: BannerProps) {
  const IconComponent = iconMap[tone || 'info'];

  return (
    <div
      role="banner"
      className={cn(bannerVariants({ tone }), className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          {title && <span className="font-semibold me-2">{title}:</span>}
          <span>{children}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {action}
        {isDismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

Banner.displayName = 'Banner';
