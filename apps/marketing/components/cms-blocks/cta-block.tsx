import { Button } from '@gateflow/ui';
import { IntentLink } from '../intent-link';
import { safeHref } from '../../lib/safe-href';
import type { Locale } from '../../i18n-config';
import type { BlockContent } from './types';

export function CtaCmsBlock({
  content,
  locale,
}: {
  content: BlockContent;
  locale: Locale;
}) {
  if (!content) return null;

  const isRtl = locale.startsWith('ar');
  const supporting = content.subheadline || content.body;

  return (
    <section
      className="relative py-32 md:py-40 bg-ds-background-brand-bold text-ds-text-inverse text-center"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="container px-8 mx-auto max-w-3xl flex flex-col items-center gap-6">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
          {content.headline || 'Ready to get started?'}
        </h2>
        {supporting && (
          <p className="text-lg md:text-xl opacity-90">{supporting}</p>
        )}
        <div className="mt-4">
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="h-16 px-10 text-[14px] font-black uppercase tracking-[0.18em] bg-ds-surface text-ds-text hover:bg-ds-surface/90"
          >
            <IntentLink
              locale={locale}
              href={safeHref(content.ctaLink, '/contact')}
              intent="consult"
              surface="cms_cta"
            >
              {content.ctaText || 'Sign Up Now'}
            </IntentLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
