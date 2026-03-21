# GateFlow — Official Documentation Hub

Welcome to the central repository for **GateFlow's technical and operational documentation**. 

GateFlow is a sprawling, enterprise-grade architecture containing 6 interconnected applications operating over a specialized zero-trust security infrastructure. This folder (`/docs`) serves to standardize all architectural decisions, deployment manifests, design paradigms, and product scopes.

<br>

---

## 🚀 1. Product & Vision
*The business logic and roadmaps dictating the engineering scope.*

| Document | Purpose |
| :--- | :--- |
| [**Master PRD (v9)**](product/PRD.md) | Absolute source of truth for all current implementations, application topologies, and the Phase 3 (Growth) roadmap. |
| [**Marketing Suite Overview**](product/MARKETING_SUITE.md) | Specifications for the CRM webhooks, UTM parameters, and tracking pixels integrated into the apps. |
| [**Project Progress Dashboard**](core/PROJECT_PROGRESS_DASHBOARD.md) | Ongoing checklist of completed macro-milestones and upcoming Epics. |

---

## 🏗️ 2. Architecture & System Engineering
*How the code is orchestrated across the monorepo.*

| Document | Purpose |
| :--- | :--- |
| [**Global Architecture**](arch/ARCHITECTURE.md) | High-level system design, data flow diagrams, and offline-syncing mechanisms for the scanner edge nodes. |
| [**Project Structure**](arch/PROJECT_STRUCTURE.md) | Breakdown of the `apps/` and `packages/` monorepo schema utilizing Turborepo. |
| [**GateFlow Config**](core/GATEFLOW_CONFIG.md) | Centralized environmental configurations and monorepo workspace behaviors. |
| [**Code Quality Audit**](arch/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md) | Logs on rigorous type-safety optimizations and N+1 Prisma query reductions. |

---

## 🔑 3. Development Guidelines & Ops
*Rules of engagement for autonomous AI agents and human engineers.*

| Document | Purpose |
| :--- | :--- |
| [**CLAUDE Mandate**](CLAUDE.md) | The prime directive for all coding workflows, styling restrictions, and code formatting rules. |
| [**Security Overview**](guides/SECURITY_OVERVIEW.md) | Deep breakdown of the `HMAC-SHA256` hashing math securing our offline QR codes. |
| [**Environment Variables**](guides/ENVIRONMENT_VARIABLES.md) | Definitions for local and production `.env` requirements (Postgres, URLs, Secrets). |
| [**UI Design Guide**](guides/UI_DESIGN_GUIDE.md) | Specifications around Atlassian Design System tokens, Tailwind variables, and RTL layouts. |
| [**Antigravity Skills**](guides/ANTIGRAVITY_SKILLS.md) | Library of internal MCP AI capabilities (`gf-dev`, `gf-security`, etc.). |

---

## 🚢 4. Deployment Checklists
*How we ship to Vercel and the App Stores.*

| Document | Purpose |
| :--- | :--- |
| [**Root Deployment**](deployment/README.md) | Standard operating procedure for Turborepo Vercel deployments. |
| [**Admin Dashboard Pipeline**](deployment/ADMIN_DASHBOARD.md) | Specific routing and environmental variables for the super-admin console. |
| [**Client Dashboard Pipeline**](deployment/CLIENT_DASHBOARD.md) | CI/CD steps pushing to our B2B portal. |
| [**Marketing Site**](deployment/MARKETING.md) | Next.js configuration for the public SEO conversion funnels. |

---

## ⚖️ Documentation Constants

1. **Parity Requirement:** It is strictly prohibited to build a macro-feature without immediately pushing a matching specification to this `docs/` folder.
2. **RTL Explicitness:** Any UI-facing documentation MUST account for bidirectional rendering using logical CSS properties.
3. **Redacted Secrets:** Example payloads MUST NEVER contain actual hashed JWTs or DB tokens. Use mock data prefixes (`gf_test_123`).

<br>
<div align="center">
  <em>© 2026 GateFlow Engineering. All docs actively maintained via the Ralph Loop.</em>
</div>
