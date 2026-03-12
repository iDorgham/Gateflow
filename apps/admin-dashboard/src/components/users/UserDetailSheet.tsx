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
  ScanLine,
  CalendarDays,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  deletedAt: string | null;
  createdAt: string;
  role: { id: string; name: string } | null;
  organization: { id: string; name: string; plan: string } | null;
  scansTotal: number;
  scansThisMonth: number;
  availableRoles: { id: string; name: string }[];
}

interface UserDetailSheetProps {
  userId: string | null;
  onClose: () => void;
}

const roleBadgeColors: Record<string, string> = {
  ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200',
  TENANT_ADMIN: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200',
  TENANT_USER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200',
  VISITOR: 'bg-muted text-muted-foreground border-border',
  RESIDENT: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200',
};

export function UserDetailSheet({ userId, onClose }: UserDetailSheetProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!userId) { setUser(null); return; }
    setLoading(true);
    fetch(`/${locale}/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((res: { success: boolean; data?: UserDetail }) => {
        if (res.success && res.data) {
          setUser(res.data);
          setSelectedRoleId(res.data.role?.id ?? '');
        }
      })
      .catch(() => toast.error('Failed to load user details'))
      .finally(() => setLoading(false));
  }, [userId, locale]);

  function handleAction(action: 'deactivate' | 'reactivate') {
    if (!userId) return;
    startTransition(async () => {
      const res = await fetch(`/${locale}/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json() as { success: boolean; message?: string };
      if (data.success) {
        toast.success(action === 'deactivate' ? 'User deactivated' : 'User reactivated');
        router.refresh();
        onClose();
      } else {
        toast.error(data.message ?? 'Action failed');
      }
    });
  }

  function handleRoleChange() {
    if (!userId || !selectedRoleId || selectedRoleId === user?.role?.id) return;
    startTransition(async () => {
      const res = await fetch(`/${locale}/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: selectedRoleId }),
      });
      const data = await res.json() as { success: boolean; roleName?: string; message?: string };
      if (data.success) {
        toast.success(`Role changed to ${data.roleName}`);
        router.refresh();
        onClose();
      } else {
        toast.error(data.message ?? 'Role change failed');
      }
    });
  }

  const suspended = user?.deletedAt !== null && user?.deletedAt !== undefined;
  const roleName = user?.role?.name ?? '';
  const initials = user?.name.split(' ').map((n) => n[0]).join('').substring(0, 2) ?? '??';

  return (
    <Sheet open={!!userId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col overflow-y-auto">
        <SheetHeader className="p-6 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm shadow-sm shrink-0',
              suspended ? 'bg-muted text-muted-foreground' : 'bg-foreground text-background'
            )}>
              {initials}
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-base font-black uppercase tracking-tight truncate">
                {loading ? '…' : (user?.name ?? 'User')}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate">
                {user?.email ?? ''}
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {roleName && (
              <Badge variant="outline" className={cn('text-[10px] font-bold uppercase tracking-wider', roleBadgeColors[roleName] ?? '')}>
                {roleName.replace('_', ' ')}
              </Badge>
            )}
            {user && (
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
        ) : user ? (
          <div className="flex-1 p-6 space-y-6">
            {/* Org */}
            {user.organization && (
              <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-foreground truncate">{user.organization.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.organization.plan} plan</p>
                </div>
              </div>
            )}

            {/* Scan stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 mb-2">
                  <ScanLine className="h-3.5 w-3.5" />
                </div>
                <p className="text-xl font-black text-foreground">{user.scansTotal.toLocaleString(locale)}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Total Scans</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 mb-2">
                  <ScanLine className="h-3.5 w-3.5" />
                </div>
                <p className="text-xl font-black text-foreground">{user.scansThisMonth.toLocaleString(locale)}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">This Month</p>
              </div>
            </div>

            {/* Joined date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Role change */}
            {user.availableRoles.length > 0 && roleName !== 'ADMIN' && (
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Change Role</p>
                <div className="flex gap-2">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="flex-1 h-9 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                  >
                    {user.availableRoles
                      .filter((r) => r.name !== 'ADMIN')
                      .map((r) => (
                        <option key={r.id} value={r.id}>{r.name.replace('_', ' ')}</option>
                      ))}
                  </select>
                  <Button
                    size="sm"
                    className="h-9 rounded-xl px-4 font-bold"
                    disabled={isPending || selectedRoleId === user.role?.id}
                    onClick={handleRoleChange}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Actions</p>
              {roleName === 'ADMIN' ? (
                <p className="text-xs text-muted-foreground italic">Platform admin accounts cannot be deactivated or have their role changed from this panel.</p>
              ) : suspended ? (
                <Button
                  className="w-full h-11 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isPending}
                  onClick={() => handleAction('reactivate')}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  Reactivate User
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl font-black border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  disabled={isPending}
                  onClick={() => handleAction('deactivate')}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldAlert className="h-4 w-4 mr-2" />}
                  Deactivate User
                </Button>
              )}
              <Button variant="ghost" className="w-full h-9 rounded-xl text-muted-foreground" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
