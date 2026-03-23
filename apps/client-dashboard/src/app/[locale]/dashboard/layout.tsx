import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { Locale } from '@/lib/i18n';

export default async function DashboardLayout(
  props: { 
    children: React.ReactNode; 
    params: Promise<{ locale: Locale }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <DashboardWrapper locale={params.locale}>
      {children}
    </DashboardWrapper>
  );
}
