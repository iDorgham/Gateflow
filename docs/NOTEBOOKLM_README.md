# GateFlow NotebookLM Knowledge Base — Sources Overview

Welcome to the **GateFlow NotebookLM Knowledge Base Source Collection**. This set of documentation files is specifically formatted, structured, and curated for uploading into **Google NotebookLM** as primary reference sources.

These documents synthesize the entire GateFlow platform architecture, Product Requirements Document (PRD), database schemas, security gates, pilot certification criteria, project file layouts, and phased development workflows into self-contained source documents.

---

## 📚 NotebookLM Source Index

| Source File                                                                                                | Title                               | Core Topics Covered                                                                                                                                                                                              |
| :--------------------------------------------------------------------------------------------------------- | :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[NOTEBOOKLM_01_SYSTEM_OVERVIEW_AND_PRD.md](./NOTEBOOKLM_01_SYSTEM_OVERVIEW_AND_PRD.md)**                 | System Overview & PRD               | Executive Summary, Product Vision, MENA Real-Estate Focus, All 6 Applications Summary, Turborepo Monorepo Architecture, Shared Packages, Key Security Invariants.                                                |
| **[NOTEBOOKLM_02_DATABASE_SCHEMA_AND_MODELS.md](./NOTEBOOKLM_02_DATABASE_SCHEMA_AND_MODELS.md)**           | Database & Data Models              | PostgreSQL + Prisma ORM Dual Connection Model (Accelerate vs Direct), 40+ Data Model Clusters (Identity, Access, CRM, AI, Content), Multi-Tenant Isolation Guards, Soft-Delete Semantics, Append-Only Scan Logs. |
| **[NOTEBOOKLM_03_AUDITS_GATES_AND_PILOT.md](./NOTEBOOKLM_03_AUDITS_GATES_AND_PILOT.md)**                   | Audits, Gates & Certification       | Security & Compliance Controls, Sanitization Sinks, Preflight Verification Gates (`pnpm preflight`), Residential Pilot User Journey, Zero-Manual-Checkbox Pilot Certification (`/certify`).                      |
| **[NOTEBOOKLM_04_PLANS_AND_DEVELOPMENT.md](./NOTEBOOKLM_04_PLANS_AND_DEVELOPMENT.md)**                     | Plans & Development Lifecycle       | Phased Planning Framework (`Draft/` -> `Ready/` -> `Active/` -> `Complete/`), Phase Execution Loop (`/dev`), Central Backlog Index (`ALL_TASKS_BACKLOG.md`), Workflow v2 Rules.                                  |
| **[NOTEBOOKLM_05_STRUCTURE_AND_CONTEXT_MAP.md](./NOTEBOOKLM_05_STRUCTURE_AND_CONTEXT_MAP.md)**             | Directory Structure & Context Map   | Monorepo Folder Tree Layout (`apps/`, `packages/`, `docs/`), Key AI Context Reference Files Map, Architecture & PRD File Pointers.                                                                               |
| **[NOTEBOOKLM_06_APPLICATIONS_DEEP_DIVE.md](./NOTEBOOKLM_06_APPLICATIONS_DEEP_DIVE.md)**                   | Applications Deep Dive              | Per-app responsibilities, route trees, API surfaces, service modules, and status for all six GateFlow apps plus the design-system catalog.                                                                       |
| **[NOTEBOOKLM_07_SECURITY_AND_COMPLIANCE.md](./NOTEBOOKLM_07_SECURITY_AND_COMPLIANCE.md)**                 | Security, Compliance & Privacy      | Zero-trust invariants, multi-tenancy isolation, auth/session architecture, QR signing, RBAC, data retention, privacy controls, and compliance posture.                                                           |
| **[NOTEBOOKLM_08_DESIGN_SYSTEM_AND_UI_UX.md](./NOTEBOOKLM_08_DESIGN_SYSTEM_AND_UI_UX.md)**                 | Design System & UI/UX               | Semantic token architecture, light/dark themes, ADS tokens, RTL/Arabic support, shared primitives, responsive patterns, and visual architecture.                                                                 |
| **[NOTEBOOKLM_09_DEVELOPMENT_STATUS_AND_PROBLEMS.md](./NOTEBOOKLM_09_DEVELOPMENT_STATUS_AND_PROBLEMS.md)** | Development Status & Known Problems | MVP completion snapshot, recent active work, security/audit residuals, pilot blockers, technical debt, CI/operational risks, and future enhancements.                                                            |

---

## 💡 Recommended NotebookLM Use Cases & Prompt Examples

Once uploaded into a NotebookLM Notebook, you can query your sources with prompts like:

### 1. Architecture & Design Decisions

> _"Explain how GateFlow enforces tenant isolation across its database queries and API routes."_  
> _"What apps exist in the GateFlow monorepo and what are their specific responsibilities?"_

### 2. Physical Access & QR Security

> _"How does the Scanner App handle guest pass verification in an offline environment?"_  
> _"What data is stored in a ScanLog and why is it append-only?"_

### 3. Development Workflow & Quality Assurance

> _"What checks are run during `pnpm preflight` before code can be merged?"_  
> _"How does an initiative move from `Draft` to `Complete` in the GateFlow workflow?"_

### 4. Residential Pilot Journey

> _"Walk me through the full user journey from resident invitation to physical gate check-in."_  
> _"What evidence is required to generate a valid pilot certification packet?"_
