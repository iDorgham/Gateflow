import { Button } from '@gateflow/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import type { BlockContent } from './types';

export function HeroCmsBlock({
  content,
  locale,
}: {
  content: BlockContent;
  locale: Locale;
}) {
  const isRtl = locale.startsWith('ar');

  return (
    <section
      className="relative py-32 md:py-40 bg-ds-surface text-center"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="container px-8 mx-auto max-w-4xl flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.94] text-ds-text-heading">
          {content.headline || 'Welcome to GateFlow'}
        </h1>
        {content.subheadline && (
          <p className="text-lg md:text-xl text-ds-text-subtle max-w-2xl leading-relaxed">
            {content.subheadline}
          </p>
        )}
        <div className="mt-4">
          <Button
            asChild
            variant="brand"
            size="lg"
            className="h-16 px-10 text-[14px] font-black uppercase tracking-[0.18em]"
          >
            <IntentLink
              locale={locale}
              href={content.ctaLink || '/contact'}
              intent="demo"
              surface="cms_hero"
            >
              {content.ctaText || 'Get Started'}
            </IntentLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
