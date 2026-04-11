'use client';

import * as React from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';

/* ─── Brand community logos (12 logos = seamless loop at 50% track width) ── */
const PARTNERS = [
  { name: 'Palm Hills',      abbr: 'PH',  accent: 'var(--ds-background-information-bold)' },
  { name: 'Sodic',           abbr: 'SD',  accent: 'var(--ds-background-danger-bold)' },
  { name: 'Emaar',           abbr: 'EM',  accent: 'var(--ds-background-success-bold)' },
  { name: 'British School',  abbr: 'BS',  accent: 'var(--ds-background-warning-bold)' },
  { name: 'Mountain View',   abbr: 'MV',  accent: 'var(--ds-background-discovery-bold)' },
  { name: 'Hyde Park',       abbr: 'HP',  accent: 'var(--ds-background-information-bold)' },
  { name: 'Madinaty',        abbr: 'MD',  accent: 'var(--ds-background-warning-bold)' },
  { name: 'Al Ahly Sabbour', abbr: 'AS',  accent: 'var(--ds-background-discovery-bold)' },
  { name: 'Katameya',        abbr: 'KA',  accent: 'var(--ds-background-danger-bold)' },
  { name: 'Zed Sheikh',      abbr: 'ZS',  accent: 'var(--ds-background-success-bold)' },
  { name: 'Six of October',  abbr: 'SO',  accent: 'var(--ds-background-discovery-bold)' },
  { name: 'iCity',           abbr: 'IC',  accent: 'var(--ds-background-warning-bold)' },
];

/* Triplicate for seamless loop (we animate to -33.33%) */
const TRACK = [...PARTNERS, ...PARTNERS, ...PARTNERS];

function LogoChip({
  name,
  abbr,
  accent,
}: {
  name: string;
  abbr: string;
  accent: string;
}) {
  return (
    <div
      className="group flex shrink-0 items-center gap-4 cursor-pointer"
      style={{ '--partner-accent': accent } as React.CSSProperties}
    >
      {/* Monogram badge */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-[13px] font-black tracking-widest flex-shrink-0 transition-all duration-500 ease-out bg-ds-surface border border-ds-border text-ds-text-subtlest group-hover:bg-[var(--partner-accent)] group-hover:border-[var(--partner-accent)] group-hover:text-white group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_-4px_var(--partner-accent)]"
        aria-hidden
      >
        {abbr}
      </div>
      {/* Wordmark */}
      <span className="text-[18px] font-bold tracking-tight whitespace-nowrap text-ds-text-subtlest transition-all duration-500 ease-out group-hover:text-ds-text-heading group-hover:translate-x-1">
        {name}
      </span>
    </div>
  );
}

export function TrustBar({ locale: _locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const controls = useAnimationControls();

  const DURATION = 40; // seconds for one full loop

  const startScroll = React.useCallback(() => {
    controls.start({
      x: ['0%', '-33.3333%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: DURATION,
          ease: 'linear',
        },
      },
    });
  }, [controls]);

  /* Start on mount */
  React.useEffect(() => {
    startScroll();
  }, [startScroll]);

  const pause = () => controls.stop();
  const resume = () => startScroll();

  return (
    <section
      className="relative z-30 border-y border-ds-border-bold/50 bg-ds-surface-sunken/50 py-10 md:py-14 overflow-hidden"
      aria-label="Trusted by leading communities"
    >
      {/* ── Section label ── */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-ds-text-subtlest mb-7"
      >
        {t('trust.badge')}
      </motion.p>

      {/* ── Scrolling track ── */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
      >
        {/* Fade masks — both sides */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-28 z-10 bg-gradient-to-r from-ds-surface-sunken to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-28 z-10 bg-gradient-to-l from-ds-surface-sunken to-transparent" />

        <motion.div
          animate={controls}
          className="flex items-center gap-x-16 md:gap-x-24 w-max pr-16 md:pr-24"
          style={{ willChange: 'transform' }}
        >
          {TRACK.map((p, i) => (
            <LogoChip key={`${p.abbr}-${i}`} {...p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
