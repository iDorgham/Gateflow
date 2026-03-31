import { Button } from '@gate-access/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import { getTranslation } from '../../lib/i18n/get-translation';

export async function BottomCTA({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');
  const { t: tc } = await getTranslation(locale, 'common');
  return (
    <section className="bg-ds-surface-sunken py-32 md:py-48 border-t border-ds-border">
      <div className="container px-8 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-8 text-4xl font-black tracking-tight text-ds-text-heading lg:text-7xl leading-tight">
            {t('cta.headline')}
          </h2>
          <p className="mb-12 text-xl md:text-2xl text-ds-text-subtle max-w-2xl mx-auto">
            {t('cta.subHeadline')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
                className="h-14 px-12 rounded-ds-radius-medium text-lg font-black transition-all w-full sm:w-auto shadow-2xl"
              >
                {tc('buttons.getStarted')}
              </Button>
            </IntentLink>
            <p className="text-sm font-black uppercase tracking-widest text-ds-text-subtle">
              {t('cta.noCreditCard')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
