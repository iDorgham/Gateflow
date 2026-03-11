import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gate-access/ui';
import { GateTable } from '@/components/settings/gates/gate-table';
import { ScannerRulesForm } from '@/components/settings/gates/scanner-rules-form';
import { DoorOpen, Settings2 } from 'lucide-react';
import type { ScannerConfig } from '@/components/settings/gates/scanner-rules-form';

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

  const scannerConfig = (orgRow?.scannerConfig ?? null) as unknown as ScannerConfig | null;

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
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight">Gates & Scanners</h1>
        <p className="text-sm text-muted-foreground">
          Manage physical access points, GPS rules, and global scanner behavior.
        </p>
      </div>

      <Tabs defaultValue="gates" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-fit h-auto">
          <TabsTrigger
            value="gates"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <DoorOpen className="h-4 w-4" />
            Gates
            <span className="ml-1 text-[10px] font-black bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
              {gateRows.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="scanner-rules"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <Settings2 className="h-4 w-4" />
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
