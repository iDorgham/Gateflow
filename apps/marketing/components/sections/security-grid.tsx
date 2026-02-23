import { Shield, Lock, FileText, UserCheck, RefreshCw, BarChart3 } from 'lucide-react';
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
    <section id="security" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container px-6 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16 lg:mb-24">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">{t('securityGrid.subtitle')}</h2>
          <p className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
            {t('securityGrid.title')}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('securityGrid.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityItems.map((item, i) => (
            <div 
              key={item.title} 
              className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
