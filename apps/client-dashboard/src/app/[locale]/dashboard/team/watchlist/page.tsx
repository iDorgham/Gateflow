import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import type { Locale } from '@/lib/i18n';
import { WatchlistClient } from './watchlist-client';

export default async function WatchlistPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect(`/${params.locale}/login`);
  if (!hasPermission(claims, 'gates:manage')) {
    redirect(`/${params.locale}/dashboard`);
  }

  return <WatchlistClient />;
}
