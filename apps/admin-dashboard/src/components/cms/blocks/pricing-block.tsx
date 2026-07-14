import React from 'react';
import { token } from './types';
import { BlockProps } from './types';
import { Button } from '@gateflow/ui';
import { Check } from 'lucide-react';

export function PricingBlock({
  block,
  locale = 'en',
  isSelected,
  onContentChange,
  isEditor = false,
}: BlockProps) {
  const content = block.content[locale] || block.content.en;
  const items = content.items || [
    { title: 'Starter', description: '$29/mo' },
    { title: 'Pro', description: '$99/mo' },
    { title: 'Enterprise', description: 'Custom' },
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
        paddingBlock: styles.paddingBlock || token('ds.space.500'),
        paddingInline: styles.paddingInline || token('ds.space.200'),
        marginBlock: styles.marginBlock || '0',
        textAlign: styles.textAlign || 'center',
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
          className="text-3xl font-bold mb-4 outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
        >
          {content.headline || 'Simple, transparent pricing'}
        </h2>
        <p
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('subheadline', e.currentTarget.textContent)
          }
          className="text-ds-text-subtle mb-10 outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
        >
          {content.subheadline || 'Choose the plan that best fits your needs.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 border ${i === 1 ? 'border-ds-border-brand bg-ds-background-brand-subtle' : 'border-ds-border bg-ds-surface'} flex flex-col items-center`}
            >
              <h3
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleItemChange(i, 'title', e.currentTarget.textContent)
                }
                className="text-xl font-bold mb-2 outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
              >
                {item.title}
              </h3>
              <div
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleItemChange(
                    i,
                    'description',
                    e.currentTarget.textContent
                  )
                }
                className="text-4xl font-black mb-6 outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
              >
                {item.description}
              </div>
              <ul className="text-sm space-y-3 mb-8 text-left w-full">
                {[
                  'Feature one included',
                  'Feature two included',
                  'Feature three included',
                ].map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-ds-icon-success" />
                    <span className="text-ds-text-subtle">{feat}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full mt-auto ${i === 1 ? 'bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90' : 'bg-ds-surface border border-ds-border hover:bg-ds-surface-subtle text-ds-text'}`}
                onClick={(e) => {
                  if (isEditor) e.preventDefault();
                }}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
