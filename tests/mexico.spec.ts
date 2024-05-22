import { test, expect } from '@playwright/test';

test.use({
  extraHTTPHeaders: {
    'X-Vercel-IP-Country': 'MX',
  },
});

test('Testing matching country (MX)', async ({ page }) => {
  await page.goto('/');
  // Expect a title "to contain" a substring.
  await expect(page.getByText(/The country is: MX!!/)).toHaveCount(1);
});
