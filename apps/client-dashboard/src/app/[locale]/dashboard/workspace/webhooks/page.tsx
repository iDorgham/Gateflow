import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n-config';

export default function WebhookRedirect({ params }: { params: { locale: Locale } }) {
  redirect(`/${params.locale}/dashboard/settings?tab=webhooks`);
}
