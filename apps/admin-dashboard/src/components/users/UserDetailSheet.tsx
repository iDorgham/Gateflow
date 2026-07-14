'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  Badge,
  Button,
  NativeSelect,
  cn,
  ScrollArea,
} from '@gateflow/ui';
import {
  Building2,
  CalendarDays,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  X,
  Mail,
  Crown,
  History,
  Activity,
  ChevronRight,
  Shield,
  Settings2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
  ADMIN:
    'bg-ds-background-danger-subtle text-ds-text-danger border-ds-border-danger/20',
  TENANT_ADMIN:
    'bg-ds-background-warning-subtle text-ds-text-warning border-ds-border-warning/20',
  TENANT_USER:
    'bg-ds-background-information-subtle text-ds-text-information border-ds-border-information/20',
  VISITOR:
    'bg-ds-background-neutral-subtle text-ds-text-subtle border-ds-border',
  RESIDENT:
    'bg-ds-background-success-subtle text-ds-text-success border-ds-border-success/20',
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
    if (!userId) {
      setUser(null);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/users/${userId}`)
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
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        toast.success(
          action === 'deactivate' ? 'User deactivated' : 'User reactivated'
        );
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
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: selectedRoleId }),
      });
      const data = (await res.json()) as {
        success: boolean;
        roleName?: string;
        message?: string;
      };
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
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??';

  return (
    <Sheet
      open={!!userId}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-ds-background-default border-l border-ds-border shadow-2xl">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-ds-text-brand" />
          </div>
        ) : user ? (
          <>
            <div className="flex flex-col space-y-2 text-center sm:text-left p-6 border-b border-ds-border bg-ds-background-neutral-subtle/20 shrink-0">
              <div className="flex items-center gap-3 mb-1">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm shadow-sm',
                    suspended
                      ? 'bg-ds-background-neutral text-ds-text-subtle'
                      : 'bg-ds-background-brand-bold text-ds-text-inverse'
                  )}
                >
                  {initials}
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-ds-text text-base font-black uppercase tracking-tight truncate leading-tight">
                    {user.name}
                  </h2>
                  <p className="text-xs text-ds-text-subtle truncate">
                    {user.email}
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
                {roleName && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'h-5 px-1.5 font-bold uppercase text-[9px] tracking-wider',
                      roleBadgeColors[roleName]
                    )}
                  >
                    {roleName.replace('_', ' ')}
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 ltr:ml-2 rtl:mr-2">
                  <ShieldCheck
                    className={cn(
                      'h-3 w-3',
                      suspended ? 'text-ds-text-subtle' : 'text-ds-text-success'
                    )}
                  />
                  <span className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-tighter">
                    {suspended ? 'SUSPENDED' : 'ACTIVE USER'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 border-b border-ds-border">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  className="font-bold flex-1 h-10 shadow-sm rounded-lg"
                  disabled={roleName === 'ADMIN'}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Grant Access
                </Button>
                <Button
                  variant="subtle"
                  className="font-bold flex-1 h-10 border border-ds-border rounded-lg"
                >
                  <Settings2 className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-ds-background-default border border-ds-border shadow-sm group hover:border-ds-border-brand transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-ds-text-subtlest group-hover:text-ds-text-brand transition-colors">
                      <History className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Lifetime Scans
                      </span>
                    </div>
                    <div className="text-2xl font-black text-ds-text tabular-nums">
                      {user.scansTotal.toLocaleString(locale)}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-ds-background-default border border-ds-border shadow-sm group hover:border-ds-border-brand transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-ds-text-subtlest group-hover:text-ds-text-brand transition-colors">
                      <Activity className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Monthly Scans
                      </span>
                    </div>
                    <div className="text-2xl font-black text-ds-text tabular-nums">
                      {user.scansThisMonth.toLocaleString(locale)}
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-ds-background-neutral flex items-center justify-center text-ds-text-subtle">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest mb-0.5">
                          Primary Email
                        </span>
                        <span className="text-sm font-bold text-ds-text truncate max-w-[200px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-ds-text-subtlest opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {user.organization && (
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-ds-background-neutral flex items-center justify-center text-ds-text-subtle">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest mb-0.5">
                            Organization
                          </span>
                          <span className="text-sm font-bold text-ds-text truncate max-w-[200px]">
                            {user.organization.name}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="subtle"
                        className="text-[9px] h-4 font-bold uppercase tracking-tight"
                      >
                        {user.organization.plan}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-ds-background-neutral flex items-center justify-center text-ds-text-subtle">
                        <CalendarDays className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest mb-0.5">
                          Joined Platfom
                        </span>
                        <span className="text-sm font-bold text-ds-text">
                          {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-ds-text-subtlest opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Role Management Section */}
                {user.availableRoles.length > 0 && roleName !== 'ADMIN' && (
                  <div className="p-5 rounded-2xl bg-ds-background-neutral-subtle/50 border border-ds-border-subtle space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-ds-text-brand" />
                        <h3 className="text-[11px] font-black text-ds-text uppercase tracking-widest">
                          Authority Level
                        </h3>
                      </div>
                      <Badge
                        variant="subtle"
                        className="text-[9px] h-4 font-bold uppercase bg-ds-background-neutral text-ds-text-subtle"
                      >
                        Edit Mode
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <NativeSelect
                        value={selectedRoleId}
                        onChange={(e) => setSelectedRoleId(e.target.value)}
                        className="flex-1 h-10 rounded-xl bg-ds-background-default border-ds-border"
                      >
                        {user.availableRoles
                          .filter((r) => r.name !== 'ADMIN')
                          .map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name.replace('_', ' ')}
                            </option>
                          ))}
                      </NativeSelect>
                      <Button
                        variant="primary"
                        className="h-10 px-4 font-bold rounded-xl"
                        disabled={isPending || selectedRoleId === user.role?.id}
                        onClick={handleRoleChange}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Actions Section */}
            <div className="p-6 border-t border-ds-border bg-ds-background-default shrink-0 space-y-3">
              {roleName === 'ADMIN' ? (
                <div className="p-4 rounded-xl bg-ds-background-neutral-subtle border border-ds-border-subtle">
                  <p className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-wide leading-relaxed text-center">
                    Platform admin accounts are protected and cannot be
                    deactivated from this panel.
                  </p>
                </div>
              ) : suspended ? (
                <Button
                  className="w-full h-11 rounded-xl font-black bg-ds-background-success-bold hover:bg-ds-background-success-bold-hovered text-ds-text-inverse shadow-lg shadow-ds-background-success-bold/20"
                  disabled={isPending}
                  onClick={() => handleAction('reactivate')}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  )}
                  Reactivate Account
                </Button>
              ) : (
                <Button
                  variant="subtle"
                  className="w-full h-11 rounded-xl font-black bg-ds-background-danger-subtle text-ds-text-danger hover:bg-ds-background-danger-subtle-hovered border border-ds-border-danger/20"
                  disabled={isPending}
                  onClick={() => handleAction('deactivate')}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 mr-2" />
                  )}
                  Deactivate Account
                </Button>
              )}
              <Button
                variant="subtle"
                className="w-full h-10 rounded-xl text-ds-text-subtle font-bold"
                onClick={onClose}
              >
                Close Profile
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
