import React from 'react';
import { token } from './types';
import { BlockProps } from './types';
import { Box } from 'lucide-react';

export function FeaturesBlock({
  block,
  locale = 'en',
  isSelected,
  onContentChange,
  isEditor = false,
}: BlockProps) {
  const content = block.content[locale] || block.content.en;
  const items = content.items || [
    { title: 'Feature 1', description: 'Description for feature 1' },
    { title: 'Feature 2', description: 'Description for feature 2' },
    { title: 'Feature 3', description: 'Description for feature 3' },
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
        backgroundColor: styles.backgroundColor || 'transparent',
        paddingBlock: styles.paddingBlock || token('ds.space.400'),
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
          {content.headline || 'Our Features'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-6 rounded-xl bg-ds-surface border border-ds-border"
            >
              <div className="h-12 w-12 rounded-lg bg-ds-background-brand-subtle flex items-center justify-center text-ds-text-brand">
                <Box className="h-6 w-6" />
              </div>
              <h3
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleItemChange(i, 'title', e.currentTarget.textContent)
                }
                className="text-xl font-semibold outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
              >
                {item.title}
              </h3>
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
                className="text-ds-text-subtle outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
