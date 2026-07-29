'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Download, Trash2 } from 'lucide-react';
import { Button } from '@gateflow/ui';
import {
  buildResidentVisitorRevokePath,
  buildVisitorSharePayload,
} from '@/lib/pilot-ux';

type Props = {
  visitorId: string;
  visitorName: string;
  qrCode: string;
  isActive: boolean;
};

async function downloadQrSvg(qrCode: string, fileBase: string) {
  const escaped = qrCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  // Prefer on-page SVG QR; fall back to signed payload text file.
  const existing = document.querySelector(
    '[data-testid="visitor-qr-code"] svg'
  );
  let blob: Blob;
  let filename: string;
  if (existing) {
    const serializer = new XMLSerializer();
    const svg = serializer.serializeToString(existing);
    blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    filename = `${fileBase}.svg`;
  } else {
    blob = new Blob([escaped], { type: 'text/plain;charset=utf-8' });
    filename = `${fileBase}.txt`;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function VisitorPassActions({
  visitorId,
  visitorName,
  qrCode,
  isActive,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onShare = async () => {
    setError(null);
    try {
      const payload = buildVisitorSharePayload({ visitorName, qrCode });
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(payload);
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload.text);
        setError('Pass copied to clipboard.');
        return;
      }
      setError('Sharing is not available on this device.');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Could not share this pass.');
    }
  };

  const onDownload = async () => {
    setError(null);
    try {
      const base = `gateflow-pass-${visitorId.slice(-6)}`;
      await downloadQrSvg(qrCode, base);
    } catch {
      setError('Could not download this pass.');
    }
  };

  const onRevoke = () => {
    if (!isActive) return;
    const confirmed = window.confirm(
      'Revoke this pass? The QR will stop working immediately.'
    );
    if (!confirmed) return;

    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          const res = await fetch(buildResidentVisitorRevokePath(visitorId), {
            method: 'DELETE',
            credentials: 'include',
          });
          if (!res.ok) {
            setError(
              res.status === 401 || res.status === 403
                ? 'Sign in again to revoke this pass.'
                : 'Could not revoke this pass.'
            );
            return;
          }
          router.push('/visitors');
          router.refresh();
        } catch {
          setError('Could not revoke this pass.');
        }
      })();
    });
  };

  return (
    <div className="w-full space-y-3">
      {error ? (
        <p role="status" className="text-sm text-slate-600">
          {error}
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button
          type="button"
          className="flex-1 h-12 gap-2 text-base shadow-md"
          disabled={!qrCode || pending}
          onClick={() => void onShare()}
        >
          <Share2 className="h-5 w-5" />
          Share Pass
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 w-12 p-0 shadow-sm"
          disabled={!qrCode || pending}
          aria-label="Download pass"
          onClick={() => void onDownload()}
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 gap-2 text-red-600 border-red-200 hover:bg-red-50"
        disabled={!isActive || pending}
        onClick={onRevoke}
      >
        <Trash2 className="h-5 w-5" />
        {pending ? 'Revoking…' : isActive ? 'Revoke Pass' : 'Already revoked'}
      </Button>
    </div>
  );
}
