import type { Locale } from '../../i18n-config';
import type { BlockContent } from './types';

export function FeaturesCmsBlock({
  content,
  locale,
}: {
  content: BlockContent;
  locale: Locale;
}) {
  const isRtl = locale.startsWith('ar');
  const items = content.items?.length
    ? content.items
    : [
        { title: 'Feature 1', description: 'Description for feature 1' },
        { title: 'Feature 2', description: 'Description for feature 2' },
        { title: 'Feature 3', description: 'Description for feature 3' },
      ];

  return (
    <section
      className="py-32 md:py-40 bg-ds-surface"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="container px-8 mx-auto max-w-6xl">
        <h2 className="text-3xl font-black tracking-tight mb-10 text-center text-ds-text-heading">
          {content.headline || 'Our Features'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
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
