/**
 * migration-safety.ts — Prisma Migration Safety & Direct DB URL Verifier
 *
 * Enforces strict environment contracts and migration AST safety:
 * 1. DIRECT_DATABASE_URL must be a direct PostgreSQL connection (not Accelerate prisma://).
 * 2. Scans migration SQL for destructive actions (DROP TABLE, DROP COLUMN, TRUNCATE)
 *    unless explicitly annotated with `-- prisma-safety-override: <reason>`.
 */
import fs from 'fs';
import path from 'path';

export class MigrationSafetyError extends Error {
  constructor(
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'MigrationSafetyError';
  }
}

export interface DirectUrlValidationResult {
  valid: boolean;
  url: string;
  scheme: string;
  isDirect: boolean;
  isAccelerate: boolean;
  error?: string;
}

export interface MigrationSqlAnalysisResult {
  isSafe: boolean;
  destructiveStatements: string[];
  warnings: string[];
  hasSafetyOverride: boolean;
  overrideReason?: string;
}

const DESTRUCTIVE_PATTERNS = [
  { name: 'DROP TABLE', regex: /\bDROP\s+TABLE\b/i },
  { name: 'DROP COLUMN', regex: /\bDROP\s+COLUMN\b/i },
  { name: 'TRUNCATE', regex: /\bTRUNCATE\b/i },
  { name: 'DROP DATABASE', regex: /\bDROP\s+DATABASE\b/i },
  { name: 'DROP SCHEMA', regex: /\bDROP\s+SCHEMA\b/i },
];

const WARNING_PATTERNS = [
  { name: 'ALTER COLUMN TYPE', regex: /\bALTER\s+COLUMN\s+.*\s+TYPE\b/i },
  { name: 'DROP NOT NULL', regex: /\bDROP\s+NOT\s+NULL\b/i },
  { name: 'RENAME COLUMN', regex: /\bRENAME\s+COLUMN\b/i },
];

/**
 * Validates DIRECT_DATABASE_URL format and ensures it is a direct Postgres connection.
 */
export function validateDirectDatabaseUrl(
  rawUrl: string | undefined = process.env.DIRECT_DATABASE_URL
): DirectUrlValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return {
      valid: false,
      url: '',
      scheme: '',
      isDirect: false,
      isAccelerate: false,
      error:
        'DIRECT_DATABASE_URL is missing or empty. Prisma migrations require a direct PostgreSQL connection.',
    };
  }

  const trimmed = rawUrl.trim();
  const isAccelerate =
    trimmed.startsWith('prisma://') || trimmed.startsWith('prisma+postgres://');

  if (isAccelerate) {
    return {
      valid: false,
      url: trimmed,
      scheme: trimmed.split('://')[0],
      isDirect: false,
      isAccelerate: true,
      error:
        'DIRECT_DATABASE_URL cannot be a Prisma Accelerate URL (prisma://). Migrations require direct postgresql:// access.',
    };
  }

  const isDirect =
    trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://');

  if (!isDirect) {
    return {
      valid: false,
      url: trimmed,
      scheme: trimmed.split('://')[0] || 'unknown',
      isDirect: false,
      isAccelerate: false,
      error: `DIRECT_DATABASE_URL has unsupported scheme "${trimmed.split('://')[0]}". Must start with postgresql:// or postgres://.`,
    };
  }

  return {
    valid: true,
    url: trimmed,
    scheme: trimmed.startsWith('postgresql://') ? 'postgresql' : 'postgres',
    isDirect: true,
    isAccelerate: false,
  };
}

/**
 * Analyzes SQL statements in a migration file for destructive operations.
 */
export function analyzeMigrationSql(
  sqlContent: string,
  options: { allowDestructive?: boolean } = {}
): MigrationSqlAnalysisResult {
  if (!sqlContent || typeof sqlContent !== 'string') {
    return {
      isSafe: true,
      destructiveStatements: [],
      warnings: [],
      hasSafetyOverride: false,
    };
  }

  // Check for explicit override annotation in comments
  const overrideMatch = sqlContent.match(
    /--\s*prisma-safety-override:\s*([^\r\n]+)/i
  );
  const hasSafetyOverride =
    Boolean(overrideMatch) || Boolean(options.allowDestructive);
  const overrideReason = overrideMatch ? overrideMatch[1].trim() : undefined;

  const destructiveStatements: string[] = [];
  const warnings: string[] = [];

  // Remove single-line comments for pattern inspection
  const cleanSql = sqlContent
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  for (const { name, regex } of DESTRUCTIVE_PATTERNS) {
    if (regex.test(cleanSql)) {
      destructiveStatements.push(name);
    }
  }

  for (const { name, regex } of WARNING_PATTERNS) {
    if (regex.test(cleanSql)) {
      warnings.push(name);
    }
  }

  const isSafe = hasSafetyOverride || destructiveStatements.length === 0;

  return {
    isSafe,
    destructiveStatements,
    warnings,
    hasSafetyOverride,
    overrideReason,
  };
}

/**
 * Scans a migrations directory and verifies all migration.sql files.
 */
export function verifyMigrationDirectory(migrationsDir: string): {
  scannedCount: number;
  allSafe: boolean;
  reports: Array<{
    migrationName: string;
    analysis: MigrationSqlAnalysisResult;
  }>;
} {
  if (!fs.existsSync(migrationsDir)) {
    throw new MigrationSafetyError(
      `Migrations directory not found: ${migrationsDir}`
    );
  }

  const entries = fs.readdirSync(migrationsDir, { withFileTypes: true });
  const reports: Array<{
    migrationName: string;
    analysis: MigrationSqlAnalysisResult;
  }> = [];
  let allSafe = true;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const migrationSqlPath = path.join(
      migrationsDir,
      entry.name,
      'migration.sql'
    );
    if (!fs.existsSync(migrationSqlPath)) continue;

    const sqlContent = fs.readFileSync(migrationSqlPath, 'utf8');
    const analysis = analyzeMigrationSql(sqlContent);

    if (!analysis.isSafe) {
      allSafe = false;
    }

    reports.push({
      migrationName: entry.name,
      analysis,
    });
  }

  return {
    scannedCount: reports.length,
    allSafe,
    reports,
  };
}
