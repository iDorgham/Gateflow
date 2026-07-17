import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { StyleHubClient } from '@/components/settings/StyleHubClient';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Style Hub | Design Orchestration' };

export default async function StyleHubPage(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    notFound();
  }

  const branding = await (prisma as any).organizationBranding.findUnique({
    where: { organizationId: orgId },
  });
  const snapshots = await (prisma as any).brandingSnapshot.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const tokenOverrides =
    (branding?.tokenOverrides as Record<string, string> | undefined) ?? {};
  const initialVariables = Object.entries(tokenOverrides).map(
    ([key, value]) => ({ key, value })
  );
  const formattedSnapshots = snapshots.map((s: any) => ({
    id: s.id,
    name: `Snapshot v${s.version}`,
    createdAt: s.createdAt,
    cssTokens: s.tokenOverrides ?? {},
  }));

  return (
    <div className="max-w-7xl mx-auto py-8">
      <StyleHubClient
        orgId={orgId}
        initialVariables={initialVariables}
        snapshots={formattedSnapshots}
      />
    </div>
  );
}
