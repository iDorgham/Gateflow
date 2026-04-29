export type BlockType =
  | 'HERO'
  | 'FEATURES'
  | 'SOCIAL_PROOF'
  | 'CTA'
  | 'FAQ'
  | 'BLOG_GRID'
  | 'TESTIMONIALS'
  | 'PRICING'
  | 'FOOTER';

export interface BlockStyles {
  backgroundColor?: string;
  paddingBlock?: string;
  paddingInline?: string;
  marginBlock?: string;
  textAlign?: 'start' | 'center' | 'end';
  textColor?: string;
}

export interface BlockContent {
  headline?: string;
  subheadline?: string;
  body?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: Array<{ icon?: string; title: string; description?: string }>;
  [key: string]: any;
}

export interface Block {
  id: string;
  type: BlockType;
  content: {
    en: BlockContent;
    ar: BlockContent;
  };
  styles: BlockStyles;
}

export interface BlockProps {
  block: Block;
  locale?: 'en' | 'ar';
  isSelected?: boolean;
  onContentChange?: (key: string, value: any) => void;
  isEditor?: boolean;
}

export function token(path: string) {
  return `var(--${path.replace(/\./g, '-')})`;
}
