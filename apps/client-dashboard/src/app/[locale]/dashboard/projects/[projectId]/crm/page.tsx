import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect, notFound } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@gateflow/ui';
import { ContactTable } from '@/components/crm/ContactTable';
import { UnitTable } from '@/components/crm/UnitTable';
import { Users, Building, ShieldCheck, Search } from 'lucide-react';

export default async function ProjectCrmPage(props: {
  params: Promise<{ projectId: string; locale: Locale }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const project = await prisma.project.findFirst({
    where: {
      id: params.projectId,
      organizationId: claims.orgId,
      deletedAt: null,
    },
    select: { id: true, name: true },
  });

  if (!project) notFound();

  const currentTab = searchParams.tab || 'contacts';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-[var(--ds-text,#172B4D)] dark:text-white tracking-tight uppercase">
            CRM Hub — {project.name}
          </h1>
          <p className="text-sm font-medium text-[var(--ds-text-subtlest,#6B778C)] dark:text-[var(--ds-text-subtle,#97A0AF)]">
            Manage project residents, unit inventory, and ownership relations.
          </p>
        </div>
      </div>

      <Tabs defaultValue={currentTab} className="w-full">
        <TabsList className="h-14 p-1.5 bg-secondary rounded-2xl mb-8">
          <TabsTrigger
            value="contacts"
            className="flex-1 rounded-xl font-bold gap-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Users className="h-4.5 w-4.5" />
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="units"
            className="flex-1 rounded-xl font-bold gap-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Building className="h-4.5 w-4.5" />
            Units Inventory
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex-1 rounded-xl font-bold gap-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            Security Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-border bg-[var(--ds-background-subtle,#FAFBFC)] dark:bg-[var(--ds-background-information-subtle,#091E42)]/20">
              <h2 className="text-[18px] font-bold text-[var(--ds-text,#172B4D)] dark:text-white">
                Residents Directory
              </h2>
              <p className="text-xs text-[var(--ds-text-subtlest,#6B778C)] font-medium mt-1">
                Full list of verified occupants and external consultants.
              </p>
            </div>
            <div className="p-8">
              <ContactTable
                projectId={params.projectId}
                locale={params.locale}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units">
          <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-border bg-[var(--ds-background-subtle,#FAFBFC)] dark:bg-[var(--ds-background-information-subtle,#091E42)]/20">
              <h2 className="text-[18px] font-bold text-[var(--ds-text,#172B4D)] dark:text-white">
                Property Inventory
              </h2>
              <p className="text-xs text-[var(--ds-text-subtlest,#6B778C)] font-medium mt-1">
                Managed assets and occupancy tracking for this project.
              </p>
            </div>
            <div className="p-8">
              <UnitTable projectId={params.projectId} locale={params.locale} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-border rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="bg-[var(--ds-background-subtle,#FAFBFC)] dark:bg-[var(--ds-background-information-subtle,#091E42)]/20 p-8 border-b border-border">
              <CardTitle className="text-[18px] font-bold">
                Activity Log
              </CardTitle>
              <CardDescription>
                Security and administrative audit trail for CRM records.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center text-[var(--ds-text-subtlest,#6B778C)]">
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                  <Search className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-sm font-medium italic">
                  Detailed audit trail is coming in the next phase.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
