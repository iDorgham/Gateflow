/**
 * Logical phase → building → floor → unit tree for advanced seeding.
 *
 * Prisma has a single {@link Unit} model (no Building/Floor tables). We map:
 * - **Phase** → `generateUnitId` `phase` slug (LOCATION / GLOBAL) + human `building` label prefix
 * - **Building** → short code passed to `generateUnitId` + `Unit.building` (CRM column)
 * - **Floor / slot** → `generateUnitId` indices (1-based)
 *
 * `areaSqm`, `balconyArea`, and `terraceArea` are generated for realism; the dashboard stores
 * a single {@link Unit.sizeSqm} — we persist **total** rounded living + outdoor (sqm).
 *
 * **Owners:** `ContactUnit` links each unit to one round-robin contact from the Phase 3 pool.
 */

import type { Prisma, UnitIdFormat, UnitType } from '@prisma/client';
import {
  mulberry32,
  pickRandom,
  pickWeighted,
  RED_SEA_COMPOUND_NAMES,
} from './red-sea-data';
import type { UniquenessBucket } from './seed-integrity';
import { validateUniqueness } from './seed-integrity';
import { generateUnitId, normalizeBuildingCode } from './unit-id-formats';

/** Range config shared with future CLI / emulation UI (all bounds inclusive). */
export type UnitHierarchyRangeConfig = {
  minPhases: number;
  maxPhases: number;
  minBuildingsPerPhase: number;
  maxBuildingsPerPhase: number;
  minFloorsPerBuilding: number;
  maxFloorsPerBuilding: number;
  minUnitsPerFloor: number;
  maxUnitsPerFloor: number;
};

export const DEFAULT_UNIT_HIERARCHY_RANGES: UnitHierarchyRangeConfig = {
  minPhases: 1,
  maxPhases: 2,
  minBuildingsPerPhase: 2,
  maxBuildingsPerPhase: 4,
  minFloorsPerBuilding: 3,
  maxFloorsPerBuilding: 10,
  minUnitsPerFloor: 2,
  maxUnitsPerFloor: 6,
};

export type PlannedUnitMeta = {
  areaSqm: number;
  balconyArea: number;
  terraceArea: number;
  phaseLabel: string;
  buildingCode: string;
  floor: number;
  unitIndex: number;
};

export type PlannedUnitSeed = {
  name: string;
  building: string;
  organizationId: string;
  projectId: string;
  type: UnitType;
  sizeSqm: number;
  ownerContactId: string;
  meta: PlannedUnitMeta;
};

function intInRange(rng: () => number, min: number, max: number): number {
  if (min > max) {
    throw new Error(`unit-hierarchy-seed: invalid range min=${min} max=${max}`);
  }
  return min + Math.floor(rng() * (max - min + 1));
}

/** Stable building codes: A–Z, then T1, T2, … */
export function buildingCodeForGlobalIndex(
  globalBuildingIndex: number
): string {
  if (globalBuildingIndex < 0) {
    throw new Error('buildingCodeForGlobalIndex: negative index');
  }
  if (globalBuildingIndex < 26) {
    return String.fromCharCode(65 + globalBuildingIndex);
  }
  return `T${globalBuildingIndex - 25}`;
}

/**
 * `Unit` enforces `@@unique([organizationId, name])` org-wide. Prefix the format-generated
 * label with a short project-derived token so multiple projects in one org never collide.
 */
export function projectScopedUnitName(
  projectId: string,
  formatGeneratedName: string
): string {
  const compact = projectId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const key = (compact.slice(-6) + compact + 'PRJX').slice(0, 4);
  return `${key}-${formatGeneratedName}`;
}

const UNIT_TYPE_WEIGHTS: { value: UnitType; weight: number }[] = [
  { value: 'STUDIO', weight: 12 },
  { value: 'ONE_BR', weight: 28 },
  { value: 'TWO_BR', weight: 30 },
  { value: 'THREE_BR', weight: 18 },
  { value: 'FOUR_BR', weight: 6 },
  { value: 'VILLA', weight: 3 },
  { value: 'PENTHOUSE', weight: 2 },
  { value: 'COMMERCIAL', weight: 1 },
];

function areasForUnitType(
  type: UnitType,
  rng: () => number
): { areaSqm: number; balconyArea: number; terraceArea: number } {
  const r = (a: number, b: number) => a + rng() * (b - a);

  let areaSqm: number;
  switch (type) {
    case 'STUDIO':
      areaSqm = Math.round(r(32, 52));
      break;
    case 'ONE_BR':
      areaSqm = Math.round(r(55, 78));
      break;
    case 'TWO_BR':
      areaSqm = Math.round(r(78, 115));
      break;
    case 'THREE_BR':
      areaSqm = Math.round(r(110, 165));
      break;
    case 'FOUR_BR':
      areaSqm = Math.round(r(155, 240));
      break;
    case 'VILLA':
      areaSqm = Math.round(r(220, 420));
      break;
    case 'PENTHOUSE':
      areaSqm = Math.round(r(140, 280));
      break;
    case 'COMMERCIAL':
      areaSqm = Math.round(r(40, 220));
      break;
    default: {
      const _e: never = type;
      return _e;
    }
  }

  let balconyArea = Math.round(
    r(0, type === 'VILLA' || type === 'PENTHOUSE' ? 35 : 18)
  );
  let terraceArea = Math.round(
    r(
      0,
      type === 'VILLA' || type === 'PENTHOUSE'
        ? 80
        : type === 'COMMERCIAL'
          ? 40
          : 12
    )
  );

  if (type === 'STUDIO') {
    balconyArea = Math.min(balconyArea, 12);
    terraceArea = Math.min(terraceArea, 8);
  }

  return { areaSqm, balconyArea, terraceArea };
}

function hierarchySeed(seed: number): number {
  return (seed ^ 0x9e3779b9) >>> 0;
}

export type BuildPlannedUnitHierarchyParams = {
  organizationId: string;
  projectId: string;
  unitIdFormat: UnitIdFormat;
  ranges: UnitHierarchyRangeConfig;
  /** Master seed — drives counts and layout. */
  seed: number;
  ownerContactIds: string[];
  nameBucket: UniquenessBucket;
};

/**
 * Produce planned units (CRM-shaped) and register `Unit.name` keys in `nameBucket`.
 * Throws {@link import('./seed-integrity').UniquenessViolationError} on duplicate names in-batch.
 */
export function buildPlannedUnitHierarchy(
  params: BuildPlannedUnitHierarchyParams
): PlannedUnitSeed[] {
  const {
    organizationId,
    projectId,
    unitIdFormat,
    ranges,
    seed,
    ownerContactIds,
    nameBucket,
  } = params;

  if (!organizationId?.trim()) {
    throw new Error('buildPlannedUnitHierarchy: organizationId is required');
  }
  if (!projectId?.trim()) {
    throw new Error('buildPlannedUnitHierarchy: projectId is required');
  }
  if (ownerContactIds.length === 0) {
    throw new Error(
      'buildPlannedUnitHierarchy: ownerContactIds must not be empty'
    );
  }

  const rng = mulberry32(hierarchySeed(seed));
  const phaseCount = intInRange(rng, ranges.minPhases, ranges.maxPhases);

  const planned: PlannedUnitSeed[] = [];
  let globalBuildingIndex = 0;
  let unitSeq = 0;

  for (let p = 0; p < phaseCount; p++) {
    const phaseLabel =
      p === 0 && rng() > 0.25
        ? String(pickRandom(RED_SEA_COMPOUND_NAMES, rng))
        : `Phase ${p + 1}`;

    const buildingsInPhase = intInRange(
      rng,
      ranges.minBuildingsPerPhase,
      ranges.maxBuildingsPerPhase
    );

    for (let b = 0; b < buildingsInPhase; b++) {
      const code = normalizeBuildingCode(
        buildingCodeForGlobalIndex(globalBuildingIndex)
      );
      globalBuildingIndex++;

      const floors = intInRange(
        rng,
        ranges.minFloorsPerBuilding,
        ranges.maxFloorsPerBuilding
      );

      const buildingLabel = `${phaseLabel} · Block ${code}`;

      for (let f = 1; f <= floors; f++) {
        const unitsOnFloor = intInRange(
          rng,
          ranges.minUnitsPerFloor,
          ranges.maxUnitsPerFloor
        );

        for (let u = 1; u <= unitsOnFloor; u++) {
          const baseName = generateUnitId(unitIdFormat, {
            buildingCode: code,
            floor: f,
            unitIndex: u,
            phase: phaseLabel,
          });
          const name = projectScopedUnitName(projectId, baseName);

          validateUniqueness(nameBucket, {
            organizationId,
            unitName: name,
          });

          const type = pickWeighted(UNIT_TYPE_WEIGHTS, rng);
          const { areaSqm, balconyArea, terraceArea } = areasForUnitType(
            type,
            rng
          );
          const sizeSqm = Math.max(
            1,
            Math.round(areaSqm + balconyArea + terraceArea)
          );

          const ownerContactId =
            ownerContactIds[unitSeq % ownerContactIds.length]!;
          unitSeq++;

          planned.push({
            name,
            building: buildingLabel,
            organizationId,
            projectId,
            type,
            sizeSqm,
            ownerContactId,
            meta: {
              areaSqm,
              balconyArea,
              terraceArea,
              phaseLabel,
              buildingCode: code,
              floor: f,
              unitIndex: u,
            },
          });
        }
      }
    }
  }

  return planned;
}

export function plannedUnitsToCreateManyInput(
  rows: PlannedUnitSeed[]
): Prisma.UnitCreateManyInput[] {
  return rows.map((r) => ({
    name: r.name,
    type: r.type,
    building: r.building,
    sizeSqm: r.sizeSqm,
    organizationId: r.organizationId,
    projectId: r.projectId,
  }));
}

export function assertPlannedHierarchyIntegrity(rows: PlannedUnitSeed[]): void {
  if (rows.length === 0) {
    return;
  }
  const names = new Set<string>();
  for (const r of rows) {
    if (r.organizationId !== rows[0]!.organizationId) {
      throw new Error('assertPlannedHierarchyIntegrity: mixed organizationId');
    }
    if (r.projectId !== rows[0]!.projectId) {
      throw new Error('assertPlannedHierarchyIntegrity: mixed projectId');
    }
    if (names.has(r.name)) {
      throw new Error(
        `assertPlannedHierarchyIntegrity: duplicate name ${r.name}`
      );
    }
    names.add(r.name);
    if (!r.ownerContactId) {
      throw new Error(
        'assertPlannedHierarchyIntegrity: missing ownerContactId'
      );
    }
  }
}
