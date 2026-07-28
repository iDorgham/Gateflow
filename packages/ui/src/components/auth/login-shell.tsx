'use client';

import * as React from 'react';
import { ShieldCheck, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

/* ─── Keyframes injected once ────────────────────────────────────────────── */
const KEYFRAME_STYLES = `
@keyframes login-logo-float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-4px); }
}
@keyframes login-entrance {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes login-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
.animate-login-shake {
  animation: login-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
.login-logo-success {
  transform: scale(0.85);
  opacity: 0.85;
  transition: all 0.3s ease;
}
@media (prefers-reduced-motion: reduce) {
  .login-logo { animation: none !important; transition: none !important; }
  .login-entrance { animation: none !important; }
}
`;

export interface LoginShellProps {
  variant?: 'client' | 'admin';
  appName?: string;
  heading?: string;
  subtitle?: string;
  children: React.ReactNode;
  topRight?: React.ReactNode;
  errorKey?: number;
  isSuccess?: boolean;
}

const DEFAULT_CLIENT_HEADING = 'Sign in to continue';
const DEFAULT_CLIENT_SUBTITLE =
  'Manage gates, QR codes, and scans from anywhere.';
const DEFAULT_ADMIN_HEADING = 'Platform Administration';
const DEFAULT_ADMIN_SUBTITLE =
  'Super-admin panel for global GateFlow operations.';

/**
 * LoginShell - Clean Modern Auth Container
 */
export function LoginShell({
  variant = 'client',
  appName,
  heading,
  subtitle,
  children,
  topRight,
  errorKey = 0,
  isSuccess = false,
}: LoginShellProps) {
  const isAdmin = variant === 'admin';
  const displayName = appName ?? (isAdmin ? 'Admin' : 'GateFlow');
  const displayHeading =
    heading ?? (isAdmin ? DEFAULT_ADMIN_HEADING : DEFAULT_CLIENT_HEADING);
  const displaySubtitle =
    subtitle ?? (isAdmin ? DEFAULT_ADMIN_SUBTITLE : DEFAULT_CLIENT_SUBTITLE);
  const [shaking, setShaking] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (errorKey > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 520);
      return () => clearTimeout(t);
    }
  }, [errorKey]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAME_STYLES }} />

      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-background transition-colors duration-300 p-4 sm:p-6 overflow-y-auto">
        {/* Top Header Navigation */}
        <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              {displayName}
            </span>
          </div>

          <div
            className={cn(
              'transition-opacity duration-300',
              mounted && !isSuccess
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            )}
          >
            {topRight}
          </div>
        </header>

        {/* Center Form Container */}
        <main className="relative z-10 flex w-full max-w-[400px] flex-col my-auto py-6">
          <div
            className={cn(
              'flex flex-col rounded-2xl bg-card border border-border/80 shadow-xl dark:shadow-2xl dark:border-border p-7 sm:p-9 transition-all duration-300',
              shaking && 'animate-login-shake'
            )}
          >
            {/* Branding Header */}
            <div className="mb-6 flex flex-col items-center text-center">
              <div
                className={cn(
                  'login-logo mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm transition-all duration-300',
                  isSuccess && 'login-logo-success'
                )}
              >
                {isAdmin ? (
                  <Shield className="h-6 w-6" />
                ) : (
                  <ShieldCheck className="h-6 w-6" />
                )}
              </div>

              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {displayHeading}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {displaySubtitle}
              </p>
            </div>

            {/* Content Slot / Form */}
            <div className="relative">
              {!isSuccess ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {children}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Authenticated Successfully
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer Copyright */}
        <footer className="relative z-10 py-3 text-center text-xs text-muted-foreground/60 font-medium">
          © {new Date().getFullYear()} {displayName} • Secure Infrastructure
          Access
        </footer>
      </div>
    </>
  );
}

LoginShell.displayName = 'LoginShell';
