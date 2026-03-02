import { requireAuth } from '@/lib/dashboard-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gate-access/ui';
import { getUnitsWithStats, getResidentLimits } from './actions';
import { UnitsOverview } from '@/components/settings/residents/units-overview';
import { UnitTypeTable } from '@/components/settings/residents/unit-type-table';
import { ResidentSettingsForm } from '@/components/settings/residents/resident-settings-form';
import { LayoutGrid, ListTree, Cog } from 'lucide-react';

export default async function ResidentsSettings() {
  const { org } = await requireAuth();

  if (!org) return null;

  const [units, limits] = await Promise.all([
    getUnitsWithStats(),
    getResidentLimits(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight">{org.name} — Units & Residents</h1>
        <p className="text-sm text-muted-foreground">Manage unit types, quotas, and global resident privacy settings.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-fit h-auto flex-wrap">
          <TabsTrigger value="overview" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4">
            <LayoutGrid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="types" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4">
            <ListTree className="h-4 w-4" />
            Unit Types
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4">
            <Cog className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <UnitsOverview units={units} limits={limits} />
        </TabsContent>

        <TabsContent value="types">
          <UnitTypeTable limits={limits} />
        </TabsContent>

        <TabsContent value="settings">
          <ResidentSettingsForm 
            initialData={{
              maskResidentNameOnLandingPage: org.maskResidentNameOnLandingPage,
              showUnitOnLandingPage: org.showUnitOnLandingPage,
            }}
          />
        </TabsContent>
      </Tabs>
      
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary/80 text-xs">
        <p className="font-bold uppercase tracking-widest mb-1">Quota Logic</p>
        <p>Units default to their type&apos;s quota. Overriding at the unit level takes precedence. Active keys are counted against the monthly limit.</p>
      </div>
    </div>
  );
}
