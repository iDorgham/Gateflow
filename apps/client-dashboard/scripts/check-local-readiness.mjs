import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUIRED_ENVIRONMENT_NAMES = [
  'DATABASE_URL',
  'ENCRYPTION_MASTER_KEY',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'QR_SIGNING_SECRET',
  'UPSTASH_REDIS_REST_TOKEN',
  'UPSTASH_REDIS_REST_URL',
];

function readEnvironmentFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=');
        const name = line.slice(0, separator).trim();
        const rawValue = line.slice(separator + 1).trim();
        const quoted =
          (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
          (rawValue.startsWith("'") && rawValue.endsWith("'"));
        return [name, quoted ? rawValue.slice(1, -1) : rawValue];
      })
  );
}

export function loadLocalEnvironment(repositoryRoot) {
  const appRoot = path.join(repositoryRoot, 'apps', 'client-dashboard');
  return {
    ...readEnvironmentFile(path.join(repositoryRoot, '.env')),
    ...readEnvironmentFile(path.join(repositoryRoot, '.env.local')),
    ...readEnvironmentFile(path.join(appRoot, '.env')),
    ...readEnvironmentFile(path.join(appRoot, '.env.local')),
    ...process.env,
  };
}

export function checkEnvironmentNames(environment) {
  const present = REQUIRED_ENVIRONMENT_NAMES.filter(
    (name) => typeof environment[name] === 'string' && environment[name].trim()
  );
  const missing = REQUIRED_ENVIRONMENT_NAMES.filter(
    (name) => !present.includes(name)
  );
  return { present, missing };
}

export async function checkRedisConnectivity(environment, fetchImpl = fetch) {
  const url = environment.UPSTASH_REDIS_REST_URL;
  const token = environment.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { status: 'not_configured' };

  const response = await fetchImpl(`${url.replace(/\/$/, '')}/ping`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) return { status: 'failed', httpStatus: response.status };

  const body = await response.json();
  return { status: body?.result === 'PONG' ? 'passed' : 'unexpected_response' };
}

export async function runLocalReadiness(repositoryRoot, fetchImpl = fetch) {
  const environment = loadLocalEnvironment(repositoryRoot);
  const names = checkEnvironmentNames(environment);
  const redis = await checkRedisConnectivity(environment, fetchImpl);
  return {
    valid: names.missing.length === 0 && redis.status === 'passed',
    environmentNames: names,
    connectivity: { redis },
  };
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
    '..'
  );
  try {
    const result = await runLocalReadiness(repositoryRoot);
    console.log(JSON.stringify(result, null, 2));
    if (!result.valid) process.exitCode = 1;
  } catch (error) {
    console.error(
      JSON.stringify({
        valid: false,
        error:
          error instanceof Error ? error.name : 'Unknown local readiness error',
      })
    );
    process.exitCode = 1;
  }
}
