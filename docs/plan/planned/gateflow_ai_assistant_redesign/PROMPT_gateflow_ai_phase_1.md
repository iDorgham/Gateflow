# Pro Prompt: GateFlow AI Redesign Phase 1 — Intelligence & Data Foundation

## Goal
Build the "Brain" of GateFlow Command: Update the data layer to support folders, assets, predictive rules, and the new **Tagging System**.

### Primary role
BACKEND-Database

### Preferred tool
Gemini CLI / Cursor

### Context
- **Design Reference**: [Atlassian Tags/Lozenges](https://atlassian.design/components/lozenge/examples)
- **Rules**: Strict `organizationId` scoping (Skill: `gf-system-invariants`).
- **Target**: `packages/db/prisma/schema.prisma`

### Scope (in)
- **Schema Updates**:
    - `MissionFolder`: Ephemeral workspace containers.
    - `AiAsset`: Permanent storage for AI reports/charts.
    - `AlertRule` & `PredictiveAlert`: Logic and instance storage for anomalies.
    - **Smart Tagging**: Create `Tag`, `ChatTag`, and `AssetTag` models (id, name, color, orgId).
    - `GoogleDriveToken`: OAuth storage for Drive integration.
- **Anomaly Logic**: Implement backend helpers for baseline comparison (rolling 7-day avg vs current).
- **Types**: Sync Zod schemas in `packages/types`.

### Scope (out)
- UI work (Phase 2).
- Google Drive OAuth implementation (logic only in later phases).

### Steps
1. Modify `schema.prisma` with the 7+ new models.
2. Run `pnpm turbo db:push` to sync local dev DB.
3. Update `packages/types` with new Zod schemas for Tags and Folders.
4. Implement `checkAnomaly` utility function to compare current scan traffic.
5. Apply specialized skill: `gf-prisma-performance`.

### Acceptance criteria
- [ ] Database schema successfully updated.
- [ ] Tagging system handles Organization-scoped CRUD.
- [ ] Anomaly detection utility identifies variance > 30% against mock data.
- [ ] Visual reference: https://atlassian.design/ (for Tag data structure/colors).
