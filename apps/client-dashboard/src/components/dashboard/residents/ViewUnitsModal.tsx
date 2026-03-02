'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { buildUnitsUrl } from '@/lib/analytics/build-analytics-url';

interface Unit {
  id: string;
  name: string;
  type?: string;
}

interface ViewUnitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName: string;
  units: Unit[];
  locale: string;
  contactId: string;
}

export function ViewUnitsModal({
  open,
  onOpenChange,
  contactName,
  units,
  locale,
  contactId,
}: ViewUnitsModalProps) {
  const { t } = useTranslation('dashboard');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {t('residents.unitsForContact', { name: contactName, defaultValue: `Units for ${contactName}` })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {units.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('residents.noUnitsLinked', 'No units linked.')}</p>
          ) : (
            <ul className="space-y-2">
              {units.map((u) => (
                <li key={u.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span className="font-medium">{u.name}</span>
                  {u.type && (
                    <Badge variant="outline" className="text-xs">
                      {u.type}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
          {units.length > 0 && (
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={buildUnitsUrl(locale, { contactId })} onClick={() => onOpenChange(false)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('residents.viewInUnitsPage', 'View in Units page')}
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
