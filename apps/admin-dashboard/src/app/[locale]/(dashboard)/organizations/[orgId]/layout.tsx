import { prisma } from '@gate-access/db';
import { notFound } from 'next/navigation';
import { OrganizationProvider } from '@/components/providers/OrganizationProvider';
import { BrandingStyles } from '@/components/branding/BrandingStyles';

export default async function OrganizationLayout(props: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const params = await props.params;
  const { orgId } = params;

  const organization = await prisma.organization.findUnique({
    where: { id: orgId, deletedAt: null },
    select: {
      id: true,
      name: true,
      type: true,
      plan: true,
    },
  });

  if (!organization) {
    notFound();
  }

  return (
    <OrganizationProvider organization={organization}>
      <BrandingStyles orgId={orgId} />
      {props.children}
    </OrganizationProvider>
  );
}
