import type { Locale } from '../../i18n-config';
import type { BlockContent } from './types';

export function SocialProofCmsBlock({
  content,
  locale,
}: {
  content: BlockContent;
  locale: Locale;
}) {
  const isRtl = locale.startsWith('ar');
  const items = content.items?.length ? content.items : null;

  return (
    <section
      className="py-12 border-y border-ds-border bg-ds-surface-sunken"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-6 flex flex-col gap-8 items-center">
        <p className="text-center text-sm font-semibold text-ds-text-subtle uppercase tracking-[0.2em]">
          {content.headline || 'Trusted by innovative companies'}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
          {items
            ? items.map((item, i) => (
                <div
                  key={`${i}-${item.title}`}
                  className="h-10 w-28 rounded-lg bg-ds-surface-raised border border-ds-border flex items-center justify-center text-xs font-semibold text-ds-text-subtle"
                >
                  {item.title}
                </div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-28 rounded-lg bg-ds-surface-raised border border-ds-border"
                />
              ))}
        </div>
      </div>
    </section>
  );
}
