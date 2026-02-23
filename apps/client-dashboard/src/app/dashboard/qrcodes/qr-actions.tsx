'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@gate-access/ui';
import { toast } from 'sonner';
import { toggleQRActive, deleteQR } from './actions';
import { Copy, Check, PowerOff, Power, Trash2 } from 'lucide-react';

export function QRCodeActions({
  qrId,
  isActive,
  code,
}: {
  qrId: string;
  isActive: boolean;
  code: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  function copy() {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        toast.success('QR code copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy — please try manually'));
  }

  function toggle() {
    startTransition(async () => {
      try {
        await toggleQRActive(qrId, !isActive);
        toast.success(isActive ? 'QR code deactivated' : 'QR code activated');
        router.refresh();
      } catch {
        toast.error('Failed to update QR code status');
      }
    });
  }

  function remove() {
    if (
      !window.confirm(
        'Delete this QR code? This cannot be undone.',
      )
    )
      return;
    startTransition(async () => {
      try {
        await deleteQR(qrId);
        toast.success('QR code deleted');
        router.refresh();
      } catch {
        toast.error('Failed to delete QR code');
      }
    });
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="QR code actions">
      {/* Copy */}
      <Button
        variant="ghost"
        size="sm"
        onClick={copy}
        aria-label="Copy QR code string"
        title="Copy QR string"
        className="gap-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span className="sr-only sm:not-sr-only">
          {copied ? 'Copied' : 'Copy'}
        </span>
      </Button>

      {/* Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggle}
        disabled={isPending}
        aria-label={isActive ? 'Deactivate QR code' : 'Activate QR code'}
        title={isActive ? 'Deactivate' : 'Activate'}
        className={isActive ? 'text-slate-500 hover:text-amber-700' : 'text-slate-500 hover:text-green-700'}
      >
        {isActive ? (
          <PowerOff className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Power className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span className="sr-only sm:not-sr-only ml-1.5">
          {isActive ? 'Deactivate' : 'Activate'}
        </span>
      </Button>

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        onClick={remove}
        disabled={isPending}
        aria-label="Delete QR code"
        title="Delete"
        className="text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only ml-1.5">Delete</span>
      </Button>
    </div>
  );
}
