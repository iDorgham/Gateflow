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
    <section className="py-32 md:py-48 bg-ds-text-heading text-ds-text-inverse">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-ds-radius-large bg-ds-accent-bold/10 text-ds-text-brand mb-6 border border-ds-accent-bold/20">
                {stat.icon}
              </div>
              <div className="text-4xl lg:text-7xl font-black tracking-tighter mb-4 text-ds-text-inverse">
                {stat.value}
              </div>
              <div className="text-ds-text-subtle font-black uppercase text-[12px] tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
