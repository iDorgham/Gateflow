import { test, expect } from '@playwright/test';

test.describe('CMS Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login logic here
    await page.goto('/en/login');
    // ... auth ...
  });

  test('should create a landing page with AI section generation', async ({
    page,
  }) => {
    await page.goto('/en/cms/landing-pages');

    // 1. Create new page
    await page.click('button:has-text("Create New Page")');
    await page.fill('input[placeholder*="Page Title"]', 'Test Landing Page');
    await page.click('button:has-text("Initialize Project")');

    // 2. Add AI Section
    await page.click('button:has-text("Add Block")');
    await page.click('button:has-text("AI Vector Generator")');
    await page.fill(
      'textarea',
      'Create a hero section for a luxury compound with high security focus.'
    );
    await page.click('button:has-text("Synthesize Section")');

    // 3. Verify AI Loading State
    await expect(
      page.locator('text=Synthesizing Neural Fabric...')
    ).toBeVisible();

    // 4. Confirmation Gate
    await expect(page.locator('text=Confirm AI Publication')).toBeVisible();

    // Check all items
    const checkboxes = await page.locator('button[role="checkbox"]').all();
    for (const checkbox of checkboxes) {
      await checkbox.click();
    }

    await page.click('button:has-text("Confirm & Publish")');

    // 5. Verify Publication
    await expect(
      page.locator('text=Landing Page Published Successfully')
    ).toBeVisible();
  });

  test('should track version history and restore', async ({ page }) => {
    await page.goto('/en/cms/landing-pages/test-page/builder');

    // Make a change
    await page.click('text=Test Landing Page');
    await page.fill('input', 'Modified Title');
    await page.click('button:has-text("Save Draft")');

    // View history
    await page.click('button:has-text("History")');
    await expect(page.locator('text=Trajectory History')).toBeVisible();
    await expect(page.locator('text=Modified Title')).toBeVisible();

    // Restore
    await page.click('button:has-text("V1")');
    await page.click('button:has-text("Restore")');
    await expect(page.locator('text=Test Landing Page')).toBeVisible();
  });
});
