# GateFlow Design System Docs

This is the interactive documentation and component explorer for the GateFlow Design System.

## Architecture

Built with **Next.js 15 (App Router)**, **Tailwind CSS**, and the **Atlassian Design System (ADS)** philosophy. It serves as the single source of truth for:

- `@gateflow/tokens` (Atomic variables)
- `@gateflow/ui` (Primitives)
- `@gateflow/components` (Product patterns)
- `@gateflow/ai` (Agentic UI)

## Local Development

```bash
# From the monorepo root
pnpm dev --filter=design-system
```

## Deployment (Vercel)

The documentation is deployed to [design.gateflow.site](https://design.gateflow.site).

### Configuration

1. **Project Title**: `GateFlow Design System`
2. **Root Directory**: `apps/design-system`
3. **Build Command**: `cd ../.. && pnpm build:design` (or use Turborepo remote caching)
4. **Output Directory**: `.next`
5. **Domain**: Add `design.gateflow.site` and follow Vercel DNS instructions.

### Environment Variables

| Name                   | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Set to `https://design.gateflow.site` for canonical SEO metadata. |

## Localization (RTL/MENA)

The documentation site supports English (LTR) and Arabic (RTL) out of the box.

- Component spacing must use **logical properties** (`ps-*`, `pe-*`, `border-s-*`) to ensure automatic layout mirroring.
- Locale persistence is stored in `gateflow-locale` localStorage.
