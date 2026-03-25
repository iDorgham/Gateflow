# Skill Discovery Report

**Date:** 2026-03-25T07:11:05.262Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/api/tags/route.test.ts:      { id: 't1', name: 'family', color: '#22c55e' },
apps/client-dashboard/src/app/api/tags/route.test.ts:      { id: 't2', name: 'maid', color: '#3b82f6' },
apps/client-dashboard/src/app/api/tags/route.test.ts:    mockCreate.mockResolvedValue({ id: 't3', name: 'driver', color: '#a855f7' });
apps/client-dashboard/src/app/api/tags/route.test.ts:      body: JSON.stringify({ name: 'driver', color: '#a855f7' }),
apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx:  SUCCESS: 'bg-[#E3FCEF] text-[#006644] dark:bg-[#E3FCEF]/10 dark:text-[#E3FCEF] border-none',
apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx:  FAILED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73] border-none',
apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx:  EXPIRED: 'bg-[#FFF0B3] text-[#172B4D] dark:bg-[#FFF0B3]/10 dark:text-[#FFF0B3] border-none',
apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx:  MAX_USES_REACHED: 'bg-[#DEEBFF] text-[#0747A6] dark:bg-[#DEEBFF]/10 dark:text-[#DEEBFF] border-none',
apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx:  INACTIVE: 'bg-[#F4F5F7] text-[#42526E] dark:bg-[#F4F5F7]/10 dark:text-[#A5ADBA] border-none',
apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx:  DENIED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73] border-none',

```
