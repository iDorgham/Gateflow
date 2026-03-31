import * as React from 'react';
import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { Check, Clock, Shield, QrCode } from 'lucide-react';

export async function StatsSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const stats = [
    {
      icon: <Clock className="w-8 h-8" />,
      value: '500ms',
      label: t('stats.scanTime'),
    },
    {
      icon: <Shield className="w-8 h-8" />,
      value: '100%',
      label: t('stats.offline'),
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      value: '1M+',
      label: t('stats.qrCodes'),
    },
    {
      icon: <Check className="w-8 h-8" />,
      value: '99.9%',
      label: t('stats.uptime'),
    },
  ];

  return (
    <section className="py-32 md:py-48 bg-ds-text-heading text-ds-text-inverse border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--ds-background-brand-bold),0.15),transparent)]" />
      <div className="container mx-auto px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left rtl:lg:text-right group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-ds-radius-medium bg-white/5 text-ds-text-brand mb-8 border border-white/10 group-hover:bg-ds-background-brand-bold group-hover:text-ds-text-inverse transition-all duration-300">
                {React.cloneElement(stat.icon as React.ReactElement, { size: 28 })}
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <div className="text-5xl lg:text-7xl font-black tracking-tighter text-ds-text-inverse">
                  {stat.value}
                </div>
                {i % 2 === 0 ? (
                  <div className="text-[10px] font-black bg-ds-background-success-bold text-white px-2 py-0.5 rounded-sm tracking-widest uppercase">
                    +12%
                  </div>
                ) : (
                  <div className="text-[10px] font-black bg-ds-background-brand-bold text-white px-2 py-0.5 rounded-sm tracking-widest uppercase">
                    STABLE
                  </div>
                )}
              </div>
              <div className="text-ds-text-subtle font-black uppercase text-[12px] tracking-[0.2em] mb-4">
                {stat.label}
              </div>
              <div className="w-full h-px bg-white/10 mb-4" />
              <div className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                {i === 0 ? 'Latency Peer-Verified' : i === 1 ? 'End-to-End Encrypted' : i === 2 ? 'Global Distribution' : 'Tier-4 Reliability'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
