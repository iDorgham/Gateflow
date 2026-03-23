import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ProjectList } from '@/components/projects/ProjectList';
import { Button } from '@gate-access/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

export const metadata = { title: 'Projects | GateFlow' };

export default async function ProjectsPage({
  params,
}: {
  params: { locale: Locale };
}) {
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
            Projects Catalog
          </h1>
          <p className="text-sm font-medium text-muted-foreground/80">
            Manage your real estate access points and resource categories.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-none h-12 rounded-xl font-bold bg-background shadow-sm border-border/60 hover:border-primary/20">
            <Link href={`/${locale}/dashboard/settings?tab=projects`}>
              Project Settings
            </Link>
          </Button>
          <Button asChild className="flex-1 sm:flex-none h-12 rounded-xl font-bold bg-primary text-primary-foreground shadow-md hover:shadow-primary/20 gap-2">
            <Link href={`/${locale}/dashboard/settings?tab=projects&new=true`}>
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid of Command Centers */}
      <ProjectList projects={projectsWithCounts} />
    </div>
  );
}
