import React from 'react';
import { token } from './types';
import { BlockProps } from './types';
import { Button } from '@gateflow/ui';

export function HeroBlock({
  block,
  locale = 'en',
  isSelected,
  onContentChange,
  isEditor = false,
}: BlockProps) {
  const content = block.content[locale] || block.content.en;
  const { headline, subheadline, ctaText } = content;
  const { styles } = block;

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
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center justify-center">
        <h1
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('headline', e.currentTarget.textContent)
          }
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md px-2"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {headline || 'Hero Headline'}
        </h1>
        <p
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('subheadline', e.currentTarget.textContent)
          }
          className="text-lg md:text-xl text-ds-text-subtle max-w-2xl outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md px-2"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {subheadline || 'Subheadline goes here.'}
        </p>
        <div className="mt-4">
          <Button
            size="lg"
            className="bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
            onClick={(e) => {
              if (isEditor) e.preventDefault();
            }}
          >
            {ctaText || 'Get Started'}
          </Button>
        </div>
      </div>
    </section>
  );
}
