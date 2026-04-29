import TranslationsProvider from '@/components/i18n/TranslationsProvider';
import { AdminShell } from '@/components/admin-shell';
import { Locale, i18n } from '@/lib/i18n/i18n-config';
import { notFound } from 'next/navigation';
import { OrganizationProvider } from '@/components/providers/OrganizationProvider';

export default async function DashboardLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  const locale = params.locale as Locale;

  const {
    children
  } = props;

  if (!i18n.locales.includes(locale)) {
    notFound();
  }

  return (
    <OrganizationProvider organization={null}>
      <TranslationsProvider>
        <AdminShell locale={locale}>{children}</AdminShell>
      </TranslationsProvider>
    </OrganizationProvider>
  );
}
