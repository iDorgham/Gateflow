'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Avatar,
  AvatarFallback,
  NativeSelect,
  cn,
  EmptyState,
} from '@gateflow/ui';
import { inviteMember, removeMember, changeRole } from './actions';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Trash2,
  UserPlus,
  X,
  Shield,
  Users,
  UserCheck,
} from 'lucide-react';
import {
  WorkspacePageLayout,
  SidebarSection,
} from '@/components/dashboard/workspace-page-layout';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'System Admin',
  TENANT_ADMIN: 'Admin',
  TENANT_USER: 'Member',
  VISITOR: 'Viewer',
  RESIDENT: 'Resident',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-danger-subtle text-danger-bold',
  TENANT_ADMIN: 'bg-info-subtle text-info-bold',
  TENANT_USER: 'bg-muted text-foreground',
  VISITOR: 'bg-muted text-muted-foreground',
  RESIDENT: 'bg-success-subtle text-success-bold',
};

// ─── Remove confirm modal ─────────────────────────────────────────────────────

function RemoveConfirmModal({
  member,
  onConfirm,
  onClose,
  isPending,
}: {
  member: Member;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-card shadow-2xl ring-1 ring-border">
        <div className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-danger-subtle text-danger-bold">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mb-1 text-xl font-bold text-foreground">
            Remove {member.name}?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            They will lose access to your workspace immediately. This action
            cannot be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 rounded-lg bg-destructive font-semibold text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive"
            >
              {isPending ? 'Removing…' : 'Remove member'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TeamClient({
  members: initialMembers,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('TENANT_USER');
  const [removingMember, setRemovingMember] = useState<Member | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isPendingRemove, startRemove] = useTransition();

  function invite() {
    if (!inviteEmail.trim() || !inviteName.trim()) {
      return toast.error('Name and email are required.');
    }
    startTransition(async () => {
      const result = await inviteMember(
        inviteEmail.trim(),
        inviteName.trim(),
        inviteRole
      );
      if (result?.success && result.member) {
        const m = result.member;
        setMembers((prev) => [...prev, m]);
        setInviteEmail('');
        setInviteName('');
        setShowInvite(false);
        toast.success(`${m.name} has been added to the team.`);
      } else {
        toast.error(result?.error ?? 'Failed to invite member.');
      }
    });
  }

  function confirmRemove() {
    if (!removingMember) return;
    const name = removingMember.name;
    const id = removingMember.id;
    startRemove(async () => {
      const result = await removeMember(id);
      if (result?.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setRemovingMember(null);
        toast.success(`${name} has been removed.`);
      } else {
        toast.error(result?.error ?? 'Failed to remove member.');
      }
    });
  }

  async function updateRole(id: string, newRole: string) {
    startTransition(async () => {
      const result = await changeRole(id, newRole);
      if (result?.success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
        );
        toast.success('Role updated.');
      } else {
        toast.error(result?.error ?? 'Failed to update role.');
      }
    });
  }

  const sidebar = (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <SidebarSection title="Team Capacity" icon={Users}>
        <Card className="rounded-2xl border-border bg-card p-6 shadow-sm ring-1 ring-border/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info-subtle text-info-bold shadow-sm">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground leading-none">
                {members.length}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Seats Occupied
              </p>
            </div>
          </div>
        </Card>
      </SidebarSection>

      <SidebarSection title="Role Definitions" icon={Shield}>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border/50">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              <p className="text-xs font-bold text-foreground capitalzie">
                Admin
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground font-medium pl-3.5">
              Full access to all resources, billing, and team management.
            </p>
          </div>
          <div className="space-y-1.5 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-info" />
              <p className="text-xs font-bold text-foreground capitalize">
                Member
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground font-medium pl-3.5">
              Manage QR codes and gates but cannot change workspace settings.
            </p>
          </div>
          <div className="space-y-1.5 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <p className="text-xs font-bold text-foreground capitalize">
                Viewer
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground font-medium pl-3.5">
              Read-only access to analytics and scan logs.
            </p>
          </div>
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <WorkspacePageLayout
      header={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Team
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Manage your workspace members and their access levels.
          </p>
        </div>
      }
      sidebar={sidebar}
    >
      <div className="space-y-6">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
          <Button
            onClick={() => setShowInvite((v) => !v)}
            variant={showInvite ? 'outline' : 'default'}
            className="gap-2"
          >
            {showInvite ? (
              <>
                <X className="h-4 w-4" aria-hidden="true" />
                Cancel
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Invite member
              </>
            )}
          </Button>
        </div>

        {/* Invite form */}
        {showInvite && (
          <Card className="overflow-hidden border-info bg-info-subtle rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-foreground">
                Invite a team member
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                They will receive an email with instructions to set up their
                account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="inviteName">Full name</Label>
                  <Input
                    id="inviteName"
                    placeholder="Jane Smith"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inviteEmail">Email address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="jane@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inviteRole">Role</Label>
                <NativeSelect
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full"
                >
                  <option value="TENANT_ADMIN">Admin — full access</option>
                  <option value="TENANT_USER">Member — standard access</option>
                  <option value="VISITOR">Viewer — read only</option>
                  <option value="RESIDENT">
                    Resident — unit portal access
                  </option>
                </NativeSelect>
              </div>
              <Button onClick={invite} disabled={isPending} className="gap-2">
                {isPending ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Inviting…
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Send invite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Members list */}
        <Card className="overflow-hidden border-border rounded-2xl shadow-sm">
          <CardContent className="p-0">
            {members.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No team members yet"
                description="Invite your first team member to get started."
                className="min-h-[240px] border-0 rounded-none"
              />
            ) : (
              <div className="divide-y divide-border">
                {members.map((member) => {
                  const initials = member.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  const isCurrentUser = member.id === currentUserId;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-info-subtle text-info-bold text-sm font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {member.name}
                          </span>
                          {isCurrentUser && (
                            <span className="rounded-full bg-info-subtle px-2 py-0.5 text-xs text-info-bold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <NativeSelect
                          value={member.role}
                          disabled={isCurrentUser || isPending}
                          onChange={(e) =>
                            updateRole(member.id, e.target.value)
                          }
                          className={cn(
                            'h-8 text-xs font-semibold px-2 pr-7',
                            ROLE_COLORS[member.role] ??
                              'bg-muted text-foreground'
                          )}
                        >
                          {Object.entries(ROLE_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </NativeSelect>
                        {!isCurrentUser && (
                          <button
                            onClick={() => setRemovingMember(member)}
                            disabled={isPending || isPendingRemove}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-subtle hover:text-danger-bold disabled:opacity-40"
                            aria-label={`Remove ${member.name}`}
                            title="Remove member"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Remove confirm modal */}
        {removingMember && (
          <RemoveConfirmModal
            member={removingMember}
            onConfirm={confirmRemove}
            onClose={() => setRemovingMember(null)}
            isPending={isPendingRemove}
          />
        )}
      </div>
    </WorkspacePageLayout>
  );
}
