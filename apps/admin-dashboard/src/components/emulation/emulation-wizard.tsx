'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Button,
  Input,
  Label,
  NativeSelect,
  Badge,
  cn,
} from '@gate-access/ui';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  History,
  Building2,
  Users,
  Box,
  Loader2,
  Zap,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import {
  RUSH_SCENARIOS,
  UNIT_ID_FORMATS,
  type RushScenarioClient,
  type UnitIdFormatKey,
  buildEmulateTrafficBody,
  validateStep0,
} from './emulation-schema';

const STEP_COUNT = 6;

interface EmulationResult {
  success: boolean;
  data?: any;
  error?: string;
  totalGenerated?: number;
  totalScans?: number;
}

export function EmulationWizard(props: { organizationId?: string } = {}) {
  const { t } = useTranslation('dashboard');
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<EmulationResult | null>(null);

  // Form State
  const [organizationId, setOrganizationId] = React.useState(
    props.organizationId ?? ''
  );

  React.useEffect(() => {
    if (typeof props.organizationId === 'string') {
      setOrganizationId(props.organizationId);
    }
  }, [props.organizationId]);
  const [pastDays, setPastDays] = React.useState(7);
  const [totalScans, setTotalScans] = React.useState(100);
  const [incidentRate, setIncidentRate] = React.useState(0.05);
  const [randomSeed, setRandomSeed] = React.useState(() =>
    Math.floor(Math.random() * 1000000)
  );

  const [unitIdFormat, setUnitIdFormat] =
    React.useState<UnitIdFormatKey>('COMPACT');
  const [projectId, setProjectId] = React.useState('');
  const [contactId, setContactId] = React.useState('');
  const [gateId, setGateId] = React.useState('');
  const [unitId, setUnitId] = React.useState('');
  const [createdByUserId, setCreatedByUserId] = React.useState('');

  const [minPhases, setMinPhases] = React.useState(1);
  const [maxPhases, setMaxPhases] = React.useState(4);
  const [minBuildings, setMinBuildings] = React.useState(1);
  const [maxBuildings, setMaxBuildings] = React.useState(8);
  const [minFloors, setMinFloors] = React.useState(1);
  const [maxFloors, setMaxFloors] = React.useState(12);

  const [scenario, setScenario] =
    React.useState<RushScenarioClient>('luxury-compound');
  const [dryRun, setDryRun] = React.useState(true);

  // Actions
  const next = () => {
    if (step === 0) {
      const err = validateStep0({
        organizationId,
        pastDays,
        totalScans,
        incidentRate,
        randomSeed,
      });
      if (err) return alert(err);
    }
    if (step === 4) {
      if (
        minPhases > maxPhases ||
        minBuildings > maxBuildings ||
        minFloors > maxFloors
      ) {
        return alert(t('emulation.step4.error.phases'));
      }
    }
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const run = async () => {
    setLoading(true);
    setResult(null);

    try {
      const body = buildEmulateTrafficBody({
        organizationId,
        scenario,
        pastDays,
        totalScans,
        incidentRate,
        randomSeed,
        dryRun,
        projectId,
        gateId,
        unitId,
        contactId,
        createdByUserId,
        unitIdFormat,
        ranges: {
          minPhases,
          maxPhases,
          minBuildingsPerPhase: minBuildings,
          maxBuildingsPerPhase: maxBuildings,
          minFloorsPerBuilding: minFloors,
          maxFloorsPerBuilding: maxFloors,
          minUnitsPerFloor: 2, // Hardcoded or default to keep form simple
          maxUnitsPerFloor: 6,
        },
      });

      const res = await fetch('/api/admin/emulate-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResult(data);
      if (data.success) {
        setStep(STEP_COUNT - 1);
      }
    } catch (err) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <Badge
            variant="primary"
            className="bg-ds-background-selected text-ds-text-selected border-ds-border-selected/30 px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider"
          >
            {t('emulation.step_progress', {
              current: step + 1,
              total: STEP_COUNT,
            })}
          </Badge>
          <div className="h-1 w-32 bg-ds-background-neutral-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-ds-background-selected transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
            />
          </div>
        </div>
        <h2 className="text-2xl font-black text-ds-text tracking-tight italic uppercase">
          {t(`emulation.steps.${step}`)}
        </h2>
        <p className="text-xs text-ds-text-subtle font-medium">
          {t('emulation.step_help')}
        </p>
      </div>

      <Card className="border-ds-border shadow-xl shadow-ds-background-neutral-subtle/50 overflow-hidden bg-ds-background-default">
        <CardContent className="p-8">
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-4 rounded-xl bg-ds-background-selected/5 border border-ds-border-selected/10 flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-ds-text-selected shrink-0 mt-0.5" />
                <p className="text-xs text-ds-text font-medium leading-relaxed">
                  {t('emulation.step0.intro')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.organization_id')}
                  </Label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      value={organizationId}
                      onChange={(e) => setOrganizationId(e.target.value)}
                      placeholder="e.g. org_123..."
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all shadow-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.past_days')}
                  </Label>
                  <div className="relative group">
                    <History className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      type="number"
                      value={pastDays}
                      onChange={(e) =>
                        setPastDays(parseInt(e.target.value) || 0)
                      }
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.total_scans')}
                  </Label>
                  <div className="relative group">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      type="number"
                      value={totalScans}
                      onChange={(e) =>
                        setTotalScans(parseInt(e.target.value) || 0)
                      }
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.incident_rate')}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={incidentRate}
                      onChange={(e) =>
                        setIncidentRate(parseFloat(e.target.value))
                      }
                      className="flex-1 accent-ds-background-selected"
                    />
                    <Badge
                      variant="subtle"
                      className="h-10 w-16 justify-center text-xs font-bold font-mono"
                    >
                      {Math.round(incidentRate * 100)}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.random_seed')}
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                      <Input
                        type="number"
                        value={randomSeed}
                        onChange={(e) =>
                          setRandomSeed(parseInt(e.target.value) || 0)
                        }
                        className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none font-mono"
                      />
                    </div>
                    <Button
                      variant="subtle"
                      onClick={() =>
                        setRandomSeed(Math.floor(Math.random() * 1000000))
                      }
                      className="h-12 w-12 p-0 rounded-xl"
                      title={t('emulation.fields.randomize')}
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <p className="text-xs text-ds-text-subtle leading-relaxed font-medium">
                {t('emulation.step1.body')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.reference_unit_format')}
                  </Label>
                  <NativeSelect
                    value={unitIdFormat}
                    onChange={(e) =>
                      setUnitIdFormat(e.target.value as UnitIdFormatKey)
                    }
                    className="h-12 bg-ds-background-neutral-subtle font-bold"
                  >
                    {UNIT_ID_FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.project_id_optional')}
                  </Label>
                  <div className="relative group">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder={t('emulation.placeholders.uuid')}
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.gate_id_optional')}
                  </Label>
                  <div className="relative group">
                    <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      value={gateId}
                      onChange={(e) => setGateId(e.target.value)}
                      placeholder={t('emulation.placeholders.uuid')}
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.unit_id_optional')}
                  </Label>
                  <div className="relative group">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      value={unitId}
                      onChange={(e) => setUnitId(e.target.value)}
                      placeholder={t('emulation.placeholders.uuid')}
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <p className="text-xs text-ds-text-subtle leading-relaxed font-medium">
                {t('emulation.step2.body')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.contact_id_optional')}
                  </Label>
                  <div className="relative group">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      value={contactId}
                      onChange={(e) => setContactId(e.target.value)}
                      placeholder={t('emulation.placeholders.uuid')}
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {t('emulation.fields.created_by_optional')}
                  </Label>
                  <div className="relative group">
                    <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-selected transition-colors" />
                    <Input
                      value={createdByUserId}
                      onChange={(e) => setCreatedByUserId(e.target.value)}
                      placeholder={t('emulation.placeholders.uuid')}
                      className="pl-10 h-12 bg-ds-background-neutral-subtle border-ds-border shadow-none font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <p className="text-xs text-ds-text-subtle leading-relaxed font-medium">
                {t('emulation.step3.body')}
              </p>

              <div className="grid grid-cols-1 gap-10">
                <div className="space-y-4 pt-4 border-t border-ds-border-subtle/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                      {t('emulation.fields.phases_range')}
                    </Label>
                    <Badge variant="subtle" className="font-mono text-[10px]">
                      {minPhases} — {maxPhases}
                    </Badge>
                  </div>
                  <div className="flex gap-8">
                    <div className="flex-1 space-y-2">
                      <span className="text-[9px] font-black text-ds-text-subtlest uppercase">
                        Min
                      </span>
                      <Input
                        type="range"
                        min="1"
                        max="32"
                        value={minPhases}
                        onChange={(e) => setMinPhases(parseInt(e.target.value))}
                        className="accent-ds-background-selected"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <span className="text-[9px] font-black text-ds-text-subtlest uppercase">
                        Max
                      </span>
                      <Input
                        type="range"
                        min="1"
                        max="32"
                        value={maxPhases}
                        onChange={(e) => setMaxPhases(parseInt(e.target.value))}
                        className="accent-ds-background-selected"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-ds-border-subtle/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                      {t('emulation.fields.buildings_range')}
                    </Label>
                    <Badge variant="subtle" className="font-mono text-[10px]">
                      {minBuildings} — {maxBuildings}
                    </Badge>
                  </div>
                  <div className="flex gap-8">
                    <div className="flex-1 space-y-2">
                      <span className="text-[9px] font-black text-ds-text-subtlest uppercase">
                        Min
                      </span>
                      <Input
                        type="range"
                        min="1"
                        max="32"
                        value={minBuildings}
                        onChange={(e) =>
                          setMinBuildings(parseInt(e.target.value))
                        }
                        className="accent-ds-background-selected"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <span className="text-[9px] font-black text-ds-text-subtlest uppercase">
                        Max
                      </span>
                      <Input
                        type="range"
                        min="1"
                        max="32"
                        value={maxBuildings}
                        onChange={(e) =>
                          setMaxBuildings(parseInt(e.target.value))
                        }
                        className="accent-ds-background-selected"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-ds-border-subtle/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
                      {t('emulation.fields.floors_range')}
                    </Label>
                    <Badge variant="subtle" className="font-mono text-[10px]">
                      {minFloors} — {maxFloors}
                    </Badge>
                  </div>
                  <div className="flex gap-8">
                    <div className="flex-1 space-y-2">
                      <span className="text-[9px] font-black text-ds-text-subtlest uppercase">
                        Min
                      </span>
                      <Input
                        type="range"
                        min="1"
                        max="32"
                        value={minFloors}
                        onChange={(e) => setMinFloors(parseInt(e.target.value))}
                        className="accent-ds-background-selected"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <span className="text-[9px] font-black text-ds-text-subtlest uppercase">
                        Max
                      </span>
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
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <p className="text-xs text-ds-text-subtle leading-relaxed font-medium">
                {t('emulation.step4.intro')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RUSH_SCENARIOS.map((id) => (
                  <button
                    key={id}
                    onClick={() => setScenario(id)}
                    className={cn(
                      'flex flex-col items-start p-6 rounded-2xl border text-left transition-all group',
                      scenario === id
                        ? 'bg-ds-background-selected/5 border-ds-background-selected ring-1 ring-ds-background-selected'
                        : 'bg-ds-background-neutral-subtle border-ds-border hover:border-ds-text-subtlest'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110 shadow-sm',
                        scenario === id
                          ? 'bg-ds-background-selected text-ds-text-inverse'
                          : 'bg-ds-background-default text-ds-text-subtle'
                      )}
                    >
                      <Zap className="h-5 w-5" />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-tight italic mb-1 transition-colors group-hover:text-ds-text-selected">
                      {t(`emulation.scenarios.${id}.title`)}
                    </h4>
                    <p className="text-[11px] text-ds-text-subtle font-medium leading-relaxed">
                      {t(`emulation.scenarios.${id}.desc`)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtlest">
                      {t('emulation.summary.context')}
                    </h3>
                    <div className="space-y-3 p-5 rounded-2xl bg-ds-background-neutral-subtle/50 font-mono text-[11px] border border-ds-border">
                      <div className="flex justify-between border-b border-ds-border-subtle py-1">
                        <span className="text-ds-text-subtle">
                          ORGANIZATION
                        </span>
                        <span className="font-bold text-ds-text">
                          {organizationId || '—'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-ds-border-subtle py-1">
                        <span className="text-ds-text-subtle">SCENARIO</span>
                        <span className="font-bold text-ds-text uppercase">
                          {scenario}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-ds-border-subtle py-1">
                        <span className="text-ds-text-subtle">TOTAL SCANS</span>
                        <span className="font-bold text-ds-text">
                          {totalScans}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-ds-border-subtle py-1">
                        <span className="text-ds-text-subtle">TIME WINDOW</span>
                        <span className="font-bold text-ds-text">
                          LAST {pastDays} DAYS
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtlest">
                      {t('emulation.fields.dry_run')}
                    </h3>
                    <div
                      onClick={() => setDryRun(!dryRun)}
                      className={cn(
                        'flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all group shadow-sm',
                        dryRun
                          ? 'bg-ds-background-success/5 border-ds-background-success'
                          : 'bg-ds-background-warning/5 border-ds-background-warning'
                      )}
                    >
                      <div className="space-y-0.5">
                        <p
                          className={cn(
                            'text-xs font-black uppercase tracking-wide',
                            dryRun
                              ? 'text-ds-text-success'
                              : 'text-ds-text-warning'
                          )}
                        >
                          {dryRun ? 'SAFE: DRY RUN' : 'LIVE: PERSIST TO DB'}
                        </p>
                        <p className="text-[10px] text-ds-text-subtle font-medium">
                          {t('emulation.fields.dry_run_hint')}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'h-6 w-10 rounded-full relative transition-colors p-1',
                          dryRun
                            ? 'bg-ds-background-success'
                            : 'bg-ds-background-warning'
                        )}
                      >
                        <div
                          className={cn(
                            'h-4 w-4 rounded-full bg-white transition-transform',
                            dryRun ? 'translate-x-4' : 'translate-x-0'
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtlest">
                      {t('emulation.summary.api')}
                    </h3>
                    <div className="p-5 rounded-2xl bg-ds-background-neutral-subtle font-mono text-[10px] overflow-auto max-h-[300px] border border-ds-border">
                      <pre className="text-ds-text whitespace-pre-wrap">
                        {JSON.stringify(
                          buildEmulateTrafficBody({
                            organizationId,
                            scenario,
                            pastDays,
                            totalScans,
                            incidentRate,
                            randomSeed,
                            dryRun,
                            projectId,
                            gateId,
                            unitId,
                            contactId,
                            createdByUserId,
                          }),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {result && (
                <div
                  className={cn(
                    'mt-8 p-6 rounded-2xl border animate-in slide-in-from-top-4 duration-500 shadow-lg',
                    result.success
                      ? 'bg-ds-background-success/5 border-ds-background-success-bold/20'
                      : 'bg-ds-background-warning/5 border-ds-background-warning-bold/20'
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center',
                        result.success
                          ? 'bg-ds-background-success-bold text-ds-text-inverse'
                          : 'bg-ds-background-warning-bold text-ds-text-inverse'
                      )}
                    >
                      {result.success ? (
                        <Zap className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <h4
                      className={cn(
                        'font-black text-sm uppercase italic tracking-tight',
                        result.success
                          ? 'text-ds-text-success'
                          : 'text-ds-text-warning'
                      )}
                    >
                      {result.success
                        ? t('emulation.success.title')
                        : t('emulation.result.title')}
                    </h4>
                  </div>
                  <pre className="font-mono text-[10px] overflow-auto max-h-[300px] bg-white/50 p-4 rounded-xl border border-current/10">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <div className="bg-ds-background-neutral-subtle/50 px-8 py-6 flex items-center justify-between border-t border-ds-border group/footer">
          <div className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-ds-text-selected rounded-full animate-pulse" />
            {t('emulation.summary.rate_note')}
          </div>
          <div className="flex items-center gap-3">
            {step > 0 && step < STEP_COUNT && (
              <Button
                variant="outline"
                className="h-10 px-6 rounded-full font-bold border-ds-border hover:bg-ds-background-neutral-subtle"
                onClick={back}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                {t('emulation.actions.back')}
              </Button>
            )}

            {step < STEP_COUNT - 1 ? (
              <Button
                variant="primary"
                className="h-10 px-8 rounded-full font-bold shadow-sm"
                onClick={next}
              >
                {t('emulation.actions.next')}
                <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                className={cn(
                  'h-12 px-10 rounded-full font-black italic uppercase tracking-tight shadow-lg shadow-ds-background-selected/20 transition-all hover:scale-105 active:scale-95',
                  !dryRun &&
                    'bg-ds-background-warning-bold hover:bg-ds-background-warning-bold shadow-ds-background-warning/20 border-ds-background-warning'
                )}
                onClick={run}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('emulation.actions.running')}
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {t('emulation.actions.run')}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <p className="mt-8 text-center text-[10px] font-bold text-ds-text-subtlest uppercase tracking-[0.2em] opacity-50">
        GateFlow advanced seeding subsystem — Operational Node v1.0.0
      </p>
    </div>
  );
}
