import React from 'react';
import { token } from './types';
import { BlockProps } from './types';
import { Button } from '@gateflow/ui';

export function CtaBlock({
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
        backgroundColor:
          styles.backgroundColor || token('ds.background.brand.bold'),
        paddingBlock: styles.paddingBlock || token('ds.space.600'),
        paddingInline: styles.paddingInline || token('ds.space.200'),
        marginBlock: styles.marginBlock || '0',
        textAlign: styles.textAlign || 'center',
        color: styles.textColor || token('ds.text.inverse'),
      }}
      className={`relative group ${isSelected ? 'ring-2 ring-ds-border-selected' : ''}`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <h2
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('headline', e.currentTarget.textContent)
          }
          className="text-3xl md:text-5xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2"
        >
          {headline || 'Ready to get started?'}
        </h2>
        <p
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('subheadline', e.currentTarget.textContent)
          }
          className="text-lg opacity-90 outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2"
        >
          {subheadline || 'Join thousands of users today.'}
        </p>
        <div className="mt-4">
          <Button
            size="lg"
            variant="secondary"
            className="bg-ds-surface text-ds-text font-bold hover:bg-ds-surface/90"
            onClick={(e) => {
              if (isEditor) e.preventDefault();
            }}
          >
            {ctaText || 'Sign Up Now'}
          </Button>
        </div>
      </div>
    </section>
  );
}
