# GateFlow — Official Documentation Hub

<div align="center">

![Banner](../docs/gateflow_banner.png)

**Technical and operational documentation for the GateFlow platform**

_Enterprise-grade architecture with 6 interconnected applications_

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](#)
[![Ralph Loop](https://img.shields.io/badge/Automation-Ralph_Loop-orange?style=for-the-badge)](#)
[![i18n](https://img.shields.io/badge/i18n-AR_%2B_EN-blue?style=for-the-badge)](#)

</div>

---

## Product & Vision

_The business logic and roadmaps dictating the engineering scope._

| Document                                                         | Purpose                                                              |
| :--------------------------------------------------------------- | :------------------------------------------------------------------- |
| [Master PRD (v9)](product/PRD.md)                                | Absolute source of truth for all implementations and Phase 3 roadmap |
| [Marketing Suite Overview](product/MARKETING_SUITE.md)           | CRM webhooks, UTM parameters, and tracking pixels                    |
| [Project Progress Dashboard](core/PROJECT_PROGRESS_DASHBOARD.md) | Completed macro-milestones and upcoming Epics                        |

---

## Architecture & System Engineering

_How the code is orchestrated across the monorepo._

| Document                                                         | Purpose                                      |
| :--------------------------------------------------------------- | :------------------------------------------- |
| [Global Architecture](arch/ARCHITECTURE.md)                      | High-level system design and data flow       |
| [Project Structure](arch/PROJECT_STRUCTURE.md)                   | Breakdown of apps/ and packages/             |
| [GateFlow Config](core/GATEFLOW_CONFIG.md)                       | Centralized environmental configurations     |
| [Code Quality Audit](arch/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md) | Type-safety optimizations and N+1 reductions |

---

## Development Guidelines & Ops

_Rules of engagement for autonomous AI agents and human engineers._

| Document                                                 | Purpose                                       |
| :------------------------------------------------------- | :-------------------------------------------- |
| [CLAUDE Mandate](CLAUDE.md)                              | Prime directive for all coding workflows      |
| [Security Overview](guides/SECURITY_OVERVIEW.md)         | HMAC-SHA256 hashing math for offline QR codes |
| [Environment Variables](guides/ENVIRONMENT_VARIABLES.md) | Local and production .env requirements        |
| [UI Design Guide](guides/UI_DESIGN_GUIDE.md)             | ADS tokens, Tailwind variables, RTL layouts   |
| [Antigravity Skills](guides/ANTIGRAVITY_SKILLS.md)       | Internal MCP AI capabilities                  |

---

## Deployment Checklists

_How we ship to Vercel and the App Stores._

| Document                                                    | Purpose                                 |
| :---------------------------------------------------------- | :-------------------------------------- |
| [Root Deployment](deployment/README.md)                     | Standard operating procedure for Vercel |
| [Admin Dashboard Pipeline](deployment/ADMIN_DASHBOARD.md)   | Super-admin console routing             |
| [Client Dashboard Pipeline](deployment/CLIENT_DASHBOARD.md) | B2B portal CI/CD                        |
| [Marketing Site](deployment/MARKETING.md)                   | SEO conversion funnels                  |

---

## Documentation Constants

| Rule                   | Description                                                       |
| :--------------------- | :---------------------------------------------------------------- |
| **Parity Requirement** | Build a macro-feature → immediately push matching spec to `docs/` |
| **RTL Explicitness**   | UI-facing docs MUST account for bidirectional rendering           |
| **Redacted Secrets**   | Use mock data prefixes (`gf_test_123`) — never real tokens        |

---

## Quick Navigation

| Section                                                  | Description                                  |
| :------------------------------------------------------- | :------------------------------------------- |
| [Plan Lifecycle](../docs/plan/README.md)                 | Ralph workflow: backlog → idea → plan → done |
| [Automation Guide](guides/AUTOMATION_GUIDE.md)           | Ralph scripts, hooks, and CI/CD              |
| [Development Guide](guides/DEVELOPMENT_GUIDE.md)         | Local setup and conventions                  |
| [Tool & CLI Reference](guides/TOOL_AND_CLI_REFERENCE.md) | AI tool selection matrix                     |

---

<div align="center">

_Maintained via the Ralph Loop — every commit updates docs automatically_

[Return to Main README](../README.md) · [Automation Guide](guides/AUTOMATION_GUIDE.md) · [gateflow.site](https://gateflow.site)

&copy; 2026 GateFlow Engineering

</div>
