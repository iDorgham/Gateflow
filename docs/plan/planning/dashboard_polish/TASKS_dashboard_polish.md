# TASKS: Pro Dashboard Polish

**Plan**: [PLAN_dashboard_polish.md](PLAN_dashboard_polish.md)
**Status**: Ready

## Phases

- [x] **Phase 1: Sidebar Groups + Remove Theme Toggle**
  - [x] 4 nav groups: Workspace / Residents / Access Control / Security
  - [x] Group label style: 9px font-black uppercase tracking-widest
  - [x] Collapsed state: dividers instead of labels
  - [x] ThemeToggle removed from header
  - [x] Theme toggle already in user dropdown menu
  - [x] Lint passes

- [ ] **Phase 2: Unified PageHeader + Spacing**
  - [ ] PageHeader component (title, subtitle, badge, actions)
  - [ ] Applied to: QR Codes, Access Logs, Analytics, Gates
  - [ ] All applied pages use space-y-6 section spacing
  - [ ] Lint + typecheck pass

- [ ] **Phase 3: Unified FilterBar Component**
  - [ ] FilterBar container + DatePresets + Select + Search + Divider
  - [ ] Applied to QR Codes and Scans pages
  - [ ] Pill date presets match analytics style
  - [ ] Lint passes

- [ ] **Phase 4: AI Panel + Side Panel Refinement**
  - [ ] Side panel tabs h-10, px-4, active indicator
  - [ ] AI panel: no duplicate header, welcome card in message area
  - [ ] Message avatars h-8 w-8
  - [ ] Input rounded-2xl min-h-[48px]
  - [ ] Tasks row min-h-[44px], Chat avatar h-8 w-8
  - [ ] Lint + typecheck pass

---
*Created: 2026-03-11*
