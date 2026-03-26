# Skill Discovery Report

**Date:** 2026-03-25T23:19:41.863Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:          bgColor={token('elevation.surface', '#FFFFFF')}
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:          fgColor={token('color.text', '#172B4D')}
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:      ctx.fillStyle = token('elevation.surface', '#FFFFFF');
apps/client-dashboard/src/components/settings/workspace-form.tsx:        token('color.background.brand.bold', '#3B82F6'),
apps/client-dashboard/src/components/dashboard/gateai/CanvasEditor.tsx:              color: color || token('color.text.danger', '#ED4B00'),
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.danger', '#ED4B00'), // Kimchi Orange
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.brand', '#020035'), // Midnight Blue
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.information', '#2000B1'), // Deep Sea Info
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.success', '#16A34A'), // Success Green
apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx:    token('color.text.warning', '#F59E0B'), // Warning Amber

```
