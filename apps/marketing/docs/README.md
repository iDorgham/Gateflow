# GateFlow Marketing Website

<div align="center">

**Public-facing storefront for GateFlow**

_Optimized for SEO, speed, and conversion_

</div>

---

## Primary Objective

To act as the primary acquisition channel for GateFlow. It provides high-level feature overviews, pricing transparency, and seamless onboarding flows (Waitlist / Direct Signup).

---

## Key Features

| Feature                            | Description                                  |
| :--------------------------------- | :------------------------------------------- |
| **High-Performance Landing Pages** | SSR pages for LPR, IoT, and software         |
| **Pricing & Tiers**                | Dynamic pricing tables linked to SaaS models |
| **Lead Capture**                   | Smooth CRM integration (HubSpot/Salesforce)  |
| **Public Documentation**           | FAQs and developer guides                    |

---

## Tech Stack

| Layer          | Technology                                 |
| :------------- | :----------------------------------------- |
| **Framework**  | Next.js 14 (App Router)                    |
| **Styling**    | Tailwind CSS + `@gate-access/ui`           |
| **Animations** | Framer Motion for scroll reveals           |
| **Components** | Radix UI / Shadcn UI                       |
| **SEO**        | Next.js Metadata API, sitemaps, robots.txt |

---

## Folder Structure

```
marketing/
├── app/
│   ├── pricing/        # Subscription tiers
│   ├── features/       # Hardware & software deep dive
│   ├── contact/        # Lead generation forms
│   ├── waitlist/       # Pre-launch capture
│   └── page.tsx        # Hero Landing
├── components/         # Marketing-specific UI
├── public/             # Marketing assets, OG images
├── tailwind.config.ts
└── next.config.mjs
```

---

## Getting Started

```bash
pnpm turbo dev --filter marketing
```

---

## Best Practices

| Practice             | Description                                          |
| :------------------- | :--------------------------------------------------- |
| **Aesthetics First** | Rely on `@gate-access/ui` tokens for brand alignment |
| **Bundle Size**      | Use Server Components for Core Web Vitals            |

### Metadata Title Policy

- Root layout (`app/[locale]/layout.tsx`) uses `title.template: '%s | GateFlow'`.
- Use `templatedMarketingTitle(...)` from `lib/metadata-title.ts` when a page should keep that branded suffix.
- Use `absoluteMarketingTitle(...)` from `lib/metadata-title.ts` when a page must bypass the suffix (for legal/error/auth/blog-exception pages).

---

## Related Documentation

| Document                                         | Description      |
| :----------------------------------------------- | :--------------- |
| [Design Tokens](../../docs/DESIGN_TOKENS.md)     | UI tokens        |
| [UI Design Guide](../../docs/UI_DESIGN_GUIDE.md) | Design system    |
| [SEO Guide](../../docs/guides/SEO_GUIDE.md)      | SEO optimization |
