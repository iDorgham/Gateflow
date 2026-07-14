import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { Search, X } from 'lucide-react';
import { Card, CardContent, Button, Input, NativeSelect } from '@gateflow/ui';
import Link from 'next/link';
import { GatesClient, type Gate } from './GatesClient';

export const metadata = { title: 'Gates' };

// ─── Server actions ────────────────────────────────────────────────────────────

// ─── Page ──────────────────────────────────────────────────────────────────────

interface SearchParams {
  q?: string;
  org?: string;
  status?: string;
}

export default async function GatesPage(props: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { locale, orgId } = params as any;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const search = searchParams.q?.trim() ?? '';
  const orgFilter = searchParams.org?.trim() ?? '';
  const statusFilter = searchParams.status ?? 'active';

  const gates = await prisma.gate.findMany({
    where: {
      organizationId: orgId,
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(orgFilter
        ? {
            organization: {
              name: { contains: orgFilter, mode: 'insensitive' },
            },
          }
        : {}),
      ...(statusFilter === 'active'
        ? { deletedAt: null }
        : statusFilter === 'deleted'
          ? { NOT: { deletedAt: null } }
          : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      location: true,
      isActive: true,
      deletedAt: true,
      createdAt: true,
      lastAccessedAt: true,
      organization: { select: { id: true, name: true, plan: true } },
      project: { select: { id: true, name: true } },
      _count: { select: { scanLogs: true } },
    },
  });

  const [totalActive, projects] = await Promise.all([
    prisma.gate.count({ where: { deletedAt: null, isActive: true } }),
    prisma.project.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
  ]);

  const serializedGates = gates.map(
    (g: any): Gate => ({
      ...(g as any),
      createdAt: g.createdAt.toISOString(),
      deletedAt: g.deletedAt?.toISOString() ?? null,
    })
  );

  const serializedProjects = projects.map((p: any): any => ({ ...p }));

  return (
    <GatesClient
      projects={serializedProjects}
      gates={serializedGates}
      locale={locale}
      filters={
        <Card className="shadow-sm border-ds-border">
          <CardContent className="p-4">
            <form method="GET" className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={search}
                  placeholder={t('gates.searchPlaceholder')}
                  className="ltr:pl-9 rtl:pr-9 h-10 rounded-lg bg-ds-background-neutral-subtle border-ds-border"
                />
              </div>
              <div className="flex items-center gap-2">
                <NativeSelect
                  name="status"
                  defaultValue={statusFilter}
                  className="h-10 w-[140px] rounded-lg border-ds-border"
                >
                  <option value="all">{t('gates.allStatus' as any)}</option>
                  <option value="active">{t('gates.active' as any)}</option>
                  <option value="archived">{t('gates.archived' as any)}</option>
                </NativeSelect>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-ds-background-success-bold hover:bg-ds-background-success-bold/90 text-ds-text-inverse font-bold rounded-lg h-10 px-6"
                >
                  {t('gates.filter')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="font-bold h-10 rounded-lg"
                >
                  <Link href="/gates">
                    <X className="h-3.5 w-3.5 ltr:mr-1.5 rtl:ml-1.5" />
                    {t('gates.clear')}
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      }
      translations={{
        title: t('gates.title'),
        subtitle: t('gates.subtitle'),
        addLabel: t('gates.commission'),
        totalActive: t('gates.activeGates', { count: totalActive }),
        emptyTitle: t('gates.title'),
        emptySubtitle: t('gates.noResultsDesc'),
        totalHardware: t('nav.monitoring'),
        statusArchived: t('gates.archived'),
        statusCommissioned: t('gates.active'),
        statusStandby: t('gates.inactive'),
        columns: {
          gate: t('gates.gate'),
          parent: t('gates.orgProject'),
          usage: t('gates.scans'),
          status: t('gates.status'),
        },
      }}
    />
  );
}
