'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@gate-access/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function BottomCTA({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const { t: tc } = useTranslation('common');
  const isRtl = locale.startsWith('ar');

  return (
    <section className="bg-ds-surface py-32 md:py-64 border-t border-ds-border relative overflow-hidden">
      {/* Background visual momentum */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-40">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ds-border-brand to-transparent" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ds-background-brand-subtle blur-[120px] rounded-full" />
      </div>

      <div className="container px-8 mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-ds-background-brand-subtle rounded-full border border-ds-border-brand/20 text-ds-text-brand text-xs font-black uppercase tracking-[0.3em] shadow-sm">
              <ShieldCheck size={16} />
              <span>Ready for v.9.4 Upgrade</span>
            </div>
          </div>

          <h2 className="mb-10 text-5xl lg:text-9xl font-black tracking-tighter text-ds-text-heading leading-[0.95] max-w-4xl mx-auto">
            {t('cta.headline')}
          </h2>
          <p className="mb-16 text-xl md:text-3xl text-ds-text-subtle max-w-3xl mx-auto font-medium leading-relaxed">
            {t('cta.subHeadline')}
          </p>

          <div className="flex flex-col items-center justify-center gap-10">
            <IntentLink
              locale={locale}
              href="/contact"
              intent="consult"
              surface="home_bottom_cta"
              className="w-full sm:w-auto"
            >
              <Button
                variant="brand"
                size="lg"
                className="h-20 px-16 text-xl font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_rgba(var(--ds-background-brand-bold),0.4)] hover:-translate-y-1 transition-all group"
              >
                {tc('buttons.getStarted')}
                {isRtl ? (
                  <ArrowRight className="ml-2 mr-4 h-6 w-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="ml-4 mr-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </IntentLink>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-ds-text-subtlest border-t border-ds-border pt-8 w-fit">
              <span>{t('cta.noCreditCard')}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-ds-background-success-bold shadow-[0_0_8px_rgba(var(--ds-background-success-bold),0.6)]" />
              <span>Free Consultation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
