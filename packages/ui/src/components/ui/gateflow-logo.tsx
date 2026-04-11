'use client';

import * as React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GateFlowLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  showText?: boolean;
  iconOnly?: boolean;
  className?: string;
}

/**
 * Institutional GateFlow Logo — The authoritative brand identity.
 * Synchronized across Marketing, Admin, and Design System apps.
 */
export function GateFlowLogo({
  size = 26,
  showText = true,
  iconOnly = false,
  className,
  ...props
}: GateFlowLogoProps) {
  return (
    <div
      className={cn('flex items-center gap-3 group/logo select-none', className)}
      {...props}
    >
      <div className="text-ds-text-brand transition-transform duration-300 group-hover/logo:scale-110 shrink-0">
        <Shield
          size={size}
          strokeWidth={2.4}
          fill="currentColor"
          fillOpacity={0.15}
        />
      </div>
      
      {showText && !iconOnly && (
        <span 
          className="font-black tracking-tighter text-ds-text-heading leading-none"
          style={{ fontSize: Math.max(16, size * 0.8) }}
        >
          Gate<span className="text-ds-text-brand transition-colors">Flow</span>
        </span>
      )}
    </div>
  );
}
