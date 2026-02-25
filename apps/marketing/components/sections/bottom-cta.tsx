import { Button, Input } from '@gate-access/ui';
import { I18nLink } from '../i18n-link';
import type { Locale } from '../../i18n-config';
import { getTranslation } from '../../lib/i18n/get-translation';

export async function BottomCTA({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');
  const { t: tc } = await getTranslation(locale, 'common');
  return (
    <section className="py-24">
      <div className="container px-6 mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-accent dark:bg-accent/50 p-10 lg:p-20 text-accent-foreground border-4 border-muted/50">
          <div className="absolute top-0 right-0 p-12 text-[10rem] font-black leading-none tracking-tighter opacity-10 pointer-events-none select-none">
            GATE <br /> FLOW
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">{tc('buttons.getStarted')}</p>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-8">
                {t('cta.headline')}
              </h2>
              <p className="text-muted-foreground text-lg mb-0 max-w-sm">
                {t('cta.noCreditCard')}
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur p-1.5 rounded-2xl border flex flex-col sm:flex-row gap-2">
               <input 
                type="email" 
                placeholder={t('cta.emailPlaceholder')}
                className="flex-1 bg-transparent px-6 py-4 outline-none font-medium placeholder:text-muted-foreground text-foreground"
               />
                <Button size="lg" className="h-12 sm:h-auto rounded-xl px-8 font-bold transition-colors shrink-0" asChild>
                   <I18nLink locale={locale} href="/contact">
                     {tc('buttons.getStarted')}
                   </I18nLink>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
