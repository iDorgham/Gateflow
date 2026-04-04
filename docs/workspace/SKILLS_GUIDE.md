# GateFlow Workspace — Comprehensive Skills Guide

Welcome to the **GateFlow Skills** directory. This guide provides an exhaustive list of the 83 specialized capabilities used by our AI agents to maintain code quality, design consistency, and operational safety.

---

## 🛠 How Skills Work

Skills are **instruction-rich directories** that extend the model's base knowledge with repo-specific patterns.

- **Discovery**: Agents invoke `using-superpowers` or `find-skills` to proactively discover the right skill for a task.
- **Injection**: When a skill is matched, its instructions, templates, and rules are injected into the agent's context.

---

## 📊 Skill Priority & Usage Table

Organized from **Tier 1 (Critical)** to **Tier 4 (Utility)** based on development frequency.

| Tier  | Category      | Skill                    | Description                                          | Usage % |
| :---- | :------------ | :----------------------- | :--------------------------------------------------- | :------ |
| **1** | **Workflow**  | **`workspace-guide`**    | The "brain" behind `/guide` and state assessment.    | 100%    |
| **1** | **Planning**  | **`planner`**            | Logic for generating multi-phase development plans.  | 100%    |
| **1** | **Execution** | **`dev-guide`**          | Standard implementation rituals (TDD, red-to-green). | 95%     |
| **1** | **Prompts**   | **`prompt-writer`**      | Writing high-fidelity AI prompts for `/dev`.         | 90%     |
| **1** | **Limits**    | **`cli-limits`**         | Safeguarding AI tool usage and 80% rule compliance.  | 85%     |
| **2** | **Frontend**  | **`ads-ui-styling`**     | Core ADS design system tokens and compliance logic.  | 80%     |
| **2** | **Fullstack** | **`api`**                | Next.js App Router patterns, auth, and Zod.          | 75%     |
| **2** | **Database**  | **`database`**           | Prisma queries, multi-tenancy, and soft-deletes.     | 75%     |
| **2** | **Animation** | **`uiux-animator`**      | Premium Framer Motion & Tailwind transitions.        | 70%     |
| **2** | **Security**  | **`security`**           | RBAC, data isolation, and intrusion prevention.      | 65%     |
| **3** | **Mobile**    | **`mobile`**             | React Native, Expo SDK, and hardware access.         | 40%     |
| **3** | **SEO**       | **`seo-content`**        | Writing keyword-optimized landing copy.              | 35%     |
| **3** | **i18n**      | **`i18n`**               | Managing Arabic (RTL) vs English (LTR) locales.      | 30%     |
| **3** | **System**    | **`system-invariants`**  | Logic for enforcing deep repo-wide constraints.      | 25%     |
| **4** | **Content**   | **`excel-spreadsheets`** | Automated parsing and generation of .xlsx files.     | 10%     |
| **4** | **Special**   | **`svg-animation`**      | Drawing and animating complex vector assets.         | 5%      |
| **4** | **Exports**   | **`pdf-analytics`**      | Generating high-fidelity analytical PDF reports.     | 5%      |

---

## ⚡ Domain Breakdown (Grouped List)

### 🚀 Core & Workflow

- **`workspace-guide`**: Full-repo context loader; runs pre/post task checks.
- **`planner`**: Evaluates feasibility and breaks initiatives into phases.
- **`dev-guide`**: Enforces the Ralph Loop (Branch → TDD → Code → Verify → Commit).
- **`prompt-writer`**: Formulates role-specific prompts for different models (Claude vs Gemini).
- **`cli-limits`**: Prevents overage by tracking usage across all CLI tools.
- **`cli-memory`**: Summarizes logs into durable tool-specific "memory" files.

### 🎨 Design & UI (ADS)

- **`ads-typography`**: Heading scales, font weights, and spacing.
- **`ads-elevation-shadows`**: Handling layout layers and z-index depth.
- **`ads-dynamic-tables`**: Patterns for high-density enterprise data grids.
- **`ads-tagging`**: Guidelines for status badges and relational chips.
- **`ads-iconography`**: Strict rules for Lucide vs Custom SVG icon usage.
- **`ui-ux-pro-max`**: A massive design database for 50+ styles and 21 palettes.

### 🔒 Backend & Security

- **`api-gateway`**: Global rate limiting, CORS, and request sanitation.
- **`rbac`**: Multi-layered permission logic (Tenant vs Global admin).
- **`data-privacy`**: Implementing strict GDPR and PII masking rules.
- **`qr-crypto`**: Cryptographic logic for secure, expiring QR codes.
- **`prisma-performance`**: Index optimization and query profiling for large datasets.

### 📱 Mobile & Offline

- **`expo-offline-sync`**: Handling optimistic updates and background sync.
- **`expo-mobile-optimization`**: Battery-saving and RAM-conscious patterns.
- **`property-domain`**: Specialized logic for resident-property relationships.

### 📊 Marketing & Output

- **`seo-research`**: Keyword gap analysis and competitive SERP audits.
- **`creative-director`**: High-level brand strategy and video script architecture.
- **`content-creation`**: Standards for landing pages and high-converting blogs.
- **`pdf-tables`**: Logic for high-density document rendering.

---

## 🛡 Skill Compliance Checklist

When using any skill, the agent MUST verify:

- [ ] **Contract Alignment**: Does this change violate `CONTRACTS.md`?
- [ ] **Design Parity**: Are we using the correct `token()` from `ads-spacing`?
- [ ] **Security First**: Is the query scoped via `organizationId`?
- [ ] **Verified Result**: Did the verification script in the skill pass?

---

> [!NOTE]
> This guide is dynamically referenced by the **`/guide`** command. If you add a new skill, ensure its `SKILL.md` contains a clear `name` and `description` in the YAML frontmatter and it will be auto-indexed in the next doc sync.
