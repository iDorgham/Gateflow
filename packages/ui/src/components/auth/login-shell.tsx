'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SquaresBackground } from './squares-background';

const SPRING_BALANCED = { type: 'spring' as const, stiffness: 160, damping: 24 };
const SIDEBAR_WIDTH = 96; // ~80–100px
const STAGGER = 0.07;

export interface LoginShellProps {
  /** 'client' uses ShieldCheck; 'admin' uses Shield */
  variant?: 'client' | 'admin';
  /** Name displayed beside logo (e.g. "GateFlow", "Admin") */
  appName?: string;
  /** Main heading above the form */
  heading?: string;
  /** Subtitle below the heading */
  subtitle?: string;
  /** Form content */
  children: React.ReactNode;
  /** Top-right slot (language + theme) */
  topRight?: React.ReactNode;
  footerExtra?: React.ReactNode;
  /** Increment to trigger error shake */
  errorKey?: number;
  /** True when post-login collapse should run */
  isSuccess?: boolean;
  /** Icons shown in collapsed sidebar after success */
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
  const displayHeading =
    heading ?? (isAdmin ? DEFAULT_ADMIN_HEADING : DEFAULT_CLIENT_HEADING);
  const displaySubtitle =
    subtitle ?? (isAdmin ? DEFAULT_ADMIN_SUBTITLE : DEFAULT_CLIENT_SUBTITLE);
  const reduceMotion = useReducedMotion();
  const [shaking, setShaking] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');

  React.useEffect(() => {
    setMounted(true);
    setDir((typeof document !== 'undefined' && document.documentElement.getAttribute('dir') === 'rtl') ? 'rtl' : 'ltr');
  }, []);
  React.useEffect(() => {
    if (errorKey > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 520);
      return () => clearTimeout(t);
    }
  }, [errorKey]);

  const transition = reduceMotion
    ? { duration: 0.05 }
    : SPRING_BALANCED;

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-background">
      {/* Left panel: sign-in → collapsed sidebar */}
      <motion.aside
        layout
        layoutId="gate-signin-panel"
        className={cn(
          'relative z-10 flex shrink-0 flex-col bg-background',
          'border-r border-border/50'
        )}
        initial={false}
        animate={{
          width: isSuccess ? SIDEBAR_WIDTH : '50%',
        }}
        transition={transition}
        style={{ minWidth: isSuccess ? SIDEBAR_WIDTH : undefined }}
      >
        {/* Logo + app name — slide out and fade on success */}
        <motion.div
          className="flex items-center justify-start gap-4 pt-6 pl-6 text-left"
          initial={false}
          animate={{
            opacity: isSuccess ? 0 : 1,
            x: isSuccess ? (dir === 'rtl' ? 80 : -80) : 0,
          }}
          transition={{ duration: reduceMotion ? 0.05 : 0.35 }}
          style={{ willChange: isSuccess ? 'transform, opacity' : undefined }}
        >
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-lg',
              'bg-primary'
            )}
          >
            {isAdmin ? <Shield className="h-6 w-6" /> : <ShieldCheck className="h-7 w-7" />}
          </div>
          <span className="text-2xl font-black tracking-tight text-muted-foreground whitespace-nowrap">
            {displayName}
          </span>
        </motion.div>

        {/* Form area: right-aligned, 300px */}
        <div className="flex flex-1 flex-col justify-center pe-[60px] pt-8">
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
                    <div className="mb-8">
                      <h1 className="text-2xl font-black tracking-tight text-primary">
                        {displayHeading}
                      </h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {displaySubtitle}
                      </p>
                    </div>
                    {children}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success: sidebar icons with stagger */}
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
          <div className="pb-6 ps-6 pe-6">{footerExtra}</div>
        )}
      </motion.aside>

      {/* Right panel: accent layer + animated grid, fades out to reveal bg-background */}
      <div className="relative flex-1 min-w-0 bg-background overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: isSuccess ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0.05 : 0.4, delay: isSuccess ? 0.25 : 0 }}
          style={{ willChange: isSuccess ? 'opacity' : undefined }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[hsl(var(--login-accent,19_100%_46%))]" />
          <SquaresBackground
            speed={0.5}
            squareSize={40}
            direction="diagonal"
            reducedMotion={!!reduceMotion}
            borderColor="rgba(2, 0, 53, 0.35)"
            hoverFillColor="rgba(2, 0, 53, 0.45)"
            vignetteColor="rgba(2, 0, 53, 0.15)"
          />
        </motion.div>
      </div>

      {/* Top-right: language + theme (overlay) */}
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
          'fixed bottom-6 start-6 z-[110] text-[11px] text-muted-foreground/50 font-medium transition-opacity duration-300',
          mounted && !isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <span className="whitespace-nowrap">© {new Date().getFullYear()} GateFlow Inc.</span>
      </div>
    </div>
  );
}
