import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ProjectList } from '@/components/projects/ProjectList';
import { Button } from '@gateflow/ui';
import { PageHeader } from '@gateflow/components';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

export const metadata = { title: 'Projects | GateFlow' };

export default async function ProjectsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const { locale } = params;

  const projects = await prisma.project.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { gates: true, qrCodes: true } },
      units: {
        select: {
          type: true,
          contacts: { select: { contactId: true } },
        },
      },
    },
  });

  const projectsWithCounts = projects.map((p) => {
    const uniqueContacts = new Set(
      p.units.flatMap((u) => u.contacts.map((c) => c.contactId))
    );
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      location: p.location,
      logoUrl: p.logoUrl,
      coverUrl: p.coverUrl,
      website: p.website,
      createdAt: p.createdAt,
      _count: {
        gates: p._count.gates,
        qrCodes: p._count.qrCodes,
        units: p.units.length,
        contacts: uniqueContacts.size,
      },
    };
  });

  return (
    <div className="space-y-10">
      <PageHeader
        title="Projects Catalog"
        subtitle="Manage your real estate access points and resource categories."
        showHome={false}
        className="mb-0"
        actions={
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button asChild variant="outline">
              <Link
                href={`/${locale}/dashboard/organizations/${claims.orgId}/settings/projects`}
              >
                Project Settings
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link
                href={`/${locale}/dashboard/organizations/${claims.orgId}/settings/projects`}
              >
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        }
      />

      {/* Grid of Command Centers */}
      <ProjectList projects={projectsWithCounts} />
    </div>
  );
}
