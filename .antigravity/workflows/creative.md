---
description: Run the GateFlow Social Media & Media Production Team for
  AI-driven planning and asset generation.
---

# /creative Workflow — Social Media & Media Production

Use this workflow to plan and produce creative social media content for
GateFlow using AI generative tools.

### `/creative-ideas [<vibe>]`

Generate a list of creative social media ideas with messages and AI prompts.

- **Vibe:** 'High-Tech', 'Lifestyle', 'Urgent', 'Educational'.

### `/creative plan [<target>]`

Generate a phased, comprehensive multi-platform campaign.

- **`plan`**: current month strategy.
- **`plan next month`**: YYYY-MM+1 strategic setup.
- **`plan next 3 month`**: Quarterly roadmap and high-level calendar.

Each plan is executed in **Phases**:

1. **Strategy:** Platform choice, messaging, and ad-mix.
2. **Production:** Folder structures, docs, and brief sets.
3. **Generation:** AI-native prompts for all visual assets.
4. **Verification:** Automated status syncs.
5. **HITL:** Montage work is clearly marked as `[ ] [video/montage/] - Human-in-Loop`.

## 1. Consultation & Decision Phase

- **Collaboration Check:** Ask the user: "HITL Collaborative (You verify
  strategic choices) or Autonomous (I execute according to DNA)?"
- **Creative Duel:** Present at least **two distinct visual/strategic options**
  for the core campaign (e.g., "Cinematic High-Tech" vs. "Real-World Impact").
- **Brand Alignment:** Confirm if the chosen direction perfectly matches the
  "Invisible Sentinel" archetype.

## 2. Strategic Full-Funnel Planning Phase

- Analyze the user's request (e.g., "Full-funnel campaign," "Scale lead gen").
- **Output:** A comprehensive Marketing Roadmap with:
  - **Funnel Map:** TOFU/MOFU/BOFU channel and content distribution.
  - **SEO & Search Strategy:** Keyword research and search intent mapping.
  - **Lead Generation:** Gated assets, landing page copy, and CRM hooks.
  - **Budget & Performance:** Expected CTR, CPC, and CPL projections.

## 3. Media & Performance Production Phase

For each content piece and ad variant, generate a **Production Brief**:

- **Video Brief:** AI script, cinematic specs, and moodboard storytelling.
- **Image/Ad Brief:** High-fidelity composition and performance-ad copy.
- **Landing Page/Site Brief:** Copy, meta-titles, and UI components.
- **Brand DNA Integration:** Correct usage of Deep Navy, Cyan, and Orange.

## 4. Generative AI Asset Phase

Generate the technical technical prompts for AI tools:

- **Midjourney/DALL-E:** 8K RAW, --cref/--sref for brand consistency.
- **Sora/Luma/Runway:** Start/End frames and motion vectors.
- **VEC (Visual Element Control):** 100ms UI snaps, holographic ripples.

## 5. Executive Production Setup (YYYY-MM)

For every creative month, create the main production root:
`docs/guides/marketing/production/YYYY-MM/`

Organize projects under their respective functional areas:

- `production/YYYY-MM/channels/<platform>/<project_name>/`
- `production/YYYY-MM/advertising/<platform_ads>/<ad_set_name>/`
- `production/YYYY-MM/website/<page_name>/`
- `production/YYYY-MM/seo-keyword-vault/`

Inside each project folder, maintain this standardized high-fidelity structure:

1. **strategy/**: Funnel Map, SEO Plan, Targeting, and Expected Results.
2. **docs/**: STORYTELLING.md, SCRIPT.md, BLOG.md, TASK_MANAGER.md.
3. **video/**: Subfolders for raw, montage (Adobe), and final 4K exports.
4. **photo/**: Subfolders for raw (AI), p-shop (Adobe), and final images.
5. **landing-pages/**: Copy, UI assets, and conversion flow logic.

## 6. Verification Mode (Ralph-Creative-Sync)

- Recursively scan the `YYYY-MM` production root across all functional areas.
- Update tracking via `TASK_MANAGER.md` based on final asset readiness.

## 7. Performance & Roadmap Review

- Present a summary of the full-funnel strategy.
- Provide direct links to the Funnel Map and Performance Projections.
- Highlight Human-in-Loop (HITL) needs for website updates or montage.
