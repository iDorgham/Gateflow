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
}

export function LoginShell({
  variant = 'client',
  children,
  topRight,
  footerExtra,
  errorKey = 0,
}: LoginShellProps) {
  const isAdmin = variant === 'admin';
  const [shaking, setShaking] = React.useState(false);

  React.useEffect(() => {
    if (errorKey > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 520);
      return () => clearTimeout(t);
    }
  }, [errorKey]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4">
      {/* Decorative blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className={cn(
            'absolute top-[20%] w-[500px] h-[500px] rounded-full blur-[100px]',
            'ltr:right-[10%] rtl:left-[10%]',
            isAdmin
              ? 'bg-blue-500/5 dark:bg-blue-500/10'
              : 'bg-primary/5 dark:bg-primary/10'
          )}
        />
        <div
          className={cn(
            'absolute bottom-[20%] w-[500px] h-[500px] rounded-full blur-[100px]',
            'ltr:left-[10%] rtl:right-[10%]',
            isAdmin
              ? 'bg-indigo-500/5 dark:bg-indigo-500/10'
              : 'bg-blue-500/5 dark:bg-blue-500/10'
          )}
        />
      </div>

      {/* Top-right (top-left in RTL) controls */}
      {topRight && (
        <div className="absolute top-4 ltr:right-4 rtl:left-4 flex items-center gap-1 z-20">
          {topRight}
        </div>
      )}

      {/* Main content */}
      <div className="w-full max-w-sm relative z-10">
        {/* Logo + branding */}
        <div className="text-center mb-10 space-y-3">
          <div
            className={cn(
              'mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-2xl ring-4 ring-background transition-transform hover:scale-105 duration-300',
              isAdmin
                ? 'bg-[#2563eb] shadow-blue-500/40'
                : 'bg-primary shadow-primary/40'
            )}
          >
            {isAdmin ? (
              <Shield className="h-9 w-9" />
            ) : (
              <ShieldCheck className="h-9 w-9" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              GateFlow{' '}
              <span
                className={cn(
                  'font-medium opacity-90',
                  isAdmin ? 'text-[#2563eb]' : 'text-primary'
                )}
              >
                {isAdmin ? 'Admin' : 'Client'}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-[0.3em] opacity-60">
              {isAdmin ? 'Security Control Center' : 'Access & Security Management'}
            </p>
          </div>
        </div>

        {/* Card wrapper — shakes on error */}
        <div
          className={cn(
            'transition-transform',
            shaking && 'animate-[shake_0.5s_ease-in-out]'
          )}
        >
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto">
            Authorized personnel only. Sessions are encrypted and audited.
          </p>
          {footerExtra}
          <p className="text-[10px] text-muted-foreground/20 font-medium">
            © {new Date().getFullYear()} GateFlow Ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
