'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  QrCode,
  DoorOpen,
  User,
  Hash,
  Calendar,
  BarChart2,
  Download,
  ImageDown,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { Button, cn } from '@gateflow/ui';
import { toast } from 'sonner';
import type { QRCodeRow } from '@/lib/qrcodes/use-qrcodes';
import {
  QR_PRINT_BG,
  QR_PRINT_FG,
  downloadQrJpg,
  downloadQrSvg,
} from '@/lib/qr/qr-print';

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  ACTIVE: {
    bg: 'bg-[var(--ds-background-success-subtle)]',
    text: 'text-[var(--ds-text-success)]',
    dot: 'bg-[var(--ds-background-success-bold)]',
    label: 'Active',
  },
  INACTIVE: {
    bg: 'bg-[var(--ds-background-neutral-subtle)]',
    text: 'text-[var(--ds-text-subtlest)]',
    dot: 'bg-[var(--ds-icon-subtle)]',
    label: 'Inactive',
  },
  EXPIRED: {
    bg: 'bg-[var(--ds-background-warning-subtle)]',
    text: 'text-[var(--ds-text-warning-inverse)]',
    dot: 'bg-[var(--ds-background-warning-bold)]',
    label: 'Expired',
  },
  MAX_USES_REACHED: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    dot: 'bg-primary',
    label: 'Max Uses',
  },
  REVOKED: {
    bg: 'bg-[var(--ds-background-danger-subtle)]',
    text: 'text-[var(--ds-text-danger)]',
    dot: 'bg-[var(--ds-background-danger-bold)]',
    label: 'Revoked',
  },
};

interface QRDetailDrawerProps {
  qr: QRCodeRow | null;
  locale: string;
  onClose: () => void;
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon
          className="h-3 w-3 text-[var(--ds-icon-subtle)]"
          aria-hidden="true"
        />
        <dt className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
          {label}
        </dt>
      </div>
      <dd className="ps-4">{children}</dd>
    </div>
  );
}

export function QRDetailDrawer({ qr, locale, onClose }: QRDetailDrawerProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  function handleDownloadSvg() {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg || !qr) return;
    downloadQrSvg(svg, `gateflow-qr-${qr.id}.svg`);
  }

  function handleDownloadJpg() {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg || !qr) return;
    downloadQrJpg(svg, `gateflow-qr-${qr.id}.jpg`).catch((error) => {
      toast.error('Failed to export QR code as JPG');
      console.error('JPG export failed:', error);
    });
  }

  return (
    <AnimatePresence>
      {qr && (
        <>
          {/* Backdrop */}
          <motion.div
            key="qr-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="qr-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 end-0 z-50 w-96 max-w-full bg-[var(--ds-surface)] bg-background border-s border-[var(--ds-border)] shadow-xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="QR code details"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ds-border)] shrink-0 bg-[var(--ds-background-neutral-subtle)]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                QR Code Details
              </p>
              <button
                onClick={onClose}
                className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-[var(--ds-background-neutral)] text-[var(--ds-icon-subtle)] transition-colors"
                aria-label="Close QR code details"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Status lozenge */}
              {(() => {
                const s = STATUS_CONFIG[qr.status] ?? STATUS_CONFIG.INACTIVE;
                return (
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
                      s.bg,
                      s.text
                    )}
                  >
                    <span
                      className={cn('h-1.5 w-1.5 rounded-full shrink-0', s.dot)}
                      aria-hidden="true"
                    />
                    {s.label}
                  </div>
                );
              })()}

              <div
                ref={qrRef}
                className="flex justify-center rounded-[8px] border border-[var(--ds-border)] bg-white p-4"
                aria-label="QR code preview"
              >
                <QRCode
                  value={qr.code}
                  size={192}
                  bgColor={QR_PRINT_BG}
                  fgColor={QR_PRINT_FG}
                  level="M"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 gap-2 rounded-[8px] text-xs font-bold"
                  onClick={handleDownloadSvg}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download SVG
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 gap-2 rounded-[8px] text-xs font-bold"
                  onClick={handleDownloadJpg}
                >
                  <ImageDown className="h-3.5 w-3.5" aria-hidden="true" />
                  Download JPG
                </Button>
              </div>

              <dl className="space-y-4">
                <Field icon={QrCode} label="QR Code">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-primary break-all">
                      {qr.code}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                      {qr.type}
                    </span>
                  </div>
                </Field>

                {qr.guestName && (
                  <Field icon={User} label="QR Holder">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-[var(--ds-text)]">
                        {qr.guestName}
                      </span>
                      {qr.guestEmail && (
                        <span className="text-xs text-[var(--ds-text-subtle)]">
                          {qr.guestEmail}
                        </span>
                      )}
                    </div>
                  </Field>
                )}

                {qr.gateName && (
                  <Field icon={DoorOpen} label="Gate / Entry Point">
                    <span className="text-sm font-semibold text-[var(--ds-text)]">
                      {qr.gateName}
                    </span>
                  </Field>
                )}

                <Field icon={BarChart2} label="Usage">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[var(--ds-text)]">
                      {qr.currentUses}
                    </span>
                    {qr.maxUses !== null && (
                      <span className="text-xs text-[var(--ds-text-subtle)]">
                        / {qr.maxUses} max
                      </span>
                    )}
                  </div>
                </Field>

                <Field icon={Calendar} label="Issued">
                  <span className="text-sm font-semibold text-[var(--ds-text)]">
                    {new Date(qr.createdAt).toLocaleString(locale, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </Field>

                {qr.expiresAt && (
                  <Field icon={Calendar} label="Expires">
                    <span className="text-sm font-semibold text-[var(--ds-text)]">
                      {new Date(qr.expiresAt).toLocaleString(locale, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </Field>
                )}

                <Field icon={Hash} label="QR ID">
                  <span className="font-mono text-xs text-[var(--ds-text-subtle)] break-all">
                    {qr.id}
                  </span>
                </Field>
              </dl>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
