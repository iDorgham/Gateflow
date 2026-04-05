# CRM Scope — GateFlow Lead CRM vs Client CRM

**Context:** Two distinct CRM systems exist in the GateFlow platform. This document defines their boundaries.

---

## CRM 1: GateFlow Lead CRM (Admin Dashboard — Phase 2)

**Owner:** GateFlow Sales & Marketing team  
**App:** `apps/admin-dashboard`  
**Purpose:** Track companies/operators who are evaluating or buying GateFlow subscriptions.

### Who are the "leads"?

People or companies visiting `www.gateflow.site` who:

- Fill out the contact/demo form
- Respond to a landing page CTA
- Are identified by GateFlow Sales during outreach

### Data Model

```
Lead → belongs to GateFlow (no organizationId — global)
  ├── encryptedEmail
  ├── encryptedPhone
  ├── companyName
  ├── orgTypeFit (which org type are they likely — REAL_ESTATE, SCHOOL, etc.)
  ├── region (SA, UAE, EG, other MENA)
  ├── source (landing_page_a, website_contact, outbound, referral)
  ├── score (0-100, AI-generated)
  ├── consentGiven (Boolean)
  └── status (NEW → CONTACTED → QUALIFIED → NEGOTIATION → CLOSED_WON/LOST)
```

### Accessed By

| Role            | Access            |
| :-------------- | :---------------- |
| `SALES_REP`     | Own leads only    |
| `SALES_MANAGER` | All leads + deals |
| `SUPER_ADMIN`   | Full              |
| Others          | None              |

---

## CRM 2: Client CRM (Client Dashboard — Future Phase)

**Owner:** Each client organization's admin  
**App:** `apps/client-dashboard`  
**Purpose:** Each GateFlow client tracks their OWN business contacts within their org.

### Who are the "contacts" per org type?

| Org Type          | "CRM" equivalent                     |
| :---------------- | :----------------------------------- |
| `REAL_ESTATE`     | Prospective tenants, property buyers |
| `SCHOOL`          | Prospective student families         |
| `CLUB`            | Prospective membership applicants    |
| `NIGHTCLUB`       | VIP guest list inquiries             |
| `EVENT_ORGANISER` | Prospective event sponsors/guests    |

### Data Model

```
Contact → belongs to Organization (organizationId required)
  ├── name
  ├── email (optional)
  ├── phone (optional)
  ├── status (org-type specific labels)
  ├── notes
  └── createdAt / deletedAt
```

### Plan Reference

- **Defined in:** `org_types_dashboard` plan, Phase 5 (Contextual Modules)
- **Not covered in:** `platform_evolution` plan

---

## Key Boundary

| Concern            | GateFlow CRM             | Client CRM              |
| :----------------- | :----------------------- | :---------------------- |
| **App**            | `admin-dashboard`        | `client-dashboard`      |
| **Team**           | GateFlow Sales           | Client's own team       |
| **Leads source**   | `gateflow.site` visitors | Org-specific inquiries  |
| **AI scoring**     | Yes (Phase 2)            | TBD (future)            |
| **PII encryption** | Required (Phase 2)       | Required (future phase) |
| **RBAC**           | GateFlow roles           | Client org roles        |
