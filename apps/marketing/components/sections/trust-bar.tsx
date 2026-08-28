'use client';

import * as React from 'react';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';

/* ─── Brand community logos (12 logos = seamless loop at 50% track width) ── */
const PARTNERS = [
  {
    name: 'Palm Hills',
    abbr: 'PH',
    accent: 'var(--ds-background-information-bold)',
  },
  { name: 'Sodic', abbr: 'SD', accent: 'var(--ds-background-danger-bold)' },
  { name: 'Emaar', abbr: 'EM', accent: 'var(--ds-background-success-bold)' },
  {
    name: 'British School',
    abbr: 'BS',
    accent: 'var(--ds-background-warning-bold)',
  },
  {
    name: 'Mountain View',
    abbr: 'MV',
    accent: 'var(--ds-background-discovery-bold)',
  },
  {
    name: 'Hyde Park',
    abbr: 'HP',
    accent: 'var(--ds-background-information-bold)',
  },
  { name: 'Madinaty', abbr: 'MD', accent: 'var(--ds-background-warning-bold)' },
  {
    name: 'Al Ahly Sabbour',
    abbr: 'AS',
    accent: 'var(--ds-background-discovery-bold)',
  },
  { name: 'Katameya', abbr: 'KA', accent: 'var(--ds-background-danger-bold)' },
  {
    name: 'Zed Sheikh',
    abbr: 'ZS',
    accent: 'var(--ds-background-success-bold)',
  },
  {
    name: 'Six of October',
    abbr: 'SO',
    accent: 'var(--ds-background-discovery-bold)',
  },
  { name: 'iCity', abbr: 'IC', accent: 'var(--ds-background-warning-bold)' },
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

  return (
    <section
      className="relative z-30 border-y border-ds-border-bold/50 bg-ds-surface-sunken/50 py-10 md:py-14 overflow-hidden"
      aria-label="Trusted by leading communities"
    >
      {/* ── Section label ── */}
      <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-ds-text-subtlest mb-7">
        {t('trust.badge')}
      </p>

      {/* ── Scrolling track ── */}
      <div className="relative overflow-hidden group">
        {/* Fade masks — both sides with directional start/end gradients */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-28 z-10 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-ds-surface-sunken to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-28 z-10 ltr:bg-gradient-to-l rtl:bg-gradient-to-r from-ds-surface-sunken to-transparent" />

        <div
          className="flex items-center gap-x-16 md:gap-x-24 w-max pe-16 md:pe-24 animate-gf-marquee-slow-left pause-on-hover"
          style={{ willChange: 'transform' }}
        >
          {TRACK.map((p, i) => (
            <LogoChip key={`${p.abbr}-${i}`} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
