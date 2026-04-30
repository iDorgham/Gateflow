import TranslationsProvider from '@/components/i18n/TranslationsProvider';
import { AdminShell } from '@/components/admin-shell';
import { Locale, i18n } from '@/lib/i18n/i18n-config';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@gate-access/db';
import { OrganizationProvider } from '@/components/providers/OrganizationProvider';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children } = props;
  const params = await props.params;
  const locale = params.locale as Locale;
  const cookieStore = await cookies();
  const stickyOrgId = cookieStore.get('gf_active_org_id')?.value;

  let activeOrg = null;
  if (stickyOrgId) {
    activeOrg = await prisma.organization.findUnique({
      where: { id: stickyOrgId, deletedAt: null },
      select: { id: true, name: true, type: true, plan: true },
    });
  }

  if (!i18n.locales.includes(locale)) {
    notFound();
  }

  return (
    <OrganizationProvider organization={activeOrg}>
      <TranslationsProvider>
        <AdminShell locale={locale}>{children}</AdminShell>
      </TranslationsProvider>
    </OrganizationProvider>
  );
}
