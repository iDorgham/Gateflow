'use client';

import { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  QrCode,
  Shield,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { PatrolRouteDto } from '@gate-access/types';
import { generateCheckpointPlacardSvg } from '@/lib/patrols/checkpoint-qr';

interface PatrolRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (route: PatrolRouteDto) => void;
  initialRoute?: PatrolRouteDto | null;
}

export function PatrolRouteModal({
  isOpen,
  onClose,
  onSaved,
  initialRoute,
}: PatrolRouteModalProps) {
  const [name, setName] = useState(initialRoute?.name || '');
  const [frequencyMinutes, setFrequencyMinutes] = useState(
    initialRoute?.frequencyMinutes || 60
  );
  const [isStrictSequence, setIsStrictSequence] = useState(
    initialRoute?.isStrictSequence ?? true
  );
  const [checkpoints, setCheckpoints] = useState<
    Array<{ id?: string; name: string; x: number; y: number }>
  >(
    initialRoute?.checkpoints?.map((cp) => ({
      id: cp.id,
      name: cp.name,
      x: cp.mapCoordinates?.x || 50,
      y: cp.mapCoordinates?.y || 50,
    })) || [
      { name: 'North Gate Checkpoint', x: 25, y: 30 },
      { name: 'Perimeter Fence East', x: 75, y: 35 },
      { name: 'Clubhouse Zone', x: 60, y: 70 },
    ]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCheckpoint = () => {
    setCheckpoints((prev) => [
      ...prev,
      {
        name: `Station ${prev.length + 1}`,
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 60) + 20,
      },
    ]);
  };

  const handleRemoveCheckpoint = (index: number) => {
    if (checkpoints.length <= 1) return;
    setCheckpoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveCheckpoint = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= checkpoints.length) return;

    const next = [...checkpoints];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setCheckpoints(next);
  };

  const handleDownloadPlacard = (cpName: string, index: number) => {
    const svg = generateCheckpointPlacardSvg({
      checkpointName: cpName,
      routeName: name || 'Perimeter Route',
      orderIndex: index,
    });

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkpoint-${index + 1}-${cpName.toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Route name is required');
      return;
    }
    if (checkpoints.some((c) => !c.name.trim())) {
      setErrorMsg('All checkpoints must have a station name');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        id: initialRoute?.id,
        name: name.trim(),
        frequencyMinutes: Number(frequencyMinutes),
        isStrictSequence,
        active: true,
        checkpoints: checkpoints.map((cp, idx) => ({
          id: cp.id,
          name: cp.name.trim(),
          mapCoordinates: { x: cp.x, y: cp.y },
          orderIndex: idx,
        })),
      };

      const res = await fetch('/api/patrols/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to save patrol route');
      }

      onSaved(json.route);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialRoute
                  ? 'Edit Patrol Route'
                  : 'Configure Guard Patrol Route'}
              </h3>
              <p className="text-xs text-slate-500">
                Define perimeter checkpoints and patrol frequency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Route Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. North Perimeter Loop"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Patrol Frequency (Minutes)
              </label>
              <select
                value={frequencyMinutes}
                onChange={(e) => setFrequencyMinutes(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value={30}>Every 30 Minutes (High Security)</option>
                <option value={60}>Every 60 Minutes (Standard)</option>
                <option value={120}>Every 2 Hours</option>
                <option value={240}>Every 4 Hours</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="strictSeq"
              checked={isStrictSequence}
              onChange={(e) => setIsStrictSequence(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
            />
            <label
              htmlFor="strictSeq"
              className="text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Enforce strict sequential checkpoint scanning (Station 1 → 2 → 3)
            </label>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Checkpoints & Stations ({checkpoints.length})
              </label>
              <button
                type="button"
                onClick={handleAddCheckpoint}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Station
              </button>
            </div>

            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {checkpoints.map((cp, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={cp.name}
                    onChange={(e) => {
                      const updated = [...checkpoints];
                      updated[idx].name = e.target.value;
                      setCheckpoints(updated);
                    }}
                    placeholder={`Station ${idx + 1} name`}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCheckpoint(idx, 'up')}
                      className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === checkpoints.length - 1}
                      onClick={() => handleMoveCheckpoint(idx, 'down')}
                      className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPlacard(cp.name, idx)}
                      className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                      title="Download Printable QR Placard"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={checkpoints.length <= 1}
                      onClick={() => handleRemoveCheckpoint(idx)}
                      className="rounded p-1 text-rose-500 hover:bg-rose-50 disabled:opacity-30 dark:hover:bg-rose-950/50"
                      title="Delete Station"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting
                ? 'Saving Route...'
                : initialRoute
                  ? 'Update Route'
                  : 'Save Patrol Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
