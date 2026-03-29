# Skill Discovery Report

**Date:** 2026-03-29T18:25:47.616Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/scanner-app/src/components/DiagnosticsOverlay.tsx:    shadowColor: '#000',
packages/ui/src/tokens.ts:    neutral10: '#FFFFFF',
packages/ui/src/tokens.ts:    neutral20: '#F4F5F7',
packages/ui/src/tokens.ts:    neutral30: '#EBECF0',
packages/ui/src/tokens.ts:    neutral40: '#DFE1E6',
packages/ui/src/tokens.ts:    neutral50: '#C1C7D0',
packages/ui/src/tokens.ts:    neutral60: '#A5ADBA',
packages/ui/src/tokens.ts:    neutral70: '#97A0AF',
packages/ui/src/tokens.ts:    neutral80: '#8993A4',
packages/ui/src/tokens.ts:    neutral90: '#7A869A',

```
