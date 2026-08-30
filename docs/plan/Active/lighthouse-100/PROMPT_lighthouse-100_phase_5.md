# PROMPT — lighthouse-100 — Phase 5: Admin Dashboard & CI Hard-Gate Enforcement

**Initiative:** `lighthouse-100`  
**Phase:** 5 of 5  
**Primary Role:** DevOps / Architecture  
**Preferred Tool:** Kiro / Claude  

---

## 🎯 Phase Goal

Optimize `apps/admin-dashboard` (`https://admin.gateflow.site`), configure hard-gated Lighthouse CI assertions (`minScore: 0.98`) across all 5 web apps, embed the Performance Contract into documentation, and complete final certification.

---

## 🛠️ Step-by-Step Implementation Instructions

1. **`apps/admin-dashboard` Optimization**:
   - Optimize global tenant metrics grid, organization switcher dialog, and SuperAdmin audit log streams.
   - Dynamically load audit ledger explorer and global barrier telemetry maps.
2. **Lighthouse CI Hard-Gate Configuration**:
   - Update `.lighthouserc.js` or GitHub Actions workflow to enforce strict scoring assertions:
     - `categories:performance`: `error` with `minScore: 0.98` (target 1.0)
     - `categories:accessibility`: `error` with `minScore: 0.95`
     - `categories:best-practices`: `error` with `minScore: 1.0`
     - `categories:seo`: `error` with `minScore: 1.0`
     - `cumulative-layout-shift`: `error` with `maxNumericValue: 0.01`
     - `largest-contentful-paint`: `error` with `maxNumericValue: 1500`
3. **Documentation & Performance Contract**:
   - Add "Performance Contract" section to [DESIGN.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/DESIGN.md) and top-level README.
   - Update [PRD.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/reference/product/PRD.md), [CHANGELOG.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/CHANGELOG.md), and [FEATURE_LOG.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/reference/product/FEATURE_LOG.md).
4. **Final Monorepo Verification**:
   - Execute `pnpm preflight` and full turbo build across all applications.

---

## 🧪 Acceptance Criteria

- [ ] All 5 web applications pass automated Lighthouse CI at Performance $\ge 98$ (100 in production runs).
- [ ] `.lighthouserc.js` configured to block regressions in CI.
- [ ] `pnpm preflight` passes with zero errors or warnings.
- [ ] PRD, FEATURE_LOG, and CHANGELOG updated.
