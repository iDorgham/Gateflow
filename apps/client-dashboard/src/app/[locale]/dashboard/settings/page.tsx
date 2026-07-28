import { getSessionClaims } from '@/lib/auth-cookies';
import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n';

export default async function SettingsRedirectPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.sub || !claims?.orgId) {
    redirect(`/${params.locale}/login`);
  }

  redirect(
    `/${params.locale}/dashboard/organizations/${claims.orgId}/settings`
  );
}
