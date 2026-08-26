# GateFlow — Official Documentation Hub

<div align="center">

![Banner](../assets/Images/gateflow_banner.png)

**Technical and operational documentation for the GateFlow platform**

_Enterprise-grade architecture with 6 interconnected applications_

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](#)
[![Ralph Loop](https://img.shields.io/badge/Automation-Ralph_Loop-orange?style=for-the-badge)](#)
[![i18n](https://img.shields.io/badge/i18n-AR_%2B_EN-blue?style=for-the-badge)](#)

</div>

---

## Where things live (fewer top-level folders)

| Area                          | Path                                             | What                                                                                   |
| ----------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Reference**                 | [`reference/`](reference/README.md)              | Master AI knowledge base, Product PRD, architecture, cache snapshots, app specs        |
| **Audits**                    | [`audits/`](audits/)                             | Multi-app ecosystem audits, situation audits, security reviews, and pilot gates        |
| **NotebookLM Sources**        | [`notebooklm/`](notebooklm/NOTEBOOKLM_README.md) | Dedicated structured sources for Google NotebookLM ingestion (`01` to `11` + Ultimate) |
| **Guides**                    | [`guides/`](guides/)                             | Developer setup, security, env vars, UI design, analytics, and automation guides       |
| **Workspace**                 | [`workspace/`](workspace/README.md)              | Workspace-facing tool mirrors, command guides, and AI sync logs                        |
| **Development & AI workflow** | [`development/`](development/README.md)          | Plan templates, guidelines, learning logs, `initiatives/` (`IDEA_*.md`), brainstorming |
| **Plans & Roadmap**           | [`plan/`](plan/README.md)                        | **Draft / Ready / Active / Complete** + `backlog/` and `tasks.md`                      |
| **Tools**                     | [`tools/`](tools/)                               | Tooling references and configurations                                                  |
| **Archive**                   | [`archive/`](archive/)                           | Legacy PRDs, old plans, historical logs                                                |

---

## Product & vision

| Document                                                                | Purpose                               |
| :---------------------------------------------------------------------- | :------------------------------------ |
| [Master PRD (v12.1)](reference/product/PRD.md)                          | Source of truth for scope and roadmap |
| [Marketing suite](reference/product/MARKETING_SUITE.md)                 | CRM webhooks, UTM, pixels             |
| [Upcoming](reference/product/UPCOMING.md)                               | Near-term initiatives                 |
| [Progress dashboard](reference/workspace/PROJECT_PROGRESS_DASHBOARD.md) | Milestones and epics                  |

---

## Architecture & engineering

| Document                                                                                    | Purpose                                   |
| :------------------------------------------------------------------------------------------ | :---------------------------------------- |
| [Architecture](reference/architecture/ARCHITECTURE.md)                                      | System design and data flow               |
| [Project structure](reference/architecture/PROJECT_STRUCTURE.md)                            | `apps/` and `packages/`                   |
| [GateFlow config](reference/workspace/GATEFLOW_CONFIG.md)                                   | Workspace commands, plans, security index |
| [Quality & performance audit](reference/architecture/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md) | Type-safety, N+1, perf notes              |

---

## Guidelines & ops

| Document                                                 | Purpose                              |
| :------------------------------------------------------- | :----------------------------------- |
| [CLAUDE mandate](CLAUDE.md)                              | Prime directive for coding workflows |
| [Security overview](guides/SECURITY_OVERVIEW.md)         | QR / auth / tenant patterns          |
| [Environment variables](guides/ENVIRONMENT_VARIABLES.md) | Local and production `.env`          |
| [UI design guide](guides/UI_DESIGN_GUIDE.md)             | Tokens, Tailwind, RTL                |
| [Deployment](guides/DEPLOYMENT_GUIDE.md)                 | Vercel / ship checklists             |
| [Antigravity skills](guides/ANTIGRAVITY_SKILLS.md)       | MCP / internal AI capabilities       |

---

## Documentation constants

| Rule        | Description                                           |
| :---------- | :---------------------------------------------------- |
| **Parity**  | Ship behavior and update matching specs in `docs/`    |
| **RTL**     | UI-facing docs account for bidirectional layout       |
| **Secrets** | Use mock prefixes (`gf_test_123`) — never real tokens |

---

## Quick navigation

| Section                                               | Description                       |
| :---------------------------------------------------- | :-------------------------------- |
| [Plan lifecycle](plan/README.md)                      | Draft → Ready → Active → Complete |
| [Automation](guides/AUTOMATION_GUIDE.md)              | Ralph scripts, hooks, CI          |
| [Local dev](guides/DEVELOPMENT_GUIDE.md)              | Setup and conventions             |
| [Tool & CLI matrix](guides/TOOL_AND_CLI_REFERENCE.md) | Which tool for which task         |
| [Doc index](INDEX.md)                                 | Auto-style listing                |

---

<div align="center">

_Maintained via the Ralph Loop — keep paths aligned with `reference/` + `guides/` + `development/` + `plan/`_

[Return to main README](../README.md) · [Automation guide](guides/AUTOMATION_GUIDE.md) · [gateflow.site](https://gateflow.site)

&copy; 2026 GateFlow Engineering

</div>
