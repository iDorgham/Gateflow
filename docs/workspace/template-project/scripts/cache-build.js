#!/usr/bin/env node
/**
 * cache-build.js — Workspace Cache Builder
 *
 * Scans the project and auto-generates docs/system/cache/WORKSPACE_INDEX.md.
 * Run after dependency bumps, new apps, or port changes.
 *
 * Usage:
 *   node scripts/cache-build.js
 *   pnpm cache:build
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const CACHE_DIR = path.join(PROJECT_ROOT, 'docs/system/cache');
const OUTPUT_FILE = path.join(CACHE_DIR, 'WORKSPACE_INDEX.md');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function detectPort(pkgJson, appName) {
  const scripts = pkgJson?.scripts ?? {};
  const devScript = scripts.dev ?? '';
  const portMatch = devScript.match(/(?:-p|--port)\s*(\d+)/);
  if (portMatch) return portMatch[1];
  // Common defaults
  const defaults = {
    marketing: '3000',
    'client-dashboard': '3001',
    'admin-dashboard': '3002',
    'resident-portal': '3004',
    'scanner-app': '8081',
  };
  return defaults[appName] ?? '—';
}

function detectFramework(pkgJson) {
  const deps = { ...pkgJson?.dependencies, ...pkgJson?.devDependencies };
  if (deps?.expo)
    return `Expo SDK ${deps.expo.replace(/[^0-9.]/g, '').split('.')[0] ?? ''}`;
  if (deps?.next)
    return `Next.js ${deps.next.replace(/[^0-9.]/g, '').split('.')[0] ?? ''}`;
  return '—';
}

// ─── Scanners ─────────────────────────────────────────────────────────────────

function scanApps() {
  const appsDir = path.join(PROJECT_ROOT, 'apps');
  if (!fs.existsSync(appsDir)) return [];

  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const pkg = readJSON(path.join(appsDir, e.name, 'package.json'));
      return {
        name: e.name,
        packageName: pkg?.name ?? e.name,
        port: detectPort(pkg, e.name),
        framework: detectFramework(pkg),
      };
    });
}

function scanPackages() {
  const pkgsDir = path.join(PROJECT_ROOT, 'packages');
  if (!fs.existsSync(pkgsDir)) return [];

  return fs
    .readdirSync(pkgsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const pkg = readJSON(path.join(pkgsDir, e.name, 'package.json'));
      return {
        name: e.name,
        alias: pkg?.name ?? `@project/${e.name}`,
        description: pkg?.description ?? '—',
      };
    });
}

function scanDeps() {
  const rootPkg = readJSON(path.join(PROJECT_ROOT, 'package.json'));
  const allDeps = {
    ...rootPkg?.devDependencies,
    ...rootPkg?.dependencies,
    ...rootPkg?.peerDependencies,
  };
  // Key packages to surface
  const keys = [
    'next',
    'react',
    'typescript',
    'tailwindcss',
    'prisma',
    '@prisma/client',
    'zod',
    'framer-motion',
    'ai',
    'expo',
    'turbo',
    'pnpm',
  ];
  return keys
    .filter((k) => allDeps[k])
    .map((k) => ({ name: k, version: allDeps[k] }));
}

function scanEnvExample() {
  const envFile = path.join(PROJECT_ROOT, '.env.example');
  if (!fs.existsSync(envFile)) return [];

  return fs
    .readFileSync(envFile, 'utf8')
    .split('\n')
    .filter((l) => l.match(/^[A-Z_]+=/) && !l.startsWith('#'))
    .map((l) => {
      const [key] = l.split('=');
      return { key: key.trim(), purpose: '*(fill in)*' };
    });
}

function scanScripts() {
  const rootPkg = readJSON(path.join(PROJECT_ROOT, 'package.json'));
  return Object.entries(rootPkg?.scripts ?? {}).slice(0, 10);
}

// ─── Generator ────────────────────────────────────────────────────────────────

function generateWorkspaceIndex() {
  const apps = scanApps();
  const pkgs = scanPackages();
  const deps = scanDeps();
  const envVars = scanEnvExample();
  const scripts = scanScripts();

  const appsTable =
    apps.length > 0
      ? apps
          .map(
            (a) =>
              `| ${a.name} | \`${a.packageName}\` | ${a.port} | ${a.framework} |`
          )
          .join('\n')
      : '| *(no apps/ folder found)* | | | |';

  const pkgsTable =
    pkgs.length > 0
      ? pkgs
          .map((p) => `| \`${p.name}\` | \`${p.alias}\` | ${p.description} |`)
          .join('\n')
      : '| *(no packages/ folder found)* | | |';

  const depsTable =
    deps.length > 0
      ? deps.map((d) => `| ${d.name} | \`${d.version}\` |`).join('\n')
      : '| *(run cache-build.js from project root)* | |';

  const envTable =
    envVars.length > 0
      ? envVars
          .map((e) => `| \`${e.key}\` | *(fill in)* | *(fill in)* |`)
          .join('\n')
      : '| *(add .env.example to project root)* | | |';

  const scriptsList =
    scripts.length > 0
      ? scripts
          .map(([k, v]) => `# ${k}\npnpm ${k}`)
          .join('\n')
          .slice(0, 500)
      : '# See package.json scripts';

  return `---
generated: ${today()}
update_trigger: dep-bump, new-app, port-change
---

# Workspace Index Cache

> Auto-generated by \`node scripts/cache-build.js\`.
> Load this instead of reading package.json files — saves ~500–1,000 tokens per session.

---

## Apps & Ports

| App | Package | Port | Framework |
|-----|---------|------|-----------|
${appsTable}

---

## Shared Packages

| Package | Alias | Purpose |
|---------|-------|---------|
${pkgsTable}

---

## Key Dependencies

| Package | Version |
|---------|---------|
${depsTable}

---

## Environment Variables

| Variable | Used by | Purpose |
|----------|---------|---------|
${envTable}

---

## Common Commands

\`\`\`bash
${scriptsList}
\`\`\`

---

## Quick-Reference Auth Pattern

> Update this after auth is implemented.

- Session: *(e.g. \`const session = await requireAuth()\`)*
- User ID: *(e.g. \`session.user.id\`)*
- Org scope: *(e.g. \`session.user.organizationId\`)*
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const content = generateWorkspaceIndex();
  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');

  console.log(`✓ Cache built: ${path.relative(PROJECT_ROOT, OUTPUT_FILE)}`);
  console.log(`  Generated: ${today()}`);

  const apps = scanApps();
  const pkgs = scanPackages();
  const envVars = scanEnvExample();
  console.log(
    `  Apps found: ${apps.length}, Packages: ${pkgs.length}, Env vars: ${envVars.length}`
  );
}

main();
