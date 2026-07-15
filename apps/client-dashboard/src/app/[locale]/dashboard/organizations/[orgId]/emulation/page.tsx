import { redirect } from 'next/navigation';
import { getTranslation, type Locale } from '@/lib/i18n';
import { requireAuth } from '@/lib/dashboard-auth';
import { isSuperAdmin } from '@/lib/super-admin';
import { EmulationWizard } from '@/components/dashboard/emulation/emulation-wizard';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { t } = await getTranslation(params.locale, 'dashboard');
  return {
    title: t('emulation.meta_title', {
      defaultValue: 'Traffic emulation · GateFlow',
    }),
  };
}

export default async function EmulationPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { claims } = await requireAuth();

  if (!isSuperAdmin(claims)) {
    redirect(`/${params.locale}/dashboard`);
  }

  return <EmulationWizard locale={params.locale} />;
}
