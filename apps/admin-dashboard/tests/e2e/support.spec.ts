import { test, expect } from '@playwright/test';

test.describe('Support Workflow', () => {
  test('should triage tickets and generate articles', async ({ page }) => {
    await page.goto('/en/support/tickets');

    // 1. View Ticket
    await page.click('text=Scanner Sync Timeout');

    // 2. Verify AI Triage
    await expect(page.locator('text=AI Incident Analysis')).toBeVisible();
    await expect(page.locator('text=INFRASTRUCTURE_SYNC')).toBeVisible();

    // 3. Use AI Triage recommendation
    await page.click('button:has-text("Initiate Remote Reset")');
    await expect(page.locator('text=Reset Command Sent')).toBeVisible();

    // 4. Synthesize Knowledge Base Article
    await page.goto('/en/support/knowledge-base');
    await page.click('button:has-text("AI Article Generator")');
    await page.click('button:has-text("Start Synthesis")');
    await expect(
      page.locator('text=Synthesizing Neural Documentation...')
    ).toBeVisible();
  });
});
