import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import {
  Users,
  Search,
  Key,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Filter,
  X,
  UserPlus,
  KeyRound,
  ArrowRight,
  Shield,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  cn,
} from '@gate-access/ui';
import Link from 'next/link';

export const metadata = { title: 'Users' };

// ─── Server actions ───────────────────────────────────────────────────────────

async function resetPassword(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;

  const tempPassword = randomBytes(10).toString('hex'); // 20-char hex
  const passwordHash = await argon2.hash(tempPassword);

  await prisma.user.update({ where: { id }, data: { passwordHash } });

  cookies().set('_pwflash', JSON.stringify({ id, pw: tempPassword }), {
    path: '/',
    maxAge: 120,
    sameSite: 'lax',
  });

  revalidatePath('/users');
  redirect('/users');
}

async function toggleSuspendUser(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = formData.get('id') as string;
  const current = formData.get('deletedAt') as string;
  if (!id) return;
  await prisma.user.update({
    where: { id },
    data: { deletedAt: current === 'null' ? new Date() : null },
  });
  revalidatePath('/users');
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ROLES = ['ADMIN', 'TENANT_ADMIN', 'TENANT_USER', 'VISITOR'] as const;

interface SearchParams { q?: string; role?: string; status?: string }

export default async function UsersPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { t } = await getTranslation(locale, 'admin');

  const search = searchParams.q?.trim() ?? '';
  const roleFilter = searchParams.role ?? '';
  const statusFilter = searchParams.status ?? 'active';

  const users = await prisma.user.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(roleFilter ? { role: { name: roleFilter } } : {}),
      ...(statusFilter === 'active'
        ? { deletedAt: null }
        : statusFilter === 'suspended'
        ? { NOT: { deletedAt: null } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      deletedAt: true,
      createdAt: true,
      organization: { select: { id: true, name: true, plan: true } },
    },
  });

  // Read and clear the password-reset flash cookie
  let pwFlash: { id: string; pw: string } | null = null;
  try {
    const raw = cookies().get('_pwflash')?.value;
    if (raw) {
      pwFlash = JSON.parse(raw) as { id: string; pw: string };
      cookies().delete('_pwflash');
    }
  } catch {
    // ignore malformed cookie
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('users.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('users.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-800 px-3 py-1 font-bold">
            {t('users.activeUsers', { count: users.filter(u => u.deletedAt === null).length })}
          </Badge>
        </div>
      </div>

      {/* ── Password reset flash ─────────────────────────────────────────────── */}
      {pwFlash && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 shadow-lg shadow-amber-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
          <CardHeader className="pb-3 border-b border-amber-100/50 dark:border-amber-800/50">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <KeyRound className="h-5 w-5 rtl:scale-x-[-1]" />
              <CardTitle className="text-base font-bold">{t('users.tempPasswordTitle')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              {t('users.tempPasswordDesc')}
            </p>
            <div className="relative group">
              <code className="block w-full rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 px-6 py-4 font-mono text-xl font-black tracking-[0.2em] text-amber-950 dark:text-amber-200 text-center shadow-inner group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 transition-colors">
                {pwFlash.pw}
              </code>
              <Badge className="absolute -top-2 rtl:-left-1 ltr:-right-1 bg-amber-800 text-white font-bold text-[10px] tracking-widest uppercase">
                {t('users.expiresIn2Min')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={search}
                placeholder={t('users.searchPlaceholder')}
                className="ltr:pl-9 rtl:pr-9 h-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground rtl:ml-2" />
              <select
                name="role"
                defaultValue={roleFilter}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 font-medium"
              >
                <option value="">{t('users.allRoles')}</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {t(`roles.${r}`)}
                  </option>
                ))}
              </select>
              <select
                name="status"
                defaultValue={statusFilter}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 font-medium"
              >
                <option value="all">{t('users.allStatus')}</option>
                <option value="active">{t('users.active')}</option>
                <option value="suspended">{t('users.suspended')}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                {t('users.filter')}
              </Button>
              <Button variant="outline" size="sm" asChild className="font-bold">
                <Link href="/users">
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  {t('users.clear')}
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <Card className="shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                  <th className="px-6 py-4 text-left rtl:text-right">{t('users.userIdentity')}</th>
                  <th className="px-6 py-4 text-left rtl:text-right">{t('users.affiliation')}</th>
                  <th className="px-6 py-4 text-center">{t('users.securityRole')}</th>
                  <th className="px-6 py-4 text-left rtl:text-right">{t('users.status')}</th>
                  <th className="px-6 py-4 text-right rtl:text-left">{t('users.protectionActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8 opacity-20" />
                        <p className="font-medium">{t('users.noResults')}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const suspended = user.deletedAt !== null;
                    const isFlash = pwFlash?.id === user.id;
                    return (
                      <tr key={user.id} className={cn(
                        "group transition-colors",
                        suspended ? "bg-muted/30 opacity-75" : isFlash ? "bg-amber-50/50 dark:bg-amber-900/10" : "hover:bg-primary/5"
                      )}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-full font-bold text-[10px] uppercase shadow-sm transition-transform group-hover:scale-110",
                              suspended ? "bg-muted text-muted-foreground" : "bg-foreground text-background"
                            )}>
                              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-none">{user.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.organization ? (
                            <div className="flex flex-col gap-1">
                              <p className="text-foreground font-bold text-xs">{user.organization.name}</p>
                              <Badge variant="secondary" className={cn(
                                "w-fit text-[9px] font-bold uppercase tracking-tight h-4 px-1.5",
                                user.organization?.plan === 'PRO' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" :
                                "bg-muted text-muted-foreground"
                              )}>
                                {user.organization.plan}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-wider">{t('users.platformResident')}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <RoleBadge role={user.role?.name ?? 'USER'} t={t} />
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            "border-none rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase shadow-sm",
                            suspended ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300" : "bg-emerald-500 text-white"
                          )}>
                            {suspended ? (
                              <span className="flex items-center gap-1">
                                <ShieldAlert className="h-2.5 w-2.5 rtl:ml-1" />
                                {t('users.suspended')}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ShieldCheck className="h-2.5 w-2.5 rtl:ml-1" />
                                {t('users.active')}
                              </span>
                            )}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 translate-x-2 group-hover:translate-x-0 transition-transform">
                            {/* Reset password */}
                            <form action={resetPassword}>
                              <input type="hidden" name="id" value={user.id} />
                              <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                              >
                                <KeyRound className="h-3 w-3 ltr:mr-1.5 rtl:ml-1.5" />
                                {t('users.resetKey')}
                              </Button>
                            </form>

                            {suspended ? (
                              <form action={toggleSuspendUser}>
                                <input type="hidden" name="id" value={user.id} />
                                <input type="hidden" name="deletedAt" value={String(user.deletedAt)} />
                                <Button type="submit" size="sm" variant="outline" className="h-8 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[11px] font-bold shadow-sm">
                                  {t('users.restore')}
                                </Button>
                              </form>
                            ) : (
                              <form action={toggleSuspendUser}>
                                <input type="hidden" name="id" value={user.id} />
                                <input type="hidden" name="deletedAt" value={String(user.deletedAt)} />
                                <Button type="submit" size="sm" variant="outline" className="h-8 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] font-bold shadow-sm">
                                  {t('users.restrict')}
                                </Button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground px-1">
        <Shield className="h-3 w-3 rtl:ml-1" />
        <p>{t('users.auditLogNotice')}</p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role, t }: { role: string; t: any }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 shadow-red-100/50',
    TENANT_ADMIN: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 shadow-orange-100/50',
    TENANT_USER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 shadow-blue-100/50',
    VISITOR: 'bg-muted text-muted-foreground border-border shadow-muted/50',
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider px-2 h-5 border shadow-sm",
        styles[role] ?? styles.VISITOR
      )}
    >
      {t(`roles.${role}`, role.replace('_', ' '))}
    </Badge>
  );
}
