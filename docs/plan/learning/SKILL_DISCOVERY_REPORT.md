# Skill Discovery Report

**Date:** 2026-03-26T16:41:28.616Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:          bgColor={token('elevation.surface', '#FFFFFF')}
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:          fgColor={token('color.text', '#172B4D')}
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:      ctx.fillStyle = token('elevation.surface', '#F2F3F4');
apps/client-dashboard/src/app/manifest.ts:    background_color: '#FFFFFF',
apps/client-dashboard/src/app/manifest.ts:    theme_color: '#3B82F6',
apps/client-dashboard/src/components/settings/workspace-form.tsx:        token('color.background.brand.bold', '#3B82F6'),
apps/client-dashboard/src/components/dashboard/gateai/CanvasEditor.tsx:              color: color || token('color.text.danger', '#ED4B00'),
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.danger', '#AE2A19'), // Kimchi Orange -> now aligned to ADS Danger
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.brand', '#0C66E4'), // Midnight Blue -> now aligned to ADS Brand
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.information', '#0055CC'), // Deep Sea Info -> now aligned to ADS Info

```
