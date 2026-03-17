# GateFlow — Comprehensive Product Roadmap v8.0

**Product Name:** GateFlow  
**Version:** 8.0 (Full Edition)  
**Status:** MVP 100% | Phase 3 (Growth & Autonomy)  
**Vision:** Stripe-level infrastructure for physical access control with marketing-first intelligence and resident self-service excellence.

---

## 1. The 6-App Ecosystem Structure

### 1.1 Admin Dashboard (`apps/admin-dashboard`)
*Super-admin platform management.*
- **Layout:** Sidebar Navigation + Top Header + Breadcrumbs + Resizable Content Area.
- **Pages/Structure:**
    - `/organizations`: Multi-tenant management, billing status, project quotas.
    - `/projects`: Global view of all created gates and campaigns.
    - `/scans`: Master real-time scan feed across all customers.
    - `/users`: Platform-level user management (Operators, Admins, Super-Admins).
    - `/audit-logs`: System-wide event tracking and incident reports.
    - `/finance`: Billing cycles, subscription tiers, and usage analytics.
    - `/tools`: System doctor, cache clearing, and database maintenance scripts.

### 1.2 Client Dashboard (`apps/client-dashboard`)
*The primary SaaS portal for property/event managers.*
- **Layout:** High-density Atlassian Design System (ADS) Dashboard.
- **Pages/Structure:**
    - `/dashboard`: Real-time KPI cards (Today's Scans, Guest Volume, Active Gates).
    - `/qr`: Management of QR codes (Active, Expired, Revoked).
    - `/scans`: Filterable table of all arrivals with identity verification status.
    - `/marketing`: UTM attribution dashboard, Pixel settings, CRM webhook config.
    - `/team`: RBAC-based user management for the organization.

### 1.3 Scanner App (`apps/scanner-app`)
*Native mobile app for security guards (Expo SDK 54).*
- **Layout:** High-contrast Utility UI (Optimized for field use and direct sunlight).
- **Functions:**
    - **QR Verification:** Cryptographically secure HMAC-SHA256 signature checking.
    - **Offline Queue:** AES-256 encrypted local buffer for sync when internet is absent.
    - **Sound/Haptics:** Positive/Negative feedback for scan results.
    - **Identity Capture:** 3-level capture (None, Photo, ID Document).

### 1.4 Resident Portal (`apps/resident-portal`)
*Web-based self-service for property residents.*
- **Layout:** Minimalist, Mobile-responsive Card-based UI.
- **Pages/Structure:**
    - `/visitors`: Create/Manage guest passes.
    - `/history`: View who visited the resident's unit.
    - `/open-qr`: Permanent access codes for family/close staff.
    - `/profile`: Digital ID and vehicle registration.

### 1.5 Resident Mobile (`apps/resident-mobile`)
*Native iOS/Android app for residents (Expo Router).*
- **Layout:** Modern Consumer App (Framer Motion animations, Tab Navigation).
- **Screens:**
    - `(tabs)/qrs`: Quick creation and sharing of visitor codes.
    - `(tabs)/history`: Real-time arrival notifications (Push).
    - `(tabs)/ai`: Concierge AI assistant for guest management.
    - `contact-picker`: Native integration for rapid guest invite.

### 1.6 Marketing Website (`apps/marketing`)
*Public-facing site and lead generation.*
- **Layout:** Premium SaaS Landing Page (Glassmorphism, Gradient animations).
- **Pages:**
    - `/features`: Interactive feature breakdown.
    - `/pricing`: Subscription tiers and calculators.
    - `/solutions`: Industry-specific vertical pages (Communities, Events, Nightlife).

---

## 2. Core Platform Functions

### 2.1 Access Logic
- **Single QR:** One-time use, timestamp constrained.
- **Recurring QR:** Valid on specific days/times (e.g., Maid service).
- **Permanent QR:** Fixed keys for staff or family.
- **Open QR:** Socially shareable permanent links for VIP residents.

### 2.2 Security Contracts
- **Multi-Tenancy:** 100% data isolation; `organizationId` enforced at the Prisma level.
- **Soft Deletes:** `deletedAt: null` filtering on all tenant queries.
- **QR Integrity:** Signatures generated with `HMAC-SHA256` using a per-org secret.
- **Deduplication:** `scanUuid` invariant prevents double-scanning or replay attacks.

### 2.3 Marketing Intelligence
- **UTM Tracking:** Captures digital source parameters on visitor registration.
- **Pixels:** Injectable Meta/Google pixels on guest landing pages for retargeting.
- **CRM Webhooks:** Automated lead/visit sync to HubSpot/Salesforce.

---

## 3. Skills and Tools Reference

### 3.1 Antigravity Skills
Detailed in `docs/guides/ANTIGRAVITY_SKILLS.md`:
- `gf-dev`: Daily orchestration.
- `gf-security`: RBAC & Crypto audits.
- `gf-i18n`: Perfect RTL/Arabic support.
- `gf-creative-ui-animation`: Premium transitions.

### 3.2 Professional Tools
- **Cursor IDE:** Primary visual/component development.
- **Claude CLI:** High-fidelity code review and security audits.
- **Gemini CLI (Antigravity):** High-speed architecture and DB mapping.
- **Ralph Loop:** Automated design and security enforcement.

---

## 4. Design Foundations (ADS)

- **Palette:** Midnight Blue (#020035), Anti-Flash White (#F2F3F4), Kimchi (#ED4B00 - Primary Accent).
- **Typography:** Inter Font family; inclusive of Arabic script.
- **Grid:** 4pt base; 12-column layouts; mobile-first responsiveness.
