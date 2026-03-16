'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Button,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { Building } from 'lucide-react';
import { buildContactsUrl } from '@/lib/analytics/build-analytics-url';

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
  locale,
}: ViewContactsModalProps) {
  const { t } = useTranslation('dashboard');

  if (!unit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-[#1D2125]">
        <div className="bg-[#DEEBFF] dark:bg-[#0747A6]/20 p-6 flex flex-col items-center gap-4 text-center border-b border-[#DEEBFF] dark:border-[#343A46]">
           <div className="h-16 w-16 rounded-full bg-white dark:bg-[#2C333A] flex items-center justify-center shadow-sm">
              <Building className="h-8 w-8 text-[#0052CC]" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight text-[#0052CC] dark:text-[#4C9AFF]">
              {unit.name}
           </DialogTitle>
           <p className="text-[11px] font-black uppercase tracking-widest text-[#0052CC]/60">{unit.contacts.length} {t('residents.linkedContacts', 'Linked Contacts')}</p>
        </div>
        
        <div className="p-8 space-y-6">
          {unit.contacts.length === 0 ? (
            <div className="py-8 text-center bg-[#F4F5F7] dark:bg-[#2C333A] rounded-2xl border border-dashed border-[#DFE1E6] dark:border-[#343A46]">
               <p className="text-sm font-bold text-[#6B778C]">{t('residents.noContactsLinked', 'No contacts linked.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {unit.contacts.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-[#F4F5F7] dark:bg-[#2C333A] border border-[#DFE1E6] dark:border-[#343A46] transition-all hover:border-[#0052CC]">
                   <span className="font-bold text-[#172B4D] dark:text-[#DEEBFF]">
                      {c.firstName} {c.lastName}
                   </span>
                   <Button variant="ghost" size="sm" className="h-8 text-[#0052CC] font-bold hover:bg-[#DEEBFF]" asChild>
                      <Link href={`/${locale}/dashboard/residents/contacts?id=${c.id}`}>
                         Profile
                      </Link>
                   </Button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" className="w-full h-12 rounded-xl border-[#DFE1E6] dark:border-[#343A46] font-bold text-[#42526E]" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
