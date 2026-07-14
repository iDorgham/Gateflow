import { CrmDashboard } from '@/components/crm/crm-dashboard';

/**
 * CRM Page (Scoped by Organization)
 * Only accessible to Sales roles (enforced at component/API level)
 */
export default function CrmPage() {
  return <CrmDashboard />;
}
