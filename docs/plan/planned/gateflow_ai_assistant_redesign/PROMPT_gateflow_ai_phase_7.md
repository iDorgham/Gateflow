# Pro Prompt: GateFlow AI Redesign Phase 7 — Unified Asset Hub & Integrations

## Goal
Build the "Memory": Unified storage for AI operational files and Google Drive sync.

### Primary role
BACKEND / FRONTEND

### Preferred tool
Cursor

### Context
- **Integration**: Google Drive API (OAuth2).
- **Skills**: `gf-shadcn-composable-patterns`, `gf-data-viz-chat`.
- **Target**: `apps/client-dashboard/src/components/command/AssetHub`

### Scope (in)
- **Asset Hub UI**: A full file-manager interface using `AssetHubModal`.
- **Google Drive Sync**: OAuth login flow and one-click export for any `AiAsset`.
- **Export Connectors**: WhatsApp and Email export triggers.
- **Tag Persistence**: Ensure assets display their associated `AssetTags`.

### Scope (out)
- Final polish (Phase 8).

### Steps
1. Complete the `AssetHubModal` with grid views and data tables (Skill: `gf-ads-data-density`).
2. Implement the G-Drive OAuth flow and token storage.
3. Build the "Export" Server Actions for cloud storage.
4. Verify Recharts visualizations inside the hub (Skill: `gf-data-viz-chat`).

### Acceptance criteria
- [ ] User can successfully export an AI report to Google Drive.
- [ ] Asset hub displays tags correctly.
- [ ] File access is restricted by `organizationId`.
