import React from 'react';
import { Button } from '@gateflow/ui';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface BreakpointControlsProps {
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  onChange: (bp: 'desktop' | 'tablet' | 'mobile') => void;
}

export function BreakpointControls({
  breakpoint,
  onChange,
}: BreakpointControlsProps) {
  return (
    <div className="flex gap-1 bg-ds-surface-subtle border border-ds-border rounded-lg p-1">
      <Button
        variant={breakpoint === 'desktop' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChange('desktop')}
        className={`h-8 px-2 ${breakpoint === 'desktop' ? 'bg-ds-surface shadow-sm' : ''}`}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={breakpoint === 'tablet' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChange('tablet')}
        className={`h-8 px-2 ${breakpoint === 'tablet' ? 'bg-ds-surface shadow-sm' : ''}`}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant={breakpoint === 'mobile' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChange('mobile')}
        className={`h-8 px-2 ${breakpoint === 'mobile' ? 'bg-ds-surface shadow-sm' : ''}`}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </div>
  );
}
