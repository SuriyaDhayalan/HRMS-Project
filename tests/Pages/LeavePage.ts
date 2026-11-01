import { Page, Locator } from "@playwright/test";
import { groupByLabel, selectOption } from '../utils/orangeHrmUtils';

export class LeavePage {
    readonly page: Page;
    readonly url: string;
    readonly leaveMenuLink: Locator;
    // "Apply" item in the Leave module's top bar
    readonly applyLink: Locator;
    readonly heading: Locator;
    readonly formLoader: Locator;
    readonly leaveTypeDropdown: Locator;
    readonly fromDateInput: Locator;
    readonly toDateInput: Locator;
    readonly applyButton: Locator;
    readonly savedText: Locator;
    readonly toDateError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.url = '/web/index.php/leave/applyLeave';
        // exact, so it doesn't also match "Leave List"
        this.leaveMenuLink = page.getByRole('link', { name: 'Leave', exact: true });
        this.applyLink = page.getByRole('link', { name: 'Apply', exact: true });
        this.heading = page.getByRole('heading', { name: 'Apply Leave' });
        this.formLoader = page.locator('.oxd-form-loader');
        this.leaveTypeDropdown = groupByLabel(page, 'Leave Type').locator('.oxd-select-text');
        this.fromDateInput = groupByLabel(page, 'From Date').locator('input');
        this.toDateInput = groupByLabel(page, 'To Date').locator('input');
        this.applyButton = page.getByRole('button', { name: 'Apply' });
        this.savedText = page.getByText('Successfully Saved');
        this.toDateError = groupByLabel(page, 'To Date').locator('.oxd-input-field-error-message');
    }

    async selectLeaveType(leaveType: string) {
        await selectOption(this.page, this.leaveTypeDropdown, leaveType);
    }

    // Filling From Date auto-fills To Date on blur, so set From first, then overwrite To
    async fillDates(fromDate: string, toDate: string) {
        await this.fromDateInput.fill(fromDate);
        await this.heading.click();
        await this.toDateInput.fill(toDate);
        // Click away to close the date picker and trigger validation
        await this.heading.click();
    }
}
