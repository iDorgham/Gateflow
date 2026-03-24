# SKILL: Technical SEO & Discoverability

## Purpose
Ensure all GateFlow v9.0 public-facing pages (Landing, Help Center, Blog) are perfectly optimized for search engines to drive organic traffic and conversions.

## Core Principles
1.  **Structure Over Content**: Semantic HTML (H1-H6, `<article>`, `<nav>`) is the foundation of high ranking.
2.  **Performance as SEO**: Core Web Vitals (LCP, FID, CLS) must stay in the "Green" zone to satisfy search algorithms.
3.  **Schema Markup**: Use JSON-LD to provide search engines with structured data about the product and property domain.

## Implementation Rules
- **Metadata**: Every page must have a unique `title` (max 60 chars) and `description` (max 160 chars).
- **Images**: Use `alt` text for every image; use `next/image` for automatic resizing.
- **URLs**: Clean, descriptive slugs (e.g., `/manual/qr-security` instead of `/p?id=445`).

## Anti-Patterns
- Using multiple H1 tags on a single page.
- Stuffing keywords into hidden elements.
- Ignoring "NoIndex" tags on private dashboard pages (security/SEO conflict).

## Code Examples

### JSON-LD Product Schema
```json
{
  "@context": "https://schema.org/",
  "@type": "SoftwareApplication",
  "name": "GateFlow Command",
  "operatingSystem": "iOS, Android, Web",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Next.js Metadata Config
```typescript
export const metadata: Metadata = {
  title: "GateFlow | Secure Operations Command Center",
  description: "Next-gen AI operations hub for gated communities in Egypt and the Gulf.",
  openGraph: {
    images: ['/og-image.png'],
  }
};
```
