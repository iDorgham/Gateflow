# GateFlow Resident Portal

<div align="center">

![Banner](docs/gateflow_banner.png)

**Self-Service Guest Management for Residents**

_Web-based portal for unit owners to manage visitor access_

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Type](https://img.shields.io/badge/Type-Web_Portal-blue?style=for-the-badge)](#)
[![i18n](https://img.shields.io/badge/i18n-RTL_Supported-green?style=for-the-badge)](#)

</div>

---

## Overview

The **GateFlow Resident Portal** provides a professional web interface for residents who prefer desktop management or don't have the mobile app installed.

### Key Capabilities

| Capability              | Description                                            |
| :---------------------- | :----------------------------------------------------- |
| **Desktop Management**  | Large-scale visitor management for high-capacity units |
| **Quota Visualization** | Detailed breakdown of monthly visitor allocations      |
| **Rule Engine**         | Precision control over access windows                  |
| **Audit Logs**          | Full history of QR code usage                          |

---

## Features

### Visitor Control

| Feature             | Capability                                            |
| :------------------ | :---------------------------------------------------- |
| **Pass Generation** | High-resolution QR codes for print or digital sharing |
| **Quota Monitor**   | Real-time tracking of remaining guest slots           |
| **Open QR**         | Permanent unit-linked passes for residents            |
| **Revocation**      | Instantly cancel any active pass                      |

### Unit Support

| Feature          | Description                                              |
| :--------------- | :------------------------------------------------------- |
| **Multi-Unit**   | Residents with multiple properties can switch seamlessly |
| **Profile Sync** | Shared settings across Web and Mobile                    |

---

## Tech Stack

| Layer             | Technology                                    |
| :---------------- | :-------------------------------------------- |
| **Framework**     | Next.js 14 (App Router)                       |
| **QR Generation** | Client-side SVG generation for crisp printing |
| **Security**      | jose-powered JWT verification                 |
| **Styling**       | Tailwind CSS with RTL/Arabic support          |

---

## Getting Started

```bash
# Install dependencies (from root)
pnpm install

# Build shared packages
pnpm turbo build --filter=@gate-access/*

# Start Resident Portal
pnpm dev:resident-portal
```

**Local Port**: `http://localhost:3003`

---

## Architecture

```
src/
├── app/
│   ├── [locale]/          # Root locale routing
│   │   ├── page.tsx      # Dashboard home
│   │   ├── visitors/     # Visitor management
│   │   ├── passes/       # QR pass management
│   │   └── settings/     # Profile and preferences
│   └── api/              # API routes
├── components/           # Portal-specific components
└── lib/
    └── qr/               # QR code generation utilities
```

---

## Related Documentation

| Document                                                        | Description                 |
| :-------------------------------------------------------------- | :-------------------------- |
| [Development Guide](../guides/DEVELOPMENT_GUIDE.md)             | Local setup and conventions |
| [UI Design Guide](../guides/UI_DESIGN_GUIDE.md)                 | RTL and design tokens       |
| [i18n Guide](../guides/UI_DESIGN_GUIDE.md#internationalization) | AR/EN support               |

---

<div align="center">

**Part of the GateFlow Production Ecosystem**

[Main README](../README.md) · [Documentation Index](../README.md) · [gateflow.site](https://gateflow.site)

</div>
