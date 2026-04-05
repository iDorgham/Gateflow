# GateFlow — Master Product Requirements Document (PRD)

**Document Version:** 11.0 (Enterprise Automation Edition)  
**Status:** Active / Production-Ready  
**Last Updated:** 2026-04-02  
**Confidentiality:** Internal Engineering & Product

---

## 1. Executive Summary

GateFlow is a unified, Stripe-level infrastructure platform for physical access control and marketing intelligence. Designed specifically for the high-growth MENA PropTech market, it transforms traditional, siloed security operations into a data-driven ecosystem.

GateFlow bridges the gap between digital marketing attribution and physical estate entry. By assigning cryptographic identities to every guest interaction, it allows developers and property managers to track the full lifecycle of a visitor—from the initial marketing click to the physical gate scan.

---

## 2. Strategic Vision & Objectives

### 2.1 Mission Statement

To provide absolute security and absolute measurement at every physical perimeter, while delivering a frictionless, native experience for residents and guests.

### 2.2 Key Business Objectives

- Security Perfection: Eliminate unauthorized access via HMAC-SHA256 offline-first verification.
- Marketing ROI: Provide 1:1 attribution between marketing spend (Meta/GA4) and physical site visits.
- Operational Efficiency: Reduce manual guard intervention by 80% through resident-led guest management and QR autonomy.
- Monolithic Scale: Support multi-tenant, multi-project architectures from a single unified codebase.

---

## 3. User Personas

### 3.1 Omar — The Property Manager (Operations)

- Goals: Maintain safety, visibility into traffic, and minimize resident complaints.
- Pain Points: Paper-based logs, slow peak-hour entry, lack of data on "who is actually inside."
- Primary Tool: Client Dashboard (Web).

### 3.2 Sarah — The Marketing Manager (Growth)

- Goals: Track which campaigns (Facebook vs. SMS) drive the most site visits for new property sales.
- Pain Points: "Dark traffic"—visitors show up at the gate, but their digital source is lost.
- Primary Tool: Marketing Intelligence Suite within the Client Dashboard.

### 3.3 Ahmed — The Security Guard (Field)

- Goals: Verify guests in under 2 seconds and handle residents efficiently.
- Pain Points: Bad network at the gate, complicated software, aggressive drivers.
- Primary Tool: Scanner App (Mobile).

### 3.4 Yasmine — The Resident (End User)

- Goals: Invite friends via WhatsApp quickly and receive arrival notifications.
- Pain Points: Calling security to "let someone in," lost guest passwords.
- Primary Tool: Resident Mobile (iOS/Android).

### 3.5 System Admin (The Architect)

- Goals: Maintain platform uptime, manage tenants, and audit system integrity.
- Pain Points: Database drift, secret exposure, tenant data leakage.
- Primary Tool: Admin Dashboard & The Ralph Loop.

---

## 4. The 6-App Ecosystem

### 4.1 Client Dashboard (`apps/client-dashboard`)

The administrative hub for property managers. Includes real-time KPI metrics, resident CRM, project gallery management, team RBAC, and marketing suite.

### 4.2 Admin Dashboard (`apps/admin-dashboard`)

The "God-mode" panel for platform owners. Manages organizations (tenants), authorization keys, and cross-tenant health logs.

### 4.3 Scanner App (`apps/scanner-app`)

A high-performance React Native application for field staff. Features high-speed camera scanning, offline HMAC verification, and encrypted sync queues.

### 4.4 Resident Mobile (`apps/resident-mobile`)

The native resident experience. Built with Expo, it allows one-tap pass creation, WhatsApp sharing, and real-time push alerts.

### 4.5 Resident Portal (`apps/resident-portal`)

A web-based alternative to the mobile app, providing residents with desktop access to guest logs and pass management.

### 4.6 Marketing Website (`apps/marketing`)

The customer-facing growth engine. Features SSR for SEO, dynamic vertical solutions, and pricing calculators.

---

## 5. Functional Requirements (Deep-Dive Feature Inventory)

### 5.1 Access Control & Security System

This module is the core engine of the platform, responsible for creating, signing, and verifying the multi-tier QR passes.

- Cryptographic HMAC-SHA256 Signing: Every QR pass link contains a unique payload and a signature. The server signs the payload with a secret known only to the GateFlow instances. This prevents "ID incrementing" or "link tampering" attacks.
- Offline-First Verification Protocol: The Scanner App downloads a periodically rotated signing secret (AES-encrypted at rest). This allows the guard to verify a guest's pass even in basement parking or during ISP outages, with zero latency.
- Multi-Tier Identity Verification:
  - Tier 0 (Guest): Standard name/phone collection.
  - Tier 1 (Verified): Requires a photo of a government-issued ID, OCR-scanned and validated.
  - Tier 2 (Biometric): Requires facial recognition matching between the live visitor and their submitted ID.
- Intelligent Pass Types:
  - Single-Use: One entry/exit cycle; expires immediately after successful use.
  - Recurring: Time-boxed access (e.g., "Every Monday 8 AM - 5 PM") for household staff.
  - Permanent: Infinite usage until revoked (reserved for residents and staff).
  - Open Link: Registration-based passes where guests provide their details at the gate.

### 5.2 Marketing & Attribution Intelligence

Unlike standard security tools, GateFlow captures the full marketing funnel of a physical visit.

- Attribution Persistence Logic: When a prospective resident clicks an ad (e.g., "Visit our demo villa"), the UTM parameters are stored in their session. When they generate a visitor pass, these params are bound to the `QrCode` record in the database.
- Physical Conversion Firing: The moment the security guard scans the pass at the gate, GateFlow triggers a server-side event to Meta Pixel and Google Analytics 4. This markers the visitor as a "Physical Lead," closing the loop on digital spend.
- CRM Data Sync (HubSpot/Salesforce): GateFlow pushes a payload containing the guest's name, phone, and **marketing source** to the developer's CRM the moment they are scanned.
- Cost-per-Visit (CPV) Analytics: Property developers can see exactly which channel (Snapchat, Instagram, Google) is driving real people to their site, not just "website clicks."

### 5.3 CRM & Residential Operations

Manages the human elements of the gated community.

- Tenant/Resident Lifecycle: Onboarding residents, managing their unit associations (Apartments, Villas, Berths), and handling move-in/move-out lockouts.
- Contact Source Tagging: Categorizes every person in the system by their origin (e.g., "Imported from CSV," "Captured from QR," "Manual Entry").
- Bulk Infrastructure Seeding: Allows admins to generate 1000s of units and QR codes in seconds for new projects using the Seeding Wizard.

### 5.4 AI Operational Hub (GateAI)

An agentic AI layer built directly into the administrative workflow.

- Natural Language Infrastructure: Instead of clicking 10 buttons to "Create a new gate for Project X," managers can type it into the GateAI panel.
- Real-time Intelligence Requests: Managers can ask: "Who is the most frequent visitor at Gate 4?" or "Show me all denied scans from yesterday," and the AI executes the database query securely and returns formatted results.

---

## 6. Technical Architecture

### 6.1 The Stack

- Monorepo: Turborepo + pnpm.
- Backend: Next.js App Router (RSC), Prisma ORM, PostgreSQL.
- Mobile: React Native / Expo 54.
- Styles: Tailwind CSS + ADS (Atlassian Design System) token architecture.
- i18n: Full AR/EN RTL support via logical CSS properties.

### 6.2 Security Model

- **Tenant Isolation**: Prisma middleware enforces `organizationId` scoping on every query.
- **Secret Management**: Pre-commit hooks block 12+ patterns of sensitive data.
- **Auth**: Argon2id hashing + 15-minute JWT rotation + 30-day encrypted refresh tokens.

---

## 7. The Ralph Loop (Autonomous Governance)

The Ralph Loop is GateFlow’s proprietary automation engine that ensures no code ships without meeting the 2026 Engineering Standard.

- **Pre-flight**: Automated lint, type-check, and unit testing before every push.
- **Sync-Bot**: Automated propagation of AI instructions and skills across the monorepo.
- **Doc-Bot**: Continuous updates to CHANGELOG and PRD based on Git history.

---

## 8. Roadmap & Upcoming Features

### Q3 2026 — The "Intelligence" Release

- **WhatsApp Bot**: Direct PASS delivery and creation via WhatsApp Business API.
- **LPR Integration**: License Plate Recognition camera sync for vehicle-based pass validation.
- **Predictive Staffing**: AI-generated reports on when to increase gate staff based on historical seasonality.

### 2027 — The "Ecosystem" Release

- **GateFlow SDK**: Allowing 3rd-party developers to build "Apps" inside the GateFlow ecosystem.
- **Blockchain Audit**: Moving the `ScanLog` to an immutable private ledger for financial-grade transparency.

---

## 9. Non-Functional Requirements

### 9.1 Performance

- Scanner Verify Time: < 100ms.
- Lighthouse Performance: > 98 across all web applications.
- API P95 Response: < 200ms.

### 9.2 Accessibility & Localization

- Full WCAG 2.1 compliance.
- Bi-directional (RTL/LTR) support with 100% Arabic translation coverage for field staff.

---

## 10. Glossary

- **HMAC**: Hash-based Message Authentication Code.
- **LWW**: Last-Write-Wins (Conflict resolution).
- **ADS**: Atlassian Design System.
- **The Ralph Loop**: GateFlow's internal autonomous CI/CD governance system.

---

> This document is the primary source of truth for all GateFlow engineering and product decisions.
> Developed by the GateFlow Global Engineering Team.

### Org Types Dashboard

**Status:** Phase 1 Complete | Last updated: 2026-04-05

### Gateflow Design System

**Status:** Phase 1 Complete | Last updated: 2026-04-05

### Platform Evolution

**Status:** Phase 1 Complete | Last updated: 2026-04-05
