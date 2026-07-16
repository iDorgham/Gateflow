# Symbol Catalog: packages-db

Auto-generated symbol index for planning and impact analysis.

- Base path: `packages/db/src`
- Source files indexed: 36

## `packages/db/src/access.ts`

- Exports (1): `isAccessAllowed`

## `packages/db/src/advanced-seed-service.ts`

- Exports (10): `EmulationResolutionError`, `RunEmulationParams`, `RunEmulationResult`, `SeedRelationalChainConfig`, `SeedRelationalChainResult`, `SeedUnitHierarchyForProjectParams`, `SeedUnitHierarchyForProjectResult`, `runEmulation`, `seedRelationalChain`, `seedUnitHierarchyForProject`

## `packages/db/src/crypto.ts`

- Exports (3): `decrypt`, `encrypt`, `isEncrypted`

## `packages/db/src/legacy-dev-seed.ts`

- Exports (1): `runLegacyDevSeed`

## `packages/db/src/lib/red-sea-data.ts`

- Exports (3): `mulberry32`, `pickRandom`, `pickWeighted`

## `packages/db/src/lib/relational-chain-seed.ts`

- Exports (4): `BuildVisitorSignedCodeInput`, `buildSignedVisitorQRCodeString`, `deterministicScanUuid`, `scanLogWhereForOrganization`

## `packages/db/src/lib/rich-contact.ts`

- Exports (7): `ContactNationality`, `GenerateRichContactInput`, `RichContactPayload`, `contactRngSeed`, `generateRichContact`, `normalizeNationalityWeights`, `sampleNationality`

## `packages/db/src/lib/rush-hour.ts`

- Exports (11): `RushGaussianPeak`, `RushHourScheduleError`, `RushScenario`, `RushScenarioDefinition`, `SampleScanTimestampsParams`, `WeekendAccent`, `chiSquareUniform`, `histogramBins01`, `massInRange`, `normalizedPositionsInWindow`, `sampleScanTimestamps`

## `packages/db/src/lib/seed-cli-args.ts`

- Exports (5): `SeedCliEmulateSlice`, `SeedCliParsed`, `parseSeedCliArgv`, `printSeedCliHelp`, `seedCliWantsEmulation`

## `packages/db/src/lib/seed-cli-run.ts`

- Exports (8): `ExecuteSeedCliDeps`, `assertOrganizationCountRange`, `countDuplicateContactEmails`, `countDuplicateContactPhones`, `executeSeedCli`, `runCliEmulation`, `runSeedIntegrityChecks`, `runSeedIntegritySelfTest`

## `packages/db/src/lib/seed-integrity.ts`

- Exports (9): `UniquenessBucket`, `UniquenessField`, `UniquenessRowInput`, `UniquenessViolationError`, `createUniquenessBucket`, `normalizeEmail`, `normalizePhone`, `normalizeUnitName`, `validateUniqueness`

## `packages/db/src/lib/unit-hierarchy-seed.ts`

- Exports (9): `BuildPlannedUnitHierarchyParams`, `PlannedUnitMeta`, `PlannedUnitSeed`, `UnitHierarchyRangeConfig`, `assertPlannedHierarchyIntegrity`, `buildPlannedUnitHierarchy`, `buildingCodeForGlobalIndex`, `plannedUnitsToCreateManyInput`, `projectScopedUnitName`

## `packages/db/src/lib/unit-id-formats.ts`

- Exports (3): `UnitIdGenerationContext`, `generateUnitId`, `normalizeBuildingCode`

## `packages/db/src/queries/projects.ts`

- Exports (1): `getProjectMetrics`

## `packages/db/src/queries/qr.ts`

- Exports (2): `CreateExpressInviteParams`, `createExpressInviteTransaction`

## `packages/db/src/quota.ts`

- Exports (4): `QuotaCheckResult`, `canCreateOpenQR`, `checkAndConsumeQuota`, `getDefaultMonthlyQuota`

## `packages/db/src/security.ts`

- Exports (2): `createSecureInviteSignature`, `verifySecureInviteSignature`

## `packages/db/src/seed-data.ts`

- Exports (6): `getRandomIncidentReason`, `getRandomInternationalName`, `getRandomResortLocation`, `getRandomUtmCampaign`, `getRandomUtmSource`, `getRandomWatchlistCategory`

## `packages/db/src/tenant.ts`

- Exports (5): `DbClient`, `OrganizationContext`, `clearOrganizationContext`, `getOrganizationContext`, `setOrganizationContext`
