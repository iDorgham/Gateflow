import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { CrmDashboard } from '@/components/crm/CrmDashboard';

export const metadata = { title: 'Lead Intelligence | GateFlow' };

/**
 * CRM Lead Management Page
 *
 * Provides a high-level view of all leads captured for GateFlow.
 * Includes AI scoring and outreach tools.
 */
export default async function CrmPage(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  // 1. Authorization & Localization
  await requireAdmin(locale);
  const { t } = (await getTranslation(locale, 'admin')) as any;

  // 2. Data Fetching
  // Fetch active leads scoped to the current organization
  const leads = await prisma.lead.findMany({
    where: { deletedAt: null, organizationId: orgId },
    orderBy: { createdAt: 'desc' },
    include: { organization: true },
  });

  // 3. Serialization for Client Components
  const serializedLeads = leads.map((l) => ({
    id: l.id,
    status: l.status,
    score: l.score,
    source: l.source,
    createdAt: l.createdAt.toISOString(),
    organizationName: l.organization.name,
    orgType: l.organization.type ?? 'GENERAL',
    firstName: l.firstName,
    lastName: l.lastName,
    company: l.company,
  }));

  // 4. Render Dashboard
  return (
    <CrmDashboard
      leads={serializedLeads}
      locale={locale}
      translations={{
        title: t('crm.title', 'Lead Intelligence'),
        subtitle: t('crm.subtitle', 'Predictive AI scoring and nurturing for GateFlow leads.'),
        columns: {
          lead: t('crm.columns.lead', 'Lead'),
          status: t('crm.columns.status', 'Status'),
          score: t('crm.columns.score', 'AI Score'),
          actions: t('crm.columns.actions', 'Actions'),
        },
        actions: {
          score: t('crm.actions.score', 'Analyze'),
          draft: t('crm.actions.draft', 'Generate Draft'),
        },
        scoreSuccess: t('crm.scoreSuccess', 'Lead analyzed successfully'),
        scoreError: t('crm.scoreError', 'Failed to analyze lead'),
      }}
    />
  );
}
