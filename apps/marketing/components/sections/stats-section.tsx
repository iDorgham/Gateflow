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
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl lg:text-5xl font-black tracking-tighter mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
