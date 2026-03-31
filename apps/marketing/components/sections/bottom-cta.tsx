import { Button } from '@gate-access/ui';
import { I18nLink } from '../i18n-link';
import type { Locale } from '../../i18n-config';
import { getTranslation } from '../../lib/i18n/get-translation';

export async function BottomCTA({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');
  const { t: tc } = await getTranslation(locale, 'common');
  return (
    <section className="bg-muted/30 py-24">
      <div className="container px-6 mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-6 text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
            {t('cta.headline')}
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            {t('cta.subHeadline')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <I18nLink
              locale={locale}
              href="/contact"
              className="w-full sm:w-auto"
            >
              <Button
                variant="brand"
                size="lg"
                className="h-11 px-8 rounded-sm text-sm font-semibold transition-all w-full sm:w-auto"
              >
                {tc('buttons.getStarted')}
              </Button>
            </I18nLink>
            <p className="text-sm font-medium text-muted-foreground">
              {t('cta.noCreditCard')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
