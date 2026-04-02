# Skill Discovery Report

**Date:** 2026-04-02T10:26:09.928Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/admin-dashboard/src/components/emulation/seeding-wizard.tsx:           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
apps/resident-portal/src/app/(portal)/layout.tsx:  themeColor: '#2563eb',

```
