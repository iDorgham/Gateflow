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
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">
            {t('howItWorks.badge')}
          </h2>
          <p className="text-4xl lg:text-5xl font-black tracking-tight">
            {t('howItWorks.title')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-0.5 bg-gradient-to-r from-primary/50 to-primary/50 lg:left-[calc(50%+50px)] lg:right-[calc(-50%+50px)]" />
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-white mb-6">
                  {step.icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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
