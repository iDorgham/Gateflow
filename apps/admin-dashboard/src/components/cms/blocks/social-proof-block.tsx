import React from 'react';
import { token } from './types';
import { BlockProps } from './types';

export function SocialProofBlock({
  block,
  locale = 'en',
  isSelected,
  onContentChange,
  isEditor = false,
}: BlockProps) {
  const content = block.content[locale] || block.content.en;
  const { headline } = content;
  const { styles } = block;

  return (
    <section
      style={{
        backgroundColor: styles.backgroundColor || token('ds.surface.subtle'),
        paddingBlock: styles.paddingBlock || token('ds.space.300'),
        paddingInline: styles.paddingInline || token('ds.space.200'),
        marginBlock: styles.marginBlock || '0',
        textAlign: styles.textAlign || 'center',
        color: styles.textColor || token('ds.text'),
      }}
      className={`relative group ${isSelected ? 'ring-2 ring-ds-border-selected' : ''}`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <p
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange?.('headline', e.currentTarget.textContent)
          }
          className="text-sm font-semibold uppercase tracking-wider text-ds-text-subtle outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
        >
          {headline || 'Trusted by innovative companies'}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
          {/* Mock logos */}
          <div className="h-8 w-24 bg-ds-icon-subtle rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-ds-icon-subtle rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-ds-icon-subtle rounded animate-pulse"></div>
          <div className="h-8 w-28 bg-ds-icon-subtle rounded animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
