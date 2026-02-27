# Stitch UI Specification: Visitor Journey Attribution

This document describes the user interface for **Stitch**, the marketing and identity attribution suite for GateFlow. Stitch "stitches" together digital interactions (invites and link opens) with physical access events (gate scans) to provide a complete visitor journey.

## 1. Core Component: The Stitched Journey Timeline

The central UI element for Stitch is the **Journey Timeline**, displayed within the Visitor Detail or Scan Detail views.

### UI Description:
- **Timeline Rail:** A vertical, dotted line connecting key moments.
- **Milestone Nodes:** Colored icons representing different interaction types:
  - 🟢 **Origin (P0):** "Invite Generated & Shared" (WhatsApp, SMS, or Email icon).
  - 🔵 **Interaction (P1):** "Access Link Opened" (Globe icon). Includes device fingerprint, browser, and location data.
  - 🔴 **Event (P2):** "Gate Scan Success" (Shield icon). Link to the specific gate and operator.
- **Metadata Cards:** Each milestone has a card showing:
  - **Timestamp:** Exact date and time.
  - **Duration:** Time elapsed since the previous milestone (e.g., "5 hours after invite").
  - **Attribution Source:** UTM parameters (`source`, `medium`, `campaign`).

## 2. Admin Interface: Stitch Integration Settings

Located in **Settings > Integrations > Stitch**, this UI allows administrators to manage the stitching engine.

### UI Description:
- **Connection Status:** Badge showing active connection to `stitch.googleapis.com`.
- **API Health:** Indicator for the Google Stitcher API status.
- **Attribution Window:** A slider to define how long an invite link remains valid for "stitching" to a scan (e.g., 24h, 48h, 7 days).
- **Pixel/GTM Injection Toggle:** Switch to enable/disable automatic script injection on visitor landing pages.

## 3. Marketing Dashboard: Stitch Analytics

A high-level view of how well the "stitching" is working across projects.

### UI Description:
- **Converstion Funnel:**
  1. Invites Sent (Total Stitch Origins)
  2. Links Opened (Engagement Rate)
  3. Gate Scans (Fulfillment Rate)
- **Top Sources Chart:** A bar chart showing which channels (WhatsApp vs. SMS vs. Email) have the highest "Stitch Score" (conversion from invite to physical check-in).
- **Heatmap:** Correlation between link open times and physical scan times.

## 4. Technical Integration (Context)
- **Engine:** Google Cloud Video Stitcher / Identity Stitcher.
- **Metadata:** Persistent UTM parameters stored in the `Scan` and `VisitorQR` models.
- **Pixel:** Dynamically injected via `apps/client-dashboard` visitor route.
