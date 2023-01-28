import { test, expect } from '@playwright/test';

test.describe('Arrange for Playwright Watch', () => {
  test('has title @pass', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test.skip('get started link @skip', async () => {
    /* noop */
  });

  test('failing test @fail', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    await page
      .getByRole('link', { name: 'Playwright Watch' })
      .click({ timeout: 1_000 });
    await expect(page).toHaveURL(/.*playwright-watch/, { timeout: 1_000 });
  });

  test('flaky test @flaky', async ({ page }, { retry }) => {
    await page.goto('https://playwright.dev/docs/intro');

    if (retry === 0) {
      await page
        .getByRole('link', { name: 'Playwright Watch' })
        .click({ timeout: 1_000 });
      await expect(page).toHaveURL(/.*playwright-watch/, { timeout: 1_000 });
    }
  });

  test('with a screenshot @success', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    await page.screenshot();
  });
});
