# Phase 4: Optimistic Updates for QR Create / Delete / Deny

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/client-dashboard`
- **Refs**:
  - `apps/client-dashboard/src/lib/qrcodes/use-qrcodes.ts` — `useQRCodes` hook (queryKey: `['qrcodes']`)
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/` — QR page components (find mutation call sites)
  - `apps/client-dashboard/src/app/[locale]/dashboard/scans/` — scan deny call site
  - TanStack Query docs: `useMutation` with `onMutate`, `onError`, `onSettled`

## Goal
Make local mutations feel instant by applying optimistic cache updates before the server responds. On error, roll back the optimistic change and show a toast notification.

## Scope (in)

Three mutations to optimisticise:

### 1. QR Create

Find where the QR create form calls the API (likely a `useMutation` or direct `fetch` in the QR creation component). Wrap or replace with a `useMutation`:

```ts
const queryClient = useQueryClient();

const createQRMutation = useMutation({
  mutationFn: (data: CreateQRPayload) =>
    fetch('/api/qrcodes', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json()),

  onMutate: async (newQR) => {
    // Cancel any in-flight refetches to avoid overwriting optimistic update
    await queryClient.cancelQueries({ queryKey: ['qrcodes'] });
    // Snapshot current cache
    const previous = queryClient.getQueryData(['qrcodes']);
    // Add provisional row (with temp id + pending status)
    queryClient.setQueryData(['qrcodes'], (old: QRCodesResponse | undefined) => {
      if (!old) return old;
      const provisional: QRCodeRow = {
        id: `temp-${Date.now()}`,
        ...newQR,
        status: 'pending',
        createdAt: new Date().toISOString(),
        isActive: false,
        currentUses: 0,
        scansCount: 0,
        lastScanAt: null,
        // fill remaining fields with defaults
      };
      return { ...old, data: [provisional, ...old.data] };
    });
    return { previous };
  },

  onError: (_err, _vars, context) => {
    // Roll back
    if (context?.previous) {
      queryClient.setQueryData(['qrcodes'], context.previous);
    }
    toast.error('Failed to create QR code');
  },

  onSettled: () => {
    // Always sync with server truth after mutation
    queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
  },
});
```

### 2. QR Delete

Find the delete action (likely a button in the QR table row). Wrap with `useMutation`:

```ts
const deleteQRMutation = useMutation({
  mutationFn: (qrId: string) =>
    fetch(`/api/qrcodes/${qrId}`, { method: 'DELETE' }).then(r => r.json()),

  onMutate: async (qrId) => {
    await queryClient.cancelQueries({ queryKey: ['qrcodes'] });
    const previous = queryClient.getQueryData(['qrcodes']);
    queryClient.setQueryData(['qrcodes'], (old: QRCodesResponse | undefined) => {
      if (!old) return old;
      return { ...old, data: old.data.filter(qr => qr.id !== qrId) };
    });
    return { previous };
  },

  onError: (_err, _vars, context) => {
    if (context?.previous) queryClient.setQueryData(['qrcodes'], context.previous);
    toast.error('Failed to delete QR code');
  },

  onSettled: () => queryClient.invalidateQueries({ queryKey: ['qrcodes'] }),
});
```

### 3. Scan Deny

Find the deny action in the scans page (POST `/api/scans/[scanId]/deny`). Wrap with `useMutation`:

```ts
const denyScanMutation = useMutation({
  mutationFn: (scanId: string) =>
    fetch(`/api/scans/${scanId}/deny`, { method: 'POST' }).then(r => r.json()),

  onMutate: async (scanId) => {
    await queryClient.cancelQueries({ queryKey: ['scans'] });
    const previous = queryClient.getQueryData(['scans']);
    queryClient.setQueryData(['scans'], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((scan: any) =>
          scan.id === scanId ? { ...scan, status: 'DENIED' } : scan
        ),
      };
    });
    return { previous };
  },

  onError: (_err, _vars, context) => {
    if (context?.previous) queryClient.setQueryData(['scans'], context.previous);
    toast.error('Failed to deny scan');
  },

  onSettled: () => queryClient.invalidateQueries({ queryKey: ['scans'] }),
});
```

**Toast integration**: use the existing `toast` from `@gate-access/ui` (or whichever toast is already used in the dashboard). Do not add a new toast library.

## Steps (ordered)
1. Read `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/` — find where QR create + delete are called.
2. Read the QR create component — identify current mutation pattern (direct fetch or existing `useMutation`).
3. Wrap QR create with `useMutation` + `onMutate/onError/onSettled` as above.
4. Wrap QR delete with `useMutation` + `onMutate/onError/onSettled`.
5. Read `apps/client-dashboard/src/app/[locale]/dashboard/scans/` — find scan deny action.
6. Wrap scan deny with `useMutation` + `onMutate/onError/onSettled`.
7. Test each:
   - Create QR: row appears immediately; confirm it updates to real data after server responds
   - Delete QR: row disappears immediately; confirm no regression if API fails (row reappears)
   - Kill dev server during create: confirm provisional row removed + toast shown
8. Run `pnpm turbo lint --filter=client-dashboard`.
9. Run `pnpm turbo typecheck --filter=client-dashboard`.
10. Create `docs/plan/execution/TASKS_realtime_updates.md` — all 4 phases marked complete.
11. Commit: `feat(realtime): optimistic updates for QR create/delete + scan deny (phase 4)`.

## Scope (out)
- Optimistic updates for contacts, units, gates (future — low priority)
- Admin dashboard optimistic updates

## Acceptance criteria
- [ ] QR create: provisional row appears in table immediately on form submit (before server responds)
- [ ] QR create: provisional row updates to real data (or is replaced) after server confirms
- [ ] QR create error: provisional row removed + error toast shown
- [ ] QR delete: row removed from table immediately on click
- [ ] QR delete error: row reappears + error toast shown
- [ ] Scan deny: row status changes to DENIED immediately
- [ ] Scan deny error: status rolled back + error toast shown
- [ ] `onSettled` always calls `invalidateQueries` — server truth always wins eventually
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes

## Files likely touched
- QR create component (find in `dashboard/qrcodes/`)
- QR table row / delete action component (find in `dashboard/qrcodes/`)
- Scan deny action component (find in `dashboard/scans/`)
- `docs/plan/execution/TASKS_realtime_updates.md` (new)

## Git commit
```
feat(realtime): optimistic updates for QR create/delete + scan deny (phase 4)
```
