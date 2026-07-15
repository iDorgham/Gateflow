import * as React from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'wide' | 'full';
}

/**
 * PageContainer
 * 
 * A standardized wrapper for dashboard pages that enforces 
 * consistent horizontal padding and maximum width constraints.
 */
export function PageContainer({
  children,
  variant = 'default',
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        variant === 'default' && "max-w-7xl",
        variant === 'wide' && "max-w-screen-2xl",
        variant === 'full' && "max-w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
