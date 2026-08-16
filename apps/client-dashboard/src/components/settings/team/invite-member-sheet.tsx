'use client';

import { useRef, useState, useTransition } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Avatar,
  AvatarImage,
  AvatarFallback,
  cn,
} from '@gateflow/ui';
import {
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  Sparkles,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { inviteTeamMember } from '@/app/[locale]/dashboard/organizations/[orgId]/settings/team/actions';
import { formatRoleLabel, roleSlug } from '@gate-access/types';

interface Role {
  id: string;
  name: string;
  slug?: string;
}

interface InviteMemberSheetProps {
  roles: Role[];
  children: React.ReactNode;
  onInvited?: () => void;
}

function generatePassword(): string {
  const alphabet =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return `${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}Aa1`;
}

function compressAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose a photo (JPG, PNG, or WebP).'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('Photo must be 8MB or smaller.'));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not process photo.'));
        return;
      }
      const scale = Math.max(size / image.width, size / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.drawImage(
        image,
        (size - width) / 2,
        (size - height) / 2,
        width,
        height
      );
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read that photo.'));
    };
    image.src = objectUrl;
  });
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  roleId: '',
  password: '',
  confirmPassword: '',
  mustChangePassword: true,
  avatarUrl: '' as string,
};

export function InviteMemberSheet({
  roles,
  children,
  onInvited,
}: InviteMemberSheetProps) {
  const { t } = useTranslation('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setShowPassword(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const initials = form.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      const avatarUrl = await compressAvatar(file);
      setForm((current) => ({ ...current, avatarUrl }));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t('settings.team.photoFailed', 'Could not upload photo.')
      );
    }
  };

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.roleId) {
      return toast.error(
        t('settings.team.fieldsRequired', 'Name, email, and role are required.')
      );
    }
    if (form.password.length < 8) {
      return toast.error(
        t(
          'settings.team.passwordMin',
          'Password must be at least 8 characters.'
        )
      );
    }
    if (form.password !== form.confirmPassword) {
      return toast.error(
        t('settings.team.passwordMismatch', 'Passwords do not match.')
      );
    }

    startTransition(async () => {
      const res = await inviteTeamMember({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        roleId: form.roleId,
        mustChangePassword: form.mustChangePassword,
        avatarUrl: form.avatarUrl || null,
      });
      if (res.success) {
        toast.success(
          t(
            'settings.team.memberAdded',
            'Member added. They can sign in with the password you set.'
          )
        );
        setOpen(false);
        resetForm();
        onInvited?.();
      } else {
        toast.error(res.error || t('common.error', 'An error occurred.'));
      }
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col border-l border-[var(--ds-border)] p-0 sm:max-w-lg">
        <SheetHeader className="space-y-2 border-b border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)] px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <SheetTitle className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)]">
            {t('settings.team.inviteTitle', 'Add team member')}
          </SheetTitle>
          <SheetDescription className="text-sm font-medium text-[var(--ds-text-subtle)]">
            {t(
              'settings.team.inviteDesc',
              'Create their account now. They can sign in immediately with the password you set.'
            )}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleInvite} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
            <div className="flex flex-col items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => void handlePhoto(event.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={t('settings.team.uploadPhoto', 'Upload photo')}
              >
                <Avatar
                  size="xlarge"
                  className="border-2 border-[var(--ds-border)] shadow-sm"
                >
                  {form.avatarUrl ? (
                    <AvatarImage src={form.avatarUrl} alt="" />
                  ) : null}
                  <AvatarFallback className="bg-[var(--ds-background-neutral-subtle)] text-lg font-black text-[var(--ds-text-subtle)]">
                    {initials || <UserRound className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Camera className="h-5 w-5 text-white" />
                </span>
              </button>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  {t('settings.team.uploadPhoto', 'Upload photo')}
                </button>
                {form.avatarUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({ ...current, avatarUrl: '' }))
                    }
                    className="text-[var(--ds-text-subtle)] hover:text-[var(--ds-text-danger)]"
                  >
                    {t('common.remove', 'Remove')}
                  </button>
                ) : null}
              </div>
            </div>

            <section className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                {t('settings.team.profileSection', 'Profile')}
              </p>
              <div className="space-y-2">
                <Label
                  htmlFor="invite-name"
                  className="ml-1 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]"
                >
                  {t('common.name', 'Full name')}
                </Label>
                <Input
                  id="invite-name"
                  autoComplete="name"
                  placeholder="Sara Hassan"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="invite-email"
                    className="ml-1 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]"
                  >
                    {t('common.email', 'Email')}
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-icon-subtle)]" />
                    <Input
                      id="invite-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      required
                      className="h-11 rounded-xl ps-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="invite-phone"
                    className="ml-1 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]"
                  >
                    {t('common.phone', 'Phone')}
                  </Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-icon-subtle)]" />
                    <Input
                      id="invite-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+20 10 0000 0000"
                      value={form.phone}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl ps-9"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                {t('settings.team.accessSection', 'Access')}
              </p>
              <div className="space-y-2">
                <Label
                  htmlFor="invite-role"
                  className="ml-1 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]"
                >
                  {t('settings.team.selectRole', 'Role')}
                </Label>
                <Select
                  value={form.roleId}
                  onValueChange={(roleId) =>
                    setForm((current) => ({ ...current, roleId }))
                  }
                  required
                >
                  <SelectTrigger id="invite-role" className="h-11 rounded-xl">
                    <SelectValue
                      placeholder={t(
                        'settings.team.rolePlaceholder',
                        'Choose a role'
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {roles.map((role) => (
                      <SelectItem
                        key={role.id}
                        value={role.id}
                        className="rounded-lg py-2.5 text-xs font-bold"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatRoleLabel(role.name)}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--ds-text-subtle)]">
                            {role.slug || roleSlug(role.name)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="invite-password"
                    className="ml-1 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]"
                  >
                    {t('settings.team.password', 'Password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="invite-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      required
                      minLength={8}
                      className="h-11 rounded-xl pe-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--ds-icon-subtle)] hover:text-[var(--ds-text)]"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="invite-confirm-password"
                    className="ml-1 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]"
                  >
                    {t('settings.team.confirmPassword', 'Confirm')}
                  </Label>
                  <Input
                    id="invite-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    required
                    minLength={8}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const password = generatePassword();
                  setForm((current) => ({
                    ...current,
                    password,
                    confirmPassword: password,
                  }));
                  setShowPassword(true);
                  toast.success(
                    t(
                      'settings.team.passwordGenerated',
                      'A temporary password was generated.'
                    )
                  );
                }}
                className="h-10 w-full rounded-xl text-[11px] font-black uppercase tracking-widest"
              >
                <Sparkles className="me-2 h-3.5 w-3.5" />
                {t('settings.team.generatePassword', 'Generate password')}
              </Button>
            </section>

            <section
              className={cn(
                'flex items-start justify-between gap-4 rounded-2xl border p-4',
                form.mustChangePassword
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)]'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background">
                  <KeyRound className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[var(--ds-text)]">
                    {t(
                      'settings.team.resetOnFirstLogin',
                      'Ask to reset password on first login'
                    )}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--ds-text-subtle)]">
                    {t(
                      'settings.team.resetOnFirstLoginHint',
                      'They sign in with this password once, then must choose their own.'
                    )}
                  </p>
                </div>
              </div>
              <Switch
                checked={form.mustChangePassword}
                onCheckedChange={(mustChangePassword) =>
                  setForm((current) => ({ ...current, mustChangePassword }))
                }
                aria-label={t(
                  'settings.team.resetOnFirstLogin',
                  'Ask to reset password on first login'
                )}
              />
            </section>
          </div>

          <div className="flex items-center gap-3 border-t border-[var(--ds-border)] bg-[var(--ds-surface)] px-6 py-4">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 flex-1 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              {isPending
                ? t('common.saving', 'Saving...')
                : t('settings.team.addMember', 'Add member')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 rounded-xl px-5 text-xs font-black uppercase tracking-widest"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
