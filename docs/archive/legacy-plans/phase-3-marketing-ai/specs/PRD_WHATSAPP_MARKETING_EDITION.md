# GateFlow: Omni-Channel Marketing & Visitor Access PRD

## 1. Executive Summary
GateFlow is evolving from a pure security/access management system into a **Marketing-First Access Platform**. By leveraging high-intent scan data and omni-channel delivery, GateFlow acts as the infrastructure backbone for **Real Estate Brokerages** and marketing-heavy organizations to turn gate visits into actionable leads and retargeting opportunities.

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

## 4. Marketing Integration Suite (Admin Dashboard)

To serve as a backbone for real estate marketing, the Admin Dashboard will provide a centralized "Marketing & Attribution" command center.

### 4.1 Script & Pixel Management
Administrators can configure the following IDs at the Project/Organization level:
- **Google Tag Manager (GTM)**: Primary container for all tracking scripts.
- **Google Analytics 4 (GA4)**: Granular visitor behavior and conversion tracking.
- **Meta (Facebook) Pixel**: High-fidelity retargeting for property/venue visitors.
- **Google Services**: Integration points for Google Search Console and Ads conversion tracking.

### 4.2 Technical Script Injection
- The system will dynamically inject the relevant tracking snippets into the head/body of the **Visitor Landing Pages** based on the project's configuration.
- **Privacy Compliance**: Built-in support for consent banners to ensure GDPR/CCPA compliance for tracking pixels.

### 4.3 Advanced UTM & Attribution Tracking
- **UTM Persistence**: The system will automatically capture and persist standard UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, etc.) from the delivery link to the landing page session.
- **Conversion Profiling**: Every gate scan will be attributed to its original marketing source in the Audit Logs, allowing brokers to see which campaigns are driving physical traffic.

---

## 5. Real Estate Brokerage Use Case

GateFlow is uniquely positioned for real estate brokerages to:
- **Profile Open-House Visitors**: Automatically capture visitor data via QR links sent during invite/RSVP.
- **Remarket Properties**: Use Meta Pixels to show similar property ads to visitors who recently scanned in at a specific project.
- **Broker Attribution**: Track which agents or campaigns are successfully getting visitors to the site via UTM tagging.

---

## 6. Technical Requirements

### 6.1 Link Infrastructure
- **Short-link Service**: Implementation of a URL shortener in `apps/api` to generate compact, brandable URLs.
- **Dynamic QR Landing Page**: A new public route in `apps/client-dashboard` (e.g., `/[locale]/access/[token]`) designed specifically for mobile display.

### 6.2 Delivery Integration
- **Direct Share**: Utility to open native WhatsApp/Email apps with pre-filled, UTM-tagged links.
- **Mobile Contact Picker**: Native Address Book integration (iOS/Android) for the Resident/Mobile apps.

### 6.3 Tracking & Analytics
- **Visitor Logs**: Extending the `Scan` model to track link-opens vs. actual gate-scans.
- **Marketing Suite Settings**: New database fields for Pixel/GTM/GA4 IDs.

---

## 7. Roadmap & Priority

| Phase | Feature | Status |
|-------|---------|--------|
| **Current** | Core Security & Dashboard | **Delivered** |
| **P0** | QR Link Landing Page | To Do |
| **P0** | WhatsApp/Email Direct Share | To Do |
| **P1** | Marketing Integration Suite (GTM/Pixel) | To Do |
| **P1** | Mobile Contact Picker (Native) | To Do |
| **P1** | Visitor Tracking & UTM Persistence | To Do |
| **P2** | Meta/Google Integration UI | To Do |
| **P2** | SMS Integration (Twilio/AWS) | To Do |
| **P3** | Automation Bridge (Webhook/Zapier) | To Do |
