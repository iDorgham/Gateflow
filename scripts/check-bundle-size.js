#!/usr/bin/env node
/**
 * check-bundle-size.js — Next.js bundle size guard
 *
 * Reads the Next.js build output and compares against a stored baseline.
 * Fails if any route's JS budget is exceeded.
 *
 * Usage:
 *   node scripts/check-bundle-size.js               # check + compare vs baseline
 *   node scripts/check-bundle-size.js --update      # overwrite baseline with current
 *   node scripts/check-bundle-size.js --report      # print full breakdown (no fail)
 *
 * Baseline stored at: scripts/.bundle-baseline.json
 * Run after: pnpm turbo build --filter=client-dashboard
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASELINE = path.join(__dirname, '.bundle-baseline.json');

// Apps with Next.js builds to check
const APPS = [
  {
    name: 'client-dashboard',
    buildDir: path.join(ROOT, 'apps', 'client-dashboard', '.next'),
    // Total uncompressed chunks across all code-split routes.
    // Individual page First Load JS is far smaller due to code splitting.
    // Gzip ratio ≈ 0.25–0.30x (3601 KB → ~900–1080 KB gzipped).
    budget: {
      total: 4500, // total all-chunks uncompressed (KB)
      page: 500, // single page server bundle max (KB)
    },
  },
  {
    name: 'admin-dashboard',
    buildDir: path.join(ROOT, 'apps', 'admin-dashboard', '.next'),
    budget: { total: 4500, page: 500 },
  },
  {
    name: 'marketing',
    buildDir: path.join(ROOT, 'apps', 'marketing', '.next'),
    budget: { total: 500, page: 200 },
  },
];

// ── Parse .next/ build output ─────────────────────────────────────────────────
function getChunkSizes(buildDir) {
  const staticDir = path.join(buildDir, 'static', 'chunks');
  if (!fs.existsSync(staticDir)) return null;

  let totalKb = 0;
  const chunks = {};

  function walkDir(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walkDir(full);
      } else if (entry.endsWith('.js') && !entry.endsWith('.js.map')) {
        const kb = Math.round(stat.size / 1024);
        chunks[path.relative(staticDir, full)] = kb;
        totalKb += kb;
      }
    }
  }

  walkDir(staticDir);
  return { totalKb, chunks };
}

function getPageSizes(buildDir) {
  // Read pages-manifest.json for page routes
  const pagesManifest = path.join(buildDir, 'server', 'pages-manifest.json');
  const appPathsManifest = path.join(
    buildDir,
    'server',
    'app-paths-manifest.json'
  );

  const pages = {};

  if (fs.existsSync(pagesManifest)) {
    const manifest = JSON.parse(fs.readFileSync(pagesManifest, 'utf8'));
    for (const [route, file] of Object.entries(manifest)) {
      const full = path.join(buildDir, 'server', file);
      if (fs.existsSync(full)) {
        pages[route] = Math.round(fs.statSync(full).size / 1024);
      }
    }
  }

  if (fs.existsSync(appPathsManifest)) {
    const manifest = JSON.parse(fs.readFileSync(appPathsManifest, 'utf8'));
    for (const [route, file] of Object.entries(manifest)) {
      const full = path.join(buildDir, 'server', file);
      if (fs.existsSync(full)) {
        pages[route] = Math.round(fs.statSync(full).size / 1024);
      }
    }
  }

  return pages;
}

// ── Collect current stats ─────────────────────────────────────────────────────
function collectStats() {
  const stats = {};
  for (const app of APPS) {
    if (!fs.existsSync(app.buildDir)) continue;
    const chunks = getChunkSizes(app.buildDir);
    const pages = getPageSizes(app.buildDir);
    if (!chunks) continue;
    stats[app.name] = {
      totalKb: chunks.totalKb,
      chunkCount: Object.keys(chunks.chunks).length,
      pages,
      budget: app.budget,
    };
  }
  return stats;
}

// ── Comparison ────────────────────────────────────────────────────────────────
const THRESHOLD_PCT = 10; // warn if > 10% growth
const FAIL_PCT = 25; // fail if > 25% growth

function compare(current, baseline) {
  const issues = [];
  const info = [];

  for (const [appName, cur] of Object.entries(current)) {
    const base = baseline[appName];

    if (!base) {
      info.push(
        `  ℹ  ${appName}: no baseline — treating as new (${cur.totalKb} KB total)`
      );
      continue;
    }

    const delta = cur.totalKb - base.totalKb;
    const deltaPct =
      base.totalKb > 0 ? Math.round((delta / base.totalKb) * 100) : 0;
    const sign = delta >= 0 ? '+' : '';
    const arrow = delta > 0 ? '▲' : delta < 0 ? '▼' : '→';

    if (deltaPct > FAIL_PCT) {
      issues.push({
        level: 'FAIL',
        msg: `${appName}: total JS ${arrow} ${sign}${delta} KB (${sign}${deltaPct}%) — exceeds ${FAIL_PCT}% threshold\n     Before: ${base.totalKb} KB  →  After: ${cur.totalKb} KB`,
      });
    } else if (deltaPct > THRESHOLD_PCT) {
      issues.push({
        level: 'WARN',
        msg: `${appName}: total JS ${arrow} ${sign}${delta} KB (${sign}${deltaPct}%) — over ${THRESHOLD_PCT}% warning threshold\n     Before: ${base.totalKb} KB  →  After: ${cur.totalKb} KB`,
      });
    } else {
      info.push(
        `  ✓ ${appName}: ${cur.totalKb} KB total (${sign}${delta} KB vs baseline)`
      );
    }

    // Per-app hard budget
    const budget = APPS.find((a) => a.name === appName)?.budget;
    if (budget && cur.totalKb > budget.total) {
      issues.push({
        level: 'FAIL',
        msg: `${appName}: total JS ${cur.totalKb} KB exceeds budget of ${budget.total} KB`,
      });
    }
  }

  return { issues, info };
}

// ── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isUpdate = args.includes('--update');
const isReport = args.includes('--report');

const current = collectStats();

if (Object.keys(current).length === 0) {
  console.log('ℹ  No .next/ build output found. Run pnpm build first.');
  process.exit(0);
}

if (isUpdate) {
  fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2));
  console.log(`✓ Bundle baseline updated:`);
  for (const [app, s] of Object.entries(current)) {
    console.log(`   ${app}: ${s.totalKb} KB (${s.chunkCount} chunks)`);
  }
  process.exit(0);
}

if (isReport) {
  console.log('\n📦 Bundle Size Report\n');
  for (const [app, s] of Object.entries(current)) {
    console.log(`── ${app} ─────────────────────`);
    console.log(`   Total JS:   ${s.totalKb} KB`);
    console.log(`   Chunks:     ${s.chunkCount}`);
    const topPages = Object.entries(s.pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    if (topPages.length) {
      console.log(`   Top pages (server bundle KB):`);
      topPages.forEach(([route, kb]) =>
        console.log(`     ${kb.toString().padStart(5)} KB  ${route}`)
      );
    }
  }
  process.exit(0);
}

// Default: compare vs baseline
if (!fs.existsSync(BASELINE)) {
  console.log('ℹ  No bundle baseline found. Creating baseline now...');
  fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2));
  console.log('✓ Baseline saved. Future runs will compare against this.');
  for (const [app, s] of Object.entries(current)) {
    console.log(`   ${app}: ${s.totalKb} KB`);
  }
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const { issues, info } = compare(current, baseline);

info.forEach((i) => console.log(i));

if (issues.length === 0) {
  console.log('\n✓ Bundle size check passed.\n');
  process.exit(0);
}

console.error('\n📦 Bundle Size Issues:\n');
const fails = issues.filter((i) => i.level === 'FAIL');
const warns = issues.filter((i) => i.level === 'WARN');

warns.forEach((i) => console.warn(`  ⚠️  ${i.msg}`));
fails.forEach((i) => console.error(`  ❌ ${i.msg}`));

if (fails.length > 0) {
  console.error(
    `\n→ Run \`node scripts/check-bundle-size.js --report\` for full breakdown.`
  );
  console.error(
    `→ To update baseline after intentional growth: node scripts/check-bundle-size.js --update\n`
  );
  process.exit(1);
}

// Warns only — exit 0
console.warn(
  `\n→ Review bundle growth. Run --update to accept new size as baseline.\n`
);
