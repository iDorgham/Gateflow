# GateFlow Marketing Site

<div align="center">

![Banner](docs/gateflow_banner.png)

**Public-Facing Presence & Conversion Engine**

_Lead generation, pricing, features, and MENA-focused content_

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![i18n](https://img.shields.io/badge/i18n-EN_%2B_AR-orange?style=for-the-badge)](#)
[![SEO](https://img.shields.io/badge/SEO-Optimized-green?style=for-the-badge)](#)

</div>

---

## Overview

The **GateFlow Marketing Site** is the digital storefront for the platform. Engineered for high conversion, showcasing why GateFlow is the leading digital gate solution for the Middle East.

### Key Capabilities

| Capability               | Description                                                     |
| :----------------------- | :-------------------------------------------------------------- |
| **Bilingual Excellence** | Full English (LTR) and Arabic (RTL) support                     |
| **Vertical Solutions**   | Dedicated landing pages for Compounds, Schools, Events, Marinas |
| **Conversion Focused**   | Integrated lead capture via Resend and custom API endpoints     |
| **Content Engine**       | MDX-powered blog for industry insights                          |

---

## Features

### Conversion Funnel

| Page          | Capability                                 |
| :------------ | :----------------------------------------- |
| **Home**      | Hero section with high-impact social proof |
| **Solutions** | Tailored messaging for Real Estate, Events |
| **Pricing**   | Transparent tiered pricing models          |
| **Blog**      | MDX-driven content marketing               |

### Technical Specs

| Feature           | Description                                           |
| :---------------- | :---------------------------------------------------- |
| **SEO Ready**     | Dynamic OG images, JSON-LD schema, automated sitemaps |
| **Performance**   | Static Generation (SSG) for fast load times           |
| **Accessibility** | WCAG compliant with dark mode support                 |

---

## Tech Stack

| Layer          | Technology                                   |
| :------------- | :------------------------------------------- |
| **Framework**  | Next.js 14 (App Router)                      |
| **Styling**    | Tailwind CSS with custom branding tokens     |
| **Theming**    | next-themes with system-preference detection |
| **Typography** | Cairo (Arabic) + Inter (English)             |

---

## Getting Started

```bash
# Install dependencies (from root)
pnpm install

# Start Marketing Site
pnpm dev:marketing
```

**Local Port**: `http://localhost:3000`

---

## Architecture

```
src/
├── app/
│   ├── [locale]/          # Root locale routing
│   │   ├── page.tsx      # Home page
│   │   ├── solutions/    # Industry solutions
│   │   ├── pricing/      # Pricing tiers
│   │   └── blog/         # MDX blog
│   └── api/              # API routes
├── components/           # Marketing-specific components
└── content/              # MDX blog content
```

---

## Related Documentation

| Document                                            | Description                 |
| :-------------------------------------------------- | :-------------------------- |
| [Development Guide](../guides/DEVELOPMENT_GUIDE.md) | Local setup and conventions |
| [UI Design Guide](../guides/UI_DESIGN_GUIDE.md)     | RTL and design tokens       |
| [SEO Guide](../guides/SEO_GUIDE.md)                 | SEO optimization            |

---

<div align="center">

**Part of the GateFlow Production Ecosystem**

[Main README](../README.md) · [Documentation Index](../README.md) · [gateflow.site](https://gateflow.site)

</div>
