import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { LandingPageList } from '@/components/cms/LandingPageList';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Landing Pages | Content Engine' };

export default async function LandingPagesPage(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  const pages = await prisma.landingPage.findMany({
    where: { organizationId: orgId },
    orderBy: { updatedAt: 'desc' },
  });

  const initialPages = pages.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleEn: p.titleEn,
    status: p.status,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto py-8">
      <LandingPageList
        initialPages={initialPages}
        locale={locale}
        orgId={orgId}
      />
    </div>
  );
}
