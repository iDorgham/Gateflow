import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { StyleHubClient } from '@/components/settings/StyleHubClient';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Style Hub | Design Orchestration' };

export default async function StyleHubPage(props: {
  params: Promise<{ locale: Locale, orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      styleSnapshots: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      themeVariables: true,
      activeStyle: true
    }
  });

  if (!organization) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <StyleHubClient 
        orgId={orgId} 
        initialVariables={organization.themeVariables} 
        snapshots={organization.styleSnapshots} 
      />
    </div>
  );
}
