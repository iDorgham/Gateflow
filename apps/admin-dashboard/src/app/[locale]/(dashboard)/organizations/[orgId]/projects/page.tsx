import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import { Search, Building2, X } from 'lucide-react';
import { Card, CardContent, Button, Input, NativeSelect } from '@gateflow/ui';
import Link from 'next/link';
import { ProjectsClient } from './ProjectsClient';

export const metadata = { title: 'Projects' };

function localeFromFormData(formData: FormData): Locale {
  const raw = String(formData.get('locale') ?? '');
  if (raw === 'ar-EG' || raw === 'en') return raw;
  return 'en';
}

// ─── Server actions ────────────────────────────────────────────────────────────

async function deleteProject(formData: FormData) {
  'use server';
  const locale = localeFromFormData(formData);
  await requireAdmin(locale);
  const id = formData.get('id') as string;
  if (!id) return;
  // skip-organization-check (Global Admin Action)
  await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath(`/${locale}/projects`);
}

async function restoreProject(formData: FormData) {
  'use server';
  const locale = localeFromFormData(formData);
  await requireAdmin(locale);
  const id = formData.get('id') as string;
  if (!id) return;
  // skip-organization-check (Global Admin Action)
  await prisma.project.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath(`/${locale}/projects`);
}

// ─── Page ──────────────────────────────────────────────────────────────────────

interface SearchParams {
  q?: string;
  org?: string;
  status?: string;
}

export default async function ProjectsPage(props: {
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

  // skip-organization-check (Global Admin List)
  const projects = await prisma.project.findMany({
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
        : statusFilter === 'archived'
          ? { NOT: { deletedAt: null } }
          : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      deletedAt: true,
      createdAt: true,
      organization: { select: { id: true, name: true, plan: true } },
      _count: { select: { gates: true, qrCodes: true } },
    },
  });

  const [totalActive, organizations] = await Promise.all([
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.organization.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
  ]);

  const serializedProjects = projects.map((p: (typeof projects)[number]) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    deletedAt: p.deletedAt?.toISOString() ?? null,
  }));

  const serializedOrgs = organizations.map(
    (o: (typeof organizations)[number]) => ({ ...o })
  );

  return (
    <ProjectsClient
      organizations={serializedOrgs}
      projects={serializedProjects}
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
                  placeholder={t('projects.searchPlaceholder')}
                  className="ltr:pl-9 rtl:pr-9 h-10 rounded-lg bg-ds-background-neutral-subtle border-ds-border"
                />
              </div>
              <div className="relative flex-1 min-w-[200px]">
                <Building2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="org"
                  defaultValue={orgFilter}
                  placeholder={t('projects.filterByOrg')}
                  className="ltr:pl-9 rtl:pr-9 h-10 rounded-lg bg-ds-background-neutral-subtle border-ds-border"
                />
              </div>
              <div className="flex items-center gap-2">
                <NativeSelect
                  name="status"
                  defaultValue={statusFilter}
                  className="h-10 w-[140px] rounded-lg border-ds-border"
                >
                  <option value="all">{t('projects.allStatus' as any)}</option>
                  <option value="active">{t('projects.active' as any)}</option>
                  <option value="archived">
                    {t('projects.archived' as any)}
                  </option>
                </NativeSelect>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-ds-background-brand-bold hover:bg-ds-background-brand-bold/90 text-ds-text-inverse font-bold rounded-lg h-10 px-6"
                >
                  {t('projects.filter')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="font-bold h-10 rounded-lg"
                >
                  <Link href="/projects">
                    <X className="h-3.5 w-3.5 ltr:mr-1.5 rtl:ml-1.5" />
                    {t('projects.clear')}
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      }
      translations={{
        title: t('projects.title'),
        subtitle: t('projects.subtitle'),
        addLabel: t('projects.provision'),
        totalActive: t('projects.activeProjects', { count: totalActive }),
        emptyTitle: t('projects.title'),
        emptySubtitle: t('projects.noResultsDesc'),
        totalInfrastructure: t('projects.title'),
        columns: {
          project: t('projects.project'),
          org: t('projects.organization'),
          metrics: t('projects.resources'),
          created: t('projects.created'),
        },
      }}
    />
  );
}
