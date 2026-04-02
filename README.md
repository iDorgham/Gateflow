# <p align="center">GateFlow — The Invisible Sentinel</p>

<p align="center">
  <img src="docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<p align="center">
  <b>The Operating System for Physical Access Control & Marketing Intelligence.</b><br>
  <i>Stripe-level infrastructure for the 2026 MENA PropTech landscape.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge&logo=checkmarx" alt="Status">
  <img src="https://img.shields.io/badge/Security-HMAC--SHA256-red?style=for-the-badge&logo=securityscorecard" alt="Security">
  <img src="https://img.shields.io/badge/Performance-100/100-orange?style=for-the-badge&logo=lighthouse" alt="Performance">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turbo">
</p>

---

## 🚀 GateFlow Intelligence Stack

GateFlow is built on a hardened, enterprise-grade architecture designed for sub-100ms verification and extreme scalability. Unified by a global design system and cryptographic core.

- **Turbo Monorepo**: Parallel builds and shared core libraries for types, database, and UI.
- **ADS Token Architecture**: 100% adherence to Atlassian Design System standards.
- **i18n & RTL Core**: Native Bi-directional support (Arabic/English) at the layout engine level.

---

## 🏗️ The 6-App Ecosystem

A sophisticated monorepo orchestrating six specialized applications strictly decoupled yet unified by a shared data backbone.

### 💼 Dashboards & Portals

| Application                                   | Purpose                                                                     | Status                                                                      | Core Tech           |
| :-------------------------------------------- | :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------------------ |
| **[Client Dashboard](apps/client-dashboard)** | Real-time scan monitoring (SSE), resident CRM, and marketing ROI dashboard. | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js 15          |
| **[Admin Dashboard](apps/admin-dashboard)**   | Organization isolation, project key rotation, and health auditing.          | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js + AdminKeys |
| **[Resident Portal](apps/resident-portal)**   | Instant pass generation and guests self-service landing pages.              | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js 15          |
| **[Marketing Site](apps/marketing)**          | High-SEO conversion funnels and industry-specific platform specs.           | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js 15 (SSR)    |

### 📱 Native Mobile Applications

| Application                                 | Purpose                                                                    | Status                                                                      | Core Tech           |
| :------------------------------------------ | :------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------------------ |
| **[Resident Mobile](apps/resident-mobile)** | Native iOS/Android suit for pass creation and WhatsApp invite sharing.     | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Expo 54             |
| **[Scanner App](apps/scanner-app)**         | Field Verification Hub. Offline-first HMAC validation and haptic feedback. | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | React Native (HMAC) |

---

## 🎯 Global Vision & Core Pillars

GateFlow transforms traditional, siloed physical security into an integrated data ecosystem. We treat every physical arrival as a first-class digital conversion event.

### 🛡️ Zero-Trust Access Security

Offline-first QR verification powered by **HMAC-SHA256** signatures. Verification happens on the edge, ensuring gate operations continue even with zero connectivity. All sensitive field queue data is encrypted at rest using **AES-256**.

### 📉 Physical-to-Digital Marketing Intelligence

The first platform to bridge the gap between digital spend and physical arrivals.

- **UTM Lifecycle Tracking**: Bind visitors to their origin (Meta/Google/SMS) from the first ad-click to the final physical scan.
- **Conversion Firing**: Real-time server-side events pushed to Meta Pixel and GA4 upon gate entry.
- **CRM Integration**: Instant lead sync with HubSpot and Salesforce during the physical check-in flow.

---

## 🗺️ Product Roadmap

Current release track: **[v11.0 — Enterprise Automation]**

- **[x] v11.0**: Hierarchical seeding, traffic emulation, and real-time SSE monitoring dashboard.
- **[ ] v11.5**: WhatsApp Business API Integration for direct pass delivery.
- **[ ] v12.0**: **GateAI Assistant** — Voice-first community management and agents.

---

## 📚 Product Documentation Library

- **[Master PRD v11.0](docs/product/PRD.md)** — Comprehensive product requirements and personas.
- **[Marketing Suite](docs/product/MARKETING_SUITE.md)** — Digital-to-physical attribution guide.
- **[Future Pipeline](docs/product/UPCOMING.md)** — Strategic 2026/2027 roadmap.

---

<p align="center">
  <img src="https://img.shields.io/badge/Infrastructure-Proprietary-blueviolet?style=flat-square" alt="Infra">
  <img src="https://img.shields.io/badge/License-GateFlow_Commercial-lightgrey?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Stack-Monorepo--v0.1.0-blue?style=flat-square" alt="Version">
</p>

<div align="center">
  <sub>Managed by the <b>Ralph Loop</b> Autonomous Engineering Stack.</sub><br>
  <sub>&copy; 2026 GateFlow. All rights reserved.</sub>
</div>
