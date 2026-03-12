import TranslationsProvider from '@/components/i18n/TranslationsProvider';
import { AdminShell } from '@/components/admin-shell';
import { Locale, i18n } from '@/lib/i18n/i18n-config';
import { notFound } from 'next/navigation';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!i18n.locales.includes(params.locale)) {
    notFound();
  }

  return (
    <TranslationsProvider>
      <AdminShell locale={params.locale}>{children}</AdminShell>
    </TranslationsProvider>
  );
}
