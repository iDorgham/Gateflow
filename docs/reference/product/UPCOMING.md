# <p align="center">GateFlow — Feature Pipeline & Roadmap</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Security_Shipped_Ready_Next-blueviolet?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Next_Sprint-Resident_%26_Scanner-blue?style=for-the-badge" alt="Next Sprint">
</p>

---

> **Roadmap SSOT:** This file is the canonical place for pipeline status, initiatives, and strategic goals. The root [`README.md`](../../../README.md) links here and does **not** duplicate roadmap tables—refresh the README snapshot line only when you want a new high-level teaser.

## 🏗️ Active Initiatives

Real-time status of the engineering pipeline.

### 🔴 In Progress

_Plan folders use lifecycle layout: `Draft/` → `Ready/` → `Active/` → `Complete/` (see `docs/development/PLAN_LIFECYCLE.md`)._

| Initiative                 | Goal                          | Phase / note                                                      | Plan                                                |
| :------------------------- | :---------------------------- | :---------------------------------------------------------------- | :-------------------------------------------------- |
| **Audit Remediation 2026** | P0–P2 security + CI hardening | Phases 1–4 code shipped; residual ops credential-rotation receipt | [Folder](../../plan/Active/audit_remediation_2026/) |

### 🟡 In Planning (Ready)

| Initiative                          | Goal                                             | Plan                                                   |
| :---------------------------------- | :----------------------------------------------- | :----------------------------------------------------- |
| **Resident Portal Responsive**      | PWA, mobile navigation, offline QR cache         | [Folder](../../plan/Ready/resident_portal_responsive/) |
| **Scanner Onboarding Session**      | Secure scanner sessions + multi-step ADS wizards | [Folder](../../plan/Ready/scanner_onboarding_session/) |
| **Org Types Dashboard (follow-up)** | Config-driven modules / terminology polish       | [Folder](../../plan/Ready/org_types_dashboard/)        |

### ⚪ Draft / backlog ideas

- **WhatsApp/SMS Gateway**: Mobile-first pass delivery for MENA regions.
- **Self-serve billing**: Tenant onboarding and subscription portal.
- **gateflow_readiness_market_leadership_2026**: Broader readiness initiative (reconcile with audit outcomes).

---

## ✅ Recently Shipped

Accomplishments from the last two sprints.

> [!TIP]
> **Repo Hygiene & Security Baseline (v0.3.0)** — _Shipped 2026-07-24_ — [Plan](../../plan/Draft/repo_hygiene/)
>
> - Dependency security overrides (`qs`, `uuid`, `ip-address`, `markdown-it`, `@babel/core`, `esbuild`, `@ai-sdk/provider-utils`).
> - Reconciled design system blueprints, markdownlint MD024 configuration, and root-anchored hygiene rules.
> - Client Dashboard null-safe locale label guard & Vercel Prisma engine packaging.

> [!TIP]
> **Audit Remediation 2026** — _Phases 1–4 shipped 2026-07-20 → 2026-07-21_ — [Plan](../../plan/Active/audit_remediation_2026/)
>
> - Removed production bootstrap/reset-admin surface; CMS HTML + branding CSS sanitization.
> - Request-local fail-closed tenant `db` (AsyncLocalStorage).
> - Trustworthy CI scanners + full dashboard typecheck in preflight.
> - High-risk API guards, admin login throttle, shared HSTS+CSP headers.

> [!TIP]
> **Platform / Admin / Design System (Q2 2026)**
>
> - GateFlow Design System [v1.0] — [archive](../../plan/Complete/gateflow_design_system/)
> - Admin Dashboard Evolution (side menu, CMS, builder) — [archive](../../plan/Complete/admin_dashboard_evolution/)
> - Org Types Dashboard — [archive](../../plan/Complete/org_types_dashboard/)
> - Platform Evolution (AI CMS page builder) — [archive](../../plan/Complete/platform_evolution/)

> [!NOTE]
> **Marketing Suite Foundation** — _Shipped 2026-03-23_
>
> - UTM Attribution loop (Source → Gate).
> - Meta Pixel & GA4 Event Streaming.
> - Secure CRM Webhook architecture.

---

## 📈 Strategic Goals (Q3 2026)

1. **Zero-Trust Hardening**: Hold audit remediation gains; finish ops credential rotation; expand offline HMAC for multi-gate projects.
2. **Resident & Scanner UX**: Ship Ready plans for responsive resident portal and scanner onboarding.
3. **Lighthouse Perfection**: Consistent performance across marketing and dashboards (`*.gateflow.site`).
4. **Revenue & Billing**: Self-serve billing portal for rapid tenant onboarding.

---

<div align="center">
  <sub>Managed by the <b>Ralph Loop</b> Autonomous Engineering Stack.</sub>
</div>
