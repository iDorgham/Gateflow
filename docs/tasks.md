# GateFlow — Task Tracking & Feature Inventory

This document tracks unfinished tasks and a complete feature inventory across the GateFlow ecosystem.

---

## 🛠️ Unfinished Tasks

### 🏢 Client Dashboard (`apps/client-dashboard`)

#### 🖥️ Client Frontend

- [ ] Implement advanced analytics charts for cost-per-visit (CPV).
- [ ] Add bulk import for residents via CSV/Excel.
- [ ] Refine the interactive map for multi-project overview.

#### ⚙️ Client Backend

- [ ] Implement rate limiting for public-facing guest invite links.
- [ ] Optimize the `ScanLog` aggregation query for large datasets.
- [ ] Add webhook support for 3rd-party CRM integrations.

---

### 🛡️ Admin Dashboard (`apps/admin-dashboard`)

#### 🖥️ Admin Frontend

- [x] Finalize the dark mode contrast pass and alignment with Client Dashboard aesthetics.
- [x] Refine the Admin AI UI/UX with premium animations and hybrid message parts.
- [ ] Implement the organization-level usage quota visualization.
- [x] Add a global search for projects and users across the platform (placeholder).

#### ⚙️ Admin Backend

- [ ] Harden the `ADMIN_ACCESS_KEY` validation logic.
- [ ] Implement automated backups for the organization configuration.
- [ ] Refine the multi-tenant isolation middleware performance.

- [x] **Admin Dashboard Redesign** — Alignment with Client Dashboard aesthetics (Radius, Tokens, Shell, Sidebar).

---

### 🤳 Scanner App (`apps/scanner-app`)

#### 🖥️ Scanner Frontend

- [ ] Add haptic feedback for successful and failed scans.
- [ ] Implement a low-light "Torch" toggle in the camera view.
- [ ] Refine the offline sync status indicator.

#### ⚙️ Scanner Backend

- [ ] Optimize the offline HMAC signature rotation queue.
- [ ] Implement background sync for scan logs while the app is in the background.

---

### 📱 Resident Mobile (`apps/resident-mobile`)

#### 🖥️ Mobile Frontend

- [ ] Add a "Quick Pass" widget for iOS and Android home screens.
- [ ] Implement real-time push notification history view.
- [ ] Refine the WhatsApp sharing template UI.

#### ⚙️ Mobile Backend

- [ ] Integrate with the localized WhatsApp Business API for MENA.
- [ ] Implement biometric session persistence across app restarts.

---

### 🌐 Resident Portal (`apps/resident-portal`)

#### 🖥️ Portal Frontend

- [ ] Implement the responsive multi-column layout for desktop.
- [ ] Add a visitor history timeline with filtering.
- [ ] Refine the loading skeletons for slow connections.

#### ⚙️ Portal Backend

- [ ] Optimize the pass creation API for low-latency web access.
- [ ] Implement session hijacking protection for web residents.

---

### 📣 Marketing Website (`apps/marketing`)

#### 🖥️ Marketing Frontend

- [ ] Add the interactive "Pricing Calculator" for enterprise deals.
- [ ] Finalize the "Resilience" campaign landing page.
- [ ] Optimize the mega-menu for mobile devices.

#### ⚙️ Marketing Backend

- [ ] Integrate with the internal CRM for automated lead scoring.
- [ ] Implement server-side tracking for UTM attribution.

---

## ✨ Feature Inventory

### 🏢 Client Dashboard

- **CRM Hub**: Full resident and unit management.
- **Analytics Hub**: Physical-to-digital attribution tracking.
- **Project Gallery**: HQ asset management for property listings.
- **RBAC**: Fine-grained role-based access control.

### 🛡️ Admin Dashboard

- **Organization Management**: Multi-tenant infrastructure control.
- **Emulation Hub**: Platform-wide traffic and seeding simulation.
- **Admin AI**: Refined premium assistant with hybrid UI and tool-calling visualization.
- **Security Hub**: Global key rotation and audit logs.

### 🤳 Scanner App

- **High-Speed OCR**: Instant government ID scanning.
- **Offline HMAC**: Zero-latency verification without internet.
- **Watchlist Alerts**: Real-time security notifications for flagged guests.

### 📱 Resident Mobile

- **One-Tap Invite**: Instant WhatsApp/SMS pass sharing.
- **GateAI Assistant**: Natural language guest management.
- **Biometric Lock**: Secure access via FaceID/TouchID.

### 🌐 Resident Portal

- **Desktop Management**: Full guest logs controllable via web.
- **Service Requests**: Direct communication with property management.

### 📣 Marketing Website

- **Attribution Engine**: Capturing the source of every physical visit.
- **Solution Verticals**: Tailored landing pages for different industries.

---

<div align="center">
  <sub>Updated automatically by the <b>Ralph Loop</b>.</sub>
</div>
