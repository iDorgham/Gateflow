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
import { updateProfile, changePassword } from '../../profile/actions';
import { toast } from 'sonner';
import { CalendarDays, Lock, Save, Shield, User } from 'lucide-react';

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

export function ProfileTab({ user }: { user: ProfileUser }) {
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Identity card */}
      <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-800">
        <CardContent className="flex items-center gap-6 pt-8 pb-8 px-8">
          <Avatar className="h-20 w-20 shrink-0 border-2 border-slate-100 dark:border-slate-700 shadow-sm ring-4 ring-primary/5">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white truncate">{user.name}</h2>
              <Badge variant="outline" className="gap-1.5 py-1 px-3 border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-black uppercase text-[10px] tracking-widest">
                <Shield className="h-3 w-3" aria-hidden="true" />
                {ROLE_LABELS[user.role] ?? user.role}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
            <div className="mt-3 flex items-center gap-4 text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-slate-500">ID: {user.id.slice(0, 8)}...</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update name */}
        <UpdateNameCard user={user} />

        {/* Change password */}
        <ChangePasswordCard />
      </div>
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
    <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-blue-500" />
            Display Name
        </CardTitle>
        <CardDescription className="font-medium text-slate-500">Update the name shown to teammates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</Label>
          <Input
            id="displayName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/30 dark:bg-slate-900/30"
          />
        </div>
        <Button
          onClick={submit}
          disabled={isPending || name.trim() === user.name}
          className="gap-2 rounded-xl font-bold uppercase tracking-widest text-[11px] h-11 px-6 shadow-lg shadow-primary/10"
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
    <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Lock className="h-4.5 w-4.5 text-blue-500" aria-hidden="true" />
          Security Credentials
        </CardTitle>
        <CardDescription className="font-medium text-slate-500">Ensure your account remains secure.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {[
            { id: 'current', label: 'Current password', value: current, set: setCurrent },
            { id: 'newPwd', label: 'New password', value: next, set: setNext },
            { id: 'confirm', label: 'Confirm new password', value: confirm, set: setConfirm },
          ].map(({ id, label, value, set }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</Label>
              <Input
                id={id}
                type="password"
                value={value}
                onChange={(e) => set(e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/30 dark:bg-slate-900/30"
              />
            </div>
          ))}
        </div>
        <Button onClick={submit} disabled={isPending} className="w-full gap-2 rounded-xl font-bold uppercase tracking-widest text-[11px] h-11 shadow-lg shadow-primary/10">
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
