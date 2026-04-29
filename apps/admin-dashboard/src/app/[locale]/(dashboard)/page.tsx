import { prisma } from '@gate-access/db';
import { requireAdmin } from '../../../lib/admin-auth';
import { Locale } from '../../../lib/i18n/i18n-config';
import { redirect } from 'next/navigation';

export default async function AdminOverviewPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);

  // Find first available organization to redirect to
  const firstOrg = await prisma.organization.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (firstOrg) {
    redirect(`/${locale}/organizations/${firstOrg.id}`);
  }

  // Fallback to organizations list if no orgs exist
  redirect(`/${locale}/organizations`);
}
