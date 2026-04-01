import * as React from 'react';
import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { Check, Clock, Shield, QrCode, type LucideProps } from 'lucide-react';

type StatItem = {
  icon: React.FC<LucideProps>;
  value: string;
  badge: string;
  badgeClass: string;
  label: string;
  sub: string;
};

export async function StatsSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const stats: StatItem[] = [
    {
      icon: Clock,
      value: '500ms',
      badge: '+12%',
      badgeClass: 'bg-emerald-500 text-white',
      label: t('stats.scanTime'),
      sub: 'Latency Peer-Verified',
    },
    {
      icon: Shield,
      value: '100%',
      badge: 'STABLE',
      badgeClass: 'bg-ds-background-brand-bold text-white',
      label: t('stats.offline'),
      sub: 'End-to-End Encrypted',
    },
    {
      icon: QrCode,
      value: '1M+',
      badge: '+12%',
      badgeClass: 'bg-emerald-500 text-white',
      label: t('stats.qrCodes'),
      sub: 'Global Distribution',
    },
    {
      icon: Check,
      value: '99.9%',
      badge: 'STABLE',
      badgeClass: 'bg-ds-background-brand-bold text-white',
      label: t('stats.uptime'),
      sub: 'Tier-4 Reliability',
    },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-ds-surface">
      <div className="absolute top-0 inset-x-0 h-px bg-ds-border" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-ds-border" />

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-ds-border">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group flex flex-col px-8 py-10 lg:py-0 first:ps-0 last:pe-0 relative"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-ds-surface-raised border border-ds-border text-ds-text-subtle group-hover:border-ds-border-bold group-hover:text-ds-text transition-all duration-300 shadow-sm">
                <stat.icon size={24} strokeWidth={1.5} />
              </div>

              {/* Value + badge */}
              <div className="flex items-end gap-3 mb-3">
                <span className="text-[56px] lg:text-[72px] font-black tracking-tighter leading-none text-ds-text-heading">
                  {stat.value}
                </span>
                <span
                  className={`mb-2 text-[10px] font-black px-2 py-1 rounded-md tracking-[0.15em] uppercase ${stat.badgeClass}`}
                >
                  {stat.badge}
                </span>
              </div>

              {/* Label */}
              <div className="text-[13px] font-bold text-ds-text uppercase tracking-[0.25em] mb-4">
                {stat.label}
              </div>

              {/* Divider */}
              <div className="w-8 h-px bg-ds-border mb-4 group-hover:w-16 group-hover:bg-ds-background-brand-bold transition-all duration-500" />

              {/* Sub-label */}
              <div className="text-[11px] font-semibold text-ds-text-subtle uppercase tracking-[0.2em]">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
