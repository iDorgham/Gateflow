# SKILL: MENA SEO & International Localization

## Purpose
Optimize GateFlow v9.0 for the Arabic-speaking market, ensuring high visibility on Google Egypt, Gulf, and other regional search engines.

## Core Principles
1.  **Hreflang Mastery**: Explicitly tell search engines about the relationship between English and Arabic versions of pages.
2.  **Arabic Keyword Intelligence**: Target high-intent Arabic terms (e.g., "نظام التحكم في البوابات") rather than literal translations of English keywords.
3.  **Regional Signals**: Optimize metadata for local cities (Cairo, Dubai, Riyadh) where GateFlow operates.

## Implementation Rules
- **Localization**: Use `lang="ar"` on the `html` tag for Arabic pages.
- **Directionality**: Ensure `dir="rtl"` is properly handled in meta descriptions so they don't appear garbled.
- **Fonts**: Ensure Arabic fonts (`Cairo`, `Amiri`) load fast to prevent layout shifts (CLS).

## Anti-Patterns
- Using automated machine translation for meta descriptions (leads to poor CTR).
- Missing `hreflang` tags on multi-regional pages.
- Linking to English-only content from an Arabic SEO page without warning.

## Code Examples

### Hreflang Configuration (Next.js)
```typescript
export const metadata = {
  alternates: {
    languages: {
      'en-US': '/en',
      'ar-EG': '/ar',
    },
  },
};
```

### Arabic Keyword Usage in Metadata
```typescript
const meta = {
  title: "بوابة المرور | نظام التحكم الذكي للمجمعات السكنية", // Smart control system for residential complexes
  description: "أفضل حل تقني لإدارة البوابات والأمن في مصر والخليج باستخدام الذكاء الاصطناعي.",
};
```
