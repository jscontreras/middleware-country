import { test, expect } from '@playwright/test';

test.use({
  extraHTTPHeaders: {
    'X-Vercel-IP-Country': 'US',
  },
});

test('Testing matching country (US)', async ({ page }) => {
  await page.goto('/');
  // Expect a title "to contain" a substring.
  await expect(page.getByText(/The country is: US!!/)).toHaveCount(1);
});
