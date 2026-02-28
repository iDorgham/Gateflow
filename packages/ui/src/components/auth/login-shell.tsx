'use client';

import * as React from 'react';
import { ShieldCheck, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoginShellProps {
  /** 'client' uses ShieldCheck + primary color; 'admin' uses Shield + blue */
  variant?: 'client' | 'admin';
  /** Card content (the form) */
  children: React.ReactNode;
  /** Slot rendered in top-right corner (language + theme controls) */
  topRight?: React.ReactNode;
  /** Additional footer content (dev keys, support links) */
  footerExtra?: React.ReactNode;
  /**
   * Increment this integer whenever a new error occurs to trigger a shake.
   * Pass 0 or omit to disable shake.
   */
  errorKey?: number;
  /** True when transition to dashboard should start */
  isSuccess?: boolean;
  /** Icons to fade in during the transition */
  successIcons?: React.ReactNode;
}

export function LoginShell({
  variant = 'client',
  children,
  topRight,
  footerExtra,
  errorKey = 0,
  isSuccess = false,
  successIcons,
}: LoginShellProps) {
  const isAdmin = variant === 'admin';
  const [shaking, setShaking] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (errorKey > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 520);
      return () => clearTimeout(t);
    }
  }, [errorKey]);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-50 dark:bg-zinc-950 overflow-hidden flex items-stretch">
      {/* Simplified Background Layer */}
      <div className="absolute inset-0 z-0 bg-zinc-50 dark:bg-zinc-950 pointer-events-none" />

      {/* Foreground Layer: Sliding Auth Panel - Animates width on success */}
      <div 
        className={cn(
          "relative z-10 w-full flex flex-col justify-between pt-0 transition-all duration-700 ease-in-out transform-gpu",
          isAdmin ? "bg-white/80 dark:bg-zinc-950/80" : "bg-white/95 dark:bg-zinc-950/95", // Slightly more solid during transition
          "backdrop-blur-2xl border-r border-border/50 shadow-2xl p-6 md:p-12 lg:p-16 pt-0",
          isMounted && !isSuccess ? "w-full md:w-[480px] translate-x-0" : "",
          isMounted && isSuccess ? "w-[80px] md:w-20 translate-x-0 px-4 md:px-0" : "",
          !isMounted && "-translate-x-full"
        )}
      >
        {/* Top Controls - Logo and Text */}
        <div className={cn(
          "flex items-center transition-all duration-700 delay-300 transform-gpu mb-8 border-b border-border/50 h-20 shrink-0 -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16",
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className={cn(
            "flex items-center gap-4 transition-all duration-500",
            isSuccess && "w-full justify-center gap-0"
          )}>
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-transform hover:scale-105 duration-300',
                isAdmin ? 'bg-blue-600' : 'bg-primary'
              )}
            >
              {isAdmin ? <Shield className="h-6 w-6" /> : <ShieldCheck className="h-7 w-7" />}
            </div>
            <span className={cn(
              "text-2xl font-black tracking-tight text-foreground whitespace-nowrap overflow-hidden transition-all duration-500",
              isSuccess ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"
            )}>
              GateFlow
            </span>
          </div>
        </div>

        {/* Auth Content */}
        <div className="flex-1 flex flex-col justify-center py-12">
          {/* Main Form content - Fades out on success */}
          <div
            className={cn(
              'w-full max-w-sm mx-auto transition-all duration-700 delay-500 transform-gpu',
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              shaking && 'animate-[shake_0.5s_ease-in-out]',
              isSuccess && "opacity-0 -translate-y-12 pointer-events-none delay-[0ms]"
            )}
          >
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {isAdmin ? 'Admin Console' : 'Welcome Back'}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground font-medium">
                {isAdmin 
                  ? 'Access the secure command center' 
                  : 'Manage your access control from anywhere'}
              </p>
            </div>
            {children}
          </div>

          {/* Success Icons - Fades in up only when isSuccess is true */}
          {isSuccess && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
              <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                {successIcons}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fades in */}
        {footerExtra && (
          <div className={cn(
            "mt-auto pt-8 transition-all duration-700 delay-700 transform-gpu",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {footerExtra}
          </div>
        )}

      </div>

      {/* Outer elements - Positioned relative to viewport - Fades out on success */}
      <div className={cn(
        "fixed top-6 right-6 z-[110] transition-all duration-500",
        isMounted && !isSuccess ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {topRight}
      </div>

      <div className={cn(
        "fixed bottom-6 left-6 z-[110] transition-all duration-500 flex items-center gap-3 text-[11px] text-muted-foreground/50",
        isMounted && !isSuccess ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <span className="font-medium whitespace-nowrap">© {new Date().getFullYear()} GateFlow Inc.</span>
      </div>

      <div className={cn(
        "fixed bottom-6 right-6 z-[110] transition-all duration-500 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40",
        isMounted && !isSuccess ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <button className="hover:text-primary transition-colors">Support</button>
        <button className="hover:text-primary transition-colors">Contact Us</button>
        <div className="h-3 w-[1px] bg-border/40" />
        <button className="hover:text-primary transition-colors">Terms</button>
        <button className="hover:text-primary transition-colors">Privacy</button>
      </div>
    </div>
  );
}
