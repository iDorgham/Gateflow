import type { UnitIdFormat } from '@prisma/client';

/**
 * Inputs for `generateUnitId`. All indices are **1-based** (real-estate style).
 *
 * - `buildingCode`: short label (`A`, `T1`, `B2`) — alphanumeric, will be uppercased.
 * - `floor`: floor number (1 = ground / first retail floor in seed scenarios).
 * - `unitIndex`: unit index on that floor within the building slice.
 * - `phase`: optional phase / cluster name (`Selena`, `Phase 1`) — used by LOCATION / GLOBAL.
 */
export type UnitIdGenerationContext = {
  buildingCode: string;
  floor: number;
  unitIndex: number;
  phase?: string;
  /** Reserved for future localized labels; does not affect current format strings. */
  locale?: string;
};

function pad2(n: number): string {
  return Math.max(0, Math.floor(n)).toString().padStart(2, '0');
}

function pad3(n: number): string {
  return Math.max(0, Math.floor(n)).toString().padStart(3, '0');
}

/** Uppercase alphanumeric segment for building codes (keeps `-` for `T1` style). */
export function normalizeBuildingCode(code: string): string {
  const t = code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '');
  if (!t) throw new Error('normalizeBuildingCode: empty after sanitize');
  return t.slice(0, 8);
}

function phaseSlug(phase?: string): string {
  if (!phase?.trim()) return 'LX';
  const s = phase
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toUpperCase()
    .slice(0, 6);
  return s.length > 0 ? s : 'LX';
}

/**
 * Build a CRM-facing `Unit.name` string from the project’s {@link UnitIdFormat}.
 *
 * | Format | Example | Shape |
 * |--------|---------|--------|
 * | `COMPACT` | `A-3-05` | `{building}-{floor}-{unit}` |
 * | `BUILDING_FIRST` | `B-A-F3-U5` | `B-{building}-F{floor}-U{unit}` |
 * | `SIMPLE` | `A0305` | `{building}{floor2}{unit2}` (avoids `A101` vs floor 10 / unit 1 ambiguity) |
 * | `LOCATION` | `SELENA-A-F3-U5` | `{phase}-{building}-F{floor}-U{unit}` |
 * | `DESCRIPTIVE` | `Tower A · Floor 3 · Unit 5` | Human-readable |
 * | `GLOBAL` | `RS-SELENA-A-003-005` | `RS-{phase}-{building}-{floor3}-{unit3}` |
 */
export function generateUnitId(
  format: UnitIdFormat,
  ctx: UnitIdGenerationContext
): string {
  const b = normalizeBuildingCode(ctx.buildingCode);
  const f = Math.max(1, Math.floor(ctx.floor));
  const u = Math.max(1, Math.floor(ctx.unitIndex));

  switch (format) {
    case 'COMPACT':
      return `${b}-${f}-${pad2(u)}`;
    case 'BUILDING_FIRST':
      return `B-${b}-F${f}-U${u}`;
    case 'SIMPLE':
      return `${b}${pad2(f)}${pad2(u)}`;
    case 'LOCATION': {
      const p = phaseSlug(ctx.phase);
      return `${p}-${b}-F${f}-U${u}`;
    }
    case 'DESCRIPTIVE':
      return `Tower ${b} · Floor ${f} · Unit ${u}`;
    case 'GLOBAL': {
      const p = phaseSlug(ctx.phase);
      return `RS-${p}-${b}-${pad3(f)}-${pad3(u)}`;
    }
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}
