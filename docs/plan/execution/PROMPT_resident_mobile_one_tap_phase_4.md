# Pro Prompt Template — Phase 4: Invitee Landing Page - Premium Experience

This phase implements the world-class landing page guests see when they open an invitation link.

---

## Phase 4: Invitee Landing Page - Premium Experience

### Primary role

FRONTEND | UX

### Preferred tool

- [x] Cursor IDE — visual iteration, layout, styling
- [ ] SuperDesign — premium draft generation
- [ ] Gemini CLI — layout audit (Accessibility/SEO)

### Context

- **Project**: GateFlow
- **App**: marketing (Next.js 14) or resident-portal
- **Path**: `/s/[shortId]`
- **Palette**: Atlassian Design System (ADS) or Initiative-specific palette
- **Rules**: RTL; high-premium branding; geofencing

### Goal

Redesign the invitation landing page to be visually stunning, branded for the organization, and extremely accessible.

### Scope (in)

- Path: `apps/marketing/src/app/[locale]/s/[shortId]/page.tsx`.
- Redesign for "Guest Hub":
  1. Organization Logo & Welcome text ("You are invited to [Project Name]").
  2. Large, high-resolution QR (centralized).
  3. Digital Handshake confirmation (security verification visually).
  4. Guest info entry (if Phase 2 "Anonymous" was used).
- "One-Tap Navigation": Deep links to Google Maps and Apple Maps with the gate coordinates.
- "Add to Wallet": Integrate `passkit` (if possible) or a "Save Image" option.
- Full RTL/Arabic localization.

### Scope (out)

- Redesigning the full resident portal (keep to `/s/[shortId]`).
- Security utility (Phase 1).

### Steps (ordered)

1. Generate a premium design draft:
   `superdesign create-design-draft "Branded Visitor Invitation Experience" --context-file apps/marketing/src/app/[locale]/s/[shortId]/page.tsx`
2. Implement the new `VisitorInvitationPage`.
3. Integration: Fetch `organizationId` and `projectId` from the `QRCode` record to show custom logos/colors.
4. Logic: Handle signature (`?sig=...`) validation on the server side (next-level security).
5. Audit: Mobile LHR (Lighthouse) report for accessibility.
6. **Auto-Sync:** git add, commit, push.

### Acceptance criteria

- [ ] Landing page is visually premium and highly responsive.
- [ ] Branded correctly for the inviting organization.
- [ ] "One-Tap Navigation" works for global coordinates.
- [ ] Pass details are fetched securely via the signed link.

### Files likely touched

- `apps/marketing/src/app/[locale]/s/[shortId]/page.tsx`
- `apps/marketing/src/components/invitation/BrandedPass.tsx`
- `apps/marketing/locales/en/invitation.json`
- `apps/marketing/locales/ar/invitation.json`
