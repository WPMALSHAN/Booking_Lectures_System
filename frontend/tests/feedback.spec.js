import { test, expect } from '@playwright/test';

test('Feedback page should render, accept input, and submit successfully', async ({ page }) => {
  await page.route('**/api/feedback/submit/123', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Feedback saved' }),
    });
  });

  await page.goto('/feedback/123');

  await expect(page.locator('text=Leave your feedback.')).toBeVisible();
  await expect(page.locator('textarea[placeholder*="Share your experience"]')).toBeVisible();
  await expect(page.locator('.star-btn')).toHaveCount(5);

  await page.locator('.star-btn').nth(3).click();
  await expect(page.locator('text=Very Good')).toBeVisible();

  await page.fill('textarea', 'Great lecture, well explained and easy to follow.');
  await expect(page.locator('button:has-text("Submit Feedback")')).toBeEnabled();

  await page.screenshot({ path: 'tests/feedback-page.png', fullPage: true });

  await page.click('button:has-text("Submit Feedback")');
  await expect(page).toHaveURL(/\/feedback-history$/);
});
