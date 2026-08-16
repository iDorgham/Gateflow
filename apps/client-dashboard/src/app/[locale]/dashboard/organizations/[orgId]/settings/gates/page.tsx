import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gateflow/ui';
import { GateTable } from '@/components/settings/gates/gate-table';
import { ScannerRulesForm } from '@/components/settings/gates/scanner-rules-form';
import { DoorOpen, Settings2 } from 'lucide-react';
import type { ScannerConfig } from '@/components/settings/gates/scanner-rules-form';
import {
  SETTINGS_TAB_TRIGGER,
  SETTINGS_TABS_LIST,
} from '@/components/settings/settings-section-header';

export default async function GatesSettings() {
  const { org } = await requireAuth();
  if (!org) return null;

  const [gates, projects, orgRow] = await Promise.all([
    prisma.gate.findMany({
      where: { organizationId: org.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
        _count: { select: { qrCodes: true, scanLogs: true } },
      },
    }),
    prisma.project.findMany({
      where: { organizationId: org.id, deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.organization.findUnique({
      where: { id: org.id },
      select: { scannerConfig: true },
    }),
  ]);

  const scannerConfig = (orgRow?.scannerConfig ??
    null) as unknown as ScannerConfig | null;

  const gateRows = gates.map((g) => ({
    id: g.id,
    name: g.name,
    location: g.location,
    isActive: g.isActive,
    projectId: g.projectId,
    projectName: g.project?.name ?? null,
    latitude: g.latitude,
    longitude: g.longitude,
    locationRadiusMeters: g.locationRadiusMeters,
    locationEnforced: g.locationEnforced,
    requiredIdentityLevel: g.requiredIdentityLevel,
    _count: g._count,
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="gates" className="space-y-6">
        <TabsList className={SETTINGS_TABS_LIST}>
          <TabsTrigger value="gates" className={SETTINGS_TAB_TRIGGER}>
            <DoorOpen className="h-4 w-4" strokeWidth={1.5} />
            Gates
            <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {gateRows.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="scanner-rules" className={SETTINGS_TAB_TRIGGER}>
            <Settings2 className="h-4 w-4" strokeWidth={1.5} />
            Scanner Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gates">
          <GateTable gates={gateRows} projects={projects} />
        </TabsContent>

        <TabsContent value="scanner-rules">
          <ScannerRulesForm initialConfig={scannerConfig} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
