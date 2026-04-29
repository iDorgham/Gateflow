'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  // ADS-compliant components from the monorepo...
} from '@gate-access/ui';
import { Loader2, Plus, Users, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * ## SeedingWizard (v4)
 * High-fidelity structural seeding wizard for the Admin Dashboard.
 * Focused on Project Units/Contacts hierarchy generation (Phases 3/4 of v3).
 */
export function SeedingWizard({ organizationId }: { organizationId: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [unitIdFormat, setUnitIdFormat] = useState('COMPACT');

  // Multi-layer hierarchy config (v3 parity)
  const [minPhases, setMinPhases] = useState(2);
  const [maxPhases, setMaxPhases] = useState(4);
  const [minBuildings, setMinBuildings] = useState(3);
  const [maxBuildings, setMaxBuildings] = useState(6);
  const [minFloors, setMinFloors] = useState(2);
  const [maxFloors, setMaxFloors] = useState(5);
  const [minUnits, setMinUnits] = useState(4);
  const [maxUnits, setMaxUnits] = useState(10);

  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [result, setResult] = useState<any>(null);

  const runSeeding = async () => {
    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed-hierarchy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          projectId,
          seed,
          unitIdFormatOverride: unitIdFormat,
          ranges: {
            minPhases,
            maxPhases,
            minBuildingsPerPhase: minBuildings,
            maxBuildingsPerPhase: maxBuildings,
            minFloorsPerBuilding: minFloors,
            maxFloorsPerBuilding: maxFloors,
            minUnitsPerFloor: minUnits,
            maxUnitsPerFloor: maxUnits,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Seeding failed');

      setResult(data.data);
      setStep(4); // Success step
      toast.success(`Successfully seeded ${data.data.planned.length} units!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Target Project ID</Label>
              <Input
                id="projectId"
                placeholder="e.g. clk123abc"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground italic">
                Hierarchy will be build within this project.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Unit ID Format</Label>
              <Select value={unitIdFormat} onValueChange={setUnitIdFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPACT">Compact (A-101)</SelectItem>
                  <SelectItem value="BUILDING_FIRST">
                    Building First (Bldg 1-A-101)
                  </SelectItem>
                  <SelectItem value="SIMPLE">Simple (U-001)</SelectItem>
                  <SelectItem value="GLOBAL">Global (G-A-001)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Phases (Range: {minPhases} - {maxPhases})
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={minPhases}
                    onChange={(e) => setMinPhases(Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={maxPhases}
                    onChange={(e) => setMaxPhases(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  Buildings per Phase (Range: {minBuildings} - {maxBuildings})
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={minBuildings}
                    onChange={(e) => setMinBuildings(Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={maxBuildings}
                    onChange={(e) => setMaxBuildings(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Floors per Building (Range: {minFloors} - {maxFloors})
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={minFloors}
                    onChange={(e) => setMinFloors(Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={maxFloors}
                    onChange={(e) => setMaxFloors(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  Units per Floor (Range: {minUnits} - {maxUnits})
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={40}
                    value={minUnits}
                    onChange={(e) => setMinUnits(Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={40}
                    value={maxUnits}
                    onChange={(e) => setMaxUnits(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-accent/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-ds-text-information" />
                  <span className="font-semibold text-lg">
                    Configuration Summary
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                    Estimated Scale
                  </p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    ~
                    {(
                      (((((((minPhases + maxPhases) / 2) *
                        (minBuildings + maxBuildings)) /
                        2) *
                        (minFloors + maxFloors)) /
                        2) *
                        (minUnits + maxUnits)) /
                      2
                    ).toFixed(0)}{' '}
                    Units
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Hierarchy Pattern
                  </p>
                  <p className="text-sm font-medium">
                    {minPhases}-{maxPhases} Ph | {minBuildings}-{maxBuildings}{' '}
                    Bldg
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Density
                  </p>
                  <p className="text-sm font-medium">
                    {minFloors}-{maxFloors} Flr | {minUnits}-{maxUnits} Unt
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Deterministic Seed
                  </p>
                  <Input
                    className="h-7 text-xs"
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-ds-text-brand" />
                Rich Personas Integration
              </Label>
              <p className="text-xs text-muted-foreground p-3 border rounded bg-muted/30">
                Each unit will be linked to a round-robin contact selected from
                the Organization&apos;s pool to satisfy full relational
                integrity constraints (v3 mandate).
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 rounded-full bg-ds-background-success-subtle flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-ds-text-success" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Seeding Successful</h3>
              <p className="text-muted-foreground">
                Hierarchical structural data has been injected into{' '}
                <b>{projectId}</b>.
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  New Run
                </Button>
                <Button
                  size="sm"
                  onClick={() => (window.location.href = `/monitoring/hub`)}
                >
                  View AuditorLogs
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-xl bg-card border-2 overflow-hidden">
      {/* High-fidelity procedural dots background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--ds-background-inverse) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-3">
              Structural Seeding Wizard
              <span className="text-[10px] bg-ds-background-information-subtle text-ds-text-information px-2 py-0.5 rounded-full border border-ds-border-information font-mono uppercase tracking-tighter shadow-sm">
                Advanced Engine v4
              </span>
            </CardTitle>
            <CardDescription>
              Step {step} of 3:{' '}
              {
                ['Project Context', 'Hierarchy Scale', 'Verification', 'Done'][
                  step - 1
                ]
              }
            </CardDescription>
          </div>
          <div className="flex gap-1 h-2 w-32 items-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-ds-background-information-bold shadow-md' : 'bg-ds-background-neutral-subtle'}`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[320px] relative">
        {renderStep()}
      </CardContent>
      {step < 4 && (
        <CardFooter className="flex justify-between border-t p-6 bg-accent/30 relative">
          <Button
            variant="ghost"
            disabled={step === 1 || loading}
            onClick={() => setStep(step - 1)}
          >
            Previous Stage
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-muted-foreground border-dashed"
              onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
            >
              Re-Roll Seed
            </Button>
            {step < 3 ? (
              <Button
                className="min-w-[120px] bg-ds-background-information-bold hover:bg-ds-background-information-bold/90 shadow-lg shadow-ds-background-information-bold/20"
                onClick={() => setStep(step + 1)}
              >
                Advance Configuration
              </Button>
            ) : (
              <Button
                className="min-w-[120px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20"
                disabled={loading}
                onClick={runSeeding}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Execute Seeding Run
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
