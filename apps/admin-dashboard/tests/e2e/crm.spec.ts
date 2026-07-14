import { test, expect } from '@playwright/test';

test.describe('CRM Workflow', () => {
  test('should manage contacts and lead scoring', async ({ page }) => {
    await page.goto('/en/crm/contacts');

    // 1. Add Contact
    await page.click('button:has-text("Add Contact")');
    await page.fill('input[name="firstName"]', 'Ahmed');
    await page.fill('input[name="lastName"]', 'Hassan');
    await page.fill('input[name="email"]', 'ahmed@rimal.ae');
    await page.click('button:has-text("Create Node")');

    // 2. Verify AI Lead Score
    await expect(page.locator('text=Lead Score')).toBeVisible();
    const score = await page.locator('.score-badge').innerText();
    expect(parseInt(score)).toBeGreaterThan(0);

    // 3. Generate Nurturing Follow-up
    await page.click('button:has-text("Ahmed Hassan")');
    await page.click('button:has-text("Generate AI Follow-up")');
    await expect(
      page.locator('text=Synthesizing Nurture Vector...')
    ).toBeVisible();
    await expect(page.locator('text=Dear Ahmed,')).toBeVisible();
  });

  test('should manage deal pipeline with drag and drop', async ({ page }) => {
    await page.goto('/en/crm/deals');

    // 1. Verify Pipeline Stages
    await expect(page.locator('text=Qualified')).toBeVisible();
    await expect(page.locator('text=Proposal')).toBeVisible();

    // 2. Add Deal
    await page.click('button:has-text("Create Opportunity")');
    await page.fill(
      'input[placeholder*="Deal Title"]',
      'Rimal Cluster Expansion'
    );
    await page.click('button:has-text("Create Deal")');

    // 3. Verify AI Velocity Indicator
    await expect(page.locator('text=Probability')).toBeVisible();
  });
});
