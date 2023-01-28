import { test, expect } from '@playwright/test';

test.describe('Test Playwright Watch', () => {
  test('has login screen', async ({ page }) => {
    await page.goto('https://playwright.watch/');

    await expect(page.getByRole('button')).toBeVisible();

    await expect(page).toHaveScreenshot();
  });
});
