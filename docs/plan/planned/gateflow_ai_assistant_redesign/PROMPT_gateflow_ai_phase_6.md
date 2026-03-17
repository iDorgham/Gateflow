# Pro Prompt: GateFlow AI Redesign Phase 6 — Smart Tagging Implementation

## Goal
Elevate Tagging to a first-class citizen: Implement UI for tags, AI auto-tagging, and global filtering.

### Primary role
FRONTEND / BACKEND-AI

### Preferred tool
Cursor

### Context
- **Visual Standards**: [ADS Lozenge](https://atlassian.design/components/lozenge/examples)
- **AI Intelligence**: Gemini 1.5 Flash.
- **Skills**: `gf-gemini-implementation`, `gf-ads-accessibility-rtl`.

### Scope (in)
- **Tag UI**: Integrate `TagInput` and `TagLozenge` (Phase 2) into Chats and Assets.
- **AI Auto-Tagging**: Implement backend logic where Gemini suggests tags based on conversation context.
- **Tag Filtering**: Power the `TagFilterBar` to filter folders and asset hub by selected tags.
- **ADS Compliance**: Tags must map to ADS Lozenge colors (Standard, Success, Warning, Error).

### Scope (out)
- Drive integration (Phase 7).

### Steps
1. Implement the `ChatTag` and `AssetTag` association logic in Server Actions.
2. Build the Gemini "Auto-Tagger" service.
3. Integrate the `TagFilterBar` into the `CommandShell` sidebar and `AssetHubModal`.
4. Peer review visual styles against Atlassian Lozenges.

### Acceptance criteria
- [ ] Tagging is strictly scoped to `organizationId`.
- [ ] AI suggests contextually accurate tags (e.g., #Incident for high alerts).
- [ ] Lozenge components pass ADS visual audit.
