import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n-config';

export default async function WebhookRedirect(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const { locale, orgId } = await props.params;
  redirect(`/${locale}/dashboard/organizations/${orgId}/settings/api`);
}
