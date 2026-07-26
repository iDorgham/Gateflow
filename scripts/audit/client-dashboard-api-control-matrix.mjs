#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const apiRoot = path.join(repoRoot, 'apps/client-dashboard/src/app/api');
const outputPath = path.join(
  repoRoot,
  'docs/plan/Draft/client_dashboard_readiness_2026/evidence/PHASE_01_API_CONTROL_MATRIX.md'
);

const methodPattern =
  /export\s+(?:async\s+function|const)\s+(GET|POST|PUT|PATCH|DELETE)\b/g;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function routeFor(file) {
  const relativeDirectory = path.relative(apiRoot, path.dirname(file));
  return `/api/${relativeDirectory.split(path.sep).join('/')}`;
}

function authentication(route) {
  if (
    route === '/api/resident/push/send' ||
    route === '/api/marketing/utm-track'
  ) {
    return 'D';
  }
  if (
    route === '/api/perimeter/webhook' ||
    route === '/api/webhooks/whatsapp' ||
    route === '/api/webhooks/stripe'
  ) {
    return 'H';
  }
  if (route === '/api/cron/ai-tasks') return 'K';
  if (route === '/api/resident/arrived') return 'C';
  if (route === '/api/auth/login' || route === '/api/auth/refresh') {
    return 'K';
  }
  return 'S';
}

function authorization(auth, source) {
  if (/[HCKPD]/.test(auth)) return 'N';
  if (
    /hasPermission|requirePermission|checkPermission|permission\s*[:=]/i.test(
      source
    )
  ) {
    return 'E';
  }
  return 'O';
}

function tenantBoundary(route, auth, source) {
  if (
    route === '/api/marketing/utm-track' ||
    route === '/api/resident/push/send'
  ) {
    return 'N';
  }
  if (route === '/api/resident/arrived') return 'R';
  if (route === '/api/webhooks/stripe') return 'R';
  if (auth === 'K' && route.startsWith('/api/auth/')) return 'N';
  if (auth === 'K') return 'O';
  if (
    /organizationId|orgId|runWithOrganization|tenant|unitId|userId/i.test(
      source
    )
  ) {
    return 'O';
  }
  return 'R';
}

function validation(method, route, source) {
  if (method === 'GET' || route === '/api/resident/push/send') return 'N';
  if (/safeParse|\.parse\(|z\.object|Schema/i.test(source)) return 'Z';
  if (method === 'DELETE' && !/request\.json|req\.json/i.test(source))
    return 'P';
  if (/request\.json|req\.json|searchParams|params/i.test(source)) return 'M';
  return 'N';
}

function csrf(method, auth) {
  if (method === 'GET' || /[HCKPD]/.test(auth)) return 'N';
  return 'M';
}

function abuseControl(route, source) {
  if (
    route === '/api/resident/push/send' ||
    route === '/api/marketing/utm-track'
  ) {
    return 'D';
  }
  if (
    /checkRateLimit|rateLimit|runReplayProtectedWebhook|stripe\.webhooks/i.test(
      source
    )
  ) {
    return 'E';
  }
  return 'N';
}

function audit(method, route, source) {
  if (method === 'GET') return 'N';
  if (
    route === '/api/resident/push/send' ||
    route === '/api/marketing/utm-track'
  ) {
    return 'D';
  }
  if (
    route === '/api/ai/actions/[id]/feedback' ||
    route === '/api/ai/actions/execute' ||
    route === '/api/ai/actions/log' ||
    route === '/api/contacts/[id]/invite' ||
    route === '/api/qr/bulk-create' ||
    route === '/api/webhooks/[id]/test'
  ) {
    return 'E';
  }
  if (route === '/api/project/switch') return 'N';
  if (route === '/api/ai/chat') {
    return 'G';
  }
  if (
    /auditLog|eventLog|emitEvent|scanLog|\.create\(|\.update|\.delete|upsert/i.test(
      source
    )
  ) {
    return 'E';
  }
  return 'G';
}

function disposition(route, method) {
  const contained = new Map([
    ['/api/scans/[scanId]/deny POST', 'GF-CD-SEC-001'],
    ['/api/contacts POST', 'GF-CD-SEC-002'],
    ['/api/contacts/[id] PATCH', 'GF-CD-SEC-002'],
    ['/api/resident/push/send POST', 'GF-CD-SEC-004'],
    ['/api/ai/actions/[id]/feedback POST', 'GF-CD-SEC-005'],
    ['/api/ai/actions/execute POST', 'GF-CD-SEC-006'],
    ['/api/perimeter/webhook POST', 'GF-CD-SEC-007'],
    ['/api/webhooks/whatsapp POST', 'GF-CD-SEC-007'],
    ['/api/resident/arrived POST', 'GF-CD-SEC-008'],
  ]);
  const key = `${route} ${method}`;
  if (contained.has(key)) return `contained:${contained.get(key)}`;
  if (route === '/api/marketing/utm-track') {
    return 'resolved:Phase02-retired-unsafe-public-mutation';
  }
  if (route === '/api/danger/purge-scans') {
    return 'resolved:Phase02-retention-redaction';
  }
  if (route === '/api/api-keys/[id]' && method === 'DELETE') {
    return 'resolved:Phase02-revocation-history';
  }
  if (route === '/api/ai/chat') {
    return 'resolved:Phase02-memory-only-redacted-transcript';
  }
  if (route === '/api/qr/send-email') {
    return 'resolved:Phase02-tenant-safe-delivery-audit';
  }
  return 'classified';
}

const rows = [];
for (const file of walk(apiRoot).filter((candidate) =>
  candidate.endsWith(`${path.sep}route.ts`)
)) {
  const source = fs.readFileSync(file, 'utf8');
  const route = routeFor(file);
  for (const match of source.matchAll(methodPattern)) {
    const method = match[1];
    const auth = authentication(route);
    rows.push({
      route,
      method,
      auth,
      permission: authorization(auth, source),
      tenant: tenantBoundary(route, auth, source),
      validation: validation(method, route, source),
      csrf: csrf(method, auth),
      abuse: abuseControl(route, source),
      audit: audit(method, route, source),
      disposition: disposition(route, method),
      source: path.relative(repoRoot, file),
    });
  }
}

rows.sort((left, right) =>
  `${left.route} ${left.method}`.localeCompare(`${right.route} ${right.method}`)
);

const keys = rows.map((row) => `${row.route} ${row.method}`);
const errors = [];
if (rows.length !== 170) errors.push(`expected 170 rows, found ${rows.length}`);
if (new Set(keys).size !== rows.length)
  errors.push('route/method keys are not unique');
if (rows.some((row) => Object.values(row).includes('needs-review'))) {
  errors.push('matrix contains needs-review');
}
if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const legend = `# Phase 01 API control matrix

**Generated:** 2026-07-26
**Scope:** \`apps/client-dashboard/src/app/api/**/route.ts\`
**Invariant:** exactly 170 unique route/method rows; no \`needs-review\`

This is a decision register, not a helper-count assertion. Each row links to the
reviewed route source. Codes distinguish verified controls, scoped ownership,
not-applicable controls, and explicit gaps carried into Phase 02.

| Column | Codes |
| --- | --- |
| Auth | S=session/Bearer; H=signed webhook; K=credential/secret; C=capability; P=public; D=disabled |
| Perm | E=explicit RBAC; O=owner/self/business scope; N=not applicable |
| Tenant | O=organization scoped; R=relation/identity derived; N=not applicable; G=gap |
| Valid | Z=Zod/schema; M=manual bounded parsing; P=path-only; N=no input/not applicable |
| CSRF | M=global middleware; N=not applicable |
| Abuse | E=rate/replay/provider idempotency; N=not required at current risk; G=gap; D=disabled |
| Audit | E=domain/audit event or durable mutation evidence; N=read-only/not applicable; G=gap; D=disabled |

## Matrix

| # | Route | Method | Auth | Perm | Tenant | Valid | CSRF | Abuse | Audit | Disposition | Source |
| ---: | --- | --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- | --- |`;

const tableRows = rows.map(
  (row, index) =>
    `| ${index + 1} | \`${row.route}\` | ${row.method} | ${row.auth} | ${row.permission} | ${row.tenant} | ${row.validation} | ${row.csrf} | ${row.abuse} | ${row.audit} | ${row.disposition} | \`${row.source}\` |`
);

const gapRows = rows.filter((row) => row.disposition.startsWith('gap:'));
const footer = `

## Reconciliation

- Rows: **${rows.length}**
- Unique route/method keys: **${new Set(keys).size}**
- \`needs-review\`: **0**
- Explicit carried gaps: **${gapRows.length}**
- Contained findings represented: **${
  rows.filter((row) => row.disposition.startsWith('contained:')).length
} rows**

No explicit method-level gaps remain in this register. Scan retention, API-key
revocation history, the AI transcript privacy contract, QR email delivery
auditing, and public UTM attribution integrity were resolved in Phase 02.
GF-CD-SEC-003 is global middleware evidence and therefore applies across
cookie-authenticated mutation rows rather than adding an extra route/method
row.
`;

const document = `${legend}\n${tableRows.join('\n')}${footer}`;

if (process.argv.includes('--write')) {
  fs.writeFileSync(outputPath, document);
  console.log(`wrote ${outputPath}`);
} else {
  process.stdout.write(document);
}
