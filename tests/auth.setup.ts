import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './Pages/LoginPage';
import LoginPageData from '../test-data/images/LoginPage.json';

const authFile = 'playwright/.auth/user.json';

// Log in once and save the session; other tests load it via storageState in the config
setup('authenticate', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page).toHaveTitle('OrangeHRM');
    const loginPage = new LoginPage(page);
    await loginPage.usernameInput.fill(LoginPageData.username);
    await loginPage.passwordInput.fill(LoginPageData.password);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    await page.context().storageState({ path: authFile });
});
