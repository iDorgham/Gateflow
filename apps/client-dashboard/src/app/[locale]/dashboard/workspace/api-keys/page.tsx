import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n-config';

export default async function ApiKeysRedirect(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  redirect(`/${params.locale}/dashboard/settings?tab=api-keys`);
}
