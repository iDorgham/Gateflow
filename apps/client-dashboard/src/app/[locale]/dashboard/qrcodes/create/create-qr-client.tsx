'use client';

import { useState, useTransition, useRef } from 'react';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gate-access/ui';
import { toast } from 'sonner';
import { createQRCode } from './actions';
import { QRCodeType } from '@gate-access/types';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  ImageDown,
  Infinity,
  Link2,
  ListRestart,
  QrCode,
  RefreshCw,
  Sparkles,
  User,
  Send,
} from 'lucide-react';

interface Gate {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface ContactUnit {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  units: ContactUnit[];
}

interface CreatedQR {
  qrString: string;
  qrId: string;
  type: string;
  /** Short URL encoded in the QR (absent only if shortlink persistence failed). */
  shortUrl?: string;
}

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 16);
}

export function CreateQRClient({
  organizationId,
  gates,
  currentProject,
  contacts,
}: {
  organizationId: string;
  gates: Gate[];
  currentProject: Project | null;
  contacts: Contact[];
}) {
  const [visitorMode, setVisitorMode] = useState<'manual' | 'contact'>('manual');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [type, setType] = useState<QRCodeType>(QRCodeType.SINGLE);
  const [gateId, setGateId] = useState('');
  const [maxUses, setMaxUses] = useState('10');
  const [expiresAt, setExpiresAt] = useState(defaultExpiry());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [created, setCreated] = useState<CreatedQR | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) ?? null;
  const filteredContacts = contacts.filter((c) => {
    const q = contactSearch.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    );
  });

  const showMaxUses = type === QRCodeType.RECURRING;
  const showExpiry = type !== QRCodeType.PERMANENT;

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
        expiresAt:
          showExpiry && expiresAt ? new Date(expiresAt).toISOString() : null,
      });

      if (result?.success) {
        setCreated({
          qrString: result.qrString!,
          qrId: result.qrId!,
          type,
          shortUrl: result.shortUrl,
        });
        setShowPayload(false);
        // Pre-fill send email from contact if applicable
        if (visitorMode === 'contact' && selectedContact?.email && !sendEmail) {
          setSendEmail(selectedContact.email);
        }
      } else {
        setError(result?.error ?? 'Failed to generate QR code.');
      }
    });
  }

  function copy() {
    if (!created) return;
    // Copy the short URL when available — that's what's encoded in the QR.
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
      const json = await res.json();
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
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: 'image/svg+xml',
    });
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
    const scale = 4; // high-res output
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

  // The QR encodes the short URL when available (version ~2, 25×25 modules),
  // falling back to the full signed payload only if shortlink persistence failed.
  const qrValue = created?.shortUrl ?? created?.qrString ?? '';

  if (created) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-green-700">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            QR Code Created!
          </CardTitle>
          <CardDescription>
            Scan or share this QR code to grant access. Type:{' '}
            <strong>{created.type}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR display — compact because it encodes a short URL */}
          <div
            ref={qrRef}
            className="flex justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm"
          >
            <QRCode
              value={qrValue}
              size={200}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="L"
            />
          </div>

          {/* Short URL label */}
          {created.shortUrl ? (
            <div className="flex items-center gap-2 rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-3 py-2">
              <Link2
                className="h-3.5 w-3.5 shrink-0 text-blue-500"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-blue-700 dark:text-blue-400">
                {created.shortUrl}
              </span>
              <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                encoded in QR
              </span>
            </div>
          ) : (
            // Fallback: short link failed — full payload was used
            <p className="text-center text-xs text-amber-600">
              Short link unavailable — full payload encoded in QR.
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button onClick={copy} variant="outline" className="flex-1 gap-2">
              {copied ? (
                <>
                  <Check
                    className="h-4 w-4 text-green-600"
                    aria-hidden="true"
                  />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  {created.shortUrl ? 'Copy Short URL' : 'Copy Payload'}
                </>
              )}
            </Button>
            <Button
              onClick={downloadSVG}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download SVG
            </Button>
            <Button
              onClick={downloadJPG}
              variant="outline"
              className="flex-1 gap-2"
            >
              <ImageDown className="h-4 w-4" aria-hidden="true" />
              Download JPG
            </Button>
          </div>

          {/* Full signed payload — collapsed by default */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowPayload((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span>Full signed payload</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showPayload ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {showPayload && (
              <div className="border-t bg-slate-900 px-3 py-2.5">
                <p className="break-all font-mono text-xs leading-relaxed text-sky-300">
                  {created.qrString}
                </p>
              </div>
            )}
          </div>

          {/* Send QR Link section */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-2">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              Send QR Link
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendEmail}
                disabled={sendingEmail || !sendEmail}
              >
                {sendingEmail ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                ) : (
                  'Send Link'
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 border-t pt-4">
            <Button
              onClick={() => setCreated(null)}
              variant="outline"
              className="flex-1 gap-2"
            >
              <ListRestart className="h-4 w-4" aria-hidden="true" />
              Create another
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard/qrcodes">View all QR codes</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">QR Code Details</CardTitle>
        <CardDescription>
          The QR payload is signed server-side — the signing secret never
          reaches your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visitor mode tab switcher */}
        {contacts.length > 0 && (
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setVisitorMode('contact')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                visitorMode === 'contact'
                  ? 'bg-primary/10 text-primary border-r border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-700'
              }`}
            >
              <User className="h-4 w-4" aria-hidden="true" />
              From Contact
            </button>
            <button
              type="button"
              onClick={() => setVisitorMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                visitorMode === 'manual'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Manual
            </button>
          </div>
        )}

        {/* From Contact panel */}
        {visitorMode === 'contact' && contacts.length > 0 && (
          <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <div className="space-y-1.5">
              <Label>Select Contact</Label>
              <input
                type="text"
                placeholder="Search by name or email…"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y">
                {filteredContacts.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-3">No contacts found</p>
                ) : (
                  filteredContacts.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedContactId(c.id);
                        setContactSearch(`${c.firstName} ${c.lastName}`);
                        if (c.email) setSendEmail(c.email);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        selectedContactId === c.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : ''
                      }`}
                    >
                      <div className="font-medium">{c.firstName} {c.lastName}</div>
                      {c.email && <div className="text-xs text-slate-500">{c.email}</div>}
                    </button>
                  ))
                )}
              </div>
            </div>
            {selectedContact && (
              <div className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 p-3 space-y-1.5">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Selected: {selectedContact.firstName} {selectedContact.lastName}</p>
                {selectedContact.email && <p className="text-xs text-slate-600 dark:text-slate-400">Email: {selectedContact.email}</p>}
                {selectedContact.phone && <p className="text-xs text-slate-600 dark:text-slate-400">Phone: {selectedContact.phone}</p>}
                {selectedContact.units.length > 0 && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Units: {selectedContact.units.map((u) => u.name).join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Project indicator */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Project:
          </span>
          {currentProject ? (
            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-400">
              {currentProject.name}
            </span>
          ) : (
            <span className="text-xs italic text-slate-400">
              None (All Projects mode)
            </span>
          )}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label>QR Code Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                value: QRCodeType.SINGLE,
                label: 'Single Use',
                desc: 'One scan only',
                icon: QrCode,
              },
              {
                value: QRCodeType.RECURRING,
                label: 'Recurring',
                desc: 'Limited uses',
                icon: RefreshCw,
              },
              {
                value: QRCodeType.PERMANENT,
                label: 'Permanent',
                desc: 'Unlimited',
                icon: Infinity,
              },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                    type === t.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon
                    className={`mb-1.5 h-4 w-4 ${type === t.value ? 'text-blue-600' : 'text-slate-400'}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`font-medium ${type === t.value ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    {t.label}
                  </div>
                  <div className="text-xs text-slate-500">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gate */}
        <div className="space-y-1.5">
          <Label htmlFor="gate">Gate (optional)</Label>
          <select
            id="gate"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any gate</option>
            {gates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Max uses (RECURRING only) */}
        {showMaxUses && (
          <div className="space-y-1.5">
            <Label htmlFor="maxUses">Max Uses</Label>
            <Input
              id="maxUses"
              type="number"
              min="1"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
          </div>
        )}

        {/* Expiry (non-PERMANENT) */}
        {showExpiry && (
          <div className="space-y-1.5">
            <Label htmlFor="expiry">Expires At (optional)</Label>
            <Input
              id="expiry"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        )}

        <Button className="w-full gap-2" onClick={submit} disabled={isPending}>
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating…
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Generate QR Code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
