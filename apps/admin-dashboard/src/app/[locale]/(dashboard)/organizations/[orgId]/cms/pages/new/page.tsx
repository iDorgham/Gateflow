import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { ScaffolderWizard } from '@/components/cms/ScaffolderWizard';
import { notFound } from 'next/navigation';

export const metadata = { title: 'AI Page Scaffolder | Content Engine' };

export default async function NewLandingPagePage(props: {
  params: Promise<{ locale: Locale, orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { name: true }
  });

  if (!organization) {
    notFound();
  }

  return (
    <ScaffolderWizard 
      orgId={orgId} 
      orgName={organization.name} 
      locale={locale} 
    />
  );
}
