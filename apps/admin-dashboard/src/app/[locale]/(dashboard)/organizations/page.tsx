import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import {
  Building2,
  Search,
  Users,
  QrCode,
  ScanLine,
  MoreHorizontal,
  X,
  Filter,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
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

export const metadata = { title: 'Organizations' };

// ─── Server actions ───────────────────────────────────────────────────────────

async function changePlan(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = formData.get('id') as string;
  const plan = formData.get('plan') as 'FREE' | 'PRO' | 'ENTERPRISE';
  if (!id || !plan) return;
  await prisma.organization.update({ where: { id }, data: { plan } });
  revalidatePath('/organizations');
}

async function suspendOrg(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath('/organizations');
}

async function activateOrg(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.organization.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath('/organizations');
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PLANS = ['FREE', 'PRO', 'ENTERPRISE'] as const;

interface SearchParams { q?: string; plan?: string; status?: string }

export default async function OrganizationsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { t } = await getTranslation(locale, 'admin');

  const search = searchParams.q?.trim() ?? '';
  const planFilter = searchParams.plan ?? '';
  const statusFilter = searchParams.status ?? 'all';

  const orgs = await prisma.organization.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(planFilter ? { plan: planFilter as 'FREE' | 'PRO' | 'ENTERPRISE' } : {}),
      ...(statusFilter === 'active'
        ? { deletedAt: null }
        : statusFilter === 'suspended'
        ? { NOT: { deletedAt: null } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      deletedAt: true,
      createdAt: true,
      _count: { select: { users: true, qrCodes: true, gates: true } },
    },
  });

  // Get scan counts per org for the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);
  const scansByOrg = await prisma.scanLog.groupBy({
    by: ['gateId'],
    where: { scannedAt: { gte: thirtyDaysAgo } },
    _count: true,
  });

  // Map gateId → orgId via gates
  const gates = await prisma.gate.findMany({
    where: {
      id: {
        in: Array.from(new Set(scansByOrg.map((s) => s.gateId))),
      },
    },
    select: { id: true, organizationId: true },
  });
  const gateOrgMap = new Map(gates.map((g) => [g.id, g.organizationId]));
  const orgScanMap = new Map<string, number>();
  for (const s of scansByOrg) {
    const orgId = gateOrgMap.get(s.gateId);
    if (orgId) orgScanMap.set(orgId, (orgScanMap.get(orgId) ?? 0) + s._count);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('organizations.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('organizations.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800 px-3 py-1">
            {t('organizations.totalOrgs', { count: orgs.length })}
          </Badge>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={search}
                placeholder={t('organizations.searchPlaceholder')}
                className="ltr:pl-9 rtl:pr-9 h-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground rtl:ml-2" />
              <select
                name="plan"
                defaultValue={planFilter}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">{t('organizations.allPlans')}</option>
                {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                name="status"
                defaultValue={statusFilter}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="all">{t('organizations.allStatus')}</option>
                <option value="active">{t('organizations.active')}</option>
                <option value="suspended">{t('organizations.suspended')}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t('organizations.filter')}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/organizations">
                  <X className="h-3.5 w-3.5 ltr:mr-1.5 rtl:ml-1.5" />
                  {t('organizations.clear')}
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
                  <th className="px-6 py-4 text-left rtl:text-right">{t('organizations.org')}</th>
                  <th className="px-6 py-4 text-left rtl:text-right">{t('organizations.plan')}</th>
                  <th className="px-6 py-4 text-center">{t('organizations.metrics')}</th>
                  <th className="px-6 py-4 text-left rtl:text-right">{t('organizations.status')}</th>
                  <th className="px-6 py-4 text-right rtl:text-left">{t('organizations.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orgs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Building2 className="h-8 w-8 opacity-20" />
                        <p className="font-medium">{t('organizations.noResults')}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orgs.map((org) => {
                    const suspended = org.deletedAt !== null;
                    return (
                      <tr key={org.id} className={cn(
                        "group transition-colors",
                        suspended ? "bg-muted/30 opacity-75" : "hover:bg-primary/5"
                      )}>
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs uppercase transition-transform group-hover:scale-110 shadow-sm",
                              suspended ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground shadow-primary/20"
                            )}>
                              {org.name.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-none">{org.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{org.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            org.plan === 'ENTERPRISE' ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-800" :
                            org.plan === 'PRO' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800" :
                            "bg-muted text-muted-foreground border-border"
                          )}>
                            {org.plan}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center" title={t('organizations.totalUsers')}>
                              <Users className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{org._count.users.toLocaleString(locale)}</span>
                            </div>
                            <div className="flex flex-col items-center" title={t('organizations.qrCodes')}>
                              <QrCode className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{org._count.qrCodes.toLocaleString(locale)}</span>
                            </div>
                            <div className="flex flex-col items-center" title={t('organizations.scansLast30d')}>
                              <ScanLine className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{(orgScanMap.get(org.id) ?? 0).toLocaleString(locale)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            "border-none rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase shadow-sm",
                            suspended ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300" : "bg-emerald-500 text-white"
                          )}>
                            {suspended ? (
                              <span className="flex items-center gap-1">
                                <ShieldAlert className="h-2.5 w-2.5 rtl:ml-1" />
                                {t('organizations.suspended')}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ShieldCheck className="h-2.5 w-2.5 rtl:ml-1" />
                                {t('organizations.active')}
                              </span>
                            )}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                            {/* Fast Actions */}
                            <form action={changePlan} className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <input type="hidden" name="id" value={org.id} />
                              <select
                                name="plan"
                                defaultValue={org.plan}
                                className="h-7 rounded border border-input bg-background px-1.5 py-0 text-[10px] font-bold text-foreground focus:outline-none"
                              >
                                {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <Button type="submit" size="sm" variant="ghost" className="h-7 px-2 text-[10px] font-bold text-primary hover:text-primary/80 hover:bg-primary/10">
                                {t('organizations.apply')}
                              </Button>
                            </form>

                            <div className="w-[1px] h-4 bg-border hidden group-hover:block" />

                            {suspended ? (
                              <form action={activateOrg}>
                                <input type="hidden" name="id" value={org.id} />
                                <Button type="submit" size="sm" variant="outline" className="h-8 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[11px] font-bold shadow-sm">
                                  {t('organizations.restore')}
                                </Button>
                              </form>
                            ) : (
                              <form action={suspendOrg}>
                                <input type="hidden" name="id" value={org.id} />
                                <Button type="submit" size="sm" variant="outline" className="h-8 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] font-bold shadow-sm">
                                  {t('organizations.suspend')}
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
      
      <div className="flex justify-between items-center text-[11px] font-medium text-muted-foreground px-1">
        <p>{t('organizations.sortedByDesc')}</p>
        <p>{t('organizations.syncTime')}</p>
      </div>
    </div>
  );
}
