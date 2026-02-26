# GateFlow: Comprehensive PRD (Marketing & WhatsApp Edition)

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

## 3. The New Vision: WhatsApp-Driven Marketing

### 3.1 Concept: "QR as a Link"
Instead of sending a static QR image that is "blind" to tracking, GateFlow will generate unique, trackable **Visitor Access Links**.

### 3.2 User Workflow
1. **Admin Generation**: Staff generates an access request for a visitor via the Client Dashboard.
2. **WhatsApp Delivery**: The system automatically sends a pre-configured WhatsApp message containing a unique link (e.g., `gate.flow/v/xyz789`).
3. **Visitor Landing Page**:
   - Visitor clicks the link and arrives at a mobile-optimized landing page.
   - The landing page displays the active QR code for the gate.
   - **Marketing Capture**: The system logs the visit, captures device info, and supports Meta/Google tracking pixels.
4. **Gate Access**: The visitor scans the QR from their phone screen at the gate.

### 3.3 Marketing Value Proposition
- **High-Intent Lead Capture**: Anyone opening the QR link is physically present at the venue, representing a high-value lead.
- **Retargeting Integration**: Support for Facebook/Meta pixels on the landing page allows for immediate retargeting for on-site offers.
- **CRM Integration**: Linking gate scans to WhatsApp profiles for personalized follow-up (e.g., "Thank you for visiting! Here is 10% off your next session").

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
| **P0** | WhatsApp Share Utility | To Do |
| **P1** | Visitor Link Tracking | To Do |
| **P2** | Meta Pixel Integration | To Do |
| **P3** | WhatsApp API Automation | To Do |
