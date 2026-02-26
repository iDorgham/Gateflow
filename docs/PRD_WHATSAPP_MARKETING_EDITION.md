# GateFlow: Omni-Channel Marketing & Visitor Access PRD

## 1. Executive Summary
GateFlow is evolving from a pure security/access management system into a **Marketing-First Access Platform**. By leveraging high-intent scan data and WhatsApp-based delivery, GateFlow allows organizations to turn gate visits into actionable marketing opportunities.

## 2. Platform Status (Updated February 26, 2026)
As of the current sprint, the platform has achieved **98% MVP completion**.

### Delivered Core Features:
- **Multi-Tenant Architecture**: Robust project switching and isolation.
- **Advanced Dashboard**: Real-time analytics with Recharts (Line, Pie, Heatmaps).
- **Security Hardened**: Argon2id hashing, JWT/RBAC, and supervisor override.
- **Dynamic Localization**: Full English/Arabic RTL support across dashboards and settings.

---

## 3. The New Vision: Omni-Channel Marketing

### 3.1 Concept: "QR as a Link"
Instead of sending a static QR image, GateFlow generates unique, trackable **Visitor Access Links** delivered via WhatsApp, Email, or SMS.

### 3.2 Delivery Channels & Workflows
#### A) WhatsApp (Primary)
- **Workflow**: Staff/Resident selects a contact -> System generates link -> Direct share to WhatsApp.
- **Value**: High engagement, instant delivery.

#### B) Email (Direct/Marketing)
- **Workflow**: System sends a branded email template with the access link.
- **Value**: Supports longer-form marketing content, rich media, and traditional UTM tracking.

#### C) SMS (Transactional)
- **Workflow**: Automated SMS delivery for high-priority or offline-capable access.
- **Value**: 98% open rates; essential for visitors without data plans.

### 3.3 Native Mobile Integration (Resident & Mobile App)
- **Contact Picker**: The Mobile App and Resident Portal must integrate with native OS Contact APIs (iOS/Android) to allow users to quickly select phone numbers or emails from their address book.
- **Native Sharing**: Leverage native share sheets to cross-post access links across any installed communication app.

### 3.4 Marketing Capture & Tracking
- **Visitor Landing Page**: Mobile-optimized page hosting the dynamic QR.
- **Capture**: Logs device fingerprint, captures intent, and supports Meta/Google pixels for remarketing.
- **CRM Loop**: Feedback loop into the CRM when a link is opened vs. scanned.

---

## 4. Technical Requirements

### 4.1 Link Infrastructure
- **Short-link Service**: Implementation of a URL shortener in `apps/api` to generate compact, brandable URLs.
- **Dynamic QR Landing Page**: A new public route in `apps/client-dashboard` (e.g., `/[locale]/access/[token]`) designed specifically for mobile display.

### 4.2 WhatsApp Integration
- **Direct Link Sharing**: Initial MVP feature allowing staff to "Send via WhatsApp" which opens the WhatsApp app with a pre-filled link.
- **API Automation**: Future integration with WhatsApp Business API (Twilio or specialized providers) for automated delivery from the server.

### 4.3 Tracking & Analytics
- **Visitor Logs**: Extending the `Scan` model to track link-opens vs. actual gate-scans.
- **Tracking Pixel Support**: Workspace-level settings to input Meta Pixel IDs, which would be injected into guest landing pages.

---

## 5. Roadmap & Priority

| Phase | Feature | Status |
|-------|---------|--------|
| **Current** | Core Security & Dashboard | **Delivered** |
| **P0** | QR Link Landing Page | To Do |
| **P0** | WhatsApp/Email Direct Share | To Do |
| **P1** | Mobile Contact Picker (Native) | To Do |
| **P1** | Visitor Tracking (Open/Scan) | To Do |
| **P2** | Meta/Google Pixel Integration | To Do |
| **P2** | SMS Integration (Twilio/AWS) | To Do |
| **P3** | Automation Bridge (Webhook/Zapier) | To Do |
