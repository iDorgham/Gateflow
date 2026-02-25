'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  Badge,
} from '@gate-access/ui';
import { updateProfile, changePassword } from './actions';
import { toast } from 'sonner';
import { CalendarDays, Lock, Save, Shield } from 'lucide-react';

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'System Admin',
  TENANT_ADMIN: 'Organization Admin',
  TENANT_USER: 'Member',
  VISITOR: 'Visitor',
};

export function ProfileClient({ user }: { user: ProfileUser }) {
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-5">
      {/* Identity card */}
      <Card>
        <CardContent className="flex items-center gap-5 pt-6">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" aria-hidden="true" />
                {ROLE_LABELS[user.role] ?? user.role}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update name */}
      <UpdateNameCard user={user} />

      {/* Change password */}
      <ChangePasswordCard />
    </div>
  );
}

function UpdateNameCard({ user }: { user: ProfileUser }) {
  const [name, setName] = useState(user.name);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await updateProfile(user.id, name.trim());
      if (result?.success) {
        toast.success('Name updated successfully.');
      } else {
        toast.error(result?.error ?? 'Failed to update name.');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Display Name</CardTitle>
        <CardDescription>Update the name shown across the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="displayName">Name</Label>
          <Input
            id="displayName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={submit}
          disabled={isPending || name.trim() === user.name}
          className="gap-2"
        >
          {isPending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save changes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!current || !next || !confirm) return toast.error('All fields are required.');
    if (next.length < 8) return toast.error('New password must be at least 8 characters.');
    if (next !== confirm) return toast.error('Passwords do not match.');

    startTransition(async () => {
      const result = await changePassword(current, next);
      if (result?.success) {
        toast.success('Password changed successfully.');
        setCurrent('');
        setNext('');
        setConfirm('');
      } else {
        toast.error(result?.error ?? 'Failed to change password.');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
          Change Password
        </CardTitle>
        <CardDescription>Use a strong password you don&apos;t use elsewhere.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { id: 'current', label: 'Current password', value: current, set: setCurrent },
          { id: 'newPwd', label: 'New password', value: next, set: setNext },
          { id: 'confirm', label: 'Confirm new password', value: confirm, set: setConfirm },
        ].map(({ id, label, value, set }) => (
          <div key={id} className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              type="password"
              value={value}
              onChange={(e) => set(e.target.value)}
              className="max-w-sm"
            />
          </div>
        ))}
        <Button onClick={submit} disabled={isPending} className="gap-2">
          {isPending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Updating…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden="true" />
              Update password
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
