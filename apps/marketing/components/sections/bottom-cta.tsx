import { Button } from '@gate-access/ui';
import { I18nLink } from '../i18n-link';
import type { Locale } from '../../i18n-config';
import { getTranslation } from '../../lib/i18n/get-translation';

export async function BottomCTA({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');
  const { t: tc } = await getTranslation(locale, 'common');
  return (
    <section className="py-24 bg-[#F4F5F7] dark:bg-[#091E42]">
      <div className="container px-6 mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-[#172B4D] dark:text-[#E3E9F0] mb-6">
            {t('cta.headline')}
          </h2>
          <p className="text-lg text-[#42526E] dark:text-[#97A0AF] mb-10">
            {t('cta.subHeadline')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="brand"
              size="lg"
              className="h-11 px-8 rounded-sm text-sm font-semibold transition-all w-full sm:w-auto"
              asChild
            >
              <I18nLink locale={locale} href="/contact">
                {tc('buttons.getStarted')}
              </I18nLink>
            </Button>
            <p className="text-sm text-[#42526E] dark:text-[#97A0AF] font-medium">
              {t('cta.noCreditCard')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
