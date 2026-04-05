'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  Badge,
  Button,
  cn,
  ScrollArea,
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
  X,
  Mail,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
    if (!orgId) {
      setOrg(null);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/organizations/${orgId}`)
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
      const res = await fetch(`/api/admin/organizations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        toast.success(
          action === 'suspend'
            ? 'Organization suspended'
            : 'Organization restored'
        );
        router.refresh();
        onClose();
      } else {
        toast.error(data.message ?? 'Action failed');
      }
    });
  }

  const suspended = org?.deletedAt !== null && org?.deletedAt !== undefined;

  return (
    <Sheet
      open={!!orgId}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-ds-background-default border-l border-ds-border shadow-2xl">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-ds-text-brand" />
          </div>
        ) : org ? (
          <>
            <div className="flex flex-col space-y-2 text-center sm:text-left p-6 border-b border-ds-border bg-ds-background-neutral-subtle/20 shrink-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ds-background-brand-bold text-ds-text-inverse font-bold text-sm shadow-sm">
                  {org.name.substring(0, 2).toLowerCase()}
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-ds-text text-base font-black uppercase tracking-tight truncate leading-tight">
                    {org.name}
                  </h2>
                  <p className="text-xs text-ds-text-subtle truncate">
                    {org.email}
                  </p>
                </div>
                <div className="flex-1" />
                <Button
                  variant="subtle"
                  size="icon"
                  className="rounded-full h-8 w-8 hover:bg-ds-background-neutral transition-colors shrink-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={org.plan === 'PRO' ? 'primary' : 'subtle'}
                  className="h-5 px-1.5 font-bold uppercase text-[9px] tracking-wider"
                >
                  {org.plan}
                </Badge>
                <div className="flex items-center gap-1.5 ltr:ml-2 rtl:mr-2">
                  <ShieldCheck className="h-3 w-3 text-ds-text-success" />
                  <span className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-tighter">
                    {locale === 'ar-EG' ? 'منصة موثقة' : 'PLATFORM VERIFIED'}
                  </span>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* Visual Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-ds-background-default border border-ds-border shadow-sm group hover:border-ds-border-brand transition-all hover:translate-y-[-2px]">
                    <div className="flex items-center gap-2 mb-2 text-ds-text-subtlest group-hover:text-ds-text-brand transition-colors">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Users
                      </span>
                    </div>
                    <div className="text-2xl font-black text-ds-text tabular-nums">
                      {org._count.users}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-ds-background-default border border-ds-border shadow-sm group hover:border-ds-border-brand transition-all hover:translate-y-[-2px]">
                    <div className="flex items-center gap-2 mb-2 text-ds-text-subtlest group-hover:text-ds-text-brand transition-colors">
                      <QrCode className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        QRs
                      </span>
                    </div>
                    <div className="text-2xl font-black text-ds-text tabular-nums">
                      {org._count.qrCodes}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-ds-background-default border border-ds-border shadow-sm group hover:border-ds-border-brand transition-all hover:translate-y-[-2px]">
                    <div className="flex items-center gap-2 mb-2 text-ds-text-subtlest group-hover:text-ds-text-brand transition-colors">
                      <DoorOpen className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Gates
                      </span>
                    </div>
                    <div className="text-2xl font-black text-ds-text tabular-nums text-ds-text-accent-teal">
                      {org._count.gates}
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div className="flex flex-col gap-1 pr-4 border-r border-ds-border/50">
                    <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest">
                      Admin Email
                    </span>
                    <div className="flex items-center gap-2 group cursor-pointer">
                      <span className="text-sm font-bold text-ds-text truncate">
                        {org.email}
                      </span>
                      <Mail className="h-3 w-3 text-ds-text-subtlest group-hover:text-ds-text-brand transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest">
                      Registration
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ds-text">
                        {format(new Date(org.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <CalendarDays className="h-3 w-3 text-ds-text-subtlest" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pr-4 border-r border-ds-border/50">
                    <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest">
                      Compliance
                    </span>
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        className={cn(
                          'h-3.5 w-3.5',
                          suspended
                            ? 'text-ds-text-danger'
                            : 'text-ds-text-success'
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-black uppercase tracking-tighter',
                          suspended
                            ? 'text-ds-text-danger'
                            : 'text-ds-text-success'
                        )}
                      >
                        {suspended ? 'Suspended' : 'Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest">
                      Network Status
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-ds-text-success animate-pulse" />
                      <span className="text-xs font-bold text-ds-text-subtle">
                        Live & Syncing
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Summary */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-ds-background-neutral-subtle border border-ds-border flex items-center justify-between group overflow-hidden relative">
                      <div className="flex flex-col relative z-10">
                        <span className="text-[10px] font-black text-ds-text-subtlest uppercase tracking-[0.2em] mb-1">
                          Lifetime Total
                        </span>
                        <span className="text-xl font-black text-ds-text tabular-nums tracking-tighter">
                          {org.scansTotal.toLocaleString(locale)}
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                        <ScanLine className="h-5 w-5 text-ds-text-brand" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-ds-background-neutral-subtle border border-ds-border flex items-center justify-between group overflow-hidden relative">
                      <div className="flex flex-col relative z-10">
                        <span className="text-[10px] font-black text-ds-text-subtlest uppercase tracking-[0.2em] mb-1">
                          This Month
                        </span>
                        <span className="text-xl font-black text-ds-text-success tabular-nums tracking-tighter">
                          {org.scansThisMonth.toLocaleString(locale)}
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-ds-background-success-bold/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                        <Activity className="h-5 w-5 text-ds-text-success" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Actions Section */}
            <div className="p-6 border-t border-ds-border bg-ds-background-default shrink-0 space-y-3">
              {suspended ? (
                <Button
                  className="w-full h-11 rounded-xl font-black bg-ds-background-success-bold hover:bg-ds-background-success-bold-hovered text-ds-text-inverse shadow-lg shadow-ds-background-success-bold/20"
                  disabled={isPending}
                  onClick={() => handleAction('restore')}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  )}
                  Restore Organization
                </Button>
              ) : (
                <Button
                  variant="subtle"
                  className="w-full h-11 rounded-xl font-black bg-ds-background-danger-subtle text-ds-text-danger hover:bg-ds-background-danger-subtle-hovered border border-ds-border-danger/20"
                  disabled={isPending}
                  onClick={() => handleAction('suspend')}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 mr-2" />
                  )}
                  Suspend Organization
                </Button>
              )}
              <Button
                variant="subtle"
                className="w-full h-10 rounded-xl text-ds-text-subtle font-bold"
                onClick={onClose}
              >
                Close Details
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-10 text-ds-text-subtle text-sm">
            <Building2 className="h-8 w-8 opacity-20 mr-2" /> No data
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
