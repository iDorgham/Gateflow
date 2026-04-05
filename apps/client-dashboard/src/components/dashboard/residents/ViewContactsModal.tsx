'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Button,
} from '@gateflow/ui';
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
      <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-ds-background-default">
        <div className="bg-ds-background-selected dark:bg-ds-background-neutral-hovered p-6 flex flex-col items-center gap-4 text-center border-b border-ds-background-selected dark:border-ds-border">
          <div className="h-16 w-16 rounded-full bg-ds-background-default flex items-center justify-center shadow-sm">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-primary dark:text-ds-text-selected">
            {unit.name}
          </DialogTitle>
          <p className="text-[11px] font-black uppercase tracking-widest text-primary/60">
            {unit.contacts?.length || 0}{' '}
            {t('residents.linkedContacts', 'Linked Contacts')}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {!unit.contacts || unit.contacts.length === 0 ? (
            <div className="py-8 text-center bg-ds-background-neutral-subtle rounded-2xl border border-dashed border-ds-border dark:border-ds-border">
              <p className="text-sm font-bold text-ds-text-subtle">
                {t('residents.noContactsLinked', 'No contacts linked.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {unit.contacts.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-ds-background-neutral-subtle border border-ds-border dark:border-ds-border transition-all hover:border-primary"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-ds-text dark:text-ds-text-inverse">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="text-xs text-ds-text-subtle">
                      {c.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary font-bold hover:bg-ds-background-selected"
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
              className="w-full h-12 rounded-xl border-ds-border dark:border-ds-border font-bold text-ds-text-subtle"
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
