# Sovereign Workspace — Command Router v4.0 (merged `commands` + multi-tool)
# ============================================================
# Documentation mirror only.
# Canonical executable routing source: `.ai/registry/routing/command_routing.json`.
# Multi-tool rankings (former `commands_multi_tool.md`) are appended below under
# **MULTI-TOOL RANKINGS**. Human-readable mirrors only — runtime uses JSON + routers.
# Zero flags. Zero manual paths. Zero ambiguity.
#
# Slash-doc sync (when adding/changing commands in this file):
#   1) Edit THIS file (`.ai/commands/commands.md`) as canonical markdown (includes **MULTI-TOOL RANKINGS** below).
#   2) Push to IDE layers: `bash factory/scripts/core/sync_ide_triple_layer.sh`  
#      (rsync `.ai/commands/` → `.cursor/commands/` + `.antigravity/commands/`, then removes legacy duplicate filenames).
#   3) Or manual: `cp .ai/commands/commands.md .cursor/commands/commands.md` and same for `.antigravity/commands/`.
#   4) Outbound factory mirror (optional): `python3 factory/scripts/core/industrial_mirror_sync.py`
# Do **not** maintain separate `commands-multi-tool.md` / `commands_multi_tool.md` — merged here.
# ============================================================

---

## COMMAND ROUTING TABLE

| Command | Primary Agent | Required Context | Output | Hard Block? |
|---------|--------------|-----------------|--------|------------|
| `/brand` | brand-agent | `.ai/templates/brand-discovery/questions.json` | Guided brand strategy interview output: `content/sovereign/reference/market_positioning.md`, `content/sovereign/reference/brand-voice/*.md`, `.ai/logs/brand-session-[timestamp].json` | No |
| `/brand workshop` | brand-agent | `.ai/templates/brand-discovery/questions.json` | Alias of `/brand` in meeting mode (branding expert + user) | No |
| `/research competitors` | research-agent | `content/sovereign/reference/market_positioning.md` | `content/sovereign/scraped/*/info.md`, `index.json` | No |
| `/scrape all competitors blog` | scraper-agent | `content/sovereign/scraped/index.json` | `scraped/content/blog/` | No |
| `/scrape all competitors projects` | scraper-agent | `content/sovereign/scraped/index.json` | `scraped/content/sovereign/projects/` | No |
| `/scrape all competitors all website` | scraper-agent | `content/sovereign/scraped/index.json` | Full `scraped/` | No |
| `/scrape [name] website` | scraper-agent | `content/sovereign/scraped/index.json`, competitor slug | `scraped/content/pages/` | No |
| `/scrape [name] all website` | scraper-agent | `content/sovereign/scraped/index.json`, competitor slug | Full `scraped/` | No |
| `/sync` | scraper-agent | `content/sovereign/scraped/index.json`, `sync-status.json` per competitor | Delta updates, `.ai/logs/sync-delta.jsonl` | No |
| `/extract brand voice from [source]` | brand-agent | Source text | `content/sovereign/reference/brand-voice/voice_refinement.md` | No |
| `/refine brand voice` | brand-agent | `content/` recent files, `content/sovereign/reference/brand-voice/` | Updated `style_rules.md`, `glossary.md` | No |
| `/create website pages` | creator-agent | Brand voice, keyword maps, positioning | `content/sovereign/website-pages/` | Via `/review` |
| `/create blog posts about [topic]` | creator-agent | Brand voice, keyword maps, topic | `content/sovereign/blog-posts/` | Via `/review` |
| `/create project pages` | creator-agent | Brand voice, project data | `content/sovereign/projects/` | Via `/review` |
| `/create landing pages for [campaign]` | creator-agent | Brand voice, campaign brief | `content/sovereign/landing-pages/` | Via `/review` |
| `/compare sovereign vs competitor [name]` | creator-agent | Sovereign draft + competitor scraped data | `content/sovereign/comparisons/` | Via `/review` |
| `/intel competitor [name]` | research-agent | `content/sovereign/scraped/index.json`, `content/sovereign/scraped/[slug]/info.md`, `content/sovereign/scraped/[slug]/scraped/content/` | `content/sovereign/scraped/[slug]/analysis/intel_brief.md`, `.ai/logs/intelligence-report-[timestamp].jsonl` | No |
| `/intel market snapshot` | research-agent | `content/sovereign/scraped/index.json`, competitor profile + scraped summaries | Cross-competitor trend summary + `.ai/logs/intelligence-report-[timestamp].jsonl` | No |
| `/intel opportunities` | research-agent | `content/sovereign/reference/market_positioning.md`, trend summary, competitor coverage | `content/sovereign/comparisons/opportunity-map-[timestamp].md`, `.ai/logs/intelligence-report-[timestamp].jsonl` | No |
| `/design` | guide-agent | `factory/library/design/README.md` | Lists imported design packs from the design catalog | No |
| `/design list` | guide-agent | `factory/library/design/README.md` | Displays available design packs by provider | No |
| `/design use [pack]` | guide-agent | `factory/library/design/[pack]/design.md` | Selects a design reference for current project | No |
| `/design install [pack]` | guide-agent | `factory/library/design/[pack]/design.md` | Copies selected design into project template scope | No |
| `/polish content in content/` | seo-agent + brand-agent | Draft Markdown, keyword maps, brand voice | Optimized in-place Markdown | Via `/review` |
| `/optimize images in content/` | seo-agent | Images in `content/`, manifest | `assets-seo.json`, WebP refs | Via `/review` |
| `/review` | workflow-agent | Staged `content/` drafts | `.ai/logs/quality-report-[timestamp].json` | No |
| `/approve` | workflow-agent | `.ai/logs/quality-report-[timestamp].json` (all gates passed) | Locked content metadata | Blocked if gates fail |
| `/revise [feedback]` | creator-agent or seo-agent | Feedback text, failing content | Revised Markdown | Via `/review` |
| `/export` | workflow-agent | Approved content (status: approved) | `content/sovereign/outputs/csv-exports/`, `content/sovereign/outputs/cms-packs/` | Blocked if not approved |
| `/archive old content` | workflow-agent | Files > 30 days | `archive/`, `archive-index.json` | No |
| `/memory save` | workflow-agent + memory-manager | Current session state | `.ai/memory/context-cache/` | No |
| `/memory load` | memory-manager | `.ai/memory/context-cache/` | Restored session context | No |
| `/memory clear` | memory-manager | Active session | Cleared temp context | No |
| `/budget check` | guide-agent | Current token usage | Usage report + recommendations | No |
| Command | Subcommand | Agent | Purpose |
| :--- | :--- | :--- | :--- |
| **`/plan`** | `content` | content-planner | Structured discovery interview |
| | `blueprint` | spec-architect | Generates high-density SDD specs |
| | `status` | orchestrator | Real-time phase progress/gap audit |
| | `review` | orchestrator | Strategic alignment vs intent check |
| | `adr` | spec-architect | Auto-generates ADRs with hashes |
| **`/create`** | `content` | creator-agent | Scaffolds content into workspace |
| | `image` | visualize-agent | Generates industrial visual assets |
| | `page` | creator-agent | Builds page structures with locale |
| | `spec` | spec-architect | Generates specs and test fixtures |
| | `docs` | docs-curator | Auto-generates system documentation |
| **`/dev`** | `init` | factory-manager | Env setup and dependency resolution |
| | `implement` | developer-agent | Autonomous spec-governed generation |
| | `test` | integrity-auditor| Multi-tier compliance testing |
| | `fix` | healing-bot | Recursive remediation of drift |
| | `build` | deployment-spec | Compiles and optimizes artifacts |
| **`/audit`** | `health` | integrity-auditor| Industrial health scoring |
| | `content` | creator-agent | Multi-locale consistency audit |
| | `security` | security-auditor | SAST/DAST and secrets scanning |
| | `logs` | orchestrator | Log aggregation and tracing |
| | `seo` | seo-agent | Technical SEO and meta-audit |
| **`/git`** | `auto` | repository-agent | Silent versioning and tagging |
| | `release` | deployment-spec | Sovereign handover and release |
| | `review` | repository-agent | PR consensus and auto-approval |
| | `rollback` | repository-agent | Recovery to stable compliance state |
| | `deploy` | deployment-spec | Shard distribution with routing |
| **`/guide`** | `brainstorm` | master-guide | Multi-agent strategy consensus |
| | `learn` | recursive-engine | Friction-to-skill conversion |
| | `heal` | healing-bot | Predictive structural monitoring |
| | `chaos` | chaos-validator | Stress testing and resilience |
| | `dashboard` | orchestrator | Real-time KPI/Health UI |
| | `tutor` | guide-agent | Interactive pedagogy and onboarding |
| **`/help`** | | guide-agent | usage reference and sovereignty info |
| **`/mat`** | | factory-manager | Interactive workspace materialization — run `bash .ai/scripts/factory_materialize.sh` (or `bash .ai/scripts/bin/materialize.sh`) from repo root | No |

---

## INTENT PARSING RULES

The guide-agent must resolve these ambiguities before routing:

### Scope Resolution
- `/scrape all competitors blog` → scope: ALL entries in `index.json` where `sync_enabled: true`
- `/scrape [name] website` → scope: SINGLE competitor matching `[name]` slug or closest match
- `/create blog posts about [topic]` → topic extracted from command; if multi-word, preserve full phrase
- `/revise [feedback]` → feedback applied to the LAST created/polished content item in `state.json`
- `/plan release` → triggers `.ai/scripts/silent_phase_release.py` to increment version and tag Git without user prompt.

### Competitor Name Matching
1. Exact slug match in `index.json` → use directly
2. Partial name match → use highest confidence match, confirm with user if < 80% confidence
3. No match → ask: "I don't have [name] in the competitor registry. Run `/research competitors` first, or provide the URL directly."

### Missing Context Defaults
| Missing | Default Action |
|---------|---------------|
| `market_positioning.md` empty | Respond: "Your brand foundation isn't set up yet. Run `/brand` to complete a professional brand discovery session first." |
| `brand-voice/style_rules.md` empty | Respond: "Brand voice rules are not defined. Run `/brand` (full session) or `/extract brand voice from [source]` if you have existing copy." |
| No competitor data for `/create` | Generate from brand positioning + keyword research alone |
| No keyword map for `/polish` | Mine keywords from content topic + market positioning |
| No images for `/optimize images` | Report: "No images found in content/. Add images to your draft files first." |

### Plural vs Singular
- `/create blog posts about [topic]` → generate 3 posts by default (short, medium, long-form variants)
- `/scrape all competitors` → all enabled in `index.json`
- Single `/scrape [name]` → one competitor only

---

## COMMAND CHAIN SUGGESTIONS

After every command, guide-agent outputs one of these next steps:

| Completed Command | Suggested Next Step |
|-------------------|---------------------|
| `/brand` | `/research competitors` (or `/extract brand voice from [source]` if existing copy is available) |
| `/research competitors` | `/scrape all competitors blog` |
| `/scrape all competitors blog` | `/sync` or `/create blog posts about [topic]` |
| `/sync` | `/create blog posts about [topic]` or `/compare sovereign vs competitor [name]` |
| `/create *` | `/polish content in content/` |
| `/compare *` | `/create blog posts about [topic gap identified]` |
| `/intel competitor *` | `/compare sovereign vs competitor [name]` or `/create blog posts about [identified gap]` |
| `/intel market snapshot` | `/intel opportunities` |
| `/intel opportunities` | `/create blog posts about [top opportunity]` |
| `/polish content` | `/optimize images in content/` |
| `/optimize images` | `/review` |
| `/review` (passed) | `/plan` |
| `/review` (failed) | `/revise [specific feedback for failed gate]` |
| `/revise *` | `/review` |
| `/approve` | `/export` |
| `/export` | `/sync` or `/archive old content` |
| `/archive old content` | `/memory clear` then next `/create` |
| `/memory save` | Continue with interrupted command |

---

## QUALITY GATE REFERENCE

All gates run in **parallel** during `/review`:

| Gate | Validator | Threshold | Auto-Fix? | On Failure |
|------|-----------|-----------|-----------|------------|
| SEO Score | `seo_optimizer.py` | ≥ 85% | Yes (keyword inject, meta fix) | List gaps |
| Brand Voice | `voice_validator.py` | ≥ 92% | Yes (tone adjust, max 2 retries) | Flag drift points |
| Readability | Flesch-Kincaid | ≥ 65 | Yes (simplify sentences) | List dense paragraphs |
| Image SEO | `image_seo_auditor.py` | 100% | Yes (generate alt, WebP) | List missing images |
| Originality | Semantic similarity | ≤ 15% | Yes (structural shift, max 2 retries) | Flag similar passages |

---

## PIPELINE ENFORCEMENT

```
VALID FLOW:
/research competitors
  └→ /scrape all competitors blog
       └→ /sync
            └→ /create blog posts about [topic]
                 └→ /polish content in content/
                      └→ /optimize images in content/
                           └→ /review
                                └→ /approve
                                     └→ /export
                                          └→ /archive old content

BLOCKED FLOWS (hard stops):
  /export     ← requires /approve first
  /approve    ← requires /review (all gates passed) first
  /sync       ← requires valid index.json + ≥1 competitor folder
  /optimize   ← requires images in content/ files
```

---

## COMMAND OUTPUT FORMAT

Every command response follows this structure:

```
✅ [Command completed]
→ [What was done — specific, quantified]
→ [Where output was saved]
→ [Any warnings or flags]

💡 Suggested Next Step:
• [Primary recommendation with exact command]
• [Optional alternative command]
```

Example:
```
✅ Sync complete
→ Checked 4 competitors. Detected 6 new blog posts, 2 new projects.
→ Scraped and saved to content/sovereign/scraped/*/scraped/content/
→ Updated sync-status.json for all 4 competitors. Logged to .ai/logs/sync-delta.jsonl.

💡 Suggested Next Step:
• /create blog posts about [topic from gap analysis]
• /compare sovereign vs competitor [name with most new content]
```

---

## MULTI-TOOL RANKINGS

*Merged from the former `commands_multi_tool.md` — single canonical doc is **`commands.md`**.*

Note: canonical executable source is `.ai/registry/routing/command_routing.json`.
Runtime implementation source is `.ai/scripts/tool_router_v2.py` (with `.ai/scripts/tool-router.py` compatibility shim).

Registry references:
- Agent registry: `.ai/registry/agents.registry.json`
- Sub-agent registry: `.ai/registry/subagents.registry.json`
- Skill registry: `.ai/registry/skills.registry.json`
- Legacy compatibility maps: `.ai/compat/*.legacy-map.json`

**Purpose:** Map commands to optimal tool rankings based on command type and tool strengths.

**Format:** Command type → [Rank 1, Rank 2, Rank 3, Rank 4+]

### Content Creation Commands

#### /create blog-posts
- **Ranking:** Copilot > Codex > Gemini > Qwen
- **Optimization:** Quality over speed
- **Why Copilot:** Content quality matters most (94% brand voice)
- **Why Codex:** Fast, cheap, nearly same quality (91% brand voice)

#### /create website pages
- **Ranking:** Copilot > Gemini > Codex > Qwen
- **Optimization:** Quality-balanced
- **Why Copilot:** Overall quality + brand alignment
- **Why Gemini:** Large context for complex structures

#### /create landing pages
- **Ranking:** Copilot > Gemini > Codex > Qwen
- **Optimization:** Quality over speed
- **Why Copilot:** High-quality copy + branding critical

#### /create project pages
- **Ranking:** Copilot > Codex > Gemini > Qwen
- **Optimization:** Quality + speed balance
- **Why Copilot:** Portfolio content quality important

### Content Optimization Commands

#### /polish content
- **Ranking:** Copilot > Codex > Gemini > Qwen
- **Optimization:** Quality over speed
- **Why Copilot:** Refinement requires brand voice understanding (94%)

#### /optimize images
- **Ranking:** Gemini > Codex > Copilot > Qwen
- **Optimization:** Multimodal required
- **Why Gemini:** Native image processing (1M context)
- **Why Codex:** Fast image optimization fallback

#### /extract brand voice
- **Ranking:** Copilot > Gemini > Codex > Qwen
- **Optimization:** Quality over speed
- **Why Copilot:** Complex text analysis + nuance understanding

#### /refine brand voice
- **Ranking:** Copilot > Gemini > Codex > Qwen
- **Optimization:** Quality over speed

### Analysis & Comparison Commands

#### /research competitors
- **Ranking:** Gemini > Copilot > Codex > Qwen
- **Optimization:** Context over speed
- **Why Gemini:** Large context (1M tokens) for analyzing many competitors

#### /scrape all competitors blog
- **Ranking:** Qwen > Codex > Copilot > Gemini
- **Optimization:** Speed + cost
- **Why Qwen:** Bulk processing, cheapest for large volumes

#### /scrape all competitors projects
- **Ranking:** Qwen > Codex > Copilot > Gemini
- **Optimization:** Speed + cost

#### /compare sovereign vs competitor
- **Ranking:** Gemini > Copilot > Codex > Qwen
- **Optimization:** Quality + context
- **Why Gemini:** Large context for detailed comparisons

#### /intel competitor
- **Ranking:** Gemini > Copilot > Codex > Qwen
- **Optimization:** Context-heavy analysis
- **Why Gemini:** Best for multi-source synthesis across profile + scraped data

#### /intel market snapshot
- **Ranking:** Gemini > Copilot > Codex > Qwen
- **Optimization:** Context over speed
- **Why Gemini:** Large-context pattern mining across many competitors

#### /intel opportunities
- **Ranking:** Copilot > Gemini > Codex > Qwen
- **Optimization:** Decision quality
- **Why Copilot:** Stronger prioritization and recommendation narrative

### Administrative Commands

#### /review
- **Ranking:** Copilot > Gemini > Codex > Qwen
- **Optimization:** Quality over speed

#### /approve
- **Ranking:** Copilot > Codex > Gemini > Qwen
- **Optimization:** Quality over speed

#### /export
- **Ranking:** Qwen > Codex > Copilot > Gemini
- **Optimization:** Speed + cost

#### /archive old content
- **Ranking:** Qwen > Codex > Copilot > Gemini
- **Optimization:** Speed + cost

#### /sync
- **Ranking:** Qwen > Codex > Copilot > Gemini
- **Optimization:** Speed + cost

### Fallback Strategies

#### Quality-First (Default)
Pattern: Copilot > Codex > Gemini > Qwen
- Examples: /create *, /polish *, /extract *, /review, /approve
- Chain: Copilot (quality) → Codex (fast) → Gemini (context) → Qwen (fallback)

#### Context-Heavy
Pattern: Gemini > Copilot > Codex > Qwen
- Examples: /research, /compare, /intel competitor, /intel market snapshot
- Chain: Gemini (1M context) → Copilot (quality) → Codex (fast) → Qwen (fallback)

#### Decision-Scoring
Pattern: Copilot > Gemini > Codex > Qwen
- Examples: /intel opportunities
- Chain: Copilot (decision quality) → Gemini (context) → Codex (fast) → Qwen (fallback)

#### Speed/Cost
Pattern: Qwen > Codex > Copilot > Gemini
- Examples: /scrape *, /export, /archive, /sync
- Chain: Qwen (cheap) → Codex (fast) → Copilot (quality) → Gemini (fallback)

#### Multimodal
Pattern: Gemini > Codex > Copilot > Qwen
- Examples: /optimize images
- Chain: Gemini (native) → Codex (support) → others (fallback)

#### Default (Unknown)
- Ranking: Copilot > Codex > Gemini > Qwen
- Reasoning: Most reliable general-purpose

*Multi-tool rankings version: 1.0 · Owner: guide-agent · Merged into `commands.md` 2026-05-01*

---

## TEMPLATE COMMAND MAP

Use these command templates for each content blueprint:

- Blog Post: `.ai/commands/templates/blog_post.md`
- Website Page: `.ai/commands/templates/website_page.md`
- Project Page: `.ai/commands/templates/project_page.md`
- Landing Page: `.ai/commands/templates/landing_page.md`
- Opportunity Gap Blog: `.ai/commands/templates/opportunity_gap_blog.md`
- Competitor Comparison Page: `.ai/commands/templates/competitor_comparison_page.md`
- Campaign Landing Variant: `.ai/commands/templates/campaign_landing_variant.md`
- Design Catalog: `.ai/commands/templates/design.md`
