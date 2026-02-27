# Comprehensive Client Dashboard Refactor Prompt (2026 Edition)

You are a Senior Product Engineer and UI/UX Specialist specializing in Enterprise B2B SaaS dashboards. Perform a complete high-fidelity refactor of the **GateFlow Client Dashboard (apps/client-dashboard)**. This dashboard is the secondary core of the GateFlow ecosystem, designed for Property Managers, Security Heads, and Event Organizers in the MENA region.

## CONTEXT & TECH STACK
- **Core Apps:** Client Dashboard targeting gated compounds, schools, and marinas.
- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **UI System:** @gate-access/ui (shadcn/ui based), Lucide icons, Framer Motion for micro-interactions.
- **i18n:** @gate-access/i18n (Arabic Egypt RTL + English LTR).
- **Aesthetic:** "Glassmorphism Premium" — Dark mode first, vibrant accents (Primary: #2563eb Blue), subtle gradients, and high contrast for operator readability.

---

## 1. DESIGN SYSTEM & i18n FOUNDATION
- **Token-First:** Use CSS variables for all colors, spacing, and radius. Zero hardcoded hex values.
- **Responsive Layout:** Side navigation (collapsible) + top header (Breadcrumbs + Project Switcher + User Profile).
- **RTL Support:** Automatic layout flipping using Tailwind logical properties. Specific font subsetting for Arabic (IBM Plex Sans Arabic).
- **Micro-Animations:** Skeleton loaders for all data-fetching states, smooth transitions between dashboard tabs.

---

## 2. MAIN DASHBOARD OVERVIEW (Home)
- **Key Metrics Grid:** 4-column layout for "Total Scans Today", "Active QR Codes", "Gates Online", "Blocked Access Attempts".
- **Live Feed Component:** Real-time stream of incoming scans with status indicators (Success, Failure, Warning).
- **Usage Trends:** Recharts-based area chart showing scan volume over the last 7 days.
- **Quick Actions:** Floating or prominent buttons for "Create QR", "Register Resident", "Add Gate".

---

## 3. CORE MANAGEMENT MODULES

### QR Code Management
- **List View:** Advanced data table with search, status filtering (Active, Expired, Revoked), and batch actions.
- **Single Creation:** Multi-step form or dialog with duration controls (One-time, Date Range, Recurring). 
- **Bulk CSV Import:** Robust upload flow with field mapping, validation preview, and background processing status.
- **QR Preview:** Interactive modal showing the QR code with "Print", "Share to WhatsApp", and "Download" options.

### Gate Management
- **Status Grid:** Card-based view showing every physical gate's health (Latency, OS Version, Last Heartbeat).
- **Live pulse indicator:** Visual representation of gate activity.
- **Control Center:** Remote unlock (supervisor only), configuration updates, and log extraction.

### Residents & Units
- **Unit Management:** Tree view or grouped list of buildings and units.
- **Resident Onboarding:** Invite-based flow for residents to join the Resident Portal.
- **Quota Control:** Visual indicator of visitor QR usage against unit limits.

### Scan Logs & Auditing
- **Infinite Scroll Feed:** Detailed history with high-resolution scan photos (if available).
- **Advanced Filtering:** Filter by Date Range, Gate, Operator, and Result.
- **CSV Export:** One-click export of filtered results for compliance reporting.

---

## 4. THE ULTIMATE SETTINGS SUITE (All 11 Tabs)

Refactor the settings navigation into a high-performance tabbed interface:

1.  **General:** Project branding (Name, Logo, Timezone), basic toggles for system-wide features.
2.  **Profile:** User personal info, avatar upload, password change, and bio.
3.  **Workspace:** Organization-level settings (Domain, Legal Name, Primary Contact).
4.  **Projects:** Multi-project management. Switch between "Compounds" or "Event" contexts with distinct settings.
5.  **Team:** RBAC management. Invite team members, assign predefined roles (Security, Manager, View-only).
6.  **Roles:** Custom permission builder. Granular toggles for every API scope and UI action.
7.  **Notifications:** Multi-channel alerts (Direct, Email, Slack). Configurable triggers for "Gate Offline" or "VIP Arrival".
8.  **Billing:** Subscription overview. Usage bars for QR counts, gate limits, and payment history (Invoices).
9.  **API Keys:** Developer management. Scoped keys with "Generate once" security, usage logs, and expiration dates.
10. **Webhooks:** Endpoint management. Event selector (scan.success, qr.created), secret signing, and 7-day delivery history.
11. **Integrations (The Ecosystem):** 
    - **Stitch:** Marketing attribution suite. Configure Pixel/GTM and view "Visitor Journey" conversion stats.
    - **Third-Party:** Slack, Zapier, Airtable, and Discord connectors.

---

## 5. SECURITY & RELIABILITY
- **Rate Limiting Feedback:** Visual warnings when approaching API limits.
- **Audit Logs:** Immutable record of any setting change or team member action.
- **Session Control:** View active sessions and remote logout capability.

---

## 6. ACCEPTANCE CRITERIA
✅ Clean, zero-error TypeScript implementation.
✅ Full RTL support with zero layout "jumping" on locale switch.
✅ Lighthouse Performance score > 90 on Desktop.
✅ Consistent spacing using logical properties (ps/pe, ms/me).
✅ Accessible components (ARIA labels, keyboard nav) for power users.
