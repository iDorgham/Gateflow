## Phase 3: Advanced CRM-style Contacts & Units UI

### Primary role

FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [ ] react — components, hooks, state  
- [ ] gf-design-guide — layout, density, responsive patterns  
- [ ] gf-i18n — AR/EN, RTL/LTR  
- [ ] tailwind — utility classes and tokens  
- [ ] gf-testing — UI tests where reasonable

### MCP to use

| MCP              | When                    |
|------------------|-------------------------|
| Context7         | UI/React best practices |
| cursor-ide-browser | Manual E2E checks       |

### Preferred tool

- [x] Cursor (default)

### Context

- Contacts and Units already have:
  - Rich tables with column customization, CSV import/export, and filters (`ResidentsFilterBar`).
  - Edit dialogs, linking units ↔ contacts, and some analytics columns.
- Phase 1 has introduced backend fields for CRM attributes (job title, source, avatarUrl, notes, etc.).
- Goal: surface those fields in a cohesive CRM-style **right panel + tables** experience.

### Goal

Upgrade **Contacts** and **Units** views into CRM-like dashboards with richer fields, better unit/contact linkage, and an improved side edit panel that feels wider and more structured.

### Scope (in)

- Contacts (`/dashboard/residents/contacts`):
  - Extend contact creation/edit dialog (and, where appropriate, the right-side edit panel) to include:
    - Avatar image or external photo link (re-using `Avatar` component where possible).
    - Job title, company, company website.
    - Source / From (e.g. dropdown or free text: Resident, CSV, Manual, Campaign, etc.).
    - Notes/comment field with reasonable length and styling.
  - Improve `Unit/s` field UX:
    - Replace bare checklist with a more discoverable pill/tag selector, making it easy to tag a contact with one or more units.
  - Consider a richer contact profile view inside the existing `EditPanel`:
    - Group sections (Identity, Contact details, Units, Tags, Activity summary).
- Units (`/dashboard/residents/units`):
  - Ensure unit rows show CRM-relevant data:
    - Linked residents/contacts, tag summary, quotas (already partially present).
  - When clicking through from units to contacts or vice versa, ensure the right panel or modal gives a coherent sense of “relationship” (e.g. which units a contact belongs to).
- Edit right panel:
  - Reuse the existing shared `EditPanel` but adjust width and layout so:
    - It feels spacious enough for CRM fields.
    - Sections are visually grouped and scannable.

### Scope (out)

- No changes to marketing attribution or external CRM webhooks in this phase.
- No new analytics charts; rely on counts already surfaced.

### Steps (ordered)

1. Load `react`, `gf-design-guide`, `gf-i18n`, and `tailwind` skills; review current `ContactsPage`, `UnitsPage`, `ResidentsFilterBar`, and `EditPanel` for patterns.
2. Design the information architecture for the contact edit/profile UI:
   - Decide which fields go into the main dialog vs side panel.
   - Decide on groupings (e.g. Personal, Work, Units, Notes).
3. Implement contact form enhancements:
   - Add new input fields (job title, company website, source, notes, avatar link/upload as appropriate).
   - Wire them to the backend fields introduced in Phase 1.
   - Ensure CSV import/export either ignores the new fields gracefully or is extended in a backwards-compatible way.
4. Upgrade the `Unit/s` field:
   - Implement a pill/tag-like selector for units in the contact form backed by existing unit list.
   - Ensure changes sync correctly to the units table (and vice versa).
5. Adjust Units view:
   - Verify CRM-relevant columns are visible and styled (linked contacts count, tag summary, etc.).
   - Ensure clicking units → “View contacts” feels like a related CRM view, not an isolated modal.
6. Adjust `EditPanel` layout:
   - Increase width on desktop.
   - Add section headings and spacing tokens so content is easy to read.
   - Verify RTL behavior remains correct.
7. Add light-touch UI tests where practical (e.g. snapshot or basic interaction tests) for contacts/units forms.
8. Run:
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`

### SuperDesign (recommended)

For this visually heavy phase:

- Use `superdesign create-design-draft` (or `iterate-design-draft`) focused on:
  - A CRM-style contact profile side panel.
  - The revised Contacts/Units table + right-panel layout.

### Subagents (optional)

| Subagent      | When | Prompt |
|---------------|------|--------|
| **browser-use** | Verify flows | "Login to client-dashboard, navigate to residents Contacts and Units, create/edit a contact with new CRM fields, link/unlink units, and confirm the right panel layout is readable in both EN and AR." |

### Commands (when to run)

- Before significant UI work: `/ready` if git state is messy.
- After successful checks: `/github` to commit and push.

### Acceptance criteria

- [ ] Contacts form and any right-panel view include avatar, job title, source, website/company website, notes, and updated unit selection.
- [ ] Linking/unlinking units from contacts updates both Contacts and Units tables correctly.
- [ ] Edit panel is visually wider and grouped, and works in RTL.
- [ ] CSV flows either ignore or correctly handle new fields without breaking existing imports.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (or no regressions).

