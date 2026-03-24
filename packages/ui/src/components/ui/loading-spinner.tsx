import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: number | string;
  className?: string;
}

export function LoadingSpinner({
  size = 24,
  className,
  ...props
}: LoadingSpinnerProps) {
  // Cast to React.ElementType to avoid dual @types/react version mismatch
  const Comp = Loader2 as unknown as React.ElementType<
    React.SVGAttributes<SVGElement> & { size?: number | string }
  >;
  return (
    <Comp
      size={size}
      className={cn('animate-spin text-primary', className)}
      {...props}
    />
  );
}
