# GateFlow Documentation

Welcome to the central repository for GateFlow documentation. This directory serves as the organized source of truth for all project specifications, guidelines, architectural decisions, and reviews.

## 📖 Core Specifications
- [Product Requirements Document (PRD v5.0)](../phase-1-mvp/specs/PRD_v5.0.md) - Single source of truth for the platform rules and logic.
- [Resident Portal Specification](../phase-2-resident-portal/specs/RESIDENT_PORTAL_SPEC.md) - Deep dive into resident-oriented portal and mobile features.
- [Marketing & WhatsApp PRD](../phase-3-marketing-ai/specs/PRD_WHATSAPP_MARKETING_EDITION.md) - Evolution of GateFlow into a marketing-first platform.

## 🏗 Architecture & Design
- [Project Structure](../architecture/PROJECT_STRUCTURE.md) - Turborepo monorepo architecture and workspace topology.
- [App Design Docs](../architecture/APP_DESIGN_DOCS.md) - General UI/UX flows and interface requirements.
- [Design Tokens](../architecture/DESIGN_TOKENS.md) - Core UI mapping for spacing, semantic colors, and shadows.
- [UI Component Library](../architecture/UI_COMPONENT_LIBRARY.md) - The reusable `@gate-access/ui` primitives repository overview.

## 💻 Engineering & Setup
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Local environment bootstrap setup and CLI usage.
- [Deployment Guide](../operations/DEPLOYMENT_GUIDE.md) - Vercel and Expo Application Services (EAS) deployment processes.
- [Environment Variables](../operations/ENVIRONMENT_VARIABLES.md) - API keys, secrets tracking, and structural configurations.

## 🤖 AI Workflow (Skills / Subagents / Rules)
- [AI Skills, Subagents, and Rules](../guidelines/AI_SKILLS_SUBAGENTS_RULES.md) - How to use AI effectively in this repo (skills, subagents, non-negotiable rules).
- [Suggested Improvements and Functions Map](../backlog/SUGGESTED_IMPROVEMENTS_AND_FUNCTIONS.md) - Consolidated “what we’re building” map + prioritized improvements.
- [All Tasks & Backlog](../backlog/ALL_TASKS_BACKLOG.md) - Single backlog of MVP launch tasks, Phase 2 work (Resident Portal/Mobile), and platform improvements.

## 🛡 Operations & Quality
- [Security Overview](../operations/SECURITY_OVERVIEW.md) - Strict user roles (RBAC), data encryptions, and token validations.
- [MVP Done Checklist](./MVP_DONE_CHECKLIST.md) - Macro milestone tracking and phase completions.
- [Code Quality & Security Review](../phase-1-mvp/specs/MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md) - Constraints definition and static audit checks.

## 🚀 Roadmaps
- [Improvements & Roadmap](../backlog/IMPROVEMENTS_AND_ROADMAP.md) - Short term feature scopes and quick wins.
- [Phase 2 Roadmap](../phase-2-resident-portal/specs/PHASE_2_ROADMAP.md) - Hardware IoT, Stripe Billing, and automated LPR integrations definitions.

---

> *Note: Legacy documentation has been moved directly to `./trash` for historical context without cluttering active references.*
