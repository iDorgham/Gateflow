import { requireAuth } from '@/lib/dashboard-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gateflow/ui';
import { getUnitsWithStats, getResidentLimits } from './actions';
import { UnitsOverview } from '@/components/settings/residents/units-overview';
import { UnitTypeTable } from '@/components/settings/residents/unit-type-table';
import { ResidentSettingsForm } from '@/components/settings/residents/resident-settings-form';
import { LayoutGrid, ListTree, Cog } from 'lucide-react';
import { getTranslation, Locale } from '@/lib/i18n';
import {
  SETTINGS_TAB_TRIGGER,
  SETTINGS_TABS_LIST,
} from '@/components/settings/settings-section-header';

export default async function ResidentsSettings(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const { org } = await requireAuth();

  if (!org) return null;

  const { t } = await getTranslation(locale, 'dashboard');

  const [units, limits] = await Promise.all([
    getUnitsWithStats(),
    getResidentLimits(),
  ]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className={SETTINGS_TABS_LIST}>
          <TabsTrigger value="overview" className={SETTINGS_TAB_TRIGGER}>
            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
            {t('settings.residents.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="types" className={SETTINGS_TAB_TRIGGER}>
            <ListTree className="h-4 w-4" strokeWidth={1.5} />
            {t('settings.residents.tabs.types')}
          </TabsTrigger>
          <TabsTrigger value="settings" className={SETTINGS_TAB_TRIGGER}>
            <Cog className="h-4 w-4" strokeWidth={1.5} />
            {t('settings.residents.tabs.settings')}
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
        <p className="font-bold uppercase tracking-widest mb-1">
          {t('settings.residents.quotaLogic.title')}
        </p>
        <p>{t('settings.residents.quotaLogic.description')}</p>
      </div>
    </div>
  );
}
