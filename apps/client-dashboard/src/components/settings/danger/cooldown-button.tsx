'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import { Timer } from 'lucide-react';

interface CooldownButtonProps {
  label: string;
  cooldownSeconds?: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'destructive' | 'outline';
}

/**
 * A button that requires a cooldown period before becoming active.
 * On first render it shows a countdown. Only after the timer completes
 * does the actual action become clickable — preventing accidental triggers.
 */
export function CooldownButton({
  label,
  cooldownSeconds = 30,
  onClick,
  disabled,
  className,
  variant = 'destructive',
}: CooldownButtonProps) {
  const [remaining, setRemaining] = useState(cooldownSeconds);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      setReady(true);
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const handleClick = useCallback(() => {
    if (!ready || disabled) return;
    // Reset cooldown after click so accidental double-clicks are also protected
    setReady(false);
    setRemaining(cooldownSeconds);
    onClick();
  }, [ready, disabled, cooldownSeconds, onClick]);

  return (
    <Button
      variant={ready ? variant : 'outline'}
      onClick={handleClick}
      disabled={!ready || disabled}
      aria-disabled={!ready || disabled}
      aria-label={ready ? label : `${label} — available in ${remaining}s`}
      className={cn(
        'gap-2 min-w-[180px] transition-all duration-300',
        !ready && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {ready ? (
        label
      ) : (
        <>
          <Timer className="h-4 w-4 animate-pulse" aria-hidden="true" />
          Available in {remaining}s
        </>
      )}
    </Button>
  );
}
