import { test, expect } from './fixtures/pageFixtures';
import LoginPageData from '../test-data/images/LoginPage.json';

test.describe('Login', () => {
  // Start logged out; the chromium project otherwise loads the saved session
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Login with valid credentials', async ({ page, loginPage, dashboardPage }) => {
    await page.goto('/web/index.php/auth/login');
    await loginPage.usernameInput.fill(LoginPageData.username);
    await loginPage.passwordInput.fill(LoginPageData.password);
    await loginPage.loginButton.click();

    await expect(page).toHaveURL('/web/index.php/dashboard/index');
    await expect(dashboardPage.heading).toBeVisible();
  });
});
