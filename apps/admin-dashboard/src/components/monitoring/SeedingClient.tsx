'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Button,
  Input,
  Label,
  Badge,
  cn,
} from '@gateflow/ui';
import {
  Database,
  Building2,
  Box,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export function SeedingClient({ locale }: { locale: string }) {
  const { t } = useTranslation('admin');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [organizationId, setOrganizationId] = React.useState('');
  const [projectId, setProjectId] = React.useState('');

  const [minPhases, setMinPhases] = React.useState(1);
  const [maxPhases, setMaxPhases] = React.useState(4);
  const [minBuildings, setMinBuildings] = React.useState(1);
  const [maxBuildings, setMaxBuildings] = React.useState(8);
  const [minFloors, setMinFloors] = React.useState(1);
  const [maxFloors, setMaxFloors] = React.useState(12);

  const handleSeed = async () => {
    if (!organizationId) return alert('Organization ID is required');

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/seed-hierarchy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          projectId: projectId || undefined,
          ranges: {
            minPhases,
            maxPhases,
            minBuildingsPerPhase: minBuildings,
            maxBuildingsPerPhase: maxBuildings,
            minFloorsPerBuilding: minFloors,
            maxFloorsPerBuilding: maxFloors,
            minUnitsPerFloor: 2,
            maxUnitsPerFloor: 6,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Seeding failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-ds-border shadow-sm">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-ds-text flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-ds-text-brand" />
                  Target Allocation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Organization ID
                    </Label>
                    <Input
                      value={organizationId}
                      onChange={(e) => setOrganizationId(e.target.value)}
                      placeholder="org_..."
                      className="h-11 bg-ds-background-neutral-subtle border-ds-border font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Project ID (Optional)
                    </Label>
                    <Input
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="Leave empty for new project"
                      className="h-11 bg-ds-background-neutral-subtle border-ds-border font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-ds-border-subtle">
                <h3 className="text-sm font-black uppercase tracking-widest text-ds-text flex items-center gap-2">
                  <Box className="h-4 w-4 text-ds-text-brand" />
                  Hierarchy Density
                </h3>

                <div className="space-y-8">
                  {/* Phases */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                        Phases Range
                      </Label>
                      <Badge variant="subtle" className="font-mono text-[10px]">
                        {minPhases} — {maxPhases}
                      </Badge>
                    </div>
                    <div className="flex gap-6">
                      <Input
                        type="range"
                        min="1"
                        max="16"
                        value={minPhases}
                        onChange={(e) => setMinPhases(parseInt(e.target.value))}
                        className="accent-ds-background-selected"
                      />
                      <Input
                        type="range"
                        min="1"
                        max="16"
                        value={maxPhases}
                        onChange={(e) => setMaxPhases(parseInt(e.target.value))}
                        className="accent-ds-background-selected"
                      />
                    </div>
                  </div>

                  {/* Buildings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                        Buildings per Phase
                      </Label>
                      <Badge variant="subtle" className="font-mono text-[10px]">
                        {minBuildings} — {maxBuildings}
                      </Badge>
                    </div>
                    <div className="flex gap-6">
                      <Input
                        type="range"
                        min="1"
                        max="24"
                        value={minBuildings}
                        onChange={(e) =>
                          setMinBuildings(parseInt(e.target.value))
                        }
                        className="accent-ds-background-selected"
                      />
                      <Input
                        type="range"
                        min="1"
                        max="24"
                        value={maxBuildings}
                        onChange={(e) =>
                          setMaxBuildings(parseInt(e.target.value))
                        }
                        className="accent-ds-background-selected"
                      />
                    </div>
                  </div>

                  {/* Floors */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                        Floors per Building
                      </Label>
                      <Badge variant="subtle" className="font-mono text-[10px]">
                        {minFloors} — {maxFloors}
                      </Badge>
                    </div>
                    <div className="flex gap-6">
                      <Input
                        type="range"
                        min="1"
                        max="32"
                        value={minFloors}
                        onChange={(e) => setMinFloors(parseInt(e.target.value))}
                        className="accent-ds-background-selected"
                      />
                      <Input
                        type="range"
                        min="1"
                        max="32"
                        value={maxFloors}
                        onChange={(e) => setMaxFloors(parseInt(e.target.value))}
                        className="accent-ds-background-selected"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-ds-border-subtle flex items-center justify-end gap-4">
                {success && (
                  <p className="text-xs font-bold text-ds-text-success flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                    <CheckCircle2 className="h-4 w-4" />
                    Seeding initiated successfully
                  </p>
                )}
                {error && (
                  <p className="text-xs font-bold text-ds-text-danger flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                    <ShieldAlert className="h-4 w-4" />
                    {error}
                  </p>
                )}
                <Button
                  variant="primary"
                  className="h-12 px-10 rounded-full font-black italic uppercase tracking-tight shadow-lg shadow-ds-background-brand/20 transition-all hover:scale-105"
                  onClick={handleSeed}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-3" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      Seed Now
                      <ArrowRight className="h-4 w-4 ml-3" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="bg-ds-background-neutral-subtle border border-ds-border rounded-xl p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
              Seeding Protocol
            </h4>
            <p className="text-xs text-ds-text-subtle leading-relaxed font-medium">
              Advanced Seeding generates architectural hierarchies (Units) and
              associated synthetic residents (Contacts).
            </p>
            <div className="p-4 rounded-lg bg-ds-background-default border border-ds-border-subtle space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 bg-ds-text-brand rounded-full" />
                <span className="text-[10px] font-bold text-ds-text uppercase">
                  Deep Relational Chain
                </span>
              </div>
              <p className="text-[10px] text-ds-text-subtlest pl-4 leading-tight">
                Creates Projects, Phases, Buildings, Floors, and Units in a
                secure relational chain.
              </p>
            </div>
            <p className="text-[10px] text-ds-text-subtlest font-black uppercase italic">
              Platform Admin access required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
