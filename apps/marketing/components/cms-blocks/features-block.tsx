import type { Locale } from '../../i18n-config';
import type { BlockContent } from './types';

const FALLBACKS = {
  en: {
    headline: 'Our Features',
    items: [
      { title: 'Feature 1', description: 'Description for feature 1' },
      { title: 'Feature 2', description: 'Description for feature 2' },
      { title: 'Feature 3', description: 'Description for feature 3' },
    ],
  },
  ar: {
    headline: 'مميزاتنا',
    items: [
      { title: 'ميزة 1', description: 'وصف الميزة 1' },
      { title: 'ميزة 2', description: 'وصف الميزة 2' },
      { title: 'ميزة 3', description: 'وصف الميزة 3' },
    ],
  },
} as const;

export function FeaturesCmsBlock({
  content,
  locale,
}: {
  content: BlockContent;
  locale: Locale;
}) {
  if (!content) return null;

  const isRtl = locale.startsWith('ar');
  const fallback = isRtl ? FALLBACKS.ar : FALLBACKS.en;
  const items = content.items?.length ? content.items : [...fallback.items];

  return (
    <section
      className="py-32 md:py-40 bg-ds-surface"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="container px-8 mx-auto max-w-6xl">
        <h2 className="text-3xl font-black tracking-tight mb-10 text-center text-ds-text-heading">
          {content.headline || fallback.headline}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={`${i}-${item.title}`}
              className="flex flex-col gap-3 p-6 rounded-xl bg-ds-surface-raised border border-ds-border"
            >
              <h3 className="text-xl font-bold text-ds-text-heading">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-ds-text-subtle">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
