export * from '@prisma/client';
export { prisma } from './client';
export { db } from './client';
export { default as prismaClient } from './client';
export * from './quota';
export * from './access';
export * from './tenant';
export * from './queries/projects';
export * from './queries/qr';
export * from './crypto';
export type { OrganizationContext, DbClient } from './tenant';
export {
  createSecureInviteSignature,
  verifySecureInviteSignature,
} from './security';
export {
  createUniquenessBucket,
  normalizeEmail,
  normalizePhone,
  normalizeUnitName,
  validateUniqueness,
  UniquenessViolationError,
} from './lib/seed-integrity';
export type {
  UniquenessBucket,
  UniquenessField,
  UniquenessRowInput,
} from './lib/seed-integrity';
export {
  mulberry32,
  pickRandom,
  pickWeighted,
  RED_SEA_COMPOUND_NAMES,
  HURGHADA_AREA_LABELS,
  EGYPTIAN_FIRST_NAMES,
  EGYPTIAN_LAST_NAMES,
} from './lib/red-sea-data';
export { generateUnitId, normalizeBuildingCode } from './lib/unit-id-formats';
export type { UnitIdGenerationContext } from './lib/unit-id-formats';
export {
  CONTACT_NATIONALITIES,
  DEFAULT_NATIONALITY_WEIGHT_INTS,
  DEFAULT_NATIONALITY_WEIGHTS,
  NATIONALITY_DISPLAY_NAME,
  contactRngSeed,
  generateRichContact,
  normalizeNationalityWeights,
  sampleNationality,
} from './lib/rich-contact';
export type {
  ContactNationality,
  GenerateRichContactInput,
  RichContactPayload,
} from './lib/rich-contact';
export {
  EmulationResolutionError,
  runEmulation,
  seedRelationalChain,
  seedUnitHierarchyForProject,
} from './advanced-seed-service';
export type {
  RunEmulationParams,
  RunEmulationResult,
  SeedRelationalChainConfig,
  SeedRelationalChainResult,
  SeedUnitHierarchyForProjectParams,
  SeedUnitHierarchyForProjectResult,
} from './advanced-seed-service';
export {
  buildSignedVisitorQRCodeString,
  deterministicScanUuid,
  RELATIONAL_SEED_CHAIN_DEPTH,
  scanLogWhereForOrganization,
} from './lib/relational-chain-seed';
export type { BuildVisitorSignedCodeInput } from './lib/relational-chain-seed';
export {
  assertPlannedHierarchyIntegrity,
  buildPlannedUnitHierarchy,
  buildingCodeForGlobalIndex,
  DEFAULT_UNIT_HIERARCHY_RANGES,
  plannedUnitsToCreateManyInput,
  projectScopedUnitName,
} from './lib/unit-hierarchy-seed';
export type {
  BuildPlannedUnitHierarchyParams,
  PlannedUnitMeta,
  PlannedUnitSeed,
  UnitHierarchyRangeConfig,
} from './lib/unit-hierarchy-seed';
export {
  chiSquareUniform,
  histogramBins01,
  massInRange,
  normalizedPositionsInWindow,
  RUSH_SCENARIO_REGISTRY,
  RUSH_SCENARIOS,
  RushHourScheduleError,
  sampleScanTimestamps,
} from './lib/rush-hour';
export type {
  RushGaussianPeak,
  RushScenario,
  RushScenarioDefinition,
  SampleScanTimestampsParams,
  WeekendAccent,
} from './lib/rush-hour';
export { encryptField, decryptField } from './lib/crypto';
