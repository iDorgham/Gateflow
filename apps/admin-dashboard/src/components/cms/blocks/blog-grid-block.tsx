import React from 'react';
import { token } from './types';
import { BlockProps } from './types';
import { Card, CardContent } from '@gateflow/ui';
import { ArrowRight } from 'lucide-react';

export function BlogGridBlock({
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
        <div className="flex items-end justify-between mb-8">
          <h2
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onContentChange?.('headline', e.currentTarget.textContent)
            }
            className="text-3xl font-bold outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md"
          >
            {headline || 'Latest News'}
          </h2>
          <div className="text-ds-text-brand font-medium flex items-center gap-1 cursor-pointer">
            View All <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-ds-border">
              <div className="h-48 bg-ds-background-neutral flex items-center justify-center">
                <span className="text-ds-icon-subtle">Image {i}</span>
              </div>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-ds-text-brand mb-2">
                  Category
                </p>
                <h3 className="text-lg font-bold mb-2">
                  Sample Blog Post Title {i}
                </h3>
                <p className="text-sm text-ds-text-subtle line-clamp-2">
                  This is a short excerpt from the blog post to give users an
                  idea of what it is about.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
