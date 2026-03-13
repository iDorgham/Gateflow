<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Resident Portal</h1>

<p align="center">
  <strong>Self-Service Guest Management for Residents</strong><br>
  <em>Web-based portal for unit owners to manage visitor access</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-95%25-green" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Type-Web%20Portal-blue" alt="Type">
</p>

---

## 📋 Overview

The **GateFlow Resident Portal** is a web-based self-service portal for residents and unit owners to manage visitor access to their properties. It provides a mobile-optimized experience for creating visitor passes, tracking usage, and managing access rules.

### Purpose

- 🏠 **Unit Management** — Link and manage residential units
- 🔲 **Visitor Passes** — Create and share visitor QR codes
- 📊 **Quota Tracking** — Monitor visitor allocation usage
- ⏰ **Access Rules** — Set time-based access windows
- 📜 **History** — View past visitor records
- 🔔 **Notifications** — Configure alert preferences

---

## ✨ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Unit Linking** | Connect unit to resident account | ✅ Complete |
| **Visitor QR Creation** | Generate single-use passes | ✅ Complete |
| **Quota Tracking** | Monitor monthly allocation | ✅ Complete |
| **Open QR** | Permanent unit-linked codes | ✅ Complete |
| **Visitor History** | View past visits | ✅ Complete |
| **Access Time Controls** | Set time restrictions | ✅ Complete |
| **Mobile Optimization** | Responsive web design | ✅ Complete |
| **Profile Management** | Update resident info | ✅ Complete |
| **Notification Settings** | Alert preferences | ✅ Complete |

### QR Code Types

| Type | Description | Use Case |
|------|-------------|----------|
| **One-Time** | Single use, specific date | One-time guests |
| **Date Range** | Multiple uses within range | Weekend visitors |
| **Recurring** | Specific days + time | Weekly helpers |
| **Open QR** | Permanent, unit-linked | Family/friends |

### Quota by Unit Type

| Unit Type | Monthly Quota | Open QR |
|-----------|--------------|---------|
| Studio | 3 | ❌ |
| 1 Bedroom | 5 | ❌ |
| 2 Bedroom | 10 | ✅ |
| 3 Bedroom | 15 | ✅ |
| 4 Bedroom | 20 | ✅ |
| Penthouse | 25 | ✅ |
| Villa | 30 | ✅ |

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL via Prisma |
| **Auth** | JWT (jose) |
| **QR Generation** | qrcode, react-qr-code |
| **State** | React hooks |

### Key Dependencies

```json
{
  "next": "^14.2.35",
  "@gate-access/db": "^0.1.0",
  "@gate-access/ui": "workspace:^",
  "@gate-access/types": "^0.1.0",
  "jose": "4.15.9",
  "qrcode": "^1.5.4",
  "react-qr-code": "^2.0.18"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+

### Installation

```bash
# From monorepo root
pnpm install

# Generate prisma client
cd packages/db
npx prisma generate

# Start development
pnpm turbo dev --filter=resident-portal
```

### Development Server

```bash
# Navigate to app directory
cd apps/resident-portal

# Run development server
pnpm dev

# Build for production
pnpm build

# Type-check
pnpm typecheck
```

### Default Port

```
http://localhost:3004
```

---

## 📁 Project Structure

```
apps/resident-portal/
├── app/
│   ├── api/                   # API routes
│   │   └── resident/         # Resident endpoints
│   ├── (dashboard)/         # Protected routes
│   │   ├── visitors/        # Visitor QR management
│   │   ├── history/         # Visit history
│   │   ├── quota/           # Quota tracking
│   │   └── settings/        # Profile & notifications
│   ├── login/               # Login page
│   ├── layout.tsx           # Portal layout
│   └── page.tsx             # Home page
├── components/               # React components
│   ├── visitor-form.tsx    # QR creation form
│   ├── qr-display.tsx      # QR code display
│   ├── quota-card.tsx      # Usage card
│   └── ...
├── lib/                     # Utilities
│   ├── auth.ts             # JWT utilities
│   └── utils.ts            # Helper functions
└── package.json
```

---

## 🔐 Authentication

### JWT Token Flow

1. **Login** → Access token (15 min) + Refresh token
2. **Token Expiry** → Automatic refresh
3. **Logout** → Token revocation

### Access Level

```
RESIDENT — Self-service access only
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resident/me` | GET | Get resident profile |
| `/api/resident/visitors` | GET/POST | List/Create visitor QR |
| `/api/resident/visitors/:id` | DELETE | Revoke visitor QR |
| `/api/resident/history` | GET | Visit history |
| `/api/resident/quota` | GET | Quota status |

---

## 🔗 Related Apps

| App | Description | Port |
|-----|-------------|------|
| [Client Dashboard](../client-dashboard) | Admin portal | 3001 |
| [Scanner App](../scanner-app) | Gate scanning | 8081 |
| [Resident Mobile](../resident-mobile) | Native app | 8083 |

---

## 📄 License

MIT License — see [../../LICENSE](../../LICENSE) for details.

---

<p align="center">
  <strong>Part of the GateFlow Ecosystem</strong><br>
  <a href="https://gateflow.io">Website</a> • <a href="https://github.com/iDorgham/Gateflow">GitHub</a>
</p>
