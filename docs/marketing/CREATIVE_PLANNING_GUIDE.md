# GateFlow Creative & Marketing Planning Guide (2026)

This guide defines the standardized methodology for creating high-performance,
AI-driven marketing plans and production structures within the GateFlow
workspace.

---

## 1. The Full-Plan Architecture (YYYY-MM)

Every creative month is organized into a primary production root to ensure
omni-channel consistency and archival reliability.

### Root Directory

`docs/marketing/production/YYYY-MM/`

### Functional Areas

- **`channels/`**: Organic content growth (YouTube, LinkedIn, IG, TikTok, Vimeo).
- **`advertising/`**: Performance ad sets (Meta Ads, Google Ads, LinkedIn Ads).
- **`website/`**: UI/UX updates, hero section copy, and landing page flows.
- **`seo-keyword-vault/`**: Strategic keyword banking and intent mapping.

---

## 2. High-Fidelity Project Folder Structure

Every project folder within these areas must follow this 5-tier architecture:

```text
<project_name>/
├── strategy/           # Funnel Map, SEO Plan, Projections (CTR, CPC)
├── docs/               # SCRIPT.md, STORYTELLING.md, TASK_MANAGER.md
├── video/              # raw/, montage/ (Adobe Project), final/
├── photo/              # raw/ (AI), p-shop/ (Adobe PSD), final/
└── landing-pages/      # Conversion copy and UI/UX assets
```

---

## 3. Creating an Effective Marketing Plan

To generate a new plan, use the following subcommands within the
**`/creative`** workflow:

### Step 1: Initialize Strategy

Use **`/creative plan`** to generate the initial phased roadmap.

- **Goals:** Define the TOFU/MOFU/BOFU funnel distribution.
- **Targeting:** Identify audience segments in **`TARGETING_GENIUS.md`**.

### Step 2: Define Art Direction (Strategic Docs)

The agent automatically generates high-fidelity Art Direction documents:

- **`STORYTELLING.md`**: The narrative hook and "Invisible Sentinel" alignment.
- **`MEDIA_BRIEF.md`**: Camera optics, lighting stacks, and motion vectors.
- **`MOODBOARD.md`**: Visual vibe references and color hex codes.

### Step 3: Generative AI Asset Production

The agent produces technical technical prompts for professional grade tools:

- **Midjourney/DALL-E:** 8K RAW, --cref/--sref for brand consistency.
- **Sora/Luma/Runway:** Start/End frames and motion vectors.
- **VEC (Visual Element Control):** 100ms UI snaps, holographic ripples.

---

## 4. Human-in-the-Loop (HITL) Workflow

While AI handles the strategy, brief generation, and asset components, humans
remain the final curators:

- **Adobe Montage:** Designated in `TASK_MANAGER.md` as **`Human-in-Loop`**.
- **Photoshop Retouching:** Professional PSD work is marked as **`Human-in-Loop`**.
- **Website Implementation:** UI/UX deployment remains a human verification step.

---

## 5. Automation & Verification (Ralph-Creative-Sync)

The **Ralph-Creative-Sync** engine recursively scans your production root:

- It monitors the **`video/final/`** and **`photo/final/`** directories.
- It automatically updates the corresponding **`TASK_MANAGER.md`** to **`[x]  DONE`**
  when final assets are detected.

---

**By following this guide, every GateFlow campaign achieves blockbuster-level
quality with 100% organizational precision.**
