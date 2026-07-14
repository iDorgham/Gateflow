import React from 'react';
import { token } from './types';
import { BlockProps } from './types';
import { Star } from 'lucide-react';

export function TestimonialsBlock({
  block,
  locale = 'en',
  isSelected,
  onContentChange,
  isEditor = false,
}: BlockProps) {
  const content = block.content[locale] || block.content.en;
  const items = content.items || [
    {
      title: 'Customer Name 1',
      description: 'This product is amazing. It changed everything.',
    },
    {
      title: 'Customer Name 2',
      description: 'Best service I have ever used. Highly recommend.',
    },
  ];
  const { styles } = block;

  const handleItemChange = (
    index: number,
    key: string,
    value: string | null
  ) => {
    if (!onContentChange) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onContentChange('items', newItems);
  };

  return (
    <section
      style={{
        backgroundColor:
          styles.backgroundColor || token('ds.background.neutral'),
        paddingBlock: styles.paddingBlock || token('ds.space.500'),
        paddingInline: styles.paddingInline || token('ds.space.200'),
        marginBlock: styles.marginBlock || '0',
        textAlign: styles.textAlign || 'start',
        color: styles.textColor || token('ds.text'),
      }}
      className={`relative group ${isSelected ? 'ring-2 ring-ds-border-selected' : ''}`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('headline', e.currentTarget.textContent)
          }
          className="text-3xl font-bold mb-10 text-center outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
        >
          {content.headline || 'What our customers say'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-ds-surface rounded-2xl p-8 shadow-sm">
              <div className="flex gap-1 text-ds-icon-warning mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleItemChange(
                    i,
                    'description',
                    e.currentTarget.textContent
                  )
                }
                className="text-lg mb-6 outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
              >
                &quot;{item.description}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center font-bold text-ds-text-subtle">
                  {item.title ? item.title.charAt(0) : 'U'}
                </div>
                <div>
                  <h4
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleItemChange(i, 'title', e.currentTarget.textContent)
                    }
                    className="font-bold outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
                  >
                    {item.title}
                  </h4>
                  <p className="text-sm text-ds-text-subtle">
                    Verified Customer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
