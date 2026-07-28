import { getSessionClaims } from '@/lib/auth-cookies';
import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n';

export default async function SettingsSubrouteRedirectPage(props: {
  params: Promise<{ locale: Locale; slug: string[] }>;
}) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.sub || !claims?.orgId) {
    redirect(`/${params.locale}/login`);
  }

  const subPath = params.slug ? params.slug.join('/') : '';
  redirect(
    `/${params.locale}/dashboard/organizations/${claims.orgId}/settings${subPath ? '/' + subPath : ''}`
  );
}
