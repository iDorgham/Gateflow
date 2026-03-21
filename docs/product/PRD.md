# GateFlow — Master Product Requirements Document (PRD)

**Product Name:** GateFlow  
**Current Version:** 9.0 (Growth & Autonomy Edition)  
**Status:** MVP 100% Complete | Phase 3 (Marketing Suite + Resident Mobile v2) In Progress  
**Strategic Vision:** Stripe-level infrastructure for physical access control with an emphasis on marketing intelligence, zero-trust security, and absolute resident autonomy.

---

## 1. Executive Summary

GateFlow v9.0 marks the definitive shift from building core gate infrastructure to optimizing for **Growth, Marketing Attribution, and Resident Autonomy**. The platform is established as a self-evolving ecosystem, where automated AI orchestration (The Ralph Loop) ensures stringent engineering standards while human/AI developers confidently build world-class enterprise features.

### Core Strategic Pillars
1. **The Ralph Loop (Autonomous Engineering):** Real-time enforcement of Atlassian Design System (ADS) tokens, security constraints, and performance standards via intelligent agents.
2. **Marketing & Sales Suite:** Closing the loop between digital marketing spend and physical gate visits using UTM attribution, Meta/Google pixels, and Salesforce/HubSpot CRM webhooks.
3. **Resident Ecosystem (Mobile + Web):** A complete native mobile experience and responsive web portal for residents, focusing on one-tap sharing, instant push notifications, and AI-assisted guest management.
4. **Enterprise Scale & Security:** Enhanced multi-tenant isolation at the Prisma layer, offline-capable scanner architecture, and global surveillance integration.

---

## 2. The 6-App Ecosystem Structure

GateFlow operates via 6 strictly decoupled applications connected via a Turborepo monorepo.

### 2.1 Client Dashboard (`apps/client-dashboard`)
*The primary SaaS operations portal for Property/Event Managers.*
- **Layout:** High-density enterprise dashboard utilizing the Atlassian Design System (ADS).
- **Core Features:**
  - Real-time KPIs (Today's Scans, Guest Volume, Active Gates) via SSE.
  - Granular management of QR structures (Single, Recurring, Permanent, Open Links).
  - Marketing Suite: UTM dashboards, Retargeting Pixel configuration, CRM Webhook management.
  - Team RBAC: Role-based platform access control.

### 2.2 Admin Dashboard (`apps/admin-dashboard`)
*Super-admin platform control center.*
- **Layout:** High-density administrative interface.
- **Core Features:**
  - Global metric oversight (Multi-tenant organizations, Billing status, active project quotas).
  - Master real-time scan feed aggregation.
  - Audit logging system overriding all sub-tenants.
  - System tools (System doctor, Cache invalidation triggers, DB maintenance).

### 2.3 Scanner App (`apps/scanner-app`)
*Native mobile application (Expo SDK 54) for field security guards.*
- **Layout:** High-contrast, sunlight-optimized Utility UI.
- **Core Features:**
  - Cryptographic Verification: Offline HMAC-SHA256 signature checking.
  - AES-256 encrypted local buffer for zero-connectivity environments (Event modes).
  - Instant positive/negative haptic feedback.
  - Tiered Identity Verification (ID scanning, Photo capture integration).

### 2.4 Resident Mobile (`apps/resident-mobile`)
*Native iOS/Android consumer app (Expo Router).*
- **Layout:** Premium Consumer App (Framer Motion animations, Tab Navigation).
- **Core Features:**
  - One-Tap Share: Rapid WhatsApp/iMessage sharing of visitor codes via Native Contact Picker.
  - Real-time arrival push notifications.
  - GateAI Concierge: On-device/API-assisted AI for autonomous guest handling.
  - Unit Quota visualization.

### 2.5 Resident Portal (`apps/resident-portal`)
*Web-based self-service for desktop residents.*
- **Layout:** Minimalist, Mobile-responsive Card UI.
- **Core Features:**
  - Creation and revocation of visitor passes.
  - Historical traversal logs.
  - Open QR link generation for trusted permanent staff.

### 2.6 Marketing Website (`apps/marketing`)
*Public-facing SEO conversion platform.*
- **Layout:** Premium SaaS Landing Page (Glassmorphism, intricate animations).
- **Core Features:**
  - Dynamic pricing calculators.
  - Industry-specific vertical deployments (Marinas, Gated Communities, Offices).
  - High SEO scores natively through Next.js SSR.

---

## 3. Product Roadmap & Priorities (Phase 3)

### 3.1 Marketing Suite (Client Dashboard Focus)
| Feature | Priority | Specifics |
| :--- | :--- | :--- |
| **UTM Attribution** | **P0** | Deep parameter tracking bridging URL clicks to physical gate arrivals. |
| **Retargeting Pixels** | **P1** | Injectable Meta & Google tags on public guest invite landing pages. |
| **CRM Webhooks** | **P1** | Push event capabilities to sync directly to external CRMs (HubSpot). |
| **Funnel Dashboards** | **P2** | Cost-per-physical-visit metric tracking integrations. |

### 3.2 Resident Mobile Mastery
| Feature | Priority | Specifics |
| :--- | :--- | :--- |
| **One-Tap Share** | **P0** | Instant deep-link pass generation into native share sheets. |
| **Live Gate Alerts** | **P0** | WebSockets/APN push combinations immediately notifying the host. |
| **Resident Watchlist** | **P2** | Allowing residents to flag specific historical visitors from returning. |

### 3.3 Autonomous Engineering Governance
| Feature | Priority | Specifics |
| :--- | :--- | :--- |
| **Design Strictness** | **P0** | Zero raw CSS/Hex usage; 100% adherence to defined generic UI tokens. |
| **Tenant Isolation** | **P0** | Automated verification ensuring `organizationId` scoping is explicitly assigned to every Prisma mutating query. |
| **Query Optimization** | **P2** | N+1 query detection integration on PR pipelines. |

---

## 4. Technical Constants & Boundary Constraints

1. **Absolute Data Isolation (Multi-Tenancy)**  
   Every single Prisma query must fundamentally append `organizationId: claims.orgId` without exception.
2. **Offline Source of Truth**  
   The `scanUuid` generated structurally on the offline scanner application is the unchangeable source of truth handling synchronization deduplications.
3. **i18n & RTL Adherence**  
   GateFlow specifically targets MENA regions. All newly written flexbox, margin, and padding classes must utilize logical properties (`ms-`, `me-`, `-right`/`-left` depending on `dir="rtl"`) to ensure the Arabic UI flows perfectly.
4. **Security by Design**  
   Zero trust logic. Cryptographic HMAC-SHA256 checking occurs irrespective of network status.

---

*This document serves as the absolute source of truth for all current implementations and immediate roadmapped tasks across the GateFlow repository.*
