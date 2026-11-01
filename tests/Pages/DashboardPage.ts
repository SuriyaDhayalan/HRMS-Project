import { Page,Locator } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly pimLink: Locator;
    // Logged-in employee's name in the top-right user dropdown
    readonly userName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Dashboard' });
        this.pimLink = page.getByRole('link', { name: 'PIM' });
        this.userName = page.locator('.oxd-userdropdown-name');
    }
}
