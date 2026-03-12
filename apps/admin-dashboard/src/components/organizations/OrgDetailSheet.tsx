'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Badge,
  Button,
  cn,
} from '@gate-access/ui';
import {
  Building2,
  Users,
  QrCode,
  DoorOpen,
  ScanLine,
  CalendarDays,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrgDetail {
  id: string;
  name: string;
  email: string;
  plan: string;
  deletedAt: string | null;
  createdAt: string;
  _count: { users: number; qrCodes: number; gates: number };
  scansTotal: number;
  scansThisMonth: number;
}

interface OrgDetailSheetProps {
  orgId: string | null;
  onClose: () => void;
}

export function OrgDetailSheet({ orgId, onClose }: OrgDetailSheetProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!orgId) { setOrg(null); return; }
    setLoading(true);
    fetch(`/${locale}/api/admin/organizations/${orgId}`)
      .then((r) => r.json())
      .then((res: { success: boolean; data?: OrgDetail }) => {
        if (res.success && res.data) setOrg(res.data);
      })
      .catch(() => toast.error('Failed to load organization details'))
      .finally(() => setLoading(false));
  }, [orgId, locale]);

  function handleAction(action: 'suspend' | 'restore') {
    if (!orgId) return;
    startTransition(async () => {
      const res = await fetch(`/${locale}/api/admin/organizations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json() as { success: boolean; message?: string };
      if (data.success) {
        toast.success(action === 'suspend' ? 'Organization suspended' : 'Organization restored');
        router.refresh();
        onClose();
      } else {
        toast.error(data.message ?? 'Action failed');
      }
    });
  }

  const suspended = org?.deletedAt !== null && org?.deletedAt !== undefined;

  const planColors: Record<string, string> = {
    FREE: 'bg-muted text-muted-foreground border-border',
    PRO: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  return (
    <Sheet open={!!orgId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col overflow-y-auto">
        <SheetHeader className="p-6 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              {org?.name?.substring(0, 2) ?? '??'}
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-base font-black uppercase tracking-tight truncate">
                {loading ? '...' : (org?.name ?? 'Organization')}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate">
                {org?.email ?? ''}
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {org && (
              <Badge variant="outline" className={cn('text-[10px] font-bold uppercase tracking-wider', planColors[org.plan] ?? '')}>
                {org.plan}
              </Badge>
            )}
            {org && (
              <Badge className={cn('border-none text-[10px] font-bold uppercase', suspended ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-emerald-500 text-white')}>
                {suspended ? (
                  <span className="flex items-center gap-1"><ShieldAlert className="h-2.5 w-2.5" /> Suspended</span>
                ) : (
                  <span className="flex items-center gap-1"><ShieldCheck className="h-2.5 w-2.5" /> Active</span>
                )}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          </div>
        ) : org ? (
          <div className="flex-1 p-6 space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Users', value: org._count.users, icon: Users, color: 'text-violet-600 bg-violet-500/10' },
                { label: 'Gates', value: org._count.gates, icon: DoorOpen, color: 'text-blue-600 bg-blue-500/10' },
                { label: 'QR Codes', value: org._count.qrCodes, icon: QrCode, color: 'text-emerald-600 bg-emerald-500/10' },
                { label: 'Total Scans', value: org.scansTotal, icon: ScanLine, color: 'text-amber-600 bg-amber-500/10' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-3">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg mb-2', color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xl font-black text-foreground">{value.toLocaleString(locale)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Scans this month */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Scans this month</p>
              <p className="text-2xl font-black text-foreground">{org.scansThisMonth.toLocaleString(locale)}</p>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>Joined {new Date(org.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Actions</p>
              {suspended ? (
                <Button
                  className="w-full h-11 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isPending}
                  onClick={() => handleAction('restore')}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  Restore Organization
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl font-black border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  disabled={isPending}
                  onClick={() => handleAction('suspend')}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldAlert className="h-4 w-4 mr-2" />}
                  Suspend Organization
                </Button>
              )}
              <Button variant="ghost" className="w-full h-9 rounded-xl text-muted-foreground" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground text-sm">
            <Building2 className="h-8 w-8 opacity-20 mr-2" /> No data
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
