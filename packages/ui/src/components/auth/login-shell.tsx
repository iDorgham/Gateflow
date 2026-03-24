'use client';

import * as React from 'react';
import { ShieldCheck, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

/* ─── Design tokens (Atlassian inspired) ─────────────────────────────────── */
const T = {
  primary: 'hsl(var(--primary))',
  neutral: 'hsl(var(--foreground))',
  surface: 'hsl(var(--background))',
  border: 'hsl(var(--border))',
  muted: 'hsl(var(--muted-foreground))',
  cardShadow:
    '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
} as const;

/* ─── Keyframes injected once ────────────────────────────────────────────── */
const KEYFRAME_STYLES = `
@keyframes login-logo-float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-4px); }
}
@keyframes login-entrance {
  from { opacity: 0; transform: translateY(10px); }
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
  transform: scale(0.8);
  opacity: 0.8;
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
  'Securely manage your gated infrastructure with Atlassian-grade precision.';
const DEFAULT_ADMIN_HEADING = 'Platform Administration';
const DEFAULT_ADMIN_SUBTITLE =
  'Super-admin panel for global GateFlow operations.';

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

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--ds-surface-sunken,#F4F5F7)] transition-colors duration-300">
        {/* Main Content Area: Centered layout for Atlassian feel */}
        <main className="relative z-10 flex w-full max-w-[480px] flex-col px-6">
          <div
            className={cn(
              'flex flex-col rounded-sm bg-[var(--ds-surface-raised,#FFFFFF)] p-8 shadow-xl transition-all duration-300',
              shaking && 'animate-login-shake'
            )}
            style={{
              boxShadow: T.cardShadow,
              border: `1px solid ${T.border}`,
            }}
          >
            {/* Branding Header */}
            <div className="mb-10 flex flex-col items-center text-center">
              <div
                className={cn(
                  'login-logo mb-6 flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-lg transition-all duration-300',
                  isSuccess && 'login-logo-success'
                )}
              >
                {isAdmin ? (
                  <Shield className="h-7 w-7" />
                ) : (
                  <ShieldCheck className="h-8 w-8" />
                )}
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[var(--ds-text)]">
                {displayHeading}
              </h1>
              <p className="mt-2 text-sm text-[var(--ds-text-subtle)]">
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
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <p className="mt-4 font-medium text-[#172B4D] dark:text-[#E3E9F0]">
                    Authenticated Successfully
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-8 text-center text-[12px] text-[var(--ds-text-subtlest)]">
            © {new Date().getFullYear()} {displayName} • Secure Infrastructure
            Access
          </div>
        </main>

        {/* Top-right controls (Theme/Locales) */}
        <div
          className={cn(
            'fixed top-6 end-6 z-[110] transition-opacity duration-300',
            mounted && !isSuccess
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          )}
        >
          {topRight}
        </div>
      </div>
    </>
  );
}
