# Pro Prompt: GateFlow AI Redesign Phase 5 — Predictive Alerting System

## Goal
Give GateFlow Command its "Reflexes": Implement the real-time anomaly feed and visual alerting stream.

### Primary role
BACKEND-API / FRONTEND

### Preferred tool
Cursor

### Context
- **Real-time**: SSE (Server-Sent Events).
- **Guidelines**: [ADS Data Density](https://atlassian.design/foundations/design-tokens/data-density)
- **Skills**: `gf-nextjs-speed-core`, `gf-ads-data-density`, `gf-safety-interaction`.

### Scope (in)
- **SSE Extension**: Add `PREDICTIVE_ALERT` event types to the main operations event stream.
- **PredictiveStream Component**: A vertical, real-time feed in the Command sidebar showing anomalies.
- **Visual Reflexes**: Hook `AlertBadge` (from Phase 2) to incoming SSE events with pulsing effects.
- **Mobile Prep**: Ensure the alert stream layout is dense but readable on tablet views.

### Scope (out)
- Tagging logic (Phase 6).
- Google Drive OAuth (Phase 7).

### Steps
1. Update the `AnomalyDetectionEngine` (Phase 1) to emit events via SSE.
2. Implement the `PredictiveStream` in the `CommandShell` sidebar.
3. Use `AlertBadge` to visually flag gates or units with anomalous activity.
4. Ensure real-time feed has a fixed height and maintains high performance (Skill: `gf-nextjs-speed-core`).

### Acceptance criteria
- [ ] Alerts appear in the feed <500ms after backend detection.
- [ ] Badges pulse according to severity (Warning/Danger tokens).
- [ ] 60fps scrolling in the alert feed.
