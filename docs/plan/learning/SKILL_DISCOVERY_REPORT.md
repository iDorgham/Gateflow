# Skill Discovery Report

**Date:** 2026-03-30T11:21:21.413Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
packages/ui/src/globals.css:    --ds-background-default: #F2F3F4; /* Anti-Flash White */
packages/ui/src/globals.css:    --ds-background-subtle: #EBEAED;   /* Lace Cap */
packages/ui/src/globals.css:    --ds-background-neutral: #EBEAED;
packages/ui/src/globals.css:    --ds-background-neutral-subtle: #EBEAED80;
packages/ui/src/globals.css:    --ds-background-neutral-hovered: #DEDEE0;
packages/ui/src/globals.css:    --ds-background-selected: #EBEAED;
packages/ui/src/globals.css:    --ds-background-card: #FFFFFF;
packages/ui/src/globals.css:    --ds-background-brand-bold: #ED4B00; /* Kimchi Orange */
packages/ui/src/globals.css:    --ds-background-brand-subtle: #F2F3F4;
packages/ui/src/globals.css:    --ds-background-danger-bold: #CA3521;

```
