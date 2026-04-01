export * from '@prisma/client';
export { prisma } from './client';
export { db } from './client';
export { default as prismaClient } from './client';
export * from './quota';
export * from './access';
export * from './tenant';
export * from './queries/projects';
export * from './queries/qr';
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
