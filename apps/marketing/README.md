<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Marketing</h1>

<p align="center">
  <strong>Public-Facing Marketing Website</strong><br>
  <em>Lead generation, pricing, features, and company information</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-90%25-green" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-blue" alt="Framework">
  <img src="https://img.shields.io/badge/i18n-English%20%2B%20Arabic-orange" alt="i18n">
</p>

---

## 📋 Overview

The **GateFlow Marketing** website is the public-facing presence of the GateFlow platform. It serves as the primary lead generation tool, showcasing features, pricing, and solutions to potential customers across the MENA region.

### Purpose

- 🎯 **Lead Generation** — Capture interested prospects
- 📢 **Product Showcase** — Display features and capabilities
- 💰 **Pricing Information** — Present tiered pricing plans
- 🏢 **Company Info** — About, contact, legal pages
- 📰 **Content Marketing** — Blog posts and case studies

---

## ✨ Features

### Pages

| Page | Description | Status |
|------|-------------|--------|
| **Home** | Hero, features overview, social proof | ✅ Complete |
| **Features** | Detailed feature breakdown | ✅ Complete |
| **Pricing** | Tiered pricing plans | ✅ Complete |
| **Solutions** | Industry-specific solutions | ✅ Complete |
| **Company** | About, careers, contact | ✅ Complete |
| **Blog** | Content marketing | 🔄 40% |
| **Legal** | Privacy, terms, cookies, security | ✅ Complete |
| **Help** | FAQ and support resources | ✅ Complete |

### Technical Features

- 🌐 **Multi-language** — English and Arabic (RTL)
- 📱 **Responsive Design** — Mobile-first approach
- 🔍 **SEO Optimized** — Meta tags, sitemap, robots.txt
- ⚡ **Performance** — Server-side rendering with Next.js
- 🎨 **Theming** — Dark/light mode support
- 📊 **Analytics** — Integration ready for tracking

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Icons** | HugeIcons, Lucide React |
| **i18n** | next-intl, i18next |
| **Fonts** | Cairo (Arabic), Inter (English) |

### Key Dependencies

```json
{
  "next": "^14.2.35",
  "react": "^18.3.1",
  "tailwindcss": "^3.4.19",
  "@gate-access/ui": "workspace:^",
  "@hugeicons/react": "^1.1.5",
  "lucide-react": "^0.344.0"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
# From monorepo root
pnpm install

# Start development
pnpm turbo dev --filter=marketing
```

### Development Server

```bash
# Navigate to app directory
cd apps/marketing

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Default Port

```
http://localhost:3000
```

---

## 📁 Project Structure

```
apps/marketing/
├── app/
│   ├── [locale]/              # Locale-based routing
│   │   ├── page.tsx          # Home page
│   │   ├── features/         # Features page
│   │   ├── pricing/          # Pricing page
│   │   ├── solutions/        # Industry solutions
│   │   ├── company/          # Company pages
│   │   ├── blog/             # Blog section
│   │   ├── legal/            # Legal pages
│   │   └── help/             # Help center
│   ├── api/                  # API routes
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── providers.tsx         # React providers
├── components/               # React components
│   ├── sections/             # Section components
│   ├── nav.tsx               # Navigation
│   ├── footer.tsx            # Footer
│   └── ...
├── locales/                  # Translation files
│   ├── en/                   # English
│   └── ar-EG/                # Arabic (Egypt)
├── lib/                     # Utilities
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind config
└── next.config.js           # Next.js config
```

---

## 🌍 Internationalization

### Supported Languages

| Code | Language | Direction |
|------|----------|----------|
| `en` | English | LTR |
| `ar-EG` | Arabic (Egypt) | RTL |

### Translation Files

Translations are organized in JSON files:

```
locales/
├── en/
│   ├── common.json
│   ├── navigation.json
│   ├── landing.json
│   ├── pricing.json
│   └── ...
└── ar-EG/
    ├── common.json
    ├── navigation.json
    ├── landing.json
    └── ...
```

---

## 🔗 Related Apps

| App | Description | Port |
|-----|-------------|------|
| [Client Dashboard](../client-dashboard) | Main SaaS portal | 3001 |
| [Admin Dashboard](../admin-dashboard) | Platform management | 3002 |
| [Scanner App](../scanner-app) | Gate scanning | 8081 |

---

## 📄 License

MIT License — see [../../LICENSE](../../LICENSE) for details.

---

<p align="center">
  <strong>Part of the GateFlow Ecosystem</strong><br>
  <a href="https://gateflow.io">Website</a> • <a href="https://github.com/iDorgham/Gate-Access">GitHub</a>
</p>
