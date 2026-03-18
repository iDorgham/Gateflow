# GateFlow — Documentation Hub

Welcome to the official GateFlow documentation. This repository contains the source code and configuration for the entire 6-app ecosystem.

---

## 🏗️ 1. Architecture & Design
- [**Core Architecture**](arch/README.md) — System design and data flow.
- [**Database Schema**](arch/DATABASE_SCHEMA.md) — 30+ models and multi-tenant rules.
- [**Design tokens**](design/ADS_TOKENS.md) — Atlassian Design System compliance.
- [**Branding**](design/BRANDING.md) — Visual identity and MENA-specific design.

## 🚀 2. Product & Roadmap
- [**Final PRD v1.0**](product/PRD_v1.0_FINAL.md) — Current state and requirements.
- [**Marketing Suite**](product/MARKETING_SUITE.md) — Conversion features & CRM.
- [**Project Progress**](core/PROJECT_PROGRESS_DASHBOARD.md) — Completed milestones.

## 🔑 3. Development & Guides
- [**CLAUDE.md**](core/CLAUDE.md) — Active mandate and code conventions.
- [**Security Overview**](guides/SECURITY_OVERVIEW.md) — HMAC signing & Auth flows.
- [**Environment Variables**](guides/ENVIRONMENT_VARIABLES.md) — Local/Prod config.
- [**CLI Tool Reference**](guides/TOOL_AND_CLI_REFERENCE.md) — Gemini, Ralph, and custom tools.

## 🚢 4. Deployment
- [**Cloud Deployment (Vercel)**](deployment/README.md) — Dashboard and Web.
- [**Mobile Distribution (Expo)**](deployment/SCANNER_APP.md) — App Store & Play Store.
- [**Infrastructure**](deployment/INFRASTRUCTURE.md) — DB hosting and caching.

## 📂 5. Workspace Organization
- [**Monorepo structure**](core/GATEFLOW_CONFIG.md) — Turborepo and package management.
- [**Phased Development**](plan/README.md) — Planning history and backlogs.

---

### 📚 Documentation Conventions
- **Accuracy**: Maintain parity between code and docs.
- **RTL-Aware**: Every UI doc must account for English (LTR) and Arabic (RTL).
- **Security-First**: Never include real secrets in logs or examples.

© 2026 GateFlow Engineering.
