import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { PageBuilder } from '@/components/cms/PageBuilder';
import { notFound } from 'next/navigation';

export default async function EditLandingPage(props: {
  params: Promise<{ locale: Locale; orgId: string; id: string }>;
}) {
  const params = await props.params;
  const { locale, orgId, id } = params;

  await requireAdmin(locale);

  const page = await prisma.landingPage.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!page || (page.organizationId && page.organizationId !== orgId)) {
    notFound();
  }

  return (
    <div className="h-full">
      <PageBuilder initialPage={page as any} orgId={orgId} />
    </div>
  );
}
