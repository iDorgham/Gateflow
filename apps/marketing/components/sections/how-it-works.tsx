import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { QrCode, ScanLine, FileCheck } from 'lucide-react';

export async function HowItWorksSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const steps = [
    {
      icon: <QrCode className="w-10 h-10" />,
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
    },
    {
      icon: <ScanLine className="w-10 h-10" />,
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
    },
    {
      icon: <FileCheck className="w-10 h-10" />,
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
    },
  ];

  return (
    <section className="py-32 md:py-48 bg-ds-surface-sunken border-y border-ds-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-ds-text-brand mb-6">
            {t('howItWorks.badge')}
          </h2>
          <p className="text-4xl lg:text-7xl font-black tracking-tight text-ds-text-heading leading-tight">
            {t('howItWorks.title')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 start-[calc(50%+40px)] end-[calc(-50%+40px)] h-0.5 bg-gradient-to-r from-primary/50 to-primary/50 lg:start-[calc(50%+50px)] lg:end-[calc(-50%+50px)] rtl:bg-gradient-to-l" />
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-ds-background-brand-bold text-ds-text-inverse mb-8 shadow-xl">
                  {step.icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-10 h-10 rounded-full bg-ds-text-heading text-ds-text-inverse font-black flex items-center justify-center border-4 border-ds-surface-sunken">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-black mb-4 text-ds-text-heading">{step.title}</h3>
                <p className="text-ds-text-subtle text-base leading-relaxed max-w-[280px] mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
