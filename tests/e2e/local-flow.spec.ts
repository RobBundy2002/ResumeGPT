import { expect, test } from '@playwright/test';

test('local deterministic resume analysis flow', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Upload resume').setInputFiles({
    name: 'resume.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Built NodeJS APIs deployed on k8s with postgres and React.'),
  });

  await page.getByLabel('Paste the role requirements').fill('Required: Kubernetes, Node.js, PostgreSQL, and TypeScript. Preferred: React.');
  await page.getByRole('button', { name: 'Analyze Match' }).click();

  await expect(page.locator('.score-panel').getByText('Overall Score')).toBeVisible();
  await expect(page.locator('.results').getByText('Kubernetes').first()).toBeVisible();
  await expect(page.locator('.results').getByText('TypeScript').first()).toBeVisible();

  await expect(page.getByLabel('Generated AI prompt')).toContainText('Do not fabricate skills');

  await page.getByRole('button', { name: 'Clear Session' }).click();
  await expect(page.getByLabel('Parsed resume text')).toHaveValue('');
});
