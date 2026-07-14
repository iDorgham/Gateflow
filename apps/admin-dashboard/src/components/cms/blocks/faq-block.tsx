import React from 'react';
import { token } from './types';
import { BlockProps } from './types';
import { ChevronDown } from 'lucide-react';

export function FaqBlock({
  block,
  locale = 'en',
  isSelected,
  onContentChange,
  isEditor = false,
}: BlockProps) {
  const content = block.content[locale] || block.content.en;
  const items = content.items || [
    { title: 'Question 1?', description: 'Answer to question 1.' },
    { title: 'Question 2?', description: 'Answer to question 2.' },
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
      <div className="max-w-3xl mx-auto">
        <h2
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('headline', e.currentTarget.textContent)
          }
          className="text-3xl font-bold mb-8 text-center outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
        >
          {content.headline || 'Frequently Asked Questions'}
        </h2>
        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-ds-border rounded-xl p-4 bg-ds-surface"
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleItemChange(i, 'title', e.currentTarget.textContent)
                  }
                  className="text-lg font-medium outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md w-full"
                >
                  {item.title}
                </h3>
                <ChevronDown className="h-5 w-5 text-ds-icon-subtle" />
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
