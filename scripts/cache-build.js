#!/usr/bin/env node
/**
 * Regenerates docs/reference/cache/{WORKSPACE_INDEX,API_ROUTES_MAP,SCHEMA_SNAPSHOT}.md
 * from the current repo state (package.json files, app/api routes, schema.prisma).
 *
 * Run after: a dependency bump, a new app/port, an API route added/removed,
 * or a Prisma model/enum change. See docs/reference/cache/CACHE_POLICY.md.
 *
 * Best-effort: route auth detection is a heuristic (grep for known helper
 * names), not a real type-checker. Verify before treating it as ground truth.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'docs/reference/cache');
const today = new Date().toISOString().slice(0, 10);

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function walk(dir, matcher, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      walk(full, matcher, out);
    } else if (matcher(e.name)) {
      out.push(full);
    }
  }
  return out;
}

// ---------- Apps & ports ----------
const APP_NAMES = fs
  .readdirSync(path.join(ROOT, 'apps'))
  .filter((d) => fs.statSync(path.join(ROOT, 'apps', d)).isDirectory());

const apps = APP_NAMES.map((dir) => {
  const pkg = readJson(path.join(ROOT, 'apps', dir, 'package.json')) || {};
  const devScript = (pkg.scripts && pkg.scripts.dev) || '';
  const portMatch = devScript.match(/(?:--port|-p)\s+(\d+)/);
  const isExpo = !!pkg.dependencies?.expo;
  const framework = isExpo
    ? `Expo SDK ${(pkg.dependencies.expo || '').replace(/[^\d.]/g, '') || '?'}`
    : pkg.dependencies?.next
      ? `Next.js ${(pkg.dependencies.next || '').replace(/[^\d.]/g, '') || '?'}`
      : '—';
  return {
    dir,
    name: pkg.name || dir,
    port: portMatch ? portMatch[1] : '—',
    framework,
  };
}).sort((a, b) => a.dir.localeCompare(b.dir));

// ---------- Shared packages ----------
const PKG_DIR = path.join(ROOT, 'packages');
const packages = fs
  .readdirSync(PKG_DIR)
  .filter((d) => fs.statSync(path.join(PKG_DIR, d)).isDirectory())
  .map((dir) => {
    const pkgPath = path.join(PKG_DIR, dir, 'package.json');
    const pkg = readJson(pkgPath);
    return { dir, name: pkg ? pkg.name : null, hasPackageJson: !!pkg };
  })
  .sort((a, b) => a.dir.localeCompare(b.dir));

// ---------- Key dependencies (root) ----------
const rootPkg = readJson(path.join(ROOT, 'package.json'));
const clientPkg = readJson(
  path.join(ROOT, 'apps/client-dashboard/package.json')
);
const dbPkg = readJson(path.join(ROOT, 'packages/db/package.json'));
const keyDeps = [
  ['react', rootPkg?.dependencies?.react],
  ['next', clientPkg?.dependencies?.next],
  ['typescript', rootPkg?.devDependencies?.typescript],
  ['tailwindcss', rootPkg?.devDependencies?.tailwindcss],
  ['turbo', rootPkg?.devDependencies?.turbo],
  ['eslint', rootPkg?.devDependencies?.eslint],
  ['ai', rootPkg?.devDependencies?.ai],
  ['prisma', dbPkg?.devDependencies?.prisma || dbPkg?.dependencies?.prisma],
  ['@prisma/client', dbPkg?.dependencies?.['@prisma/client']],
  ['@prisma/adapter-pg', dbPkg?.dependencies?.['@prisma/adapter-pg']],
];

// ---------- Env vars (.env.example) ----------
const envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8');
const envVars = [];
{
  const lines = envExample.split('\n');
  let pendingComment = '';
  for (const line of lines) {
    if (/^\s*#/.test(line)) {
      pendingComment = line.replace(/^\s*#\s?/, '').trim();
      continue;
    }
    const m = line.match(/^([A-Z0-9_]+)=/);
    if (m) {
      envVars.push({ name: m[1], note: pendingComment });
      pendingComment = '';
    } else if (line.trim() === '') {
      pendingComment = '';
    }
  }
}

// ---------- Commands (curated subset from root scripts) ----------
const COMMAND_KEYS = [
  'build',
  'dev',
  'lint',
  'test',
  'typecheck',
  'preflight',
  'db:generate',
  'db:studio',
  'dev:client',
  'dev:admin',
  'dev:scanner',
  'dev:marketing',
  'dev:resident',
  'dev:mobile',
  'dev:design',
  'check:security',
  'check:todos',
  'check:imports',
  'check:bundle',
  'check:db-drift',
];
const commands = COMMAND_KEYS.filter((k) => rootPkg?.scripts?.[k]).map((k) => [
  k,
  rootPkg.scripts[k],
]);

// ---------- API routes ----------
const routeFiles = [];
for (const app of APP_NAMES) {
  const apiDir = path.join(ROOT, 'apps', app, 'src/app/api');
  const files = walk(
    apiDir,
    (name) => name === 'route.ts' || name === 'route.tsx'
  );
  for (const f of files) routeFiles.push({ app, file: f });
}

const AUTH_HEURISTICS = [
  ['isAdminAuthorized', 'admin key'],
  ['requireAuth', 'session'],
  ['dashboardAuth', 'session'],
  ['apiKeyAuth', 'api key'],
  ['getSessionClaims', 'session'],
  ['verifyWebhookSignature', 'webhook sig'],
  ['isPublicRoute', 'public'],
];

function methodsAndAuth(file) {
  const src = fs.readFileSync(file, 'utf8');
  const methods = [
    ...src.matchAll(
      /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\b/g
    ),
  ].map((m) => m[1]);
  let auth = '?';
  for (const [needle, label] of AUTH_HEURISTICS) {
    if (src.includes(needle)) {
      auth = label;
      break;
    }
  }
  return { methods: methods.length ? methods.join(',') : '?', auth };
}

const routesByApp = {};
for (const { app, file } of routeFiles) {
  const rel = path.relative(path.join(ROOT, 'apps', app, 'src/app/api'), file);
  const routePath =
    '/api/' + rel.replace(/\/route\.tsx?$/, '').replace(/\\/g, '/');
  const { methods, auth } = methodsAndAuth(file);
  (routesByApp[app] = routesByApp[app] || []).push({
    routePath,
    methods,
    auth,
  });
}
for (const app of Object.keys(routesByApp)) {
  routesByApp[app].sort((a, b) => a.routePath.localeCompare(b.routePath));
}
const totalRoutes = routeFiles.length;

// ---------- Prisma schema ----------
const schemaPath = path.join(ROOT, 'packages/db/prisma/schema.prisma');
const schemaSrc = fs.readFileSync(schemaPath, 'utf8');
const modelBlocks = [...schemaSrc.matchAll(/model\s+(\w+)\s*\{([^}]*)\}/g)];
const enumNames = [...schemaSrc.matchAll(/enum\s+(\w+)\s*\{/g)].map(
  (m) => m[1]
);

const models = modelBlocks.map(([, name, body]) => ({
  name,
  hasOrgScope: /organizationId/.test(body),
  hasSoftDelete: /deletedAt/.test(body),
}));

// ================= Write WORKSPACE_INDEX.md =================
{
  let md = `---\ngenerated: ${today}\nupdate_trigger: dep-bump, new-app, port-change\n---\n\n`;
  md += `# Workspace Index Cache\n\n> Auto-generated by \`node scripts/cache-build.js\`. Run it after a dep bump, new app, or port change.\n\n---\n\n`;
  md += `## Apps & Ports\n\n| App | Package | Port | Framework |\n| --- | --- | --- | --- |\n`;
  for (const a of apps)
    md += `| ${a.dir} | \`${a.name}\` | ${a.port} | ${a.framework} |\n`;
  md += `\n---\n\n## Shared Packages\n\n| Dir | Package name | Notes |\n| --- | --- | --- |\n`;
  for (const p of packages) {
    md += `| \`${p.dir}\` | ${p.name ? '`' + p.name + '`' : '_none_'} | ${p.hasPackageJson ? '' : '⚠️ no package.json — not a real workspace package'} |\n`;
  }
  md += `\n---\n\n## Key Dependencies\n\n| Package | Version |\n| --- | --- |\n`;
  for (const [k, v] of keyDeps) md += `| ${k} | \`${v || '—'}\` |\n`;
  md += `\n---\n\n## Environment Variables\n\n| Variable | Note (from .env.example) |\n| --- | --- |\n`;
  for (const v of envVars) md += `| \`${v.name}\` | ${v.note || '—'} |\n`;
  md += `\n---\n\n## Common Commands\n\n\`\`\`bash\n`;
  for (const [k, v] of commands)
    md += `# ${k}\npnpm ${k === 'build' || k === 'dev' || k === 'lint' || k === 'test' || k === 'typecheck' || k === 'preflight' ? k : k}\n`;
  md += `\`\`\`\n\n---\n\n## Quick-Reference Auth Pattern\n\n- Session claims: cookie-based JWT via \`jose\`; helper \`getSessionClaims()\` / \`requireAuth()\` in \`apps/client-dashboard/src/lib/auth*.ts\`.\n- Claim shape: \`auth.sub\` = userId (no separate \`userId\` field).\n- Org scope: every query must filter by \`organizationId\` — see models below for which ones carry it.\n- Admin dashboard: separate \`isAdminAuthorized()\` gate (\`ADMIN_ACCESS_KEY\`), not the same session system as tenant apps.\n- Soft deletes: filter \`deletedAt: null\`; never hard-delete (see models below).\n`;
  fs.writeFileSync(path.join(CACHE_DIR, 'WORKSPACE_INDEX.md'), md);
}

// ================= Write API_ROUTES_MAP.md =================
{
  let md = `---\ngenerated: ${today}\nupdate_trigger: route-added-removed\ntotal_routes: ${totalRoutes}\n---\n\n`;
  md += `# API Routes Map\n\n> Auto-generated by \`node scripts/cache-build.js\`. ${totalRoutes} routes across ${Object.keys(routesByApp).length} apps.\n> "Auth" column is a heuristic (grep for known helper names) — \`?\` means unrecognized, verify manually.\n\n---\n\n`;
  for (const app of Object.keys(routesByApp).sort()) {
    const list = routesByApp[app];
    md += `## ${app} (${list.length} routes)\n\n| Route | Methods | Auth (heuristic) |\n| --- | --- | --- |\n`;
    for (const r of list)
      md += `| \`${r.routePath}\` | ${r.methods} | ${r.auth} |\n`;
    md += `\n`;
  }
  fs.writeFileSync(path.join(CACHE_DIR, 'API_ROUTES_MAP.md'), md);
}

// ================= Write SCHEMA_SNAPSHOT.md =================
{
  let md = `---\ngenerated: ${today}\nupdate_trigger: schema-model-or-field-change\nmodel_count: ${models.length}\nenum_count: ${enumNames.length}\n---\n\n`;
  md += `# Schema Snapshot\n\n> Auto-generated by \`node scripts/cache-build.js\` from \`packages/db/prisma/schema.prisma\`.\n> ${models.length} models, ${enumNames.length} enums.\n\n---\n\n`;
  md += `## Models\n\n| Model | organizationId scope | deletedAt (soft delete) |\n| --- | --- | --- |\n`;
  for (const m of models) {
    md += `| ${m.name} | ${m.hasOrgScope ? '✓' : '—'} | ${m.hasSoftDelete ? '✓' : '—'} |\n`;
  }
  md += `\n---\n\n## Enums\n\n${enumNames.map((e) => `- \`${e}\``).join('\n')}\n\n---\n\n## Known gotchas\n\n- QRCode Prisma accessor is \`prisma.qRCode\` (camelCase field name, not \`prisma.qrCode\`).\n- Enum imports come from \`@gate-access/db\`, not \`@prisma/client\`, in app code.\n- \`@prisma/client\` is pinned \`^6.19.3\` but \`@prisma/adapter-pg\` is pinned \`^7.9.1\` — verify this pairing is intentional before bumping either.\n`;
  fs.writeFileSync(path.join(CACHE_DIR, 'SCHEMA_SNAPSHOT.md'), md);
}

console.log(
  `Cache rebuilt: ${apps.length} apps, ${packages.length} packages, ${totalRoutes} routes, ${models.length} models, ${enumNames.length} enums.`
);
