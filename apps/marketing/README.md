# GateFlow Marketing Website

The `marketing` application is the public-facing storefront for GateFlow. It is optimized for SEO, speed, and conversion, designed to explain the value proposition to potential B2B clients and capture leads.

## 🎯 Primary Objective
To act as the primary acquisition channel for GateFlow. It provides high-level feature overviews, pricing transparently, and seamless onboarding flows (Waitlist / Direct Signup).

## ✨ Key Features
- **High-Performance Landing Pages**: Server-side rendered pages detailing LPR, IoT hardware integrations, and software capabilities.
- **Pricing & Tiers**: Dynamic pricing tables linked directly to our target SaaS models.
- **Lead Capture**: Smooth integration with CRM (HubSpot/Salesforce) or internal database for sales outreach.
- **Public Documentation Links**: FAQs and high-level structural guides for developers assessing the platform.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + `@gate-access/ui` shared tokens
- **Animations**: Framer Motion (for high-fidelity scroll reveals and hero animations)
- **Components**: Radix UI primitives / Shadcn UI
- **SEO Elements**: Next.js Metadata API, dynamic sitemaps, and robots.txt generation.

## 📁 Folder Structure
```text
marketing/
├── app/
│   ├── pricing/        # Subscription tiers
│   ├── features/       # Deep dive into hardware & software
│   ├── contact/        # Lead generation forms
│   ├── waitlist/       # Pre-launch capture
│   └── page.tsx        # Hero Landing
├── components/         # Marketing-specific UI (Carousels, CTAs)
├── public/             # Marketing assets, OG images, SVGs
├── tailwind.config.ts  # Extended from packages/config
└── next.config.mjs
```

## 🚀 Getting Started

### Local Development
Run from the root workspace:
```bash
pnpm turbo dev --filter marketing
```

### Best Practices for this Workspace
- **Aesthetics First**: This app dictates the brand's first impression. Rely heavily on the `@gate-access/ui` tokens to maintain strict brand alignment.
- **Bundle Size**: Avoid heavy client-side libraries. Utilize Server Components as much as possible to ensure perfect Core Web Vitals.

## 🔗 Related Documentation
- [Design Tokens](../../docs/DESIGN_TOKENS.md)
