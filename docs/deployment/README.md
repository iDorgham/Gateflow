# GateFlow Deployment Overview

<div align="center">

**Standard operating procedures for deploying GateFlow applications**

_Vercel for web apps, Expo EAS for mobile apps_

[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Expo](https://img.shields.io/badge/Expo-EAS-4630EB?style=for-the-badge&logo=expo)](https://expo.dev)

</div>

---

## App-Specific Guides

| App              | Guide                                                   |
| :--------------- | :------------------------------------------------------ |
| Client Dashboard | [Deployment Guide](docs/deployment/CLIENT_DASHBOARD.md) |
| Admin Dashboard  | [Deployment Guide](docs/deployment/ADMIN_DASHBOARD.md)  |
| Marketing Site   | [Deployment Guide](docs/deployment/MARKETING.md)        |

---

## Mandatory Monorepo Settings

Every app project on Vercel **MUST** have these settings:

| Setting                           | Value                                        | Required |
| :-------------------------------- | :------------------------------------------- | :------- |
| Framework Preset                  | `Next.js`                                    | Yes      |
| Build Command                     | `pnpm run build`                             | Yes      |
| Install Command                   | `pnpm install`                               | Yes      |
| Root Directory                    | App-specific (e.g., `apps/client-dashboard`) | Yes      |
| Include source files outside Root | **CHECKED**                                  | Yes      |

---

## Troubleshooting

| Error                                | Solution                                                  |
| :----------------------------------- | :-------------------------------------------------------- |
| `Module not found: @gate-access/...` | Enable "Include source files outside" checkbox in Vercel  |
| `ERR_PNPM_OUTDATED_LOCKFILE`         | Run `pnpm install` locally, commit `pnpm-lock.yaml`, push |
| `Failed to collect page data`        | Ensure all required env vars set in Vercel dashboard      |

---

## Environment Variables

See [Environment Variables Guide](../guides/ENVIRONMENT_VARIABLES.md) for complete reference.

---

## Related Documentation

| Document                                                    | Description              |
| :---------------------------------------------------------- | :----------------------- |
| [Development Guide](../guides/DEVELOPMENT_GUIDE.md)         | Local setup              |
| [Environment Variables](../guides/ENVIRONMENT_VARIABLES.md) | All env vars             |
| [Vercel Skill](../../.opencode/skills/vercel/SKILL.md)      | Vercel-specific guidance |
