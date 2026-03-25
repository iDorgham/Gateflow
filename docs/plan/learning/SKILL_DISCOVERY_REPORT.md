# Skill Discovery Report

**Date:** 2026-03-25T07:35:26.894Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/components/dashboard/ai/ChatHistorySidebar.tsx:                  <FolderIcon size={14} className="text-[#FFAB00] fill-[#FFAB00]/10" />
apps/client-dashboard/src/components/dashboard/ai/AIChartRenderer.tsx:              stroke="var(--ds-background-discovery-bold, #5243AA)"
apps/client-dashboard/src/components/dashboard/ai/AIChartRenderer.tsx:              dot={{ r: 4, fill: 'var(--ds-background-discovery-bold, #5243AA)' }}
apps/client-dashboard/src/components/dashboard/ai/ChatPanel.tsx:                      <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-[#6B778C] dark:text-[#A5ADBA] hover:bg-gray-100 dark:hover:bg-gray-800">
apps/client-dashboard/src/components/dashboard/ai/ChatPanel.tsx:                      <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-[#6B778C] dark:text-[#A5ADBA] hover:bg-gray-100 dark:hover:bg-gray-800" disabled>
apps/client-dashboard/src/components/dashboard/ai-assistant.tsx:                style={{ background: 'linear-gradient(135deg, #27272A 0%, #3F3F46 50%, #52525B 100%)' }}>
apps/client-dashboard/src/components/dashboard/ai-assistant.tsx:                style={!isUser ? { background: 'linear-gradient(135deg, #27272A, #52525B)' } : undefined}
apps/client-dashboard/src/components/dashboard/ai-assistant.tsx:              style={{ background: 'linear-gradient(135deg, #27272A, #52525B)' }}>
apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx:                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] mb-2">
apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx:                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] mb-2">

```
