'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Button,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { Building } from 'lucide-react';

interface ViewContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: any | null;
  locale: string;
}

export function ViewContactsModal({
  open,
  onOpenChange,
  unit,
}: ViewContactsModalProps) {
  const { t } = useTranslation('dashboard');

  if (!unit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-[var(--ds-background-default,#FFFFFF)]">
        <div className="bg-[var(--ds-background-selected,#DEEBFF)] dark:bg-[var(--ds-background-selected-subtle,#0747A620)] p-6 flex flex-col items-center gap-4 text-center border-b border-[var(--ds-background-selected,#DEEBFF)] dark:border-[var(--ds-border,#343A46)]">
          <div className="h-16 w-16 rounded-full bg-[var(--ds-background-default,#FFFFFF)] bg-secondary flex items-center justify-center shadow-sm">
            <Building className="h-8 w-8 text-[var(--primary)]" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-[var(--primary)] dark:text-[var(--ds-text-selected,#4C9AFF)]">
            {unit.name}
          </DialogTitle>
          <p className="text-[11px] font-black uppercase tracking-widest text-[var(--primary)]/60">
            {unit.contacts?.length || 0}{' '}
            {t('residents.linkedContacts', 'Linked Contacts')}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {!unit.contacts || unit.contacts.length === 0 ? (
            <div className="py-8 text-center bg-[var(--ds-background-neutral-subtle,#F4F5F7)] bg-secondary rounded-2xl border border-dashed border-[var(--ds-border,#DFE1E6)] dark:border-[var(--ds-border,#343A46)]">
              <p className="text-sm font-bold text-[var(--ds-text-subtle,#6B778C)]">
                {t('residents.noContactsLinked', 'No contacts linked.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {unit.contacts.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--ds-background-neutral-subtle,#F4F5F7)] bg-secondary border border-[var(--ds-border,#DFE1E6)] dark:border-[var(--ds-border,#343A46)] transition-all hover:border-[var(--primary)]"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--ds-text,#172B4D)] dark:text-[var(--ds-text-accent,#DEEBFF)]">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="text-xs text-[var(--ds-text-subtle,#6B778C)]">
                      {c.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[var(--primary)] font-bold hover:bg-[var(--ds-background-selected,#DEEBFF)]"
                    asChild
                  >
                    <a href={`mailto:${c.email}`}>
                      {t('residents.viewEmail', 'Email')}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-[var(--ds-border,#DFE1E6)] dark:border-[var(--ds-border,#343A46)] font-bold text-[var(--ds-text-subtle,#42526E)]"
              onClick={() => onOpenChange(false)}
            >
              {t('common.close', 'Close')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
