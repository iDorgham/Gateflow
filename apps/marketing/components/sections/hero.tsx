import { getTranslation } from '../../lib/i18n/get-translation';
import { HeroAnimatedContent } from './hero-animated-content';
import { I18nProvider } from '../../hooks/use-translation';
import type { Locale } from '../../i18n-config';

export async function Hero({ locale }: { locale: Locale }) {
  const { dict } = await getTranslation(locale, 'landing');
  
  return (
    <I18nProvider locale={locale} dictionaries={{ landing: dict }}>
      <HeroAnimatedContent locale={locale} />
    </I18nProvider>
  );
}
