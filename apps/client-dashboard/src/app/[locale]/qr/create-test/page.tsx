'use client';

import { type CSSProperties, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { QRCodeType } from '@gate-access/types';
import { createTestQR, type CreateTestQRInput } from './actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  /** Display-only metadata — NOT embedded in the QR payload (no PII in QR). */
  label: string;
  email: string;
  role: string;
  /** Payload fields */
  organizationId: string;
  type: QRCodeType;
  maxUses: string;
  expiresAt: string;
}

interface GeneratedQR {
  qrString: string;
  qrId: string;
  nonce: string;
  /** Short URL encoded in the QR (present when shortlink was persisted). */
  shortUrl?: string;
  /** Mirrored from form for display */
  label: string;
  email: string;
  role: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultExpiresAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDThh:mm" for datetime-local
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateTestQRPage() {
  const [form, setForm] = useState<FormState>({
    label: '',
    email: '',
    role: 'guest',
    organizationId: process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ?? '',
    type: QRCodeType.SINGLE,
    maxUses: '5',
    expiresAt: defaultExpiresAt(),
  });
  const [generated, setGenerated] = useState<GeneratedQR | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // ── Form helpers ─────────────────────────────────────────────────────────

  const field =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setError(null);
    };

  const setType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, type: e.target.value as QRCodeType }));
    setError(null);
  };

  // ── Client-side validation ────────────────────────────────────────────────

  const validate = (): string | null => {
    if (!form.organizationId.trim()) return 'Organization ID is required.';
    if (form.email && !isValidEmail(form.email)) return 'Enter a valid email address.';
    if (form.type !== QRCodeType.PERMANENT && form.expiresAt) {
      if (new Date(form.expiresAt) <= new Date()) return 'Expiry must be in the future.';
    }
    if (form.type === QRCodeType.RECURRING) {
      const n = parseInt(form.maxUses, 10);
      if (isNaN(n) || n < 1) return 'Max uses must be a positive integer.';
    }
    return null;
  };

  // ── Generate ──────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    setError(null);

    const input: CreateTestQRInput = {
      organizationId: form.organizationId.trim(),
      type: form.type,
      maxUses:
        form.type === QRCodeType.RECURRING ? parseInt(form.maxUses, 10) : null,
      expiresAt:
        form.type !== QRCodeType.PERMANENT && form.expiresAt
          ? new Date(form.expiresAt).toISOString()
          : null,
    };

    const result = await createTestQR(input);
    setIsLoading(false);

    if (result.success) {
      setGenerated({
        qrString: result.qrString!,
        qrId: result.qrId!,
        nonce: result.nonce!,
        shortUrl: result.shortUrl,
        label: form.label,
        email: form.email,
        role: form.role,
      });
    } else {
      setError(result.error ?? 'Failed to generate QR code.');
    }
  };

  // ── Copy / Download ───────────────────────────────────────────────────────

  const handleCopy = async () => {
    if (!generated) return;
    // Copy the short URL when available — that's what's encoded in the QR
    await navigator.clipboard.writeText(generated.shortUrl ?? generated.qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  const handleDownloadSVG = () => {
    const svg = qrContainerRef.current?.querySelector('svg');
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gateflow-qr-${generated?.qrId ?? 'test'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const showMaxUses = form.type === QRCodeType.RECURRING;
  const showExpiry = form.type !== QRCodeType.PERMANENT;

  // The QR value: encode short URL when available (version 2, 25×25),
  // fallback to full payload if shortlink persistence failed.
  const qrValue = generated?.shortUrl ?? generated?.qrString ?? '';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={s.page}>
      <header style={s.pageHeader}>
        <h1 style={s.pageTitle}>QR Test Generator</h1>
        <p style={s.pageDesc}>
          Generate cryptographically signed GateFlow QR codes for scanner testing.
          The QR encodes a <strong>short URL</strong> (≈ version 2, 25×25 modules) instead
          of the raw payload — the scanner resolves it automatically.
          Signing happens server-side — <code>QR_SIGNING_SECRET</code> never reaches the browser.
        </p>
      </header>

      <div style={s.layout}>
        {/* ── Form ── */}
        <section style={s.card}>
          <h2 style={s.cardTitle}>Parameters</h2>

          {/* Display-only annotation fields */}
          <fieldset style={s.fieldset}>
            <legend style={s.legend}>Display only — not embedded in QR</legend>

            <label style={s.label}>Label</label>
            <input
              style={s.input}
              placeholder="e.g. John Smith — VIP Guest"
              value={form.label}
              onChange={field('label')}
            />

            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="guest@example.com"
              value={form.email}
              onChange={field('email')}
            />

            <label style={s.label}>Role</label>
            <select style={s.select} value={form.role} onChange={field('role')}>
              <option value="guest">Guest</option>
              <option value="vip">VIP</option>
              <option value="staff">Staff</option>
            </select>
          </fieldset>

          <div style={s.divider} />

          {/* Payload fields */}
          <label style={s.label}>
            Organization ID <span style={s.required}>*</span>
          </label>
          <input
            style={s.input}
            placeholder="clorg..."
            value={form.organizationId}
            onChange={field('organizationId')}
          />

          <label style={s.label}>
            QR Type <span style={s.required}>*</span>
          </label>
          <select style={s.select} value={form.type} onChange={setType}>
            <option value={QRCodeType.SINGLE}>SINGLE — one-time use</option>
            <option value={QRCodeType.RECURRING}>RECURRING — limited uses</option>
            <option value={QRCodeType.PERMANENT}>PERMANENT — unlimited</option>
          </select>

          {showMaxUses && (
            <>
              <label style={s.label}>
                Max Uses <span style={s.required}>*</span>
              </label>
              <input
                style={s.input}
                type="number"
                min="1"
                step="1"
                value={form.maxUses}
                onChange={field('maxUses')}
              />
            </>
          )}

          {showExpiry && (
            <>
              <label style={s.label}>Expires At</label>
              <input
                style={s.input}
                type="datetime-local"
                value={form.expiresAt}
                onChange={field('expiresAt')}
              />
            </>
          )}

          {error && <p style={s.errorMsg}>{error}</p>}

          <button
            style={{ ...s.btn, ...(isLoading ? s.btnBusy : {}) }}
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? 'Generating…' : 'Generate QR Code'}
          </button>
        </section>

        {/* ── Result ── */}
        <section style={s.card}>
          <h2 style={s.cardTitle}>Generated QR</h2>

          {!generated ? (
            <div style={s.emptyState}>
              <span style={s.emptyIcon}>⬜</span>
              <p style={s.emptyText}>Fill in the form and click Generate</p>
            </div>
          ) : (
            <>
              {/* Metadata summary */}
              <div style={s.metaBox}>
                {generated.label && (
                  <p style={s.metaRow}>
                    <strong>Label:</strong> {generated.label}
                  </p>
                )}
                {generated.email && (
                  <p style={s.metaRow}>
                    <strong>Email:</strong> {generated.email}
                  </p>
                )}
                <p style={s.metaRow}>
                  <strong>Role:</strong> {generated.role.toUpperCase()}
                </p>
                <p style={s.metaRow}>
                  <strong>QR ID:</strong>{' '}
                  <code style={s.inlineCode}>{generated.qrId}</code>
                </p>
                <p style={s.metaRow}>
                  <strong>Nonce:</strong>{' '}
                  <code style={s.inlineCode}>{generated.nonce}</code>
                </p>
                {generated.shortUrl && (
                  <p style={s.metaRow}>
                    <strong>Short URL:</strong>{' '}
                    <code style={s.inlineCode}>{generated.shortUrl}</code>
                    <span style={s.badge}>encoded in QR</span>
                  </p>
                )}
              </div>

              {/* QR code image — encodes short URL for compact output */}
              <div style={s.qrWrapper} ref={qrContainerRef}>
                <QRCode
                  value={qrValue}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="L"
                />
              </div>

              {generated.shortUrl && (
                <p style={s.qrHint}>
                  Scan with GateFlow Scanner — the app resolves the URL automatically.
                </p>
              )}

              {/* Full payload display (for debugging) */}
              <details style={{ marginTop: 8 }}>
                <summary style={s.detailsSummary}>Full signed payload</summary>
                <div style={s.codeBlock}>
                  <code style={s.codeText}>{generated.qrString}</code>
                </div>
              </details>

              {/* Action buttons */}
              <div style={s.actionRow}>
                <button style={s.actionBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied!' : generated.shortUrl ? 'Copy Short URL' : 'Copy QR String'}
                </button>
                <button style={s.actionBtn} onClick={handleDownloadSVG}>
                  Download SVG
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

// ─── Styles (inline — no Tailwind dependency required) ────────────────────────

const s: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1080,
    margin: '0 auto',
    padding: '40px 24px 64px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1e293b',
  },
  pageHeader: { marginBottom: 32 },
  pageTitle: { fontSize: 26, fontWeight: 800, margin: '0 0 8px', color: '#0f172a' },
  pageDesc: { fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.7 },
  layout: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  card: {
    flex: '1 1 360px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  cardTitle: { fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#0f172a' },
  fieldset: {
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '12px 16px 16px',
    marginBottom: 8,
  },
  legend: { fontSize: 11, color: '#94a3b8', padding: '0 6px', letterSpacing: 0.4 },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    marginTop: 10,
    marginBottom: 5,
  },
  required: { color: '#ef4444', marginLeft: 2 },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    fontSize: 14,
    color: '#0f172a',
    background: '#fff',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    fontSize: 14,
    color: '#0f172a',
    background: '#fff',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  divider: { borderTop: '1px solid #e2e8f0', margin: '12px 0', border: 'none' },
  errorMsg: {
    color: '#dc2626',
    fontSize: 13,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '8px 12px',
    margin: '6px 0 0',
  },
  btn: {
    marginTop: 18,
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
  },
  btnBusy: { opacity: 0.55, cursor: 'not-allowed' },

  // Result area
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 0',
    gap: 14,
  },
  emptyIcon: { fontSize: 48, opacity: 0.25 },
  emptyText: { color: '#94a3b8', fontSize: 14, margin: 0, textAlign: 'center' },
  metaBox: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  metaRow: { fontSize: 13, color: '#475569', margin: 0, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  inlineCode: {
    fontFamily: 'monospace',
    fontSize: 12,
    background: '#f1f5f9',
    padding: '1px 5px',
    borderRadius: 4,
  },
  badge: {
    fontSize: 10,
    fontWeight: 600,
    background: '#dbeafe',
    color: '#1d4ed8',
    padding: '1px 6px',
    borderRadius: 999,
    letterSpacing: 0.3,
  },
  qrWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    marginTop: 8,
  },
  qrHint: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    margin: '6px 0 0',
  },
  detailsSummary: {
    fontSize: 12,
    color: '#94a3b8',
    cursor: 'pointer',
    userSelect: 'none',
    marginTop: 4,
  },
  codeBlock: {
    marginTop: 6,
    background: '#0f172a',
    borderRadius: 8,
    padding: '10px 14px',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
  codeText: {
    color: '#7dd3fc',
    fontSize: 11,
    lineHeight: 1.7,
    fontFamily: 'monospace',
  },
  actionRow: { display: 'flex', gap: 10, marginTop: 10 },
  actionBtn: {
    flex: 1,
    background: '#fff',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '9px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
