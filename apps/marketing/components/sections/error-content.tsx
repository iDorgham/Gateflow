import { getTranslation } from '../../lib/i18n/get-translation';
import { Button } from '@gate-access/ui';
import { I18nLink } from '../i18n-link';
import type { Locale } from '../../i18n-config';
import { AlertCircle, FileQuestion, Lock, ShieldAlert } from 'lucide-react';

export async function ErrorContent({ 
  locale, 
  code 
}: { 
  locale: Locale, 
  code: '404' | '500' | '401' | '403' | 'generic' 
}) {
  const { t } = await getTranslation(locale, 'errors');
  
  const iconMap = {
    '404': <FileQuestion className="w-24 h-24 mx-auto text-primary/40 mb-8" />,
    '500': <AlertCircle className="w-24 h-24 mx-auto text-destructive/40 mb-8" />,
    '401': <Lock className="w-24 h-24 mx-auto text-primary/40 mb-8" />,
    '403': <ShieldAlert className="w-24 h-24 mx-auto text-destructive/40 mb-8" />,
    'generic': <AlertCircle className="w-24 h-24 mx-auto text-primary/40 mb-8" />
  };

  const isHomeLink = code === '404' || code === 'generic';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {iconMap[code]}
      <h1 className="text-8xl font-black text-primary/5 mb-4">{t(`${code}.title`) || code}</h1>
      <h2 className="text-4xl font-bold mb-6">{t(`${code}.headline`)}</h2>
      <p className="text-xl text-muted-foreground max-w-lg mb-10">
        {t(`${code}.description`)}
      </p>
      <Button size="lg" className="rounded-xl h-14 px-8 font-bold" asChild>
        <I18nLink locale={locale} href={isHomeLink ? '/' : '/login'}>
          {t(`${code}.cta`)}
        </I18nLink>
      </Button>
    </div>
  );
}
