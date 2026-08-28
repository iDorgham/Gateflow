# Draft — `guard_shift_visual_map`

**Slug:** `guard_shift_visual_map`  
**Last updated:** 2026-08-28  
**Champion:** Operations & Security Engineering Team  
**Initiative Link:** `docs/development/initiatives/IDEA_guard_shift_visual_map.md`  
**Target:** Client Dashboard Q3/Q4 2026 Release

> Refined planning notes for **Guard Shift Visual Map & Real-time Gate Terminal Monitor**.

---

## 1. Executive Summary & Goals

### Problem Statement

Property managers, facility directors, and chief security officers currently lack a unified, real-time visual monitor to oversee compound perimeter gates, scanner terminal connectivity, active guard shifts, and roster compliance. Security supervisors must navigate separate tables to determine which gates are unmanned, which guards are currently clocked in, and whether scanner terminals are operating normally.

### Strategic Goals

- **Perimeter Situational Awareness**: Provide an interactive visual map and terminal card grid showcasing all gates within the organization/project, geo-coordinates, active scanner heartbeats, and current gate occupancy.
- **Real-Time Shift Monitoring**: Display live guard shifts (`ShiftLog` and `GateAssignment`), clock-in timestamps, elapsed shift duration counters, and upcoming shift handovers.
- **Operational Warning Badges**: Proactively highlight unattended gates, offline scanner terminals (no heartbeat in >5 min), and shift overruns (>8–12 hours without rotation).
- **Seamless ADS & RTL Experience**: Follow Atlassian/GateFlow Design System token standards (`@atlaskit/tokens` / `nativeTokens`), full dark mode, and complete Arabic RTL layout support.

---

## 2. Technical Architecture & Invariants

- **Stack**: Next.js 16 (App Router), React 19, TypeScript strict mode, `@gateflow/ui` / `@atlaskit/tokens`, Lucide icons, Framer Motion.
- **Multi-tenancy**: Mandatory `organizationId` scoping on all queries and mutations. Soft-delete filter `deletedAt: null` where applicable.
- **Performance**: High-density operational data rendering with zero layout shift ($CLS = 0.00$).
- **Security & Privacy**: Zero raw PII in audit logs and status feeds.
- **RTL & Localization**: Complete Arabic (`ar-EG` / `ar-SA`) and English (`en-US`) support via `@gate-access/i18n` / `react-i18next`.
