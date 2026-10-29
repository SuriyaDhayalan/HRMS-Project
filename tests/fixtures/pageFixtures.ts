import { test as base } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { DashboardPage } from '../Pages/DashboardPage';
import { PIMPage } from '../Pages/PIMPage';
import { PersonalDetailsPage } from '../Pages/PersonalDetailsPage';

type PageFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    pimPage: PIMPage;
    personalDetailsPage: PersonalDetailsPage;
};

// Tests ask for a page object by name and get one built on that test's page
export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    pimPage: async ({ page }, use) => {
        await use(new PIMPage(page));
    },
    personalDetailsPage: async ({ page }, use) => {
        await use(new PersonalDetailsPage(page));
    },
});

export { expect } from '@playwright/test';
