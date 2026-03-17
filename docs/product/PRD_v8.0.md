# GateFlow — Product Requirements Document v8.0

**Product Name:** GateFlow  
**Version:** 8.0  
**Status:** MVP 100% Complete | Phase 3 (Marketing Suite + Resident Mobile v2) In Progress
**Roadmap Focus:** Autonomous Engineering, Marketing Attribution, and Resident Experience Excellence.

---

## 1. Executive Summary

GateFlow v8.0 marks the transition from building core infrastructure to optimizing for **Growth** and **Resident Autonomy**. The platform is now a self-evolving ecosystem where the "Ralph Loop" ensures high engineering standards while we build world-class marketing and resident features.

### Core Strategic Pillars for v8.0
1. **The Ralph Loop (Autonomous Engineering):** Real-time enforcement of design, security, and performance standards via AI agents.
2. **Marketing & Sales Suite:** Closing the loop between digital marketing spend and physical gate visits using UTM attribution and CRM integrations.
3. **Resident Mobile v2:** A complete native mobile experience for residents, focusing on one-tap sharing and instant notifications.
4. **Enterprise Scale:** Enhanced multi-tenant isolation, advanced analytics, and global surveillance integration.

---

## 2. Updated Roadmap (Phase 3)

### 3.1 Marketing Suite (apps/client-dashboard)
| Feature | Priority | Description |
|---------|----------|-------------|
| **UTM Attribution** | P0 | Track which digital campaigns drive specific visitor arrivals. |
| **Pixel Integration** | P1 | Support for Meta/Google pixels on visitor landing pages. |
| **CRM Webhooks v2** | P1 | Deep integration with external CRMs (Salesforce, HubSpot). |
| **Marketing Dashboard** | P1 | KPI tracking for cost-per-physical-visit. |

### 3.2 Resident Mobile v2 (apps/resident-mobile)
| Feature | Priority | Description |
|---------|----------|-------------|
| **One-Tap Share** | P0 | Instant WhatsApp/Email sharing of generated QR codes. |
| **Arrival Push** | P0 | Real-time native notifications when a guest scans at the gate. |
| **Unit Quota Widget** | P1 | Visual tracker for monthly visitor quotas. |
| **Resident Watchlist** | P2 | Ability for residents to flag specific recurring visitors. |

### 3.3 Autonomous Engineering (The Ralph Loop)
| Feature | Priority | Description |
|---------|----------|-------------|
| **Design Enforcer** | P0 | Zero raw hex values; 100% Atlassian Design System token compliance. |
| **Security Enforcer** | P0 | Automated verification of `organizationId` scoping on all new API routes. |
| **Performance Guard** | P1 | Automated detection of N+1 Prisma queries in build pipeline. |

---

## 3. Product Status Dashboard

| App | Status | Focus for v8.0 |
|-----|--------|----------------|
| **Admin Dashboard** | ✅ 100% | Maintenance & Autonomy |
| **Client Dashboard** | 🔄 95% | Marketing Suite |
| **Scanner App** | ✅ 100% | Performance Stability |
| **Marketing Website** | 🔄 90% | Case Studies & Docs |
| **Resident Portal** | ✅ 95% | Sync with Mobile v2 |
| **Resident Mobile** | 🔄 60% | Rapid Feature Implementation |

---

## 4. Technical Constraints & Security

- **Multi-Tenancy:** 100% isolation via `organizationId` enforced by Ralph.
- **Offline Sync:** Scanner app `scanUuid` contract remains the source of truth for deduplication.
- **RTL/i18n:** Every new feature must support English and Arabic with perfect RTL layout.

---

*For detailed technical specs of past versions, see `docs/archive/legacy/PRD_v7.0.md`.*
