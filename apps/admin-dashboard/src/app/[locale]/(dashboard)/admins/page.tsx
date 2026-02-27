import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  Shield,
  UserPlus,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Calendar,
  Info,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  Label,
  cn,
} from '@gate-access/ui';

export const metadata = { title: 'Admins' };

// ─── Server actions ────────────────────────────────────────────────────────────

async function createAdmin(formData: FormData) {
  'use server';
  requireAdmin();
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  if (!name || !email || !password) return;

  const passwordHash = await argon2.hash(password);

  let adminRole = await prisma.role.findFirst({
    where: { name: 'ADMIN', organizationId: null },
  });
  if (!adminRole) {
    const { BUILT_IN_ROLES, DEFAULT_PERMISSIONS } = await import('@gate-access/types');
    adminRole = await prisma.role.create({
      data: {
        id: 'role-admin',
        name: 'ADMIN',
        description: 'Platform super-admin',
        isBuiltIn: true,
        permissions: DEFAULT_PERMISSIONS[BUILT_IN_ROLES.SUPER_ADMIN],
      },
    });
  }

  await prisma.user.upsert({
    where: { email },
    create: { name, email, passwordHash, roleId: adminRole.id },
    update: { name, passwordHash, roleId: adminRole.id, deletedAt: null },
  });
  revalidatePath('/admins');
  redirect('/admins');
}

async function resetAdminPassword(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;

  const tempPassword = randomBytes(10).toString('hex');
  const passwordHash = await argon2.hash(tempPassword);
  await prisma.user.update({ where: { id }, data: { passwordHash } });

  cookies().set('_adminpwflash', JSON.stringify({ id, pw: tempPassword }), {
    path: '/',
    maxAge: 120,
    sameSite: 'lax',
  });
  revalidatePath('/admins');
  redirect('/admins');
}

async function toggleSuspend(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  const isSuspended = formData.get('suspended') === 'true';
  if (!id) return;
  await prisma.user.update({
    where: { id },
    data: { deletedAt: isSuspended ? null : new Date() },
  });
  revalidatePath('/admins');
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  await requireAdmin();
  const { t } = await getTranslation(locale, 'admin');

  const admins = await prisma.user.findMany({
    where: { role: { name: 'ADMIN', organizationId: null } },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      deletedAt: true,
      createdAt: true,
    },
  });

  // Read and clear flash
  let pwFlash: { id: string; pw: string } | null = null;
  try {
    const raw = cookies().get('_adminpwflash')?.value;
    if (raw) {
      pwFlash = JSON.parse(raw) as { id: string; pw: string };
      cookies().delete('_adminpwflash');
    }
  } catch {
    // ignore
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('admins.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('admins.subtitle')}
        </p>
      </div>

      {/* Auth mechanism info */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300">{t('admins.twoLayerAuth')}</p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                {String(t('admins.twoLayerAuthDesc')).split('<1>')[0]}
                <code className="rounded bg-blue-100 dark:bg-blue-900/50 px-1 font-mono">ADMIN_ACCESS_KEY</code>
                {String(t('admins.twoLayerAuthDesc')).split('</1>')[1]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password flash */}
      {pwFlash && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 shadow-lg shadow-amber-500/10">
          <CardHeader className="pb-3 border-b border-amber-100/50 dark:border-amber-800/50">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <KeyRound className="h-5 w-5" />
              <CardTitle className="text-base font-bold">{t('admins.tempPasswordGen')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              {t('admins.shareSecurely')}
            </p>
            <div className="relative group">
              <code className="block w-full rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 px-6 py-4 font-mono text-xl font-black tracking-[0.2em] text-amber-950 dark:text-amber-200 text-center shadow-inner ltr:tracking-[0.2em] rtl:tracking-normal">
                {pwFlash.pw}
              </code>
              <Badge className="absolute -top-2 ltr:-right-1 rtl:-left-1 bg-amber-800 text-white font-bold text-[10px] tracking-widest uppercase border-none">
                {t('admins.expiresIn')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Admin list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('admins.platformAdmins', { count: admins.length })}
          </h2>
          {admins.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="py-10 text-center text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="font-medium">{t('admins.noAdminsYet')}</p>
                <p className="text-xs mt-1">{t('admins.createFirstAdmin')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {admins.map((admin) => {
                const suspended = admin.deletedAt !== null;
                const isFlash = pwFlash?.id === admin.id;
                return (
                  <Card
                    key={admin.id}
                    className={cn(
                      'shadow-sm transition-colors',
                      suspended ? 'opacity-70' : '',
                      isFlash ? 'border-amber-200 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10' : ''
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-xs uppercase shadow-sm',
                            suspended
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          )}>
                            {admin.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-foreground text-sm leading-none truncate">{admin.name}</p>
                              {suspended && (
                                <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 border-none text-[9px] font-bold uppercase">
                                  {t('admins.suspended')}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                <Mail className="h-2.5 w-2.5 shrink-0" />
                                {admin.email}
                              </p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                                <Calendar className="h-2.5 w-2.5" />
                                {new Date(admin.createdAt).toLocaleDateString(locale)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <form action={resetAdminPassword}>
                            <input type="hidden" name="id" value={admin.id} />
                            <Button
                              type="submit"
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-[11px] font-bold whitespace-nowrap"
                            >
                              <KeyRound className="h-3 w-3 ltr:mr-1.5 rtl:ml-1.5" />
                              {t('admins.reset')}
                            </Button>
                          </form>
                          <form action={toggleSuspend}>
                            <input type="hidden" name="id" value={admin.id} />
                            <input type="hidden" name="suspended" value={String(suspended)} />
                            <Button
                              type="submit"
                              size="sm"
                              variant="outline"
                              className={cn(
                                'h-8 text-[11px] font-bold shadow-sm',
                                suspended
                                  ? 'border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                  : 'border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                              )}
                            >
                              {suspended ? (
                                <><ShieldCheck className="h-3 w-3 ltr:mr-1.5 rtl:ml-1.5" />{t('admins.restore')}</>
                              ) : (
                                <><ShieldAlert className="h-3 w-3 ltr:mr-1.5 rtl:ml-1.5" />{t('admins.suspend')}</>
                              )}
                            </Button>
                          </form>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Create admin form */}
        <div>
          <h2 className="text-base font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
            <UserPlus className="h-4 w-4" />
            {t('admins.addAdmin')}
          </h2>
          <Card className="shadow-md">
            <CardContent className="p-5">
              <form action={createAdmin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    {t('admins.fullName')}
                  </Label>
                  <Input id="name" name="name" placeholder={t('admins.fullNamePlaceholder')} required className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    {t('admins.email')}
                  </Label>
                  <Input id="email" name="email" type="email" placeholder={t('admins.emailPlaceholder')} required className="h-10" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    {t('admins.initialPassword')}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t('admins.passwordPlaceholder')}
                    minLength={8}
                    required
                    className="h-10 text-left ltr:text-left rtl:text-right"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <UserPlus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('admins.createAdminBtn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
