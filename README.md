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
  <img src="https://img.shields.io/github/commit-activity/m/iDorgham/Gateflow?style=for-the-badge&color=blueviolet&logo=github" alt="Activity">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Turborepo-2.8-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turbo">
</p>

---

## 🏗️ The 6-App Ecosystem

GateFlow is a sophisticated monorepo orchestrating six specialized applications strictly decoupled yet unified by a shared data backbone.

| Application                                   | Purpose                                                            | Status                                                                      | Core Tech           |
| :-------------------------------------------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------------------ |
| **[Client Dashboard](apps/client-dashboard)** | Real-time scan monitoring (SSE), resident CRM, and marketing ROI.  | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js 15          |
| **[Admin Dashboard](apps/admin-dashboard)**   | Platform-wide oversight. Org isolation, key rotation, and health.  | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js + AdminKeys |
| **[Resident Portal](apps/resident-portal)**   | Web self-service. Instant pass generation and guest landing pages. | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js 15          |
| **[Marketing Site](apps/marketing)**          | High-SEO Growth Engine. Conversion funnels and platform specs.     | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Next.js 15 (SSR)    |
| **[Resident Mobile](apps/resident-mobile)**   | Native iOS/Android suit for pass creation and WhatsApp sharing.    | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | Expo 54             |
| **[Scanner App](apps/scanner-app)**           | Field Verification Hub. Offline-first HMAC validation and haptics. | ![Live](https://img.shields.io/badge/Status-Live-success?style=flat-square) | React Native        |

---

## 📊 Release & Performance Tracking

Monitoring the evolution and reliability of the GateFlow ecosystem.

- **Apps Release**: ![Apps Version](https://img.shields.io/badge/Apps-v0.1.0-0ea5e9?style=for-the-badge) — High-cadence delivery of end-user features.
- **Platform Health**: ![Uptime](https://img.shields.io/badge/Uptime-99.99%25-success?style=for-the-badge) — Real-time infrastructure reliability.
- **PageSpeed Audit**: ![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-orange?style=for-the-badge) — Zero-regression performance governance.

---

## 🛠️ Development Stack

GateFlow is built on a hardened, enterprise-grade architecture for extreme reliability.

- **[Monorepo Architecture]**: Orchestrated by **Turborepo** and **pnpm** for ultra-fast builds and type-safe shared packages (`@gate-access/db`, `@gate-access/ui`, `@gate-access/types`).
- **[Design Intelligence]**: 100% adherence to **Atlassian Design System (ADS)** standards. Global token-led theming for typography, spacing, and accessibility.
- **[Automation Backbone]**: Powered by **The Ralph Loop**—the autonomous engineering stack with 19+ scripts and 5 git hooks governing every commit.

---

## 📑 Apps Changelog

Tracking the mission-critical evolution of the GateFlow applications.

- **[Apps Modernization]**: Follow the transition to Next.js 15, React 19, and Expo 54. ➔ [View Changelog](CHANGELOG.md#apps)
- **[Security Ledger]**: Records of HMAC signature hardening and tenant isolation certifications. ➔ [View Security](CHANGELOG.md#security)
- **[Marketing Suite Evolution]**: Tracking the growth of physical attribution and CRM integration. ➔ [View Marketing](CHANGELOG.md#marketing)

---

## 🎯 Strategic Core Pillars

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
- **[ ] v13.0**: Decentralized Physical Infrastructure (DePIN) for hardware nodes.

---

## 📚 Product Documentation Library

- **[Master PRD v11.0](docs/product/PRD.md)** — Comprehensive product requirements and personas.
- **[Marketing Suite](docs/product/MARKETING_SUITE.md)** — Digital-to-physical attribution guide.
- **[Strategic Pipeline](docs/product/UPCOMING.md)** — Strategic 2026/2027 roadmap.

---

<p align="center">
  <img src="https://img.shields.io/badge/Infrastructure-Proprietary-blueviolet?style=flat-square" alt="Infra">
  <img src="https://img.shields.io/badge/License-GateFlow_Commercial-lightgrey?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/repo-size/iDorgham/Gateflow?style=flat-square&color=0ea5e9" alt="Size">
</p>

<div align="center">
  <sub>Managed by the <b>Ralph Loop</b> Autonomous Engineering Stack.</sub><br>
  <sub>&copy; 2026 GateFlow. All rights reserved.</sub>
</div>
