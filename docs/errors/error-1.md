❯ pnpm preflight

> gate-access@0.1.0 preflight /Users/Dorgham/Documents/Work/Devleopment/Gate-Access
> turbo lint && turbo typecheck && turbo test

╭───────────────────────────────────────────────────────────────────────────╮
│                                                                           │
│                    Update available v2.8.13 ≫ v2.8.16                     │
│    Changelog: https://github.com/vercel/turborepo/releases/tag/v2.8.16    │
│           Run "pnpm dlx @turbo/codemod@latest update" to update           │
│                                                                           │
│          Follow @turborepo for updates: https://x.com/turborepo           │
╰───────────────────────────────────────────────────────────────────────────╯
• turbo 2.8.13
• Packages in scope: @gate-access/api-client, @gate-access/config, @gate-access/db, @gate-access/i18n, @gate-access/types, @gate-access/ui, admin-dashboard, client-dashboard, marketing, resident-mobile, resident-portal, scanner-app
• Running lint in 12 packages
• Remote caching disabled
@gate-access/ui:lint: cache miss, executing 0e50b7bb1eca3e46
marketing:lint: cache miss, executing 07f601cc35e6c63b
resident-mobile:lint: cache miss, executing 7ddd64e7d01ac6e9
scanner-app:lint: cache miss, executing d7fc921aff49e5cb
@gate-access/i18n:lint: cache hit, replaying logs bbd75c9491673054
@gate-access/config:lint: cache hit, replaying logs b8690b3700900470
@gate-access/api-client:lint: cache hit, replaying logs 086ca7dc017bcd2f
@gate-access/config:lint: 
@gate-access/i18n:lint: 
@gate-access/config:lint: > @gate-access/config@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/config
@gate-access/api-client:lint: 
@gate-access/api-client:lint: > @gate-access/api-client@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/api-client
@gate-access/i18n:lint: > @gate-access/i18n@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/i18n
@gate-access/i18n:lint: > eslint src/
@gate-access/i18n:lint: 
@gate-access/config:lint: > eslint .
@gate-access/config:lint: 
@gate-access/i18n:lint: Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.
@gate-access/api-client:lint: > eslint src/
@gate-access/api-client:lint: 
@gate-access/api-client:lint: Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.
@gate-access/config:lint: Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.
@gate-access/types:lint: cache hit, replaying logs ddfd4a5f50593294
@gate-access/types:lint: 
@gate-access/types:lint: > @gate-access/types@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/types
@gate-access/types:lint: > eslint src/
@gate-access/types:lint: 
@gate-access/types:lint: Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.
@gate-access/db:lint: cache miss, executing 769d1bf6028969f5
client-dashboard:lint: cache miss, executing 235315232729d252
@gate-access/ui:lint: 
admin-dashboard:lint: cache miss, executing 6b38317b06462135
resident-portal:lint: cache miss, executing 9df3c0974b4a80fe
marketing:lint: 
resident-mobile:lint: 
scanner-app:lint: 
@gate-access/db:lint: 
client-dashboard:lint: 
admin-dashboard:lint: 
resident-portal:lint: 
@gate-access/ui:lint: 
@gate-access/ui:lint: > @gate-access/ui@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/ui
@gate-access/ui:lint: > eslint src/
@gate-access/ui:lint: 
resident-mobile:lint: 
resident-mobile:lint: > resident-mobile@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/resident-mobile
resident-mobile:lint: > expo lint
resident-mobile:lint: 
marketing:lint: 
marketing:lint: > marketing@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/marketing
marketing:lint: > next lint
marketing:lint: 
@gate-access/db:lint: 
@gate-access/db:lint: > @gate-access/db@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/db
@gate-access/db:lint: > eslint src/
@gate-access/db:lint: 
client-dashboard:lint: 
client-dashboard:lint: > client-dashboard@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard
client-dashboard:lint: > next lint
client-dashboard:lint: 
scanner-app:lint: 
scanner-app:lint: > scanner-app@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/scanner-app
scanner-app:lint: > expo lint
scanner-app:lint: 
resident-portal:lint: 
resident-portal:lint: > resident-portal@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/resident-portal
resident-portal:lint: > next lint
resident-portal:lint: 
admin-dashboard:lint: 
admin-dashboard:lint: > admin-dashboard@0.1.0 lint /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/admin-dashboard
admin-dashboard:lint: > next lint
admin-dashboard:lint: 
resident-mobile:lint: env: load .env.local
resident-mobile:lint: env: export EXPO_PUBLIC_API_URL
resident-mobile:lint: Using legacy ESLint config. Consider upgrading to flat config.
scanner-app:lint: env: load .env
scanner-app:lint: env: export EXPO_PUBLIC_API_URL REACT_NATIVE_PACKAGER_HOSTNAME EXPO_PUBLIC_QR_SECRET
scanner-app:lint: Using legacy ESLint config. Consider upgrading to flat config.
@gate-access/ui:lint: =============
@gate-access/ui:lint: 
@gate-access/ui:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
@gate-access/ui:lint: 
@gate-access/ui:lint: You may find that it works just fine, or you may not.
@gate-access/ui:lint: 
@gate-access/ui:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
@gate-access/ui:lint: 
@gate-access/ui:lint: YOUR TYPESCRIPT VERSION: 5.9.3
@gate-access/ui:lint: 
@gate-access/ui:lint: Please only submit bug reports when using the officially supported version.
@gate-access/ui:lint: 
@gate-access/ui:lint: =============
@gate-access/db:lint: =============
@gate-access/db:lint: 
@gate-access/db:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
@gate-access/db:lint: 
@gate-access/db:lint: You may find that it works just fine, or you may not.
@gate-access/db:lint: 
@gate-access/db:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
@gate-access/db:lint: 
@gate-access/db:lint: YOUR TYPESCRIPT VERSION: 5.9.3
@gate-access/db:lint: 
@gate-access/db:lint: Please only submit bug reports when using the officially supported version.
@gate-access/db:lint: 
@gate-access/db:lint: =============
@gate-access/db:lint: Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.
marketing:lint: =============
marketing:lint: 
marketing:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
marketing:lint: 
marketing:lint: You may find that it works just fine, or you may not.
marketing:lint: 
marketing:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
marketing:lint: 
marketing:lint: YOUR TYPESCRIPT VERSION: 5.9.3
marketing:lint: 
marketing:lint: Please only submit bug reports when using the officially supported version.
marketing:lint: 
marketing:lint: =============
admin-dashboard:lint: =============
admin-dashboard:lint: 
admin-dashboard:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
admin-dashboard:lint: 
admin-dashboard:lint: You may find that it works just fine, or you may not.
admin-dashboard:lint: 
admin-dashboard:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
admin-dashboard:lint: 
admin-dashboard:lint: YOUR TYPESCRIPT VERSION: 5.9.3
admin-dashboard:lint: 
admin-dashboard:lint: Please only submit bug reports when using the officially supported version.
admin-dashboard:lint: 
admin-dashboard:lint: =============
client-dashboard:lint: =============
client-dashboard:lint: 
client-dashboard:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
client-dashboard:lint: 
client-dashboard:lint: You may find that it works just fine, or you may not.
client-dashboard:lint: 
client-dashboard:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
client-dashboard:lint: 
client-dashboard:lint: YOUR TYPESCRIPT VERSION: 5.9.3
client-dashboard:lint: 
client-dashboard:lint: Please only submit bug reports when using the officially supported version.
client-dashboard:lint: 
client-dashboard:lint: =============
resident-portal:lint: =============
resident-portal:lint: 
resident-portal:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
resident-portal:lint: 
resident-portal:lint: You may find that it works just fine, or you may not.
resident-portal:lint: 
resident-portal:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
resident-portal:lint: 
resident-portal:lint: YOUR TYPESCRIPT VERSION: 5.9.3
resident-portal:lint: 
resident-portal:lint: Please only submit bug reports when using the officially supported version.
resident-portal:lint: 
resident-portal:lint: =============
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/(dashboard)/analytics/page.tsx
admin-dashboard:lint: 113:9  Warning: 'totalOrgs' is assigned a value but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/(dashboard)/audit-logs/page.tsx
admin-dashboard:lint: 279:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 279:72  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 280:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 282:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/(dashboard)/authorization-keys/authorization-keys-client.tsx
admin-dashboard:lint: 60:10  Warning: 'loading' is assigned a value but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/(dashboard)/gates/page.tsx
admin-dashboard:lint: 14:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 108:23  Warning: 'totalInactive' is assigned a value but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 108:38  Warning: 'totalDeleted' is assigned a value but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/(dashboard)/page.tsx
admin-dashboard:lint: 42:5  Warning: 'scansWeek' is assigned a value but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 43:5  Warning: 'scansMonth' is assigned a value but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/(dashboard)/projects/page.tsx
admin-dashboard:lint: 93:23  Warning: 'totalArchived' is assigned a value but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/(dashboard)/scans/page.tsx
admin-dashboard:lint: 9:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 10:3  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 11:3  Warning: 'ArrowUpRight' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 27:3  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 28:3  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/api/admin/analytics/route.test.ts
admin-dashboard:lint: 18:34  Warning: Require statement not part of import statement.  @typescript-eslint/no-var-requires
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/api/admin/authorization-keys/route.ts
admin-dashboard:lint: 8:27  Warning: Require statement not part of import statement.  @typescript-eslint/no-var-requires
admin-dashboard:lint: 14:26  Warning: Require statement not part of import statement.  @typescript-eslint/no-var-requires
admin-dashboard:lint: 67:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 68:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/api/admin/finance/route.test.ts
admin-dashboard:lint: 18:34  Warning: Require statement not part of import statement.  @typescript-eslint/no-var-requires
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/api/admin/health/route.test.ts
admin-dashboard:lint: 20:34  Warning: Require statement not part of import statement.  @typescript-eslint/no-var-requires
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/api/admin/organizations/route.test.ts
admin-dashboard:lint: 15:34  Warning: Require statement not part of import statement.  @typescript-eslint/no-var-requires
admin-dashboard:lint: 
admin-dashboard:lint: ./src/app/[locale]/api/admin/users/route.test.ts
admin-dashboard:lint: 13:34  Warning: Require statement not part of import statement.  @typescript-eslint/no-var-requires
admin-dashboard:lint: 
admin-dashboard:lint: ./src/components/Sidebar.tsx
admin-dashboard:lint: 41:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 
admin-dashboard:lint: ./src/components/monitoring/MonitoringClient.tsx
admin-dashboard:lint: 9:3  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 10:3  Warning: 'Building2' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 11:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 12:3  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/components/users/UsersClient.tsx
admin-dashboard:lint: 51:38  Warning: 'locale' is defined but never used. Allowed unused args must match /^_/u.  @typescript-eslint/no-unused-vars
admin-dashboard:lint: 
admin-dashboard:lint: ./src/lib/i18n/i18n.ts
admin-dashboard:lint: 20:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 30:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 31:6  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 55:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 56:6  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
admin-dashboard:lint: 
admin-dashboard:lint: info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
resident-mobile:lint: =============
resident-mobile:lint: 
resident-mobile:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
resident-mobile:lint: 
resident-mobile:lint: You may find that it works just fine, or you may not.
resident-mobile:lint: 
resident-mobile:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
resident-mobile:lint: 
resident-mobile:lint: YOUR TYPESCRIPT VERSION: 5.9.3
resident-mobile:lint: 
resident-mobile:lint: Please only submit bug reports when using the officially supported version.
resident-mobile:lint: 
resident-mobile:lint: =============
scanner-app:lint: =============
scanner-app:lint: 
scanner-app:lint: WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
scanner-app:lint: 
scanner-app:lint: You may find that it works just fine, or you may not.
scanner-app:lint: 
scanner-app:lint: SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
scanner-app:lint: 
scanner-app:lint: YOUR TYPESCRIPT VERSION: 5.9.3
scanner-app:lint: 
scanner-app:lint: Please only submit bug reports when using the officially supported version.
scanner-app:lint: 
scanner-app:lint: =============
resident-portal:lint: 
resident-portal:lint: ./src/app/(portal)/profile/page.tsx
resident-portal:lint: 5:3  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
resident-portal:lint: 6:3  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
resident-portal:lint: 
resident-portal:lint: ./src/app/(portal)/settings/notifications/page.tsx
resident-portal:lint: 2:27  Warning: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
resident-portal:lint: 
resident-portal:lint: info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
marketing:lint: 
marketing:lint: ./app/[locale]/contact/page.tsx
marketing:lint: 89:68  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./app/[locale]/features/page.tsx
marketing:lint: 116:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 128:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./app/[locale]/legal/security/page.tsx
marketing:lint: 3:24  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
marketing:lint: 3:34  Warning: 'CheckCircle2' is defined but never used.  @typescript-eslint/no-unused-vars
marketing:lint: 
marketing:lint: ./app/[locale]/pricing/page.tsx
marketing:lint: 18:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 156:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./app/[locale]/resources/page.tsx
marketing:lint: 85:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./app/[locale]/solutions/page.tsx
marketing:lint: 140:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./components/chat-widget.tsx
marketing:lint: 16:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 18:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./components/contact-form.tsx
marketing:lint: 7:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./components/nav.tsx
marketing:lint: 110:72  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: ./lib/i18n/get-translation.ts
marketing:lint: 18:79  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 18:87  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
marketing:lint: 
marketing:lint: info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
resident-mobile:lint: 
resident-mobile:lint: /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/resident-mobile/app/qrs/new.tsx
resident-mobile:lint:   10:3  warning  'Alert' is defined but never used  @typescript-eslint/no-unused-vars
resident-mobile:lint: 
resident-mobile:lint: ✖ 1 problem (0 errors, 1 warning)
resident-mobile:lint: 
client-dashboard:lint: 
client-dashboard:lint: ./src/app/[locale]/login/page.tsx
client-dashboard:lint: 10:3  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
client-dashboard:lint: 
client-dashboard:lint: ./src/app/api/analytics/export-pdf/route.ts
client-dashboard:lint: 325:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
client-dashboard:lint: 
client-dashboard:lint: ./src/app/api/resident/me/route.test.ts
client-dashboard:lint: 44:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
client-dashboard:lint: 
client-dashboard:lint: ./src/app/api/resident/push-token/route.test.ts
client-dashboard:lint: 44:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
client-dashboard:lint: 83:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
client-dashboard:lint: 90:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
client-dashboard:lint: 
client-dashboard:lint: ./src/app/api/resident/push-token/route.ts
client-dashboard:lint: 63:30  Warning: 'request' is defined but never used. Allowed unused args must match /^_/u.  @typescript-eslint/no-unused-vars
client-dashboard:lint: 
client-dashboard:lint: ./src/app/api/resident/visitors/route.test.ts
client-dashboard:lint: 101:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
client-dashboard:lint: 104:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
client-dashboard:lint: 
client-dashboard:lint: info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules

 Tasks:    12 successful, 12 total
Cached:    4 cached, 12 total
  Time:    19.757s 

╭───────────────────────────────────────────────────────────────────────────╮
│                                                                           │
│                    Update available v2.8.13 ≫ v2.8.16                     │
│    Changelog: https://github.com/vercel/turborepo/releases/tag/v2.8.16    │
│           Run "pnpm dlx @turbo/codemod@latest update" to update           │
│                                                                           │
│          Follow @turborepo for updates: https://x.com/turborepo           │
╰───────────────────────────────────────────────────────────────────────────╯
• turbo 2.8.13
• Packages in scope: @gate-access/api-client, @gate-access/config, @gate-access/db, @gate-access/i18n, @gate-access/types, @gate-access/ui, admin-dashboard, client-dashboard, marketing, resident-mobile, resident-portal, scanner-app
• Running typecheck in 12 packages
• Remote caching disabled
@gate-access/ui:typecheck: cache miss, executing 5abfcf1c9c46e419
@gate-access/db:typecheck: cache miss, executing 2b81fca51b8e141b
resident-mobile:typecheck: cache miss, executing 2a0940ff625c1bfb
admin-dashboard:typecheck: cache miss, executing d9d272665dc035b2
resident-portal:typecheck: cache miss, executing 83467765bf154990
client-dashboard:typecheck: cache miss, executing aa14895f0d348b42
@gate-access/i18n:typecheck: cache hit, replaying logs ebc0eac1c70c6489
@gate-access/api-client:typecheck: cache hit, replaying logs 5447f7ece4931711
@gate-access/i18n:typecheck: 
@gate-access/i18n:typecheck: > @gate-access/i18n@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/i18n
@gate-access/i18n:typecheck: > tsc -p tsconfig.json
@gate-access/i18n:typecheck: 
@gate-access/api-client:typecheck: 
@gate-access/api-client:typecheck: > @gate-access/api-client@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/api-client
@gate-access/api-client:typecheck: > tsc -p tsconfig.json
@gate-access/api-client:typecheck: 
@gate-access/types:typecheck: cache hit, replaying logs dbf1e1158ce4c682
@gate-access/ui:typecheck: 
@gate-access/types:typecheck: 
@gate-access/types:typecheck: > @gate-access/types@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/types
@gate-access/types:typecheck: > tsc -p tsconfig.json
@gate-access/types:typecheck: 
@gate-access/db:typecheck: 
resident-mobile:typecheck: 
admin-dashboard:typecheck: 
resident-portal:typecheck: 
client-dashboard:typecheck: 
client-dashboard:typecheck: 
client-dashboard:typecheck: > client-dashboard@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard
client-dashboard:typecheck: > tsc --noEmit
client-dashboard:typecheck: 
@gate-access/db:typecheck: 
@gate-access/db:typecheck: > @gate-access/db@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/db
@gate-access/db:typecheck: > tsc -p tsconfig.json
@gate-access/db:typecheck: 
resident-mobile:typecheck: 
resident-mobile:typecheck: > resident-mobile@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/resident-mobile
resident-mobile:typecheck: > tsc --noEmit
resident-mobile:typecheck: 
@gate-access/ui:typecheck: 
@gate-access/ui:typecheck: > @gate-access/ui@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/ui
@gate-access/ui:typecheck: > tsc -p tsconfig.json
@gate-access/ui:typecheck: 
admin-dashboard:typecheck: 
admin-dashboard:typecheck: > admin-dashboard@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/admin-dashboard
admin-dashboard:typecheck: > tsc --noEmit
admin-dashboard:typecheck: 
resident-portal:typecheck: 
resident-portal:typecheck: > resident-portal@0.1.0 typecheck /Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/resident-portal
resident-portal:typecheck: > tsc --noEmit
resident-portal:typecheck: 
resident-mobile:typecheck: app/contact-picker.tsx:11:27 - error TS2307: Cannot find module 'expo-contacts' or its corresponding type declarations.
resident-mobile:typecheck: 
resident-mobile:typecheck: 11 import * as Contacts from 'expo-contacts';
resident-mobile:typecheck:                              ~~~~~~~~~~~~~~~
resident-mobile:typecheck: 
resident-mobile:typecheck: app/qrs/new.tsx:16:26 - error TS2307: Cannot find module 'expo-sharing' or its corresponding type declarations.
resident-mobile:typecheck: 
resident-mobile:typecheck: 16 import * as Sharing from 'expo-sharing';
resident-mobile:typecheck:                             ~~~~~~~~~~~~~~
resident-mobile:typecheck: 
resident-mobile:typecheck: components/ContactPickerButton.tsx:2:27 - error TS2307: Cannot find module 'expo-contacts' or its corresponding type declarations.
resident-mobile:typecheck: 
resident-mobile:typecheck: 2 import * as Contacts from 'expo-contacts';
resident-mobile:typecheck:                             ~~~~~~~~~~~~~~~
resident-mobile:typecheck: 
resident-mobile:typecheck: lib/push-notifications.ts:1:32 - error TS2307: Cannot find module 'expo-notifications' or its corresponding type declarations.
resident-mobile:typecheck: 
resident-mobile:typecheck: 1 import * as Notifications from 'expo-notifications';
resident-mobile:typecheck:                                  ~~~~~~~~~~~~~~~~~~~~
resident-mobile:typecheck: 
resident-mobile:typecheck: lib/push-notifications.ts:2:25 - error TS2307: Cannot find module 'expo-device' or its corresponding type declarations.
resident-mobile:typecheck: 
resident-mobile:typecheck: 2 import * as Device from 'expo-device';
resident-mobile:typecheck:                           ~~~~~~~~~~~~~
resident-mobile:typecheck: 
resident-mobile:typecheck: 
resident-mobile:typecheck: Found 5 errors in 4 files.
resident-mobile:typecheck: 
resident-mobile:typecheck: Errors  Files
resident-mobile:typecheck:      1  app/contact-picker.tsx:11
resident-mobile:typecheck:      1  app/qrs/new.tsx:16
resident-mobile:typecheck:      1  components/ContactPickerButton.tsx:2
resident-mobile:typecheck:      2  lib/push-notifications.ts:1
resident-mobile:typecheck:  ELIFECYCLE  Command failed with exit code 2.
resident-mobile:typecheck: ERROR: command finished with error: command (/Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/resident-mobile) /usr/local/bin/pnpm run typecheck exited (1)
resident-mobile#typecheck: command (/Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/resident-mobile) /usr/local/bin/pnpm run typecheck exited (1)

 Tasks:    5 successful, 9 total
Cached:    3 cached, 9 total
  Time:    15.265s 
Failed:    resident-mobile#typecheck

 ERROR  run failed: command  exited (1)
 ELIFECYCLE  Command failed with exit code 1.
