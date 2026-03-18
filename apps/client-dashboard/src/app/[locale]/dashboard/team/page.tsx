import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n-config';

export default function TeamRedirect({ params }: { params: { locale: Locale } }) {
  redirect(`/${params.locale}/dashboard/settings?tab=team`);
}
