import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { requireAdmin } from '../../../lib/admin-auth';
import { Locale } from '../../../lib/i18n/i18n-config';

export default async function LegacyRedirectPage(props: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ to?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale } = params;
  const { to } = searchParams;

  await requireAdmin(locale);

  const firstOrg = await prisma.organization.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (firstOrg) {
    const target = to ? `/${to}` : '';
    redirect(`/${locale}/organizations/${firstOrg.id}${target}`);
  }

  redirect(`/${locale}/organizations`);
}
