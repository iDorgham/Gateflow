# CONTEXT: marketing_rebuild_dashboard_parity

Frozen snapshot for AI execution — marketing design-system alignment (not schema work).

## Apps & packages

| Name             | Path                    | Role                                                                        |
| ---------------- | ----------------------- | --------------------------------------------------------------------------- |
| marketing        | `apps/marketing`        | Next 15, port 3000, `@gate-access/ui` workspace dep                         |
| client-dashboard | `apps/client-dashboard` | Reference for shell patterns                                                |
| ui               | `packages/ui`           | `src/globals.css`, `src/tokens.ts`, shadcn components, `tailwind.config.ts` |

## Key files (marketing)

- `apps/marketing/app/globals.css` — current large `--ds-*` block
- `apps/marketing/tailwind.config.ts`
- `apps/marketing/app/[locale]/layout.tsx`, `app/providers.tsx`
- `apps/marketing/components/nav.tsx`, `footer.tsx`, `components/sections/*`

## Key files (canonical UI)

- `packages/ui/src/globals.css`
- `packages/ui/src/index.ts` / component exports
- `packages/ui/tailwind.config.ts`

## i18n

- Locales: `en`, `ar-EG` (`apps/marketing/i18n-config.ts`)
- Dictionaries under marketing `locales/` as existing

## Env (no secrets in repo)

- `NEXT_PUBLIC_SITE_URL` — used for metadata base in layout

## Out of scope for this plan

- Prisma / API / contact pipeline rewrites
- Domain or analytics provider changes
