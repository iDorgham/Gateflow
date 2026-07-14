import React from 'react';
import { token } from './types';
import { BlockProps } from './types';

export function FooterBlock({
  block,
  locale = 'en',
  isSelected,
  onContentChange,
  isEditor = false,
}: BlockProps) {
  const content = block.content[locale] || block.content.en;
  const { styles } = block;

  return (
    <footer
      style={{
        backgroundColor:
          styles.backgroundColor || token('ds.background.neutral'),
        paddingBlock: styles.paddingBlock || token('ds.space.400'),
        paddingInline: styles.paddingInline || token('ds.space.200'),
        marginBlock: styles.marginBlock || '0',
        textAlign: styles.textAlign || 'start',
        color: styles.textColor || token('ds.text'),
      }}
      className={`relative group border-t border-ds-border ${isSelected ? 'ring-2 ring-ds-border-selected' : ''}`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-ds-text-subtle">
              <li>About</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-ds-text-subtle">
              <li>Features</li>
              <li>Pricing</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-ds-text-subtle">
              <li>Help Center</li>
              <li>API Docs</li>
              <li>Status</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-ds-text-subtle">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-ds-border flex flex-col md:flex-row justify-between items-center text-sm text-ds-text-subtle gap-4">
          <p
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onContentChange?.('body', e.currentTarget.textContent)
            }
            className="outline-none focus:ring-2 focus:ring-ds-border-selected rounded-md px-2"
          >
            {content.body || '© 2026 GateFlow. All rights reserved.'}
          </p>
          <div className="flex gap-4">
            <span className="w-5 h-5 bg-ds-icon-subtle rounded-sm"></span>
            <span className="w-5 h-5 bg-ds-icon-subtle rounded-sm"></span>
            <span className="w-5 h-5 bg-ds-icon-subtle rounded-sm"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
