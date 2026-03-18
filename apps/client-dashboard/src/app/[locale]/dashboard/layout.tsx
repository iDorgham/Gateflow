import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { Locale } from '@/lib/i18n';

export default async function DashboardLayout({ 
  children,
  params
}: { 
  children: React.ReactNode; 
  params: { locale: Locale };
}) {
  return (
    <DashboardWrapper locale={params.locale}>
      {children}
    </DashboardWrapper>
  );
}
