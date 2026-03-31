import {
  Shield,
  Lock,
  FileText,
  UserCheck,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';

export async function SecurityGrid({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const securityItems = [
    {
      icon: Shield,
      title: t('securityGrid.items.hmac.title'),
      desc: t('securityGrid.items.hmac.description'),
    },
    {
      icon: UserCheck,
      title: t('securityGrid.items.rbac.title'),
      desc: t('securityGrid.items.rbac.description'),
    },
    {
      icon: Lock,
      title: t('securityGrid.items.aes.title'),
      desc: t('securityGrid.items.aes.description'),
    },
    {
      icon: FileText,
      title: t('securityGrid.items.audit.title'),
      desc: t('securityGrid.items.audit.description'),
    },
    {
      icon: RefreshCw,
      title: t('securityGrid.items.jwt.title'),
      desc: t('securityGrid.items.jwt.description'),
    },
    {
      icon: BarChart3,
      title: t('securityGrid.items.monitoring.title'),
      desc: t('securityGrid.items.monitoring.description'),
    },
  ];

  return (
    <section
      id="security"
      className="py-32 lg:py-48 bg-ds-surface-sunken border-y border-ds-border relative overflow-hidden"
    >
      <div className="container px-8 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-24 lg:mb-32">
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-ds-text-brand mb-6">
            {t('securityGrid.subtitle')}
          </h2>
          <p className="text-4xl lg:text-7xl font-black tracking-tight mb-10 text-ds-text-heading leading-tight">
            {t('securityGrid.title')}
          </p>
          <p className="text-xl text-ds-text-subtle leading-relaxed max-w-2xl mx-auto">
            {t('securityGrid.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {securityItems.map((item, _i) => (
            <div
              key={item.title}
              className="group p-12 rounded-ds-radius-large border border-ds-border bg-ds-surface-raised hover:border-ds-border-brand transition-all duration-300 hover:shadow-2xl hover:shadow-ds-text-brand/5 hover:-translate-y-2 text-start"
            >
              <div className="h-16 w-16 bg-ds-background-brand-subtle rounded-ds-radius-medium flex items-center justify-center text-ds-text-brand mb-8 group-hover:bg-ds-background-brand-bold group-hover:text-ds-text-inverse transition-colors shadow-sm">
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-ds-text-heading">{item.title}</h3>
              <p className="text-ds-text-subtle text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
