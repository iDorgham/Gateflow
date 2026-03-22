'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, QrCode, DoorOpen, User, Hash, Calendar, BarChart2 } from 'lucide-react';
import { cn } from '@gate-access/ui';
import type { QRCodeRow } from '@/lib/qrcodes/use-qrcodes';

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  ACTIVE: {
    bg: 'bg-[var(--ds-background-success-subtle,#E3FCEF)]',
    text: 'text-[var(--ds-text-success,#006644)]',
    dot: 'bg-[var(--ds-background-success-bold,#00875A)]',
    label: 'Active',
  },
  INACTIVE: {
    bg: 'bg-[var(--ds-background-neutral-subtle,#F4F5F7)]',
    text: 'text-[var(--ds-text-subtlest,#6B778C)]',
    dot: 'bg-[var(--ds-icon-subtle,#6B778C)]',
    label: 'Inactive',
  },
  EXPIRED: {
    bg: 'bg-[var(--ds-background-warning-subtle,#FFF0B3)]',
    text: 'text-[var(--ds-text-warning-inverse,#172B4D)]',
    dot: 'bg-[var(--ds-background-warning-bold,#FF991F)]',
    label: 'Expired',
  },
  MAX_USES_REACHED: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    dot: 'bg-primary',
    label: 'Max Uses',
  },
  REVOKED: {
    bg: 'bg-[var(--ds-background-danger-subtle,#FFEBE6)]',
    text: 'text-[var(--ds-text-danger,#BF2600)]',
    dot: 'bg-[var(--ds-background-danger-bold,#DE350B)]',
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
        <Icon className="h-3 w-3 text-[var(--ds-icon-subtle,#6B778C)]" aria-hidden="true" />
        <dt className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest,#6B778C)]">
          {label}
        </dt>
      </div>
      <dd className="ps-4">{children}</dd>
    </div>
  );
}

export function QRDetailDrawer({ qr, locale, onClose }: QRDetailDrawerProps) {
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
            className="fixed inset-y-0 end-0 z-50 w-80 bg-[var(--ds-surface,#FFFFFF)] bg-background border-s border-[var(--ds-border,#DFE1E6)] shadow-xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="QR code details"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ds-border,#DFE1E6)] shrink-0 bg-[var(--ds-background-neutral-subtle,#F4F5F7)]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest,#6B778C)]">
                QR Code Details
              </p>
              <button
                onClick={onClose}
                className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-[var(--ds-background-neutral,#EBECF0)] text-[var(--ds-icon-subtle,#6B778C)] transition-colors"
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
                      s.text,
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', s.dot)} aria-hidden="true" />
                    {s.label}
                  </div>
                );
              })()}

              <dl className="space-y-4">
                <Field icon={QrCode} label="QR Code">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-primary break-all">
                      {qr.code}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--ds-text-subtlest,#6B778C)]">
                      {qr.type}
                    </span>
                  </div>
                </Field>

                {qr.guestName && (
                  <Field icon={User} label="QR Holder">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#B6C2CF]">
                        {qr.guestName}
                      </span>
                      {qr.guestEmail && (
                        <span className="text-xs text-[var(--ds-text-subtle,#42526E)]">{qr.guestEmail}</span>
                      )}
                    </div>
                  </Field>
                )}

                {qr.gateName && (
                  <Field icon={DoorOpen} label="Gate / Entry Point">
                    <span className="text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#B6C2CF]">
                      {qr.gateName}
                    </span>
                  </Field>
                )}

                <Field icon={BarChart2} label="Usage">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[var(--ds-text,#172B4D)] dark:text-[#B6C2CF]">
                      {qr.currentUses}
                    </span>
                    {qr.maxUses !== null && (
                      <span className="text-xs text-[var(--ds-text-subtle,#42526E)]">
                        / {qr.maxUses} max
                      </span>
                    )}
                  </div>
                </Field>

                <Field icon={Calendar} label="Issued">
                  <span className="text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#B6C2CF]">
                    {new Date(qr.createdAt).toLocaleString(locale, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </Field>

                {qr.expiresAt && (
                  <Field icon={Calendar} label="Expires">
                    <span className="text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#B6C2CF]">
                      {new Date(qr.expiresAt).toLocaleString(locale, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </Field>
                )}

                <Field icon={Hash} label="QR ID">
                  <span className="font-mono text-xs text-[var(--ds-text-subtle,#42526E)] break-all">
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
