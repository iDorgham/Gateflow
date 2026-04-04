# E2E Playwright Test Template

Use when adding Playwright E2E tests. Requires `@playwright/test` installed.

**Setup:** `pnpm add -D @playwright/test` in client-dashboard, then `npx playwright install`

**Output:** `apps/client-dashboard/e2e/<flow>.spec.ts`

---

## Basic structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('[Feature] E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login or ensure auth state
    await page.goto('http://localhost:3001/en/login');
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL ?? '');
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD ?? '');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should [expected behavior]', async ({ page }) => {
    await page.goto('http://localhost:3001/en/dashboard/projects');
    await page.click('button:has-text("New Project")');
    await page.fill('[name="name"]', 'E2E Test');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=E2E Test')).toBeVisible();
  });
});
```

---

## Auth helper pattern

```typescript
// e2e/helpers/auth.ts
export async function loginAsTenantAdmin(page: Page) {
  await page.goto('http://localhost:3001/en/login');
  await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}
```

---

## playwright.config.ts (example)

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { channel: 'chrome' } }],
  webServer: {
    command: 'pnpm dev:client',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Checklist

- [ ] `@playwright/test` installed
- [ ] `npx playwright install` run
- [ ] `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` in .env.test (not committed)
- [ ] Dev server starts before tests (webServer in config)
- [ ] Use data-testid for stable selectors where needed
