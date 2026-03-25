# Skill Discovery Report

**Date:** 2026-03-25T04:06:09.051Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:    .replace(/'/g, '&#039;');
apps/client-dashboard/src/app/api/tags/route.test.ts:      { id: 't1', name: 'family', color: '#22c55e' },
apps/client-dashboard/src/app/api/tags/route.test.ts:      { id: 't2', name: 'maid', color: '#3b82f6' },
apps/client-dashboard/src/app/api/tags/route.test.ts:    mockCreate.mockResolvedValue({ id: 't3', name: 'driver', color: '#a855f7' });
apps/client-dashboard/src/app/api/tags/route.test.ts:      body: JSON.stringify({ name: 'driver', color: '#a855f7' }),
apps/client-dashboard/src/components/settings/workspace-form.tsx:      accentColor: initialData?.accentColor || '#3B82F6',
apps/client-dashboard/src/components/crm/ContactTable.tsx:              <Badge key={u.id} variant="secondary" className="text-[10px] font-bold bg-[#DEEBFF] text-[var(--primary)] border-none">
apps/client-dashboard/src/components/crm/UnitTable.tsx:        <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 border-[#DFE1E6] bg-[#FAFBFC] text-[#6B778C]">
apps/client-dashboard/src/components/crm/UnitTable.tsx:           <Button onClick={handleCreate} className="h-10 rounded-xl bg-[#00875A] hover:bg-[#00875A]/90 text-white font-bold gap-2 shadow-sm">
apps/client-dashboard/src/components/operations/ProjectTeamTable.tsx:          <Badge variant="outline" className="bg-[#DEEBFF] text-[#0747A6] border-none font-bold">

```
