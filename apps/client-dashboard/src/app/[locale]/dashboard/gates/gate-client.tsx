'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@gate-access/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { toggleGate, createGate, updateGate, deleteGate } from './actions';
import {
  AlertTriangle,
  Layers,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  PowerOff,
  Trash2,
  Zap,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GateWithStats {
  id: string;
  name: string;
  location: string | null;
  isActive: boolean;
  lastAccessedAt: Date | null;
  scansToday: number;
  isActiveToday: boolean;
  _count: { qrCodes: number; scanLogs: number };
  projectName: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(date: Date, t: any): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return t('relative.justNow', 'just now');
  if (diffMins < 60) return t('relative.minutes', { count: diffMins, defaultValue: `${diffMins}m ago` });
  if (diffHours < 24) return t('relative.hours', { count: diffHours, defaultValue: `${diffHours}h ago` });
  if (diffDays === 1) return t('relative.yesterday', 'yesterday');
  return date.toLocaleDateString();
}

// ─── AutoRefresh ──────────────────────────────────────────────────────────────

export function AutoRefresh({ intervalMs = 30_000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
  return null;
}

// ─── Modal backdrop ───────────────────────────────────────────────────────────

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

// ─── Add Gate Modal ───────────────────────────────────────────────────────────

function AddGateModal({ orgId, onClose }: { orgId: string; onClose: () => void }) {
  const { t } = useTranslation('dashboard');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!name.trim()) {
      return setError(t('gates.modal.fields.nameRequired', 'Gate name is required.'));
    }
    startTransition(async () => {
      const result = await createGate(orgId, name.trim(), location.trim());
      if (result?.success) {
        toast.success(t('gates.messages.created', { name: name.trim(), defaultValue: `Gate "${name.trim()}" created` }));
        onClose();
        router.refresh();
      } else {
        setError(result?.error ?? t('gates.messages.createFailed', 'Failed to create gate.'));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">{t('gates.modal.add.title', 'New Gate')}</h2>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          {t('gates.modal.add.desc', 'Configure a physical or logical access point for your organisation.')}
        </p>
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="add-name">{t('gates.modal.fields.name', 'Gate name')}</Label>
            <Input
              id="add-name"
              placeholder={t('gates.modal.fields.namePlaceholder', 'Main Entrance')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="add-location">{t('gates.modal.fields.location', 'Location')}</Label>
              <span className="text-xs text-slate-400">{t('gates.modal.fields.optional', 'Optional')}</span>
            </div>
            <Input
              id="add-location"
              placeholder={t('gates.modal.fields.locationPlaceholder', 'e.g. Building A, Floor 1')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <p className="text-xs text-slate-400">{t('gates.modal.fields.locationDesc', 'Used for context in scan logs — optional')}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={submit} disabled={isPending} className="flex-1 gap-2">
            {isPending ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {t('gates.modal.actions.creating', 'Creating…')}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t('gates.modal.actions.create', 'Create')}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('gates.modal.actions.cancel', 'Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Gate Modal ──────────────────────────────────────────────────────────

function EditGateModal({ gate, onClose }: { gate: GateWithStats; onClose: () => void }) {
  const { t } = useTranslation('dashboard');
  const [name, setName] = useState(gate.name);
  const [location, setLocation] = useState(gate.location);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!name.trim()) {
      return setError(t('gates.modal.fields.nameRequired', 'Gate name is required.'));
    }
    startTransition(async () => {
      const result = await updateGate(gate.id, name.trim(), location.trim());
      if (result?.success) {
        toast.success(t('gates.messages.updated', 'Gate updated'));
        onClose();
        router.refresh();
      } else {
        setError(result?.error ?? t('gates.messages.updateFailed', 'Failed to update gate.'));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">{t('gates.modal.edit.title', 'Edit Gate')}</h2>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">{t('gates.modal.edit.desc', 'Update gate name or location.')}</p>
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">{t('gates.modal.fields.name', 'Gate name')}</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-location">{t('gates.modal.fields.location', 'Location')}</Label>
              <span className="text-xs text-slate-400">{t('gates.modal.fields.optional', 'Optional')}</span>
            </div>
            <Input
              id="edit-location"
              placeholder={t('gates.modal.fields.locationPlaceholder', 'e.g. Building A, Floor 1')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={submit} disabled={isPending} className="flex-1">
            {isPending ? t('gates.modal.actions.saving', 'Saving…') : t('gates.modal.actions.save', 'Save')}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('gates.modal.actions.cancel', 'Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({ gate, onClose }: { gate: GateWithStats; onClose: () => void }) {
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function confirm() {
    startTransition(async () => {
      const result = await deleteGate(gate.id);
      if (result?.success) {
        toast.success(t('gates.messages.deleted', { name: gate.name, defaultValue: `Gate "${gate.name}" deleted` }));
        onClose();
        router.refresh();
      } else {
        toast.error(t('gates.messages.deleteFailed', 'Failed to delete gate'));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          {t('gates.modal.delete.title', { name: gate.name, defaultValue: `Delete "${gate.name}"?` })}
        </h2>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          {t('gates.modal.delete.desc', 'This gate will be soft-deleted and removed from the active list. All existing scan logs and QR codes linked to this gate will be preserved.')}
        </p>
        {gate._count.qrCodes > 0 && (
          <p className="mb-4 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            {t('gates.modal.delete.warning', { count: gate._count.qrCodes, defaultValue: `Warning: ${gate._count.qrCodes} QR code is still linked to this gate.` })}
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('gates.modal.actions.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={confirm}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isPending ? t('gates.modal.actions.deleting', 'Deleting…') : t('gates.modal.delete.confirm', 'Delete gate')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Gate Actions Dropdown ────────────────────────────────────────────────────

function GateActionsMenu({
  gate,
  onEdit,
  onDelete,
}: {
  gate: GateWithStats;
  onEdit: (gate: GateWithStats) => void;
  onDelete: (gate: GateWithStats) => void;
}) {
  const { t } = useTranslation('dashboard');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  function toggle() {
    close();
    startTransition(async () => {
      await toggleGate(gate.id, !gate.isActive);
      toast.success(gate.isActive 
        ? t('gates.messages.deactivated', { name: gate.name, defaultValue: `"${gate.name}" deactivated` }) 
        : t('gates.messages.activated', { name: gate.name, defaultValue: `"${gate.name}" activated` })
      );
      router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
        aria-label={t('gates.menu.options', 'Gate options')}
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 shadow-lg">
          <button
            onClick={() => { close(); onEdit(gate); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            {t('gates.menu.edit', 'Edit details')}
          </button>

          <button
            onClick={toggle}
            disabled={isPending}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
              gate.isActive ? 'text-amber-600' : 'text-green-600'
            }`}
          >
            {gate.isActive ? (
              <>
                <PowerOff className="h-4 w-4" aria-hidden="true" />
                {t('gates.menu.deactivate', 'Deactivate')}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" aria-hidden="true" />
                {t('gates.menu.activate', 'Activate')}
              </>
            )}
          </button>

          <hr className="my-1 border-slate-100 dark:border-slate-700" />

          <button
            onClick={() => { close(); onDelete(gate); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {t('gates.menu.delete', 'Delete')}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Gate Card ────────────────────────────────────────────────────────────────

function GateCard({
  gate,
  showProject,
  onEdit,
  onDelete,
}: {
  gate: GateWithStats;
  showProject: boolean;
  onEdit: (gate: GateWithStats) => void;
  onDelete: (gate: GateWithStats) => void;
}) {
  const { t } = useTranslation('dashboard');
  
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30 overflow-hidden",
        !gate.isActive && "opacity-75 grayscale-[0.5]"
      )}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      {/* Card Body */}
      <div className="relative flex flex-col h-full bg-card z-10">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                  {gate.isActive && gate.isActiveToday ? (
                    <>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        gate.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                      )}
                    />
                  )}
                </div>
                <h3 className="truncate text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {gate.name}
                </h3>
              </div>

              {/* Location Badge */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                {gate.location || <span className="italic opacity-50 uppercase text-[9px]">Unspecified</span>}
              </div>
              
              {/* Project Relationship - More prominent */}
              {showProject && (
                <div className="mt-4 flex items-center gap-2 p-2 px-3 rounded-xl bg-muted/50 border border-border/50 group-hover:border-primary/10 transition-colors">
                   <Layers className="h-3.5 w-3.5 text-primary opacity-60" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1">Project Attachment</span>
                      <span className="text-sm font-bold text-foreground truncate max-w-[150px]">
                        {gate.projectName || 'General Nodes'}
                      </span>
                   </div>
                </div>
              )}
            </div>

            <div className="flex shrink-0 transform lg:translate-x-2 group-hover:translate-x-0 transition-transform duration-300 opacity-0 lg:group-hover:opacity-100">
               <GateActionsMenu gate={gate} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>
        </div>

        {/* Stats Section with Glassmorphism feel */}
        <div className="mt-auto border-t border-border/50 bg-muted/20">
          <div className="grid grid-cols-3 divide-x divide-border/50">
            <div className="flex flex-col items-center justify-center py-4 px-2 hover:bg-muted/30 transition-colors">
              <span className="text-lg font-black text-foreground leading-none">{gate._count.qrCodes}</span>
              <span className="mt-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">Keys</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 px-2 hover:bg-muted/30 transition-colors">
              <span className="text-lg font-black text-foreground leading-none">
                {gate._count.scanLogs > 1000 ? `${(gate._count.scanLogs / 1000).toFixed(1)}k` : gate._count.scanLogs}
              </span>
              <span className="mt-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">Scans</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 px-2 hover:bg-muted/30 transition-colors">
              <span
                className={cn(
                  "text-lg font-black leading-none",
                  gate.scansToday > 0 ? "text-primary" : "text-muted-foreground opacity-50"
                )}
              >
                {gate.scansToday}
              </span>
              <span className="mt-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">Today</span>
            </div>
          </div>
        </div>

        {/* Footer info Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-muted/40 border-t border-border/50">
          <div className="flex items-center gap-2">
             <div className={cn(
               "h-1.5 w-1.5 rounded-full",
               gate.isActive ? "bg-emerald-500" : "bg-muted-foreground"
             )} />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               {gate.isActive ? t('gates.card.status.active', 'Online') : t('gates.card.status.inactive', 'Offline')}
             </span>
          </div>

          <div className="flex items-center gap-1.5">
             <Zap className="h-3 w-3 text-muted-foreground opacity-50" />
             <span className="text-[10px] font-bold text-muted-foreground/60">
                {gate.lastAccessedAt ? formatRelative(new Date(gate.lastAccessedAt), t) : t('gates.card.neverScanned', 'Never')}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main GatesList ───────────────────────────────────────────────────────────

export function GatesList({
  gates,
  orgId,
  isAllProjects = false,
}: {
  gates: GateWithStats[];
  orgId: string;
  isAllProjects?: boolean;
}) {
  const { t } = useTranslation('dashboard');
  const [editingGate, setEditingGate] = useState<GateWithStats | null>(null);
  const [deletingGate, setDeletingGate] = useState<GateWithStats | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Track when the page was last refreshed
  useEffect(() => {
    setLastRefreshed(new Date());
  }, [gates]);

  const activeCount = gates.filter((g) => g.isActive).length;

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('gates.activeTotal', { active: activeCount, total: gates.length, defaultValue: `${activeCount} active · ${gates.length} total` })}
          </p>
          <p className="text-xs text-slate-400">
            {t('gates.lastRefreshed', { time: lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), defaultValue: `Refreshes every 30 s · last at ${lastRefreshed.toLocaleTimeString()}` })}
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('gates.addGate', 'New Gate')}
        </Button>
      </div>

      {/* Grid or empty state */}
      {gates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
            <MapPin className="h-8 w-8 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">{t('gates.empty.title', 'No gates configured')}</p>
          <p className="mt-1 text-sm text-slate-400">
            {t('gates.empty.desc', 'Add your first gate to start controlling access.')}
          </p>
          <Button onClick={() => setShowAdd(true)} className="mt-5 gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('gates.addGate', 'New Gate')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gates.map((gate) => (
            <GateCard
              key={gate.id}
              gate={gate}
              showProject={isAllProjects}
              onEdit={setEditingGate}
              onDelete={setDeletingGate}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd && <AddGateModal orgId={orgId} onClose={() => setShowAdd(false)} />}
      {editingGate && (
        <EditGateModal gate={editingGate} onClose={() => setEditingGate(null)} />
      )}
      {deletingGate && (
        <DeleteConfirmModal gate={deletingGate} onClose={() => setDeletingGate(null)} />
      )}
    </>
  );
}

// ─── Backward-compat exports (kept so any other pages don't break) ────────────

export function GateActions({ gateId, isActive }: { gateId: string; isActive: boolean }) {
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  function toggle() {
    startTransition(async () => {
      await toggleGate(gateId, !isActive);
      router.refresh();
    });
  }
  return (
    <Button variant="ghost" size="sm" className={isActive ? 'text-slate-500' : 'text-green-600'} onClick={toggle} disabled={isPending}>
      {isActive ? t('gates.menu.deactivate', 'Deactivate') : t('gates.menu.activate', 'Activate')}
    </Button>
  );
}

