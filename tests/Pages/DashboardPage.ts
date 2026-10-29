import { Page,Locator } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly pimLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Dashboard' });
        this.pimLink = page.getByRole('link', { name: 'PIM' });
    }
}
