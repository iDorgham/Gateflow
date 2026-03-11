'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@gate-access/ui';
import {
  Download,
  Trash2,
  AlertTriangle,
  ShieldOff,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CooldownButton } from './cooldown-button';
import { csrfFetch } from '@/lib/csrf';

interface DangerZoneProps {
  orgName: string;
}

// ─── Export Section ──────────────────────────────────────────────────────────

function ExportCard() {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const res = await csrfFetch('/api/danger/export', { method: 'POST' });
      if (!res.ok) {
        toast.error('Export failed. Please try again.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gateflow-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Workspace data exported successfully.');
    });
  };

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">Export Workspace Data</CardTitle>
            <CardDescription className="text-xs mt-1">
              Download a full JSON export of all your organization data — users, gates, QR codes, scan logs, contacts, and units.
              This action is logged in your audit trail.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CooldownButton
          label="Download Export"
          cooldownSeconds={5}
          onClick={handleExport}
          disabled={isPending}
          variant="outline"
          className="border-primary/20 text-primary hover:bg-primary/5"
        />
      </CardContent>
    </Card>
  );
}

// ─── Purge Scans Section ─────────────────────────────────────────────────────

function PurgeScansCard() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [olderThanDays, setOlderThanDays] = useState(90);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ deletedCount: number } | null>(null);

  const handlePurge = () => {
    if (confirmation !== 'PURGE SCANS') {
      toast.error('Type PURGE SCANS exactly to confirm.');
      return;
    }

    startTransition(async () => {
      const res = await csrfFetch('/api/danger/purge-scans', {
        method: 'POST',
        body: JSON.stringify({ confirmation, olderThanDays }),
      });
      const data = (await res.json()) as { success?: boolean; deletedCount?: number; error?: string };
      if (res.ok && data.success) {
        setResult({ deletedCount: data.deletedCount ?? 0 });
        toast.success(`${data.deletedCount} scan records deleted.`);
      } else {
        toast.error(data.error ?? 'Purge failed.');
      }
    });
  };

  const reset = () => {
    setOpen(false);
    setConfirmation('');
    setResult(null);
  };

  return (
    <>
      <Card className="rounded-2xl border-warning/30 bg-warning/5">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <Trash2 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight text-warning">
                Purge Historical Scan Data
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Permanently delete scan logs older than a chosen number of days. This frees up storage but removes your audit
                history. This action is irreversible.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CooldownButton
            label="Purge Scan Data…"
            cooldownSeconds={10}
            onClick={() => setOpen(true)}
            variant="destructive"
            className="bg-warning hover:bg-warning/90 border-warning text-white"
          />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); }}>
        <DialogContent className="sm:max-w-md rounded-2xl border-warning/40 bg-background p-0 overflow-hidden">
          <div className="bg-warning/10 p-6 border-b border-warning/20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/20 mb-4 ring-8 ring-warning/5">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <DialogTitle className="text-lg font-black text-foreground mb-1">Purge Scan History</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This permanently deletes scan records. It cannot be undone.
            </DialogDescription>
          </div>

          {result ? (
            <div className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <p className="font-bold text-foreground">{result.deletedCount} scan records deleted.</p>
              <Button onClick={reset} className="w-full rounded-xl h-11 font-black">Done</Button>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Delete records older than (days)
                </Label>
                <Input
                  type="number"
                  min={30}
                  max={3650}
                  value={olderThanDays}
                  onChange={(e) => setOlderThanDays(parseInt(e.target.value, 10) || 90)}
                  className="h-11 rounded-xl font-bold text-center"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Type <span className="font-mono bg-warning/10 text-warning px-1.5 py-0.5 rounded">PURGE SCANS</span> to confirm
                </Label>
                <Input
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="PURGE SCANS"
                  className="h-11 rounded-xl text-center font-bold border-warning/30 focus-visible:ring-warning/30"
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={reset} disabled={isPending} className="flex-1 h-11 rounded-xl font-bold">
                  Cancel
                </Button>
                <Button
                  onClick={handlePurge}
                  disabled={confirmation !== 'PURGE SCANS' || isPending}
                  className="flex-1 h-11 rounded-xl font-black bg-warning hover:bg-warning/90 border-warning text-white"
                >
                  {isPending ? 'Purging…' : 'Confirm Purge'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Delete Workspace Section ─────────────────────────────────────────────────

function DeleteWorkspaceCard({ orgName }: { orgName: string }) {
  const [step, setStep] = useState(0); // 0: idle, 1: name confirm, 2: final confirm, 3: done
  const [nameInput, setNameInput] = useState('');
  const [actionInput, setActionInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (actionInput !== 'DELETE WORKSPACE') return;

    startTransition(async () => {
      const res = await csrfFetch('/api/danger/delete-workspace', {
        method: 'POST',
        body: JSON.stringify({ orgNameConfirmation: nameInput, actionConfirmation: actionInput }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        setStep(3);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        toast.error(data.error ?? 'Deletion failed.');
      }
    });
  };

  return (
    <Card className="rounded-2xl border-destructive/40 bg-destructive/5">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <ShieldOff className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-destructive">
              Delete Workspace
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Permanently delete your entire workspace — all users, gates, QR codes, scan history, contacts, and billing data.
              This action is irreversible and cannot be recovered.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {step === 0 && (
          <CooldownButton
            label="Delete Workspace…"
            cooldownSeconds={30}
            onClick={() => setStep(1)}
            variant="destructive"
          />
        )}

        {step === 1 && (
          <div className="space-y-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2 text-xs font-bold text-destructive uppercase tracking-widest">
              <ChevronRight className="h-3.5 w-3.5" />
              Step 1 of 2 — Confirm workspace name
            </div>
            <p className="text-xs text-muted-foreground">
              Type <span className="font-mono font-bold text-foreground">{orgName}</span> to continue.
            </p>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={orgName}
              className="h-11 rounded-xl font-bold border-destructive/30 focus-visible:ring-destructive/30"
              autoComplete="off"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setStep(0); setNameInput(''); }} className="flex-1 h-10 rounded-xl font-bold">
                Cancel
              </Button>
              <Button
                disabled={nameInput !== orgName}
                onClick={() => setStep(2)}
                variant="destructive"
                className="flex-1 h-10 rounded-xl font-black"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 p-4 rounded-xl border border-destructive/40 bg-destructive/10">
            <div className="flex items-center gap-2 text-xs font-bold text-destructive uppercase tracking-widest">
              <ChevronRight className="h-3.5 w-3.5" />
              Step 2 of 2 — Final confirmation
            </div>
            <p className="text-xs text-muted-foreground">
              Type <span className="font-mono font-bold text-foreground">DELETE WORKSPACE</span> to permanently delete.
            </p>
            <Input
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              placeholder="DELETE WORKSPACE"
              className="h-11 rounded-xl font-bold border-destructive/40 focus-visible:ring-destructive/30"
              autoComplete="off"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setStep(1); setActionInput(''); }} className="flex-1 h-10 rounded-xl font-bold">
                Back
              </Button>
              <Button
                disabled={actionInput !== 'DELETE WORKSPACE' || isPending}
                onClick={handleDelete}
                variant="destructive"
                className="flex-1 h-10 rounded-xl font-black"
              >
                {isPending ? 'Deleting…' : 'Delete Forever'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-center space-y-2">
            <p className="font-bold text-destructive text-sm">Workspace deleted.</p>
            <p className="text-xs text-muted-foreground">Redirecting to login…</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DangerZone({ orgName }: DangerZoneProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
        <p className="text-sm font-medium text-destructive">
          All actions on this page are destructive. Buttons have a cooldown timer to prevent accidental clicks.
          Every action is recorded in your organization&apos;s audit log.
        </p>
      </div>

      <ExportCard />
      <PurgeScansCard />
      <DeleteWorkspaceCard orgName={orgName} />
    </div>
  );
}
