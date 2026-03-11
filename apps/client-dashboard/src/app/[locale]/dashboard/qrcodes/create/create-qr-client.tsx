'use client';

import { useState, useTransition, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
} from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import { toast } from 'sonner';
import { createQRCode } from './actions';
import { QRCodeType } from '@gate-access/types';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ImageDown,
  Infinity,
  Link2,
  ListRestart,
  QrCode,
  RefreshCw,
  Send,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Gate {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  units: { id: string; name: string }[];
}

interface CreatedQR {
  qrString: string;
  qrId: string;
  type: string;
  shortUrl?: string;
}

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 16);
}

// ─── StepIndicator ────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Access Type' },
  { label: 'Gate & Schedule' },
  { label: 'Guest Details' },
  { label: 'Review & Generate' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center w-full mb-8" role="list" aria-label="Wizard steps">
      {STEPS.map((step, idx) => {
        const n = idx + 1;
        const isCompleted = n < current;
        const isActive = n === current;
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none" role="listitem">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black transition-all duration-300',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isActive
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground/50 bg-muted/30'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? <Check className="h-4 w-4" aria-hidden="true" /> : n}
              </div>
              <span
                className={cn(
                  'mt-1.5 hidden sm:block text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap',
                  isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground/50'
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 mt-[-1rem] sm:mt-[-1.4rem] transition-colors duration-300',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Access Type ──────────────────────────────────────────────────────

const QR_TYPES = [
  {
    value: QRCodeType.SINGLE,
    label: 'Single Use',
    desc: 'One scan only. The code is deactivated after the first successful entry.',
    icon: QrCode,
    accent: 'border-blue-500/40 bg-blue-500/5 hover:border-blue-500/60',
    activeAccent: 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30',
    iconColor: 'text-blue-500',
  },
  {
    value: QRCodeType.RECURRING,
    label: 'Recurring',
    desc: 'Allow a fixed number of scans. Useful for event passes or repeat visitors.',
    icon: RefreshCw,
    accent: 'border-violet-500/40 bg-violet-500/5 hover:border-violet-500/60',
    activeAccent: 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30',
    iconColor: 'text-violet-500',
  },
  {
    value: QRCodeType.PERMANENT,
    label: 'Permanent',
    desc: 'Unlimited scans. Ideal for resident or staff access cards.',
    icon: Infinity,
    accent: 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60',
    activeAccent: 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30',
    iconColor: 'text-emerald-500',
  },
];

function Step1({
  type,
  setType,
  onNext,
}: {
  type: QRCodeType;
  setType: (t: QRCodeType) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Choose Access Type</h2>
        <p className="text-sm text-muted-foreground mt-1">Select how many times this QR code can be used.</p>
      </div>

      <div className="space-y-3">
        {QR_TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = type === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setType(t.value)}
              aria-pressed={isSelected}
              className={cn(
                'w-full flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                isSelected ? t.activeAccent : t.accent
              )}
            >
              <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-background/80 shadow-sm', isSelected && 'shadow-md')}>
                <Icon className={cn('h-5 w-5', t.iconColor)} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-foreground uppercase tracking-tight text-sm">{t.label}</span>
                  {isSelected && (
                    <CheckCircle2 className={cn('h-5 w-5 shrink-0', t.iconColor)} aria-hidden="true" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Button onClick={onNext} className="w-full h-12 gap-2 font-black uppercase tracking-widest text-[11px]">
        Continue
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

// ─── Step 2: Gate & Schedule ──────────────────────────────────────────────────

function Step2({
  type,
  gateId,
  setGateId,
  maxUses,
  setMaxUses,
  expiresAt,
  setExpiresAt,
  gates,
  currentProject,
  error,
  onBack,
  onNext,
}: {
  type: QRCodeType;
  gateId: string;
  setGateId: (v: string) => void;
  maxUses: string;
  setMaxUses: (v: string) => void;
  expiresAt: string;
  setExpiresAt: (v: string) => void;
  gates: Gate[];
  currentProject: Project | null;
  error: string | null;
  onBack: () => void;
  onNext: () => void;
}) {
  const showMaxUses = type === QRCodeType.RECURRING;
  const showExpiry = type !== QRCodeType.PERMANENT;

  function validate() {
    if (showMaxUses && (isNaN(parseInt(maxUses)) || parseInt(maxUses) < 1)) {
      return 'Max uses must be a positive number.';
    }
    if (showExpiry && expiresAt && new Date(expiresAt) <= new Date()) {
      return 'Expiry must be in the future.';
    }
    return null;
  }

  function handleNext() {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Gate & Schedule</h2>
        <p className="text-sm text-muted-foreground mt-1">Optionally restrict this code to a specific gate and set its expiry.</p>
      </div>

      {/* Project badge */}
      {currentProject && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">Project:</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-black text-primary">{currentProject.name}</span>
        </div>
      )}

      {/* Gate */}
      <div className="space-y-2">
        <Label htmlFor="gate-select" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          Gate (optional)
        </Label>
        <select
          id="gate-select"
          value={gateId}
          onChange={(e) => setGateId(e.target.value)}
          aria-label="Select gate"
          className="w-full h-11 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          <option value="">Any gate — no restriction</option>
          {gates.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* Max uses (RECURRING only) */}
      {showMaxUses && (
        <div className="space-y-2">
          <Label htmlFor="max-uses" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Max Uses
          </Label>
          <Input
            id="max-uses"
            type="number"
            min="1"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            className="h-11 rounded-xl font-bold"
            aria-describedby="max-uses-hint"
          />
          <p id="max-uses-hint" className="text-[11px] text-muted-foreground">
            How many times this code can be scanned in total.
          </p>
        </div>
      )}

      {/* Expiry (non-PERMANENT) */}
      {showExpiry && (
        <div className="space-y-2">
          <Label htmlFor="expiry" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Expires At (optional)
          </Label>
          <Input
            id="expiry"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive font-medium px-1">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 gap-2 font-bold uppercase tracking-widest text-[11px]">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1 h-12 gap-2 font-black uppercase tracking-widest text-[11px]">
          Continue
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

// ─── Steps 3 & 4 placeholders (Phase 3) ──────────────────────────────────────

function Step3Placeholder({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Guest Details</h2>
        <p className="text-sm text-muted-foreground mt-1">Link this QR to a guest or contact.</p>
      </div>
      <div className="h-40 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground/50 text-sm italic">
        Guest details — coming in Phase 3
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 gap-2 font-bold uppercase tracking-widest text-[11px]">
          <ChevronLeft className="h-4 w-4" />Back
        </Button>
        <Button onClick={onNext} className="flex-1 h-12 gap-2 font-black uppercase tracking-widest text-[11px]">
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Step4Placeholder({
  onBack,
  onSubmit,
  isPending,
}: {
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Review & Generate</h2>
        <p className="text-sm text-muted-foreground mt-1">Confirm your choices and generate the QR code.</p>
      </div>
      <div className="h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground/50 text-sm italic">
        Summary card — coming in Phase 3
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 gap-2 font-bold uppercase tracking-widest text-[11px]" disabled={isPending}>
          <ChevronLeft className="h-4 w-4" />Back
        </Button>
        <Button onClick={onSubmit} disabled={isPending} className="flex-1 h-12 gap-2 font-black uppercase tracking-widest text-[11px]">
          {isPending ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Generating…</>
          ) : (
            <><QrCode className="h-4 w-4" aria-hidden="true" />Generate QR</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Result View ──────────────────────────────────────────────────────────────

function ResultView({
  created,
  sendEmail,
  setSendEmail,
  sendingEmail,
  copied,
  showPayload,
  setShowPayload,
  onCopy,
  onDownloadSVG,
  onDownloadJPG,
  onSendEmail,
  onReset,
  qrRef,
}: {
  created: CreatedQR;
  sendEmail: string;
  setSendEmail: (v: string) => void;
  sendingEmail: boolean;
  copied: boolean;
  showPayload: boolean;
  setShowPayload: (v: boolean | ((prev: boolean) => boolean)) => void;
  onCopy: () => void;
  onDownloadSVG: () => void;
  onDownloadJPG: () => void;
  onSendEmail: () => void;
  onReset: () => void;
  qrRef: React.RefObject<HTMLDivElement>;
}) {
  const qrValue = created.shortUrl ?? created.qrString;

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-success/30 bg-success/5">
        <CheckCircle2 className="h-6 w-6 text-success shrink-0" aria-hidden="true" />
        <div>
          <p className="font-black text-foreground uppercase tracking-tight text-sm">QR Code Generated!</p>
          <p className="text-xs text-muted-foreground mt-0.5">Type: <span className="font-bold text-foreground">{created.type}</span></p>
        </div>
      </div>

      {/* QR display */}
      <div
        ref={qrRef}
        className="flex justify-center rounded-2xl border-2 border-border bg-white p-8 shadow-sm"
        aria-label="Generated QR code"
      >
        <QRCode value={qrValue} size={200} bgColor="#ffffff" fgColor="#0f172a" level="L" />
      </div>

      {/* Short URL */}
      {created.shortUrl ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
          <Link2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-primary">{created.shortUrl}</span>
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary uppercase tracking-wider">encoded in QR</span>
        </div>
      ) : (
        <p className="text-center text-xs text-warning">Short link unavailable — full payload encoded in QR.</p>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={onCopy} variant="outline" className="gap-2 rounded-xl font-bold text-xs h-10">
          {copied ? <><Check className="h-3.5 w-3.5 text-success" />Copied!</> : <><Copy className="h-3.5 w-3.5" />{created.shortUrl ? 'Copy URL' : 'Copy'}</>}
        </Button>
        <Button onClick={onDownloadSVG} variant="outline" className="gap-2 rounded-xl font-bold text-xs h-10">
          <Download className="h-3.5 w-3.5" aria-hidden="true" />SVG
        </Button>
        <Button onClick={onDownloadJPG} variant="outline" className="gap-2 rounded-xl font-bold text-xs h-10">
          <ImageDown className="h-3.5 w-3.5" aria-hidden="true" />JPG
        </Button>
      </div>

      {/* Full signed payload — collapsed */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowPayload((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-xs text-muted-foreground hover:bg-muted/30 transition-colors"
          aria-expanded={showPayload}
        >
          <span className="font-bold uppercase tracking-widest text-[10px]">Full signed payload</span>
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showPayload && 'rotate-180')} aria-hidden="true" />
        </button>
        {showPayload && (
          <div className="border-t bg-slate-900 px-4 py-3">
            <p className="break-all font-mono text-xs leading-relaxed text-sky-300">{created.qrString}</p>
          </div>
        )}
      </div>

      {/* Send QR Link */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          Send QR Link
        </p>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            className="flex-1 h-10 rounded-xl text-sm"
            aria-label="Recipient email address"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={onSendEmail}
            disabled={sendingEmail || !sendEmail}
            className="h-10 px-4 rounded-xl font-bold"
          >
            {sendingEmail
              ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-foreground" />
              : 'Send'}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <Button onClick={onReset} variant="outline" className="flex-1 h-11 gap-2 font-bold text-xs">
          <ListRestart className="h-4 w-4" aria-hidden="true" />Create another
        </Button>
        <Button asChild className="flex-1 h-11 font-bold text-xs">
          <Link href="/dashboard/qrcodes">View all QR codes</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateQRClient({
  organizationId,
  gates,
  currentProject,
  contacts: _contacts, // passed through; will be used in Phase 3 (Step 3 guest picker)
}: {
  organizationId: string;
  gates: Gate[];
  currentProject: Project | null;
  contacts: Contact[];
}) {
  // _contacts will be used in Phase 3 for the guest contact picker
  void _contacts;
  // Wizard step (1–4)
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Step 1 state
  const [type, setType] = useState<QRCodeType>(QRCodeType.SINGLE);

  // Step 2 state
  const [gateId, setGateId] = useState('');
  const [maxUses, setMaxUses] = useState('10');
  const [expiresAt, setExpiresAt] = useState(defaultExpiry());

  // Step 3 guest state (used in Phase 3)
  const [visitorMode, setVisitorMode] = useState<'contact' | 'manual'>('contact');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Result & UI state
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [created, setCreated] = useState<CreatedQR | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Navigation helpers
  const goForward = () => { setDirection(1); setStep((s) => s + 1); };
  const goBack = () => { setDirection(-1); setStep((s) => s - 1); };

  // Suppress unused variable warnings — these will be wired in Phase 3
  void visitorMode; void setVisitorMode;
  void selectedContactId; void setSelectedContactId;
  void guestName; void setGuestName;
  void guestEmail; void setGuestEmail;
  void guestPhone; void setGuestPhone;

  const showMaxUses = type === QRCodeType.RECURRING;
  const showExpiry = type !== QRCodeType.PERMANENT;

  // Generate QR (called from Step 4)
  function submit() {
    setError(null);
    if (!organizationId) return;
    if (showMaxUses && (isNaN(parseInt(maxUses)) || parseInt(maxUses) < 1)) {
      return setError('Max uses must be a positive number.');
    }
    if (showExpiry && expiresAt && new Date(expiresAt) <= new Date()) {
      return setError('Expiry must be in the future.');
    }

    startTransition(async () => {
      const result = await createQRCode({
        organizationId,
        type,
        gateId: gateId || null,
        maxUses: showMaxUses ? parseInt(maxUses) : null,
        expiresAt: showExpiry && expiresAt ? new Date(expiresAt).toISOString() : null,
        // Guest fields (Phase 3 wires these; empty string → null)
        guestName: guestName || null,
        guestEmail: guestEmail || null,
        guestPhone: guestPhone || null,
        contactId: selectedContactId || null,
      });

      if (result?.success) {
        setCreated({ qrString: result.qrString!, qrId: result.qrId!, type, shortUrl: result.shortUrl });
        setShowPayload(false);
        if (!sendEmail && guestEmail) setSendEmail(guestEmail);
      } else {
        setError(result?.error ?? 'Failed to generate QR code.');
      }
    });
  }

  function copy() {
    if (!created) return;
    navigator.clipboard.writeText(created.shortUrl ?? created.qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSendEmail() {
    if (!sendEmail || !created) return;
    setSendingEmail(true);
    try {
      const res = await fetch('/api/qr/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrId: created.qrId, email: sendEmail, shortUrl: created.shortUrl }),
      });
      const json = await res.json() as { success: boolean; message?: string };
      if (!json.success) throw new Error(json.message ?? 'Failed to send email');
      toast.success(`Link sent to ${sendEmail}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  }

  function downloadSVG() {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gateflow-qr-${created?.qrId ?? 'code'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadJPG() {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const scale = 4;
    canvas.width = 200 * scale;
    canvas.height = 200 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gateflow-qr-${created?.qrId ?? 'code'}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        },
        'image/jpeg',
        0.95
      );
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }

  function resetWizard() {
    setStep(1);
    setDirection(1);
    setType(QRCodeType.SINGLE);
    setGateId('');
    setMaxUses('10');
    setExpiresAt(defaultExpiry());
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setSelectedContactId('');
    setCreated(null);
    setSendEmail('');
    setError(null);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  if (created) {
    return (
      <Card className="rounded-3xl border-border shadow-none">
        <CardContent className="p-6 sm:p-8">
          <ResultView
            created={created}
            sendEmail={sendEmail}
            setSendEmail={setSendEmail}
            sendingEmail={sendingEmail}
            copied={copied}
            showPayload={showPayload}
            setShowPayload={setShowPayload}
            onCopy={copy}
            onDownloadSVG={downloadSVG}
            onDownloadJPG={downloadJPG}
            onSendEmail={handleSendEmail}
            onReset={resetWizard}
            qrRef={qrRef as React.RefObject<HTMLDivElement>}
          />
        </CardContent>
      </Card>
    );
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -40, opacity: 0 }),
  };

  return (
    <Card className="rounded-3xl border-border shadow-none">
      <CardContent className="p-6 sm:p-8">
        <StepIndicator current={step} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <Step1 type={type} setType={setType} onNext={goForward} />
            )}
            {step === 2 && (
              <Step2
                type={type}
                gateId={gateId}
                setGateId={setGateId}
                maxUses={maxUses}
                setMaxUses={setMaxUses}
                expiresAt={expiresAt}
                setExpiresAt={setExpiresAt}
                gates={gates}
                currentProject={currentProject}
                error={error}
                onBack={goBack}
                onNext={goForward}
              />
            )}
            {step === 3 && (
              <Step3Placeholder onBack={goBack} onNext={goForward} />
            )}
            {step === 4 && (
              <Step4Placeholder onBack={goBack} onSubmit={submit} isPending={isPending} />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
