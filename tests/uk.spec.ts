import { test, expect } from '@playwright/test';

test.use({
  extraHTTPHeaders: {
    'X-Vercel-IP-Country': 'UK',
  },
});

test('Testing NOT matching any country', async ({ page }) => {
  await page.goto('/');
  // Expect a title "to contain" a substring.
  await expect(page.getByText(/The country is/)).toHaveCount(0);
});
