const crypto = require('node:crypto');
const { resolveApp } = require('./support');

const REASON_CODES = [
  'ACCEPTED',
  'TAMPERED',
  'EXPIRED',
  'REVOKED',
  'ALREADY_USED',
  'WRONG_GATE',
  'WRONG_PROJECT',
  'WRONG_TENANT',
  'NOT_YET_VALID',
  'PERMISSION_NOT_FOUND',
  'OPERATOR_UNAUTHORIZED',
  'OFFLINE_POLICY_DENIED',
];

const ENVIRONMENT_CONTRACTS = {
  'client-dashboard': ['DATABASE_URL', 'DIRECT_DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'QR_SIGNING_SECRET'],
  'resident-portal': ['DATABASE_URL', 'DIRECT_DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'QR_SIGNING_SECRET'],
  'scanner-app': ['EXPO_PUBLIC_API_URL'],
};

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('base64url');
}

function buildQrVectors(secret) {
  if (!secret || secret.length < 32) throw new Error('fixture signing secret must be at least 32 characters');
  const base = {
    v: 2,
    credentialId: 'cred_fixture_1',
    permissionId: 'perm_fixture_1',
    tenantId: 'tenant_fixture_1',
    projectId: 'project_fixture_1',
    gateIds: ['gate_fixture_1'],
    notBefore: '2026-07-24T00:00:00.000Z',
    expiresAt: '2026-07-25T00:00:00.000Z',
    usage: 'single',
  };
  const signature = sign(base, secret);
  return [
    { name: 'valid', payload: base, signature, expected: 'ACCEPTED' },
    { name: 'tampered', payload: { ...base, gateIds: ['gate_other'] }, signature, expected: 'TAMPERED' },
    { name: 'expired', payload: { ...base, expiresAt: '2026-07-23T00:00:00.000Z' }, signature: null, expected: 'EXPIRED' },
    { name: 'revoked', payload: base, signature, state: { revoked: true }, expected: 'REVOKED' },
    { name: 'replay', payload: base, signature, state: { used: true }, expected: 'ALREADY_USED' },
    { name: 'wrong-gate', payload: base, signature, context: { gateId: 'gate_other' }, expected: 'WRONG_GATE' },
    { name: 'wrong-project', payload: base, signature, context: { projectId: 'project_other' }, expected: 'WRONG_PROJECT' },
    { name: 'wrong-tenant', payload: base, signature, context: { tenantId: 'tenant_other' }, expected: 'WRONG_TENANT' },
  ].map((vector) => vector.signature === null
    ? { ...vector, signature: sign(vector.payload, secret) }
    : vector);
}

function checkReasonCodes(codes) {
  return codes.filter((code) => !REASON_CODES.includes(code))
    .map((code) => `Unknown scan decision reason code: ${code}`);
}

function checkEnvironmentNames(app, env) {
  resolveApp(app);
  const required = ENVIRONMENT_CONTRACTS[app] || [];
  return {
    app,
    required,
    present: required.filter((name) => Boolean(env[name])),
    missing: required.filter((name) => !env[name]),
  };
}

function scanTenantScope(source) {
  const findings = [];
  const calls = source.matchAll(/prisma\.\w+\.(findFirst|findMany|update|deleteMany)\s*\(\s*\{[\s\S]*?where\s*:\s*\{([\s\S]*?)\}[\s\S]*?\}\s*\)/g);
  for (const match of calls) {
    if (!/organizationId/.test(match[2])) findings.push(`Possible unscoped Prisma ${match[1]} call`);
  }
  return findings;
}

function verificationCommands(app) {
  const resolved = resolveApp(app);
  const commands = ['lint', 'typecheck', 'test', 'build']
    .filter((script) => !(app === 'scanner-app' && script === 'typecheck'))
    .map((script) => `pnpm --filter ${resolved.package} ${script}`);
  return { app, commands };
}

function releaseChecklist(app) {
  resolveApp(app);
  return {
    version: 1,
    app,
    items: [
      'Focused diff validated',
      'App checks and pilot evidence fresh',
      'Security and independent reviews complete',
      'Changelog and version decision recorded',
      'Migration/backfill/rollback reviewed if applicable',
      'Environment variable names present; values not recorded',
      'Deployment authorization recorded',
      'Rollback triggers and commands reviewed',
      'Post-release monitoring and pilot support owner assigned',
    ],
  };
}

module.exports = {
  ENVIRONMENT_CONTRACTS,
  REASON_CODES,
  buildQrVectors,
  checkEnvironmentNames,
  checkReasonCodes,
  releaseChecklist,
  scanTenantScope,
  verificationCommands,
};
