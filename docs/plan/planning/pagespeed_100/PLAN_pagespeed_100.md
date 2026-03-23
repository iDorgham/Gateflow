# PLAN: Google PageSpeed 100% Mastery

Initiative: `pagespeed_100`
Goal: 100/100 Google PageSpeed score (Mobile & Desktop) across all GateFlow routes.

## 📈 Status Check
- **Current**: Unknown (Needs Baseline)
- **Target**: 100/100
- **Team**: `perf` (Gemini, Opencode, Kilo)

## 🗺️ Phases

### Phase 1: Lighthouse CI & Automated Baselines
- **Goal**: Establish a repeatable performance measurement pipeline.
- **Deliverables**:
  - [ ] GitHub Action for Lighthouse CI.
  - [ ] PageSpeed Insights API integration for public routes.
  - [ ] Performance Budget (Budget.json).

### Phase 2: Asset Overhaul (LCP & CLS Fixes)
- **Goal**: Resolve all image and font-related bottlenecks.
- **Deliverables**:
  - [ ] `next/image` migration for all remaining static/remote assets.
  - [ ] Font swapping strategy (zero layout shift).
  - [ ] SVG optimization & Icon sprite generation.

### Phase 3: Critical Path & Streaming
- **Goal**: Optimize Time to First Byte (TTFB) and Total Blocking Time (TBT).
- **Deliverables**:
  - [ ] Suspense boundaries for dashboard high-density charts.
  - [ ] Server Component data fetching parallelization.
  - [ ] Critical CSS extraction.

### Phase 4: High-Density UI Polish
- **Goal**: Maintain 100/100 even with complex data visualizations.
- **Deliverables**:
  - [ ] Recharts dynamic imports.
  - [ ] Table row virtualization for large logs.
  - [ ] Bundle size reduction (shaking heavy deps).

### Phase 5: Final Audit & 100/100 Certification
- **Goal**: Verify and lock in the perfect score.
- **Deliverables**:
  - [ ] Production benchmarks on Vercel Edge.
  - [ ] Mobile/Desktop certification report.
  - [ ] Regression testing guide.

---

## 🛠️ Performance Mandate
Every Pull Request must undergo a `/clis team perf` review if performance scores drop by > 2 points.
