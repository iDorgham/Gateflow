'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const SPRING_BALANCED = { type: 'spring' as const, stiffness: 160, damping: 24 };
const SIDEBAR_WIDTH = 96;
const STAGGER = 0.07;

/* ─── Design tokens (login 2026) ─────────────────────────────────────────── */
const T = {
  accent: '#EB4A00',
  base: '#020E73',
  surface: '#FFFFFF',
  border: 'rgba(2, 14, 115, 0.12)',
  focusGlow: 'rgba(235, 74, 0, 0.20)',
  cardShadow: '0 4px 24px rgba(2, 14, 115, 0.08)',
  meshOverlay: 'rgba(2, 14, 115, 0.045)',
} as const;

/* ─── Keyframes injected once ────────────────────────────────────────────── */
const KEYFRAME_STYLES = `
@keyframes login-logo-float {
  0%,100% { transform: translateY(0px); opacity: 1; }
  45%      { transform: translateY(-5px); opacity: 0.88; }
}
@keyframes login-entrance {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes login-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@media (prefers-reduced-motion: reduce) {
  .login-logo { animation: none !important; }
  .login-entrance { animation: none !important; }
  .login-shimmer-bar { animation: none !important; }
}
`;

export interface LoginShellProps {
  variant?: 'client' | 'admin';
  appName?: string;
  heading?: string;
  subtitle?: string;
  children: React.ReactNode;
  topRight?: React.ReactNode;
  footerExtra?: React.ReactNode;
  errorKey?: number;
  isSuccess?: boolean;
  successIcons?: React.ReactNode;
}

const DEFAULT_CLIENT_HEADING = 'Sign in';
const DEFAULT_CLIENT_SUBTITLE =
  'Manage gates, QR codes, and scans from anywhere. Zero-trust digital access.';
const DEFAULT_ADMIN_HEADING = 'Admin Portal';
const DEFAULT_ADMIN_SUBTITLE =
  'Secure access for platform operators. Use your organization access key.';

export function LoginShell({
  variant = 'client',
  appName,
  heading,
  subtitle,
  children,
  topRight,
  footerExtra,
  errorKey = 0,
  isSuccess = false,
  successIcons,
}: LoginShellProps) {
  const isAdmin = variant === 'admin';
  const displayName = appName ?? (isAdmin ? 'Admin' : 'GateFlow');
  const displayHeading = heading ?? (isAdmin ? DEFAULT_ADMIN_HEADING : DEFAULT_CLIENT_HEADING);
  const displaySubtitle = subtitle ?? (isAdmin ? DEFAULT_ADMIN_SUBTITLE : DEFAULT_CLIENT_SUBTITLE);
  const reduceMotion = useReducedMotion();
  const [shaking, setShaking] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');

  React.useEffect(() => {
    setMounted(true);
    setDir(
      typeof document !== 'undefined' &&
        document.documentElement.getAttribute('dir') === 'rtl'
        ? 'rtl'
        : 'ltr'
    );
  }, []);

  React.useEffect(() => {
    if (errorKey > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 520);
      return () => clearTimeout(t);
    }
  }, [errorKey]);

  const transition = reduceMotion ? { duration: 0.05 } : SPRING_BALANCED;

  return (
    <>
      {/* Inject keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAME_STYLES }} />

      <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#E6E6E6]">
        {/* Left panel: sign-in → collapsed sidebar */}
        <motion.aside
          layout
          layoutId="gate-signin-panel"
          className="relative z-10 flex shrink-0 flex-col border-r"
          style={{
            background: T.surface,
            borderColor: T.border,
            boxShadow: '2px 0 32px rgba(2,14,115,0.06)',
            minWidth: isSuccess ? SIDEBAR_WIDTH : undefined,
          }}
          initial={false}
          animate={{ width: isSuccess ? SIDEBAR_WIDTH : '50%' }}
          transition={transition}
        >
          {/* Geometric mesh overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden
            style={{
              backgroundImage: `
                linear-gradient(${T.meshOverlay} 1px, transparent 1px),
                linear-gradient(90deg, ${T.meshOverlay} 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Logo + app name */}
          <motion.div
            className="relative z-10 flex items-center justify-start gap-4 pt-6 pl-6"
            initial={false}
            animate={{
              opacity: isSuccess ? 0 : 1,
              x: isSuccess ? (dir === 'rtl' ? 80 : -80) : 0,
            }}
            transition={{ duration: reduceMotion ? 0.05 : 0.35 }}
            style={{ willChange: isSuccess ? 'transform, opacity' : undefined }}
          >
            {/* Logo mark with float animation */}
            <div
              className="login-logo flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${T.base} 0%, ${T.accent} 100%)`,
                animation: reduceMotion ? 'none' : 'login-logo-float 6s ease-in-out infinite',
              }}
            >
              {isAdmin ? <Shield className="h-6 w-6" /> : <ShieldCheck className="h-7 w-7" />}
            </div>
            <span
              className="text-2xl font-black tracking-tight whitespace-nowrap"
              style={{ color: T.base }}
            >
              {displayName}
            </span>
          </motion.div>

          {/* Form area */}
          <div className="relative z-10 flex flex-1 flex-col justify-center pe-[60px] pt-8">
            <div className="flex w-full justify-end">
              <div className="w-full max-w-[300px]">
                <AnimatePresence mode="wait">
                  {!isSuccess && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: reduceMotion ? 0.05 : 0.25 }}
                      className={cn(
                        'transition-transform duration-300',
                        shaking && 'animate-[shake_0.5s_ease-in-out]'
                      )}
                    >
                      {/* Heading */}
                      <div className="mb-6">
                        <h1
                          className="text-2xl font-black tracking-tight"
                          style={{ color: T.base }}
                        >
                          {displayHeading}
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: `${T.base}99` }}>
                          {displaySubtitle}
                        </p>
                      </div>

                      {/* Animated accent bar */}
                      <div
                        className="login-shimmer-bar mb-6 h-0.5 w-12 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${T.accent}, ${T.base}, ${T.accent})`,
                          backgroundSize: '200% 100%',
                          animation: reduceMotion
                            ? 'none'
                            : 'login-shimmer 3s linear infinite',
                        }}
                      />

                      {/* Glass card wrapper */}
                      <div
                        className="rounded-2xl p-5"
                        style={{
                          background: 'rgba(255,255,255,0.72)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          border: `1px solid ${T.border}`,
                          boxShadow: T.cardShadow,
                        }}
                      >
                        {children}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success icons */}
                <AnimatePresence>
                  {isSuccess && successIcons && (
                    <motion.div
                      key="success-icons"
                      className="flex flex-col items-center gap-6 pt-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: reduceMotion ? 0 : STAGGER,
                            delayChildren: reduceMotion ? 0 : 0.2,
                          },
                        },
                        hidden: {},
                      }}
                    >
                      {React.Children.map(successIcons, (child, i) => (
                        <motion.div
                          key={i}
                          variants={{
                            hidden: { opacity: 0, scale: 0.95, y: 8 },
                            visible: {
                              opacity: 1,
                              scale: 1,
                              y: 0,
                              transition: reduceMotion ? { duration: 0.05 } : {},
                            },
                          }}
                        >
                          {child}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {footerExtra && !isSuccess && (
            <div className="relative z-10 pb-6 ps-6 pe-6">{footerExtra}</div>
          )}
        </motion.aside>

        {/* Right panel: accent brand panel with subtle pattern */}
        <div className="relative flex-1 min-w-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0"
            style={{ background: T.accent }}
          />
          {/* Subtle navy mesh on the right panel */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(2,14,115,0.15) 0%, transparent 60%)`,
            }}
          />
          {/* Floating brand text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white">
            <p
              className="text-5xl font-black tracking-tighter leading-none mb-4 opacity-20 select-none"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
            >
              GateFlow
            </p>
          </div>
        </div>

        {/* Top-right controls */}
        <div
          className={cn(
            'fixed top-6 end-6 z-[110] transition-opacity duration-300',
            mounted && !isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {topRight}
        </div>

        {/* Footer copyright */}
        <div
          className={cn(
            'fixed bottom-6 start-6 z-[110] text-[11px] font-medium transition-opacity duration-300',
            mounted && !isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          style={{ color: `${T.base}60` }}
        >
          <span className="whitespace-nowrap">© {new Date().getFullYear()} GateFlow Inc.</span>
        </div>
      </div>
    </>
  );
}
