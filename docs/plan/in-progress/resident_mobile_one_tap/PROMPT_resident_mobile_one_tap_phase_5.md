# Pro Prompt Template — Phase 5: Refinement - i18n & GateAI Polish

This phase finalizes the MENA localization and adds AI-delegation options for the "One-Tap" flow.

---

## Phase 5: Refinement - i18n & GateAI Polish

### Primary role

i18n | QA | SECURITY | BACKEND-API

### Preferred tool

- [x] Claude CLI — i18n review, audit, logic polish
- [ ] Gemini CLI — i18n analysis
- [ ] OpenCode CLI — i18n refactors

### Context

- **Project**: GateFlow
- **Stack**: Next.js, Expo, Prisma
- **Rules**: RTL; multi-tenant; audit trail; HMAC verification; GateAI roadmap

### Goal

Ensure the "One-Tap" flow is production-ready with perfect Arabic support and intelligent GateAI pre-clearance.

### Scope (in)

- Global audit of translation keys for:
  - Invite messages (SMS/WhatsApp).
  - Share templates.
  - Landing page.
- Feature: Delegate pre-clearance to GateAI.
  - Option to flag `QRCode` for "AI-Auto-Allow" in security rules.
- Regression testing: Verify "One-Tap" scans correctly on physical `scanner-app`.
- Multi-tenant security audit: Ensure No IDOR leaks across organizations.

### Scope (out)

- Redesigning the full resident app (focus on the Share flow).
- New core features not related to invites.

### Steps (ordered)

1. Review all sharing strings in `resident-mobile` and `marketing` apps (English/Arabic).
2. Logic: Implement `delegateToAi` flag on `QRCode` in `prisma/schema.prisma`.
3. Update `scanner-app` scan logic (API side) to check for this flag and allow "Silent Entry."
4. Security Audit: Run `/clis-team audit` specifically for the `resident` and `marketing` routes (IDOR check).
5. Finalize the `PLAN_resident_mobile_one_tap.md` as "Done."
6. **Auto-Sync:** git add, commit, push.

### Acceptance criteria

- [ ] All invitation messages are localized correctly for MENA users.
- [ ] GateAI pre-clearance allows "Silent Entry" when flagged.
- [ ] Zero IDOR leaks found in the security audit.
- [ ] `pnpm preflight` is 100% green across all apps.

### Files likely touched

- `apps/resident-mobile/locales/ar/common.json`
- `apps/marketing/locales/ar/invitation.json`
- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/scans/validate/route.ts`
