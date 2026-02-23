'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@gate-access/ui';
import { toast } from 'sonner';
import { toggleGate, createGate, updateGate, deleteGate } from './actions';
import {
  AlertTriangle,
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

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
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
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!name.trim()) {
      return setError('Gate name is required.');
    }
    startTransition(async () => {
      const result = await createGate(orgId, name.trim(), location.trim());
      if (result?.success) {
        toast.success(`Gate "${name.trim()}" created`);
        onClose();
        router.refresh();
      } else {
        setError(result?.error ?? 'Failed to create gate.');
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Add New Gate</h2>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          Configure a physical or logical access point for your organisation.
        </p>
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="add-name">Gate name</Label>
            <Input
              id="add-name"
              placeholder="Main Entrance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="add-location">Location</Label>
              <span className="text-xs text-slate-400">Optional</span>
            </div>
            <Input
              id="add-location"
              placeholder="e.g. Building A, Floor 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <p className="text-xs text-slate-400">Used for context in scan logs — optional</p>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={submit} disabled={isPending} className="flex-1 gap-2">
            {isPending ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Gate
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Gate Modal ──────────────────────────────────────────────────────────

function EditGateModal({ gate, onClose }: { gate: GateWithStats; onClose: () => void }) {
  const [name, setName] = useState(gate.name);
  const [location, setLocation] = useState(gate.location);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!name.trim()) {
      return setError('Gate name is required.');
    }
    startTransition(async () => {
      const result = await updateGate(gate.id, name.trim(), location.trim());
      if (result?.success) {
        toast.success('Gate updated');
        onClose();
        router.refresh();
      } else {
        setError(result?.error ?? 'Failed to update gate.');
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Edit Gate</h2>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Update gate name or location.</p>
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Gate name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-location">Location</Label>
              <span className="text-xs text-slate-400">Optional</span>
            </div>
            <Input
              id="edit-location"
              placeholder="e.g. Building A, Floor 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={submit} disabled={isPending} className="flex-1">
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({ gate, onClose }: { gate: GateWithStats; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function confirm() {
    startTransition(async () => {
      const result = await deleteGate(gate.id);
      if (result?.success) {
        toast.success(`Gate "${gate.name}" deleted`);
        onClose();
        router.refresh();
      } else {
        toast.error('Failed to delete gate');
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Delete "{gate.name}"?</h2>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          This gate will be soft-deleted and removed from the active list. All existing scan logs
          and QR codes linked to this gate will be preserved.
        </p>
        {gate._count.qrCodes > 0 && (
          <p className="mb-4 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            Warning: {gate._count.qrCodes} QR code{gate._count.qrCodes !== 1 ? 's are' : ' is'} still
            linked to this gate.
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={confirm}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isPending ? 'Deleting…' : 'Delete gate'}
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
      toast.success(gate.isActive ? `"${gate.name}" deactivated` : `"${gate.name}" activated`);
      router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
        aria-label="Gate options"
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
            Edit details
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
                Deactivate
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" aria-hidden="true" />
                Activate
              </>
            )}
          </button>

          <hr className="my-1 border-slate-100 dark:border-slate-700" />

          <button
            onClick={() => { close(); onDelete(gate); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
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
  return (
    <div
      className={`flex flex-col rounded-xl border bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md ${
        gate.isActive ? 'border-slate-200 dark:border-slate-700' : 'border-slate-200 dark:border-slate-700 opacity-60'
      }`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0 flex-1">
          {/* Status dot + name */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3 shrink-0 items-center justify-center">
              {gate.isActive && gate.isActiveToday ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </>
              ) : (
                <span
                  className={`inline-flex h-2 w-2 rounded-full dark:opacity-90 ${
                    gate.isActive ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">{gate.name}</h3>
          </div>

          {/* Location */}
          <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {gate.location || <span className="italic text-slate-400">No location</span>}
          </p>

          {/* Project badge — only shown in "All Projects" mode */}
          {showProject && (
            <div className="mt-1.5">
              {gate.projectName ? (
                <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                  {gate.projectName}
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-400 italic">
                  No project
                </span>
              )}
            </div>
          )}
        </div>

        <GateActionsMenu gate={gate} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px border-y border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-700">
        <div className="flex flex-col items-center bg-white dark:bg-slate-800 py-3">
          <span className="text-lg font-bold text-slate-900 dark:text-white">{gate._count.qrCodes}</span>
          <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">QR codes</span>
        </div>
        <div className="flex flex-col items-center bg-white dark:bg-slate-800 py-3">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {gate._count.scanLogs.toLocaleString()}
          </span>
          <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">total scans</span>
        </div>
        <div className="flex flex-col items-center bg-white dark:bg-slate-800 py-3">
          <span
            className={`text-lg font-bold ${
              gate.scansToday > 0 ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            {gate.scansToday}
          </span>
          <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">today</span>
        </div>
      </div>

      {/* Footer: status badge + last accessed */}
      <div className="flex items-center justify-between px-5 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            gate.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          {gate.isActive ? 'Active' : 'Inactive'}
        </span>

        {gate.lastAccessedAt ? (
          <span className="text-xs text-slate-400">
            Last scan {formatRelative(new Date(gate.lastAccessedAt))}
          </span>
        ) : (
          <span className="text-xs text-slate-400">Never scanned</span>
        )}
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
            {activeCount} active · {gates.length} total
          </p>
          <p className="text-xs text-slate-400">
            Refreshes every 30 s · last at{' '}
            {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Gate
        </Button>
      </div>

      {/* Grid or empty state */}
      {gates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
            <MapPin className="h-8 w-8 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No gates configured</p>
          <p className="mt-1 text-sm text-slate-400">
            Add your first gate to start controlling access.
          </p>
          <Button onClick={() => setShowAdd(true)} className="mt-5 gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Gate
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
      {isActive ? 'Deactivate' : 'Activate'}
    </Button>
  );
}

export function AddGateButton({ orgId }: { orgId: string }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <>
      <Button onClick={() => setShowAdd(true)} className="gap-2">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Gate
      </Button>
      {showAdd && <AddGateModal orgId={orgId} onClose={() => setShowAdd(false)} />}
    </>
  );
}
