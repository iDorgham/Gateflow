# Pro Prompt: GateFlow AI Redesign Phase 8 — Polish, Audit & Performance

## Goal
Finalize the experience: RTL perfection, performance hardening, and legacy code removal.

### Primary role
FRONTEND / QA

### Preferred tool
Cursor

### Context
- **Constraint**: Production-ready stability for GateFlow v8.1.
- **Skills**: `gf-ads-accessibility-rtl`, `gf-nextjs-speed-core`.

### Scope (in)
- **RTL Audit**: Side-by-side audit of the Command cinematic shell in Arabic vs English.
- **Performance Hardening**: Ensure SSE streams and framer-motion transitions don't lag main-thread scans.
- **Cleanup**: Delete legacy GateAI chat components in `apps/client-dashboard`.
- **Documentation**: Finalize `PRD_v8.1.md` reflecting the new Command pillars.

### Scope (out)
- New feature requests.

### Steps
1. Run a full visual audit of the `TagLozenge` and `MissionFolderTree` in RTL mode.
2. Optimize Vercel AI SDK streaming performance (Skill: `gf-nextjs-speed-core`).
3. Delete files in `components/ai/` that are now replaced by `components/command/`.
4. Final verification of all success metrics defined in `IDEA_gateai.md`.

### Acceptance criteria
- [ ] Zero visual defects in RTL/Dark Mode.
- [ ] Page load speed (LCP) and interaction latency meet v8.1 standards.
- [ ] Clean filesystem (no legacy GateAI fragments).
