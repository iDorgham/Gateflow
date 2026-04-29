'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gate-access/ui';
import { csrfFetch } from '@/lib/csrf';
import { ArrowLeft, CheckCircle2, FileUp, Mail, RotateCcw, Upload } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Gate {
  id: string;
  name: string;
}

interface ParsedRow {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  gate?: string;
  expiresAt?: string;
  _rowIndex: number;
  _errors: string[];
}

interface CreatedItem {
  index: number;
  qrId: string;
  qrString: string;
  name: string;
  email?: string;
}

interface BulkError {
  index: number;
  name: string;
  error: string;
}

interface EmailResult {
  name: string;
  email: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  error?: string;
}

type PageStatus = 'idle' | 'creating' | 'done' | 'emailing';

// ─── CSV parser ───────────────────────────────────────────────────────────────

const DISPLAY_HEADERS = ['name', 'email', 'phone', 'role', 'gate', 'expiresAt'];

function parseCSV(text: string): { rows: ParsedRow[]; parseError: string | null } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return { rows: [], parseError: 'CSV must have a header row and at least one data row.' };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const nameIdx = headers.indexOf('name');
  const emailIdx = headers.indexOf('email');
  const phoneIdx = headers.indexOf('phone');
  const roleIdx = headers.indexOf('role');
  const gateIdx = headers.indexOf('gate');
  const expiresIdx = headers.findIndex((h) => h === 'expiresat' || h === 'expires_at' || h === 'expiry');

  if (nameIdx === -1) {
    return { rows: [], parseError: 'CSV must have a "name" column.' };
  }

  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    const get = (idx: number) => (idx >= 0 && idx < cols.length ? cols[idx] || undefined : undefined);

    const name = get(nameIdx) ?? '';
    const email = get(emailIdx);
    const phone = get(phoneIdx);
    const role = get(roleIdx);
    const gate = get(gateIdx);
    const expiresAt = get(expiresIdx);

    const rowErrors: string[] = [];

    if (!name) rowErrors.push('Name is required');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) rowErrors.push('Invalid email format');
    if (expiresAt) {
      const d = new Date(expiresAt);
      if (isNaN(d.getTime())) rowErrors.push('Invalid date format (use ISO 8601, e.g. 2026-12-31T23:59)');
      else if (d <= new Date()) rowErrors.push('Expiry date must be in the future');
    }

    rows.push({ name, email, phone, role, gate, expiresAt, _rowIndex: i, _errors: rowErrors });
  }

  return { rows, parseError: null };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BulkQRClient({ gates }: { gates: Gate[] }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<PageStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [created, setCreated] = useState<CreatedItem[]>([]);
  const [bulkErrors, setBulkErrors] = useState<BulkError[]>([]);
  const [emailResults, setEmailResults] = useState<EmailResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gateNames = gates.map((g) => g.name);
  const validRows = rows.filter((r) => r._errors.length === 0);
  const invalidRows = rows.filter((r) => r._errors.length > 0);

  // ── File handling ─────────────────────────────────────────────────────────

  function processFile(file: File) {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setParseError('Please upload a .csv file.');
      setRows([]);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? '';
      const { rows: parsed, parseError: err } = parseCSV(text);
      setRows(parsed);
      setParseError(err);
      setStatus('idle');
      setCreated([]);
      setBulkErrors([]);
      setEmailResults([]);
    };
    reader.readAsText(file);
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  // ── Bulk create ───────────────────────────────────────────────────────────

  async function handleCreate() {
    if (validRows.length === 0) return;
    setStatus('creating');
    setProgress(0);

    const items = validRows.map((r) => ({
      name: r.name,
      ...(r.email && { email: r.email }),
      ...(r.phone && { phone: r.phone }),
      ...(r.role && { role: r.role }),
      ...(r.gate && { gate: r.gate }),
      ...(r.expiresAt && { expiresAt: r.expiresAt }),
      type: 'SINGLE' as const,
    }));

    // Simulate progress while waiting for the response
    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 5 : p));
    }, 300);

    try {
      const res = await csrfFetch('/api/qr/bulk-create', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });
      clearInterval(progressInterval);
      setProgress(100);

      const json = await res.json();
      if (!res.ok || !json.success) {
        setParseError(json.message ?? 'Failed to create QR codes.');
        setStatus('idle');
        return;
      }

      setCreated(json.data.created ?? []);
      setBulkErrors(json.data.errors ?? []);
      setStatus('done');
    } catch (err) {
      clearInterval(progressInterval);
      setParseError(`Network error: ${(err as Error).message}`);
      setStatus('idle');
    }
  }

  // ── Send emails ───────────────────────────────────────────────────────────

  async function handleSendEmails() {
    const withEmail = created.filter((c) => c.email);
    if (withEmail.length === 0) return;

    setStatus('emailing');
    setEmailResults(
      withEmail.map((c) => ({ name: c.name, email: c.email!, status: 'pending' }))
    );

    const results: EmailResult[] = withEmail.map((c) => ({
      name: c.name,
      email: c.email!,
      status: 'pending',
    }));

    for (let i = 0; i < withEmail.length; i++) {
      const item = withEmail[i];
      results[i] = { ...results[i], status: 'sending' };
      setEmailResults([...results]);

      try {
        const res = await csrfFetch('/api/qr/send-email', {
          method: 'POST',
          body: JSON.stringify({
            qrString: item.qrString,
            qrId: item.qrId,
            recipientEmail: item.email,
            recipientName: item.name,
          }),
        });
        const json = await res.json();
        results[i] = {
          ...results[i],
          status: res.ok && json.success ? 'sent' : 'failed',
          error: !res.ok || !json.success ? (json.message ?? 'Delivery failed') : undefined,
        };
      } catch (err) {
        results[i] = { ...results[i], status: 'failed', error: (err as Error).message };
      }

      setEmailResults([...results]);
    }

    setStatus('done');
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function reset() {
    setRows([]);
    setParseError(null);
    setFileName(null);
    setStatus('idle');
    setProgress(0);
    setCreated([]);
    setBulkErrors([]);
    setEmailResults([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const createdWithEmail = created.filter((c) => c.email);

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bulk QR Creation</h1>
          <p className="text-sm text-slate-500">
            Upload a CSV file to generate multiple QR access codes at once.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/dashboard/qrcodes">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to QR Codes
          </Link>
        </Button>
      </div>

      {/* Upload area */}
      {status === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload CSV File</CardTitle>
            <CardDescription>
              Required columns:{' '}
              <code className="rounded bg-slate-100 px-1 text-xs">name</code>.&ensp;Optional:{' '}
              {['email', 'phone', 'role', 'gate', 'expiresAt'].map((c) => (
                <code key={c} className="mr-1 rounded bg-slate-100 px-1 text-xs">
                  {c}
                </code>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gate reference */}
            {gateNames.length > 0 && (
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <p className="mb-1 font-medium text-slate-700">Available gates:</p>
                <p className="text-slate-500">{gateNames.join(', ')}</p>
              </div>
            )}

            {/* CSV format hint */}
            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="mb-1 text-xs font-medium text-slate-500">Example CSV format:</p>
              <pre className="overflow-x-auto text-xs leading-relaxed text-slate-600">
{`name,email,phone,role,gate,expiresAt
John Doe,john@example.com,0123456789,VIP,Main Gate,2026-12-31T23:59
Jane Smith,jane@example.com,,,, 2026-06-15`}
              </pre>
            </div>

            {/* Drag-and-drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
              }`}
            >
              {fileName ? (
                <FileUp
                  className="mb-3 h-10 w-10 text-blue-500"
                  aria-hidden="true"
                />
              ) : (
                <Upload
                  className="mb-3 h-10 w-10 text-slate-400"
                  aria-hidden="true"
                />
              )}
              <p className="text-sm font-medium text-slate-700">
                {fileName ?? 'Drag & drop your CSV here, or click to browse'}
              </p>
              <p className="mt-1 text-xs text-slate-400">Supports .csv files up to 500 rows</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleFileChange}
            />

            {/* Parse error */}
            {parseError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {parseError}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview table */}
      {rows.length > 0 && status === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Preview — {rows.length} row{rows.length !== 1 ? 's' : ''} parsed
              {invalidRows.length > 0 && (
                <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs text-red-600">
                  {invalidRows.length} with errors
                </span>
              )}
              {validRows.length > 0 && (
                <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                  {validRows.length} valid
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Showing first {Math.min(rows.length, 10)} rows. Rows with errors will be skipped.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-slate-50">
                  <tr className="text-left text-xs font-medium text-slate-500">
                    <th className="px-3 py-2">#</th>
                    {DISPLAY_HEADERS.map((h) => (
                      <th key={h} className="px-3 py-2">
                        {h}
                      </th>
                    ))}
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.slice(0, 10).map((row) => (
                    <tr
                      key={row._rowIndex}
                      className={row._errors.length > 0 ? 'bg-red-50' : 'hover:bg-slate-50'}
                    >
                      <td className="px-3 py-2 text-slate-400">{row._rowIndex}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">{row.name || '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{row.email || '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{row.phone || '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{row.role || '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{row.gate || '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{row.expiresAt || '—'}</td>
                      <td className="px-3 py-2">
                        {row._errors.length === 0 ? (
                          <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                            Valid
                          </span>
                        ) : (
                          <span
                            title={row._errors.join('; ')}
                            className="cursor-help rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600"
                          >
                            {row._errors.length} error{row._errors.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 10 && (
              <p className="border-t px-4 py-2 text-xs text-slate-400">
                + {rows.length - 10} more rows not shown
              </p>
            )}
          </CardContent>
          {/* Actions */}
          <div className="flex gap-3 border-t px-6 py-4">
            <Button variant="outline" onClick={reset}>
              Change file
            </Button>
            <Button
              onClick={handleCreate}
              disabled={validRows.length === 0}
              className="flex-1 sm:flex-none"
            >
              Create {validRows.length} QR Code{validRows.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </Card>
      )}

      {/* Progress bar */}
      {status === 'creating' && (
        <Card>
          <CardContent className="px-6 py-8">
            <p className="mb-3 text-sm font-medium text-slate-700">
              Creating {validRows.length} QR code{validRows.length !== 1 ? 's' : ''}…
            </p>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">{progress}% — please wait</p>
          </CardContent>
        </Card>
      )}

      {/* Results summary */}
      {status === 'done' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Creation Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Success count */}
              {created.length > 0 && (
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {created.length} QR code{created.length !== 1 ? 's' : ''} created successfully
                    </p>
                    <p className="text-xs text-green-600">
                      They are now active and visible in QR Codes list.
                    </p>
                  </div>
                </div>
              )}

              {/* Error count */}
              {bulkErrors.length > 0 && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="mb-2 text-sm font-medium text-amber-800">
                    {bulkErrors.length} row{bulkErrors.length !== 1 ? 's' : ''} skipped:
                  </p>
                  <ul className="space-y-1">
                    {bulkErrors.map((e) => (
                      <li key={e.index} className="text-xs text-amber-700">
                        Row {e.index} (<strong>{e.name}</strong>): {e.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button variant="outline" onClick={reset} className="gap-2">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Upload another CSV
                </Button>
                <Button asChild>
                  <Link href="/dashboard/qrcodes">View all QR Codes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email delivery section */}
          {createdWithEmail.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Delivery</CardTitle>
                <CardDescription>
                  {createdWithEmail.length} recipient{createdWithEmail.length !== 1 ? 's' : ''}{' '}
                  have email addresses. Send their QR codes directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email results list */}
                {emailResults.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-slate-50">
                        <tr className="text-left text-xs font-medium text-slate-500">
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {emailResults.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-medium text-slate-900">{r.name}</td>
                            <td className="px-3 py-2 text-slate-600">{r.email}</td>
                            <td className="px-3 py-2">
                              {r.status === 'pending' && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                                  Pending
                                </span>
                              )}
                              {r.status === 'sending' && (
                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600">
                                  Sending…
                                </span>
                              )}
                              {r.status === 'sent' && (
                                <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                                  Sent ✓
                                </span>
                              )}
                              {r.status === 'failed' && (
                                <span
                                  title={r.error}
                                  className="cursor-help rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600"
                                >
                                  Failed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {emailResults.length === 0 && (
                  <Button onClick={handleSendEmails} className="gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Send QR Codes to {createdWithEmail.length} recipient
                    {createdWithEmail.length !== 1 ? 's' : ''}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
