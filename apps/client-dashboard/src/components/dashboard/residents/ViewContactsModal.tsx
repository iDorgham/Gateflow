'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { buildContactsUrl } from '@/lib/analytics/build-analytics-url';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
}

interface ViewContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitName: string;
  contacts: Contact[];
  locale: string;
  unitId: string;
}

export function ViewContactsModal({
  open,
  onOpenChange,
  unitName,
  contacts,
  locale,
  unitId,
}: ViewContactsModalProps) {
  const { t } = useTranslation('dashboard');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {t('residents.contactsForUnit', { name: unitName, defaultValue: `Contacts for ${unitName}` })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('residents.noContactsLinked', 'No contacts linked.')}</p>
          ) : (
            <ul className="space-y-2">
              {contacts.map((c) => (
                <li key={c.id} className="rounded-lg border px-3 py-2 font-medium">
                  {c.firstName} {c.lastName}
                </li>
              ))}
            </ul>
          )}
          {contacts.length > 0 && (
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={buildContactsUrl(locale, { unitId })} onClick={() => onOpenChange(false)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('residents.viewInContactsPage', 'View in Contacts page')}
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
