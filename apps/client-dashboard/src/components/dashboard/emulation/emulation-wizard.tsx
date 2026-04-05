'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Label,
  cn,
  LoadingSpinner,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gateflow/ui';
import { ChevronDown } from 'lucide-react';
import { csrfFetch } from '@/lib/csrf';
import type { Locale } from '@/lib/i18n-config';
import {
  RUSH_SCENARIOS,
  UNIT_ID_FORMATS,
  buildEmulateTrafficBody,
  EmulateTrafficBodySchema,
  type RushScenarioClient,
  type UnitIdFormatKey,
  validateStep0,
} from './emulation-schema';

const STEP_COUNT = 6;

type FormState = {
  organizationId: string;
  pastDays: number;
  totalScans: number;
  incidentRate: number;
  randomSeed: number;
  referenceUnitIdFormat: UnitIdFormatKey;
  projectId: string;
  contactId: string;
  hierarchyPhasesMin: number;
  hierarchyPhasesMax: number;
  hierarchyBuildingsMin: number;
  hierarchyBuildingsMax: number;
  hierarchyFloorsMin: number;
  hierarchyFloorsMax: number;
  gateId: string;
  unitId: string;
  createdByUserId: string;
  scenario: RushScenarioClient;
  dryRun: boolean;
};

const initialForm: FormState = {
  organizationId: '',
  pastDays: 7,
  totalScans: 50,
  incidentRate: 0.05,
  randomSeed: 42,
  referenceUnitIdFormat: 'COMPACT',
  projectId: '',
  contactId: '',
  hierarchyPhasesMin: 1,
  hierarchyPhasesMax: 2,
  hierarchyBuildingsMin: 1,
  hierarchyBuildingsMax: 3,
  hierarchyFloorsMin: 1,
  hierarchyFloorsMax: 8,
  gateId: '',
  unitId: '',
  createdByUserId: '',
  scenario: 'luxury-compound',
  dryRun: true,
};

type WizardState = {
  step: number;
  form: FormState;
  stepError: string | null;
};

type WizardAction =
  | { type: 'PATCH_FORM'; patch: Partial<FormState> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SET_STEP_ERROR'; message: string | null };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'PATCH_FORM':
      return {
        ...state,
        form: { ...state.form, ...action.patch },
        stepError: null,
      };
    case 'SET_STEP':
      return { ...state, step: action.step, stepError: null };
    case 'SET_STEP_ERROR':
      return { ...state, stepError: action.message };
    case 'BACK':
      return {
        ...state,
        step: Math.max(0, state.step - 1),
        stepError: null,
      };
    case 'NEXT':
      return {
        ...state,
        step: Math.min(STEP_COUNT - 1, state.step + 1),
        stepError: null,
      };
    default:
      return state;
  }
}

function validateHierarchyStep(form: FormState): string | null {
  const checks: [string, number, number][] = [
    [
      'emulation.step4.error.phases',
      form.hierarchyPhasesMin,
      form.hierarchyPhasesMax,
    ],
    [
      'emulation.step4.error.buildings',
      form.hierarchyBuildingsMin,
      form.hierarchyBuildingsMax,
    ],
    [
      'emulation.step4.error.floors',
      form.hierarchyFloorsMin,
      form.hierarchyFloorsMax,
    ],
  ];
  for (const [key, a, b] of checks) {
    if (a < 1 || b < 1 || a > 32 || b > 32) {
      return key;
    }
    if (a > b) {
      return key;
    }
  }
  return null;
}

export function EmulationWizard({ locale }: { locale: Locale }) {
  const { t } = useTranslation('dashboard');
  const [state, dispatch] = useReducer(wizardReducer, {
    step: 0,
    form: initialForm,
    stepError: null,
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [lastSuccess, setLastSuccess] = React.useState<unknown>(null);

  const stepLabel = useMemo(
    () =>
      t('emulation.step_progress', {
        current: state.step + 1,
        total: STEP_COUNT,
      }),
    [state.step, t]
  );

  useEffect(() => {
    headingRef.current?.focus();
  }, [state.step]);

  const tryAdvance = useCallback(() => {
    const { form, step } = state;
    if (step === 0) {
      const err = validateStep0({
        organizationId: form.organizationId,
        pastDays: form.pastDays,
        totalScans: form.totalScans,
        incidentRate: form.incidentRate,
        randomSeed: form.randomSeed,
      });
      if (err) {
        dispatch({ type: 'SET_STEP_ERROR', message: err });
        return;
      }
    }
    if (step === 3) {
      const key = validateHierarchyStep(form);
      if (key) {
        dispatch({
          type: 'SET_STEP_ERROR',
          message: t(key, { defaultValue: 'Check min/max ranges.' }),
        });
        return;
      }
    }
    dispatch({ type: 'NEXT' });
  }, [state, t]);

  const tryBack = useCallback(() => {
    dispatch({ type: 'BACK' });
  }, []);

  const patchForm = useCallback((patch: Partial<FormState>) => {
    dispatch({ type: 'PATCH_FORM', patch });
  }, []);

  const onSubmit = async () => {
    const { form } = state;
    let body: ReturnType<typeof buildEmulateTrafficBody>;
    try {
      body = buildEmulateTrafficBody({
        organizationId: form.organizationId,
        scenario: form.scenario,
        pastDays: form.pastDays,
        totalScans: form.totalScans,
        incidentRate: form.incidentRate,
        randomSeed: form.randomSeed,
        dryRun: form.dryRun,
        projectId: form.projectId,
        gateId: form.gateId,
        unitId: form.unitId,
        contactId: form.contactId,
        createdByUserId: form.createdByUserId,
      });
    } catch {
      toast.error(
        t('emulation.error.invalid_payload', {
          defaultValue: 'Invalid inputs.',
        })
      );
      return;
    }

    const safe = EmulateTrafficBodySchema.safeParse(body);
    if (!safe.success) {
      toast.error(
        safe.error.errors[0]?.message ??
          t('emulation.error.invalid_payload', {
            defaultValue: 'Invalid inputs.',
          })
      );
      return;
    }

    setSubmitting(true);
    setLastSuccess(null);
    try {
      const res = await csrfFetch('/api/admin/emulate-traffic', {
        method: 'POST',
        body: JSON.stringify(safe.data),
      });
      const json: unknown = await res.json().catch(() => null);

      if (res.status === 429) {
        const retry = res.headers.get('Retry-After');
        toast.error(
          t('emulation.error.rate_limit', {
            defaultValue: 'Too many requests. Retry after {{seconds}}s.',
            seconds: retry ?? '?',
          })
        );
        return;
      }

      if (!res.ok) {
        const errObj = json as { error?: string; code?: string } | null;
        const msg =
          errObj?.error ??
          t('emulation.error.request_failed', {
            defaultValue: 'Request failed.',
          });
        toast.error(errObj?.code ? `${msg} (${errObj.code})` : msg);
        return;
      }

      setLastSuccess(json);
      toast.success(
        t('emulation.success.title', {
          defaultValue: 'Emulation run completed.',
        })
      );
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : t('emulation.error.network', { defaultValue: 'Network error.' })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const f = state.form;
  const incidentPercent = Math.round(f.incidentRate * 1000) / 10;

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return (
          <div
            className="space-y-6"
            role="group"
            aria-labelledby="emulation-step-title"
          >
            <p className="text-sm text-[var(--ds-text-subtle,#626F86)]">
              {t('emulation.step0.intro', {
                defaultValue:
                  'Target a tenant organization and define how many synthetic scans to place in the time window. The live run uses Phase 7 resolution rules (project, gate, unit, contact, staff user).',
              })}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="org-id">
                  {t('emulation.fields.organization_id', {
                    defaultValue: 'Target organization ID',
                  })}
                </Label>
                <Input
                  id="org-id"
                  name="organizationId"
                  autoComplete="off"
                  value={f.organizationId}
                  onChange={(e) =>
                    patchForm({ organizationId: e.target.value })
                  }
                  className="min-h-11"
                  aria-required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="past-days">
                  {t('emulation.fields.past_days', {
                    defaultValue: 'Past days (1–365)',
                  })}
                </Label>
                <Input
                  id="past-days"
                  type="number"
                  min={1}
                  max={365}
                  value={f.pastDays}
                  onChange={(e) =>
                    patchForm({ pastDays: Number(e.target.value) || 1 })
                  }
                  className="min-h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-scans">
                  {t('emulation.fields.total_scans', {
                    defaultValue: 'Total scans (1–10,000)',
                  })}
                </Label>
                <Input
                  id="total-scans"
                  type="number"
                  min={1}
                  max={10_000}
                  value={f.totalScans}
                  onChange={(e) =>
                    patchForm({ totalScans: Number(e.target.value) || 1 })
                  }
                  className="min-h-11"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="incident-rate">
                  {t('emulation.fields.incident_rate', {
                    defaultValue: 'Failed scan rate',
                  })}{' '}
                  ({incidentPercent}%)
                </Label>
                <input
                  id="incident-rate"
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={incidentPercent}
                  onChange={(e) =>
                    patchForm({ incidentRate: Number(e.target.value) / 100 })
                  }
                  className="w-full h-11 accent-[var(--ds-icon-accent,#0C66E4)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="random-seed">
                  {t('emulation.fields.random_seed', {
                    defaultValue: 'Random seed (integer)',
                  })}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="random-seed"
                    type="number"
                    value={f.randomSeed}
                    onChange={(e) =>
                      patchForm({
                        randomSeed: Math.trunc(Number(e.target.value)) || 0,
                      })
                    }
                    className="min-h-11 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11 shrink-0"
                    onClick={() =>
                      patchForm({
                        randomSeed: Math.floor(Math.random() * 1_000_000_000),
                      })
                    }
                  >
                    {t('emulation.fields.randomize', {
                      defaultValue: 'Randomize',
                    })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div
            className="space-y-6"
            role="group"
            aria-labelledby="emulation-step-title"
          >
            <p className="text-sm text-[var(--ds-text-subtle,#626F86)]">
              {t('emulation.step1.body', {
                defaultValue:
                  'Unit naming during advanced seeding follows the project’s Unit ID format (CRM / Phase 4). Choose a reference format for this run’s documentation; optional project ID narrows resolution when multiple projects exist.',
              })}
            </p>
            <div className="space-y-2">
              <Label htmlFor="unit-format">
                {t('emulation.fields.reference_unit_format', {
                  defaultValue: 'Reference unit ID format',
                })}
              </Label>
              <Select
                value={f.referenceUnitIdFormat}
                onValueChange={(v) =>
                  patchForm({ referenceUnitIdFormat: v as UnitIdFormatKey })
                }
              >
                <SelectTrigger
                  id="unit-format"
                  className="min-h-11 w-full max-w-md"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_ID_FORMATS.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>
                      {fmt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-override">
                {t('emulation.fields.project_id_optional', {
                  defaultValue: 'Project ID (optional override)',
                })}
              </Label>
              <Input
                id="project-override"
                autoComplete="off"
                value={f.projectId}
                onChange={(e) => patchForm({ projectId: e.target.value })}
                placeholder={t('emulation.placeholders.uuid', {
                  defaultValue: 'Leave empty to auto-resolve',
                })}
                className="min-h-11 max-w-md"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div
            className="space-y-6"
            role="group"
            aria-labelledby="emulation-step-title"
          >
            <p className="text-sm text-[var(--ds-text-subtle,#626F86)]">
              {t('emulation.step2.body', {
                defaultValue:
                  'Rich contacts (Phase 3) use weighted nationalities and duplicate-safe email/phone. The emulation API resolves a default contact when omitted; set an override to tie the visitor QR to a specific Contact row.',
              })}
            </p>
            <div className="space-y-2">
              <Label htmlFor="contact-override">
                {t('emulation.fields.contact_id_optional', {
                  defaultValue: 'Contact ID (optional override)',
                })}
              </Label>
              <Input
                id="contact-override"
                autoComplete="off"
                value={f.contactId}
                onChange={(e) => patchForm({ contactId: e.target.value })}
                className="min-h-11 max-w-md"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div
            className="space-y-6"
            role="group"
            aria-labelledby="emulation-step-title"
          >
            <p className="text-sm text-[var(--ds-text-subtle,#626F86)]">
              {t('emulation.step3.body', {
                defaultValue:
                  'Phase 4 seeds phases, buildings, and floors into Units. Ranges below document the intended hierarchy density for operators; the live API still resolves gate, unit, and staff IDs unless you override them.',
              })}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  [
                    'hierarchyPhasesMin',
                    'hierarchyPhasesMax',
                    'emulation.fields.phases_range',
                    'Phases min / max',
                  ],
                  [
                    'hierarchyBuildingsMin',
                    'hierarchyBuildingsMax',
                    'emulation.fields.buildings_range',
                    'Buildings min / max',
                  ],
                  [
                    'hierarchyFloorsMin',
                    'hierarchyFloorsMax',
                    'emulation.fields.floors_range',
                    'Floors min / max',
                  ],
                ] as const
              ).map(([minK, maxK, i18nKey, fallback]) => (
                <div
                  key={minK}
                  className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end"
                >
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`${minK}-min`}>
                      {t(`${i18nKey}_min`, {
                        defaultValue: `${fallback} (min)`,
                      })}
                    </Label>
                    <Input
                      id={`${minK}-min`}
                      type="number"
                      min={1}
                      max={32}
                      value={f[minK]}
                      onChange={(e) =>
                        patchForm({
                          [minK]: Number(e.target.value) || 1,
                        } as Partial<FormState>)
                      }
                      className="min-h-11"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`${maxK}-max`}>
                      {t(`${i18nKey}_max`, {
                        defaultValue: `${fallback} (max)`,
                      })}
                    </Label>
                    <Input
                      id={`${maxK}-max`}
                      type="number"
                      min={1}
                      max={32}
                      value={f[maxK]}
                      onChange={(e) =>
                        patchForm({
                          [maxK]: Number(e.target.value) || 1,
                        } as Partial<FormState>)
                      }
                      className="min-h-11"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Collapsible className="rounded-lg border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-neutral-subtle,#F4F5F7)] px-4 py-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 text-sm font-medium text-[var(--ds-text,#172B4D)] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md py-1">
                {t('emulation.advanced.entity_ids', {
                  defaultValue: 'Entity ID overrides',
                })}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label htmlFor="gate-id">
                    {t('emulation.fields.gate_id_optional', {
                      defaultValue: 'Gate ID',
                    })}
                  </Label>
                  <Input
                    id="gate-id"
                    value={f.gateId}
                    onChange={(e) => patchForm({ gateId: e.target.value })}
                    className="min-h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-id">
                    {t('emulation.fields.unit_id_optional', {
                      defaultValue: 'Unit ID',
                    })}
                  </Label>
                  <Input
                    id="unit-id"
                    value={f.unitId}
                    onChange={(e) => patchForm({ unitId: e.target.value })}
                    className="min-h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-id">
                    {t('emulation.fields.created_by_optional', {
                      defaultValue: 'Created-by user ID (staff)',
                    })}
                  </Label>
                  <Input
                    id="staff-id"
                    value={f.createdByUserId}
                    onChange={(e) =>
                      patchForm({ createdByUserId: e.target.value })
                    }
                    className="min-h-11"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      case 4:
        return (
          <div
            className="space-y-4"
            role="radiogroup"
            aria-labelledby="emulation-step-title"
          >
            <p className="text-sm text-[var(--ds-text-subtle,#626F86)]">
              {t('emulation.step4.intro', {
                defaultValue:
                  'Rush-hour shaping (Phase 5) clusters scans around scenario-specific peaks.',
              })}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {RUSH_SCENARIOS.map((sc) => (
                <button
                  key={sc}
                  type="button"
                  role="radio"
                  aria-checked={f.scenario === sc}
                  onClick={() => patchForm({ scenario: sc })}
                  className={cn(
                    'rounded-lg border p-4 text-left text-sm transition-colors min-h-[72px] outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    f.scenario === sc
                      ? 'border-[var(--ds-border-accent,#0C66E4)] bg-[var(--ds-background-accent-subtle,#E9F2FF)]'
                      : 'border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-surface-raised,#FFFFFF)] hover:bg-[var(--ds-background-neutral-subtle,#F4F5F7)]'
                  )}
                >
                  <span className="font-semibold text-[var(--ds-text,#172B4D)] block">
                    {t(`emulation.scenarios.${sc}.title`, {
                      defaultValue: sc.replace(/-/g, ' '),
                    })}
                  </span>
                  <span className="text-[var(--ds-text-subtle,#626F86)] mt-1 block">
                    {t(`emulation.scenarios.${sc}.desc`, { defaultValue: '' })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <p className="text-sm text-[var(--ds-text-subtle,#626F86)]">
              {t('emulation.step5.intro', {
                defaultValue:
                  'Confirm payload. Dry run validates resolution and timestamps only (no QR or ScanLog writes). Turn off dry run only when QR_SIGNING_SECRET is configured on the server.',
              })}
            </p>
            <Card variant="sunken">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {t('emulation.summary.api', { defaultValue: 'API payload' })}
                </CardTitle>
                <CardDescription>
                  {t('emulation.summary.rate_note', {
                    defaultValue:
                      'Super Admin only. Rate limit: 5 requests per hour per operator.',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2 font-mono text-[var(--ds-text,#172B4D)]">
                <p>
                  <span className="text-[var(--ds-text-subtle,#626F86)]">
                    organizationId
                  </span>{' '}
                  {f.organizationId.trim() || '—'}
                </p>
                <p>
                  <span className="text-[var(--ds-text-subtle,#626F86)]">
                    scenario
                  </span>{' '}
                  {f.scenario}
                </p>
                <p>
                  <span className="text-[var(--ds-text-subtle,#626F86)]">
                    window
                  </span>{' '}
                  {f.pastDays}d · {f.totalScans} scans · incident{' '}
                  {incidentPercent}%
                </p>
                <p>
                  <span className="text-[var(--ds-text-subtle,#626F86)]">
                    randomSeed
                  </span>{' '}
                  {f.randomSeed} ·{' '}
                  <span className="text-[var(--ds-text-subtle,#626F86)]">
                    dryRun
                  </span>{' '}
                  {f.dryRun ? 'true' : 'false'}
                </p>
              </CardContent>
            </Card>
            <Card variant="outline">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {t('emulation.summary.context', {
                    defaultValue: 'Seeding context (reference)',
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-[var(--ds-text,#172B4D)]">
                <p>
                  {t('emulation.summary.unit_format', {
                    defaultValue: 'Unit ID format',
                  })}
                  : {f.referenceUnitIdFormat}
                </p>
                <p>
                  {t('emulation.summary.hierarchy', {
                    defaultValue: 'Hierarchy ranges',
                  })}
                  : phases {f.hierarchyPhasesMin}–{f.hierarchyPhasesMax},
                  buildings {f.hierarchyBuildingsMin}–{f.hierarchyBuildingsMax},
                  floors {f.hierarchyFloorsMin}–{f.hierarchyFloorsMax}
                </p>
              </CardContent>
            </Card>
            <label className="flex items-start gap-3 cursor-pointer min-h-11">
              <Checkbox
                checked={f.dryRun}
                onChange={(e) => patchForm({ dryRun: e.target.checked })}
                className="mt-1"
                aria-describedby="dry-run-hint"
              />
              <span>
                <span className="font-medium text-[var(--ds-text,#172B4D)]">
                  {t('emulation.fields.dry_run', {
                    defaultValue: 'Dry run (no database writes for QR / scans)',
                  })}
                </span>
                <span
                  id="dry-run-hint"
                  className="block text-sm text-[var(--ds-text-subtle,#626F86)] mt-1"
                >
                  {t('emulation.fields.dry_run_hint', {
                    defaultValue:
                      'Recommended for first-time validation on production-shaped data.',
                  })}
                </span>
              </span>
            </label>
            {lastSuccess ? (
              <Card
                variant="default"
                className="border-[var(--ds-border-success,#22A06B)]"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-[var(--ds-text-success,#1F845A)]">
                    {t('emulation.result.title', {
                      defaultValue: 'Last response',
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs overflow-x-auto p-3 rounded-md bg-[var(--ds-surface-sunken,#F4F5F7)] max-h-64 overflow-y-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(lastSuccess, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ) : null}
          </div>
        );
      default:
        return null;
    }
  };

  const stepTitle = [
    t('emulation.steps.0', { defaultValue: 'Organization & scan window' }),
    t('emulation.steps.1', { defaultValue: 'Unit ID format & project' }),
    t('emulation.steps.2', { defaultValue: 'Contacts & visitor mix' }),
    t('emulation.steps.3', { defaultValue: 'Unit hierarchy parameters' }),
    t('emulation.steps.4', { defaultValue: 'Rush scenario' }),
    t('emulation.steps.5', { defaultValue: 'Review & run' }),
  ][state.step];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('emulation.title', { defaultValue: 'Traffic emulation' })}
        subtitle={t('emulation.subtitle', {
          defaultValue:
            'Super Admin wizard for advanced seeding & rush-hour traffic (Phase 8).',
        })}
        homeHref={`/${locale}`}
      />

      <div className="mb-2" aria-hidden>
        <div className="h-2 rounded-full bg-[var(--ds-background-neutral,#091E4224)] overflow-hidden">
          <div
            className="h-full bg-[var(--ds-icon-accent,#0C66E4)] transition-all duration-300"
            style={{ width: `${((state.step + 1) / STEP_COUNT) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[var(--ds-text-subtle,#626F86)] mt-2">
          {stepLabel}
        </p>
      </div>

      <Card variant="default">
        <CardHeader>
          <h2
            ref={headingRef}
            id="emulation-step-title"
            tabIndex={-1}
            className="text-lg font-semibold text-[var(--ds-text,#172B4D)] outline-none"
          >
            {stepTitle}
          </h2>
          <CardDescription className="text-[var(--ds-text-subtle,#626F86)]">
            {t('emulation.step_help', {
              defaultValue:
                'Use Next and Back. Fields are validated before leaving each step.',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.stepError ? (
            <div
              role="alert"
              className="rounded-md border border-[var(--ds-border-danger,#DE350B)] bg-[var(--ds-background-danger,#FFEBE6)] px-3 py-2 text-sm text-[var(--ds-text-danger,#DE350B)]"
            >
              {state.stepError}
            </div>
          ) : null}
          {renderStep()}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between pt-4 border-t border-[var(--ds-border,#DFE1E6)]">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={tryBack}
              disabled={state.step === 0 || submitting}
            >
              {t('emulation.actions.back', { defaultValue: 'Back' })}
            </Button>
            {state.step < STEP_COUNT - 1 ? (
              <Button
                type="button"
                className="min-h-11"
                onClick={tryAdvance}
                disabled={submitting}
              >
                {t('emulation.actions.next', { defaultValue: 'Next' })}
              </Button>
            ) : (
              <Button
                type="button"
                className="min-h-11 min-w-[140px]"
                onClick={onSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size={18} />
                    {t('emulation.actions.running', {
                      defaultValue: 'Running…',
                    })}
                  </span>
                ) : (
                  t('emulation.actions.run', { defaultValue: 'Run emulation' })
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
