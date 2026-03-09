'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  Check,
  CheckCircle,
  Server,
  Shield,
} from 'lucide-react';
import { cn } from '@gate-access/ui';
import type { Locale } from '@/lib/i18n-config';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  'ar-EG': 'AR',
};

const LOCALES = ['en', 'ar-EG'] as const;

export interface LoginPageLayout2026Props {
  children: React.ReactNode;
  locale: Locale;
  errorKey?: number;
}

// ─── Language & theme controls (top corner) ─────────────────────────────────

function LoginControls2026({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const switchLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  const isRtl = locale === 'ar-EG';

  return (
    <div
      className="flex items-center gap-1"
      style={{ minHeight: 44 }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setLangOpen((v) => !v)}
          className="inline-flex h-10 min-w-[4rem] items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] dark:focus-visible:ring-offset-[#0f172a]"
          style={{
            color: 'rgba(255,255,255,0.9)',
            borderColor: 'rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(0,0,0,0.15)',
          }}
          aria-label={`Current language: ${LOCALE_LABELS[locale] ?? locale}. Switch language`}
        >
          <Globe className="h-4 w-4" />
          <span>{LOCALE_LABELS[locale] ?? locale}</span>
        </button>
        {langOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              aria-hidden
              onClick={() => setLangOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                'absolute top-full z-20 mt-2 min-w-[120px] overflow-hidden rounded-xl border py-1 shadow-xl',
                isRtl ? 'start-0' : 'end-0'
              )}
              style={{
                borderColor: 'rgba(255,255,255,0.15)',
                backgroundColor: 'rgba(2, 14, 115, 0.95)',
              }}
            >
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => switchLocale(l)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
                  style={{ color: '#fff' }}
                >
                  {LOCALE_LABELS[l]}
                  {l === locale && (
                    <Check className="h-4 w-4 text-[#EB4A00]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          if (!mounted) return;
          document.documentElement.classList.add('transitioning');
          setTheme(theme === 'dark' ? 'light' : 'dark');
          setTimeout(
            () => document.documentElement.classList.remove('transitioning'),
            350
          );
        }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020E73] dark:focus-visible:ring-offset-[#0f172a]"
        style={{
          color: 'rgba(255,255,255,0.9)',
          borderColor: 'rgba(255,255,255,0.2)',
          backgroundColor: 'rgba(0,0,0,0.15)',
        }}
        aria-label={mounted ? `Toggle theme. Current: ${theme === 'dark' ? 'dark' : 'light'}` : 'Toggle theme'}
      >
        {mounted && theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

// ─── Abstract gate / nodes pattern (SVG) ────────────────────────────────────

function GatePattern({ className }: { className?: string }) {
  return (
    <svg
      className={cn('absolute inset-0 h-full w-full opacity-[0.08]', className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id="gate-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1.5" fill="#EB4A00" />
          <circle cx="0" cy="0" r="0.5" fill="#fff" />
        </pattern>
        <linearGradient id="gate-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EB4A00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EB4A00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gate-grid)" />
      <path
        d="M0 50 Q 25 25 50 50 T 100 50 T 150 50"
        fill="none"
        stroke="url(#gate-line)"
        strokeWidth="0.5"
      />
      <path
        d="M0 70 Q 50 30 100 70 T 200 70"
        fill="none"
        stroke="url(#gate-line)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// ─── Brand panel (Navy + orb + logo + tagline + trust badges) ───────────────

const springEntrance = { type: 'spring' as const, stiffness: 350, damping: 30 };
const reducedMotionTransition = { duration: 0.01 };

const brandPanelVariants = {
  hidden: (opts: { isRtl: boolean; reduce: boolean }) => ({
    opacity: 0,
    x: opts.reduce ? 0 : opts.isRtl ? 100 : -100,
  }),
  visible: (opts: { reduce: boolean }) => ({
    opacity: 1,
    x: 0,
    transition: opts.reduce ? reducedMotionTransition : springEntrance,
  }),
};

const taglineVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const trustBadgeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (opts: { i: number; reduce: boolean }) => ({
    opacity: 1,
    y: 0,
    transition: opts.reduce
      ? { duration: 0.01 }
      : { delay: 0.4 + opts.i * 0.1, duration: 0.4, type: 'spring', stiffness: 350, damping: 30 },
  }),
};

export function LoginPageLayout2026({
  children,
  locale,
  errorKey = 0,
}: LoginPageLayout2026Props) {
  const { t } = useTranslation('login');
  const isRtl = locale === 'ar-EG';
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen flex-col transition-colors duration-300 md:grid md:grid-cols-3"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ─── Brand panel (left in LTR, right in RTL) ───────────────────────── */}
      <motion.aside
        key="brand"
        custom={{ isRtl, reduce: !!reduceMotion }}
        variants={brandPanelVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'relative flex min-h-[40vh] flex-col justify-between overflow-hidden px-6 py-8 md:col-span-2 md:min-h-screen md:px-10 md:py-12',
          isRtl ? 'md:order-2' : 'md:order-1'
        )}
        style={{
          backgroundColor: '#020E73',
          color: '#fff',
        }}
      >
        {/* Subtle orange orb (animated mesh) */}
        <div
          className="login-orb absolute -top-1/2 -start-1/2 h-full w-full rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #EB4A00 0%, transparent 70%)',
          }}
        />
        <div
          className="login-orb login-orb-delay absolute bottom-0 end-0 h-2/3 w-2/3 rounded-full opacity-[0.07] blur-3xl"
          style={{
            background: 'radial-gradient(circle, #EB4A00 0%, transparent 70%)',
          }}
        />

        <GatePattern />

        {/* Top: controls */}
        <div
          className={cn(
            'relative z-10 flex justify-end',
            isRtl ? 'justify-start' : 'justify-end'
          )}
        >
          <LoginControls2026 locale={locale} />
        </div>

        {/* Center: logo + tagline */}
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <motion.div variants={taglineVariants} className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: 'rgba(235, 74, 0, 0.2)',
                border: '1px solid rgba(235, 74, 0, 0.4)',
              }}
            >
              <ShieldCheck className="h-8 w-8 text-[#EB4A00]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                GateFlow
              </h1>
              <motion.p
                variants={taglineVariants}
                className="mt-1 text-sm font-medium text-white/80 md:text-base"
              >
                {t('tagline', 'Zero-Trust Access Infrastructure')}
              </motion.p>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4 gap-y-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              { icon: Shield, label: t('trustBadgeSoc2', 'SOC2 Compliant') },
              { icon: Server, label: t('trustBadgeMena', 'MENA Hosted') },
              { icon: CheckCircle, label: t('trustBadgeUptime', '99.9% Uptime') },
            ].map(({ icon: Icon, label }, i) => (
              <motion.span
                key={label}
                custom={{ i, reduce: !!reduceMotion }}
                variants={trustBadgeVariants}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-transform hover:scale-105"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                <Icon className="h-6 w-6 text-[var(--color-accent)]" />
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Bottom: optional footer on brand side */}
        <div className="relative z-10 mt-4 text-xs text-white/50">
          © {new Date().getFullYear()} GateFlow. All rights reserved.
        </div>
      </motion.aside>

      {/* ─── Form panel (right in LTR, left in RTL) ─────────────────────────── */}
      <motion.section
        key="form-panel"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion
            ? reducedMotionTransition
            : { delay: 0.2, type: 'spring', stiffness: 350, damping: 30 }
        }
        className={cn(
          'relative flex min-h-[60vh] flex-col items-center justify-center overflow-auto px-6 py-8 md:col-span-1 md:min-h-screen md:px-12 md:py-8',
          isRtl ? 'md:order-1' : 'md:order-2',
          errorKey > 0 && 'animate-shake'
        )}
        style={{
          backgroundColor: 'var(--login-form-surface)',
          transition: 'background-color 0.3s ease',
        }}
        role="main"
      >
        {children}
      </motion.section>
    </div>
  );
}
