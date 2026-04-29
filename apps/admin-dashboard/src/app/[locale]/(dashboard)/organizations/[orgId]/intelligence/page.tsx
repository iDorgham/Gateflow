import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { IntelligenceHubClient } from '@/components/intelligence/IntelligenceHubClient';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Intelligence Hub | Vertical AI' };

export default async function IntelligenceHubPage(props: {
  params: Promise<{ locale: Locale, orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      knowledgeSources: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!organization) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <IntelligenceHubClient 
        orgId={orgId} 
        initialSources={organization.knowledgeSources as any} 
      />
    </div>
  );
}
