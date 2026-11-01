import { Page, Locator } from "@playwright/test";
import { groupByLabel, selectOption } from '../utils/orangeHrmUtils';

export class AddEntitlementPage {
    readonly page: Page;
    // "Entitlements" in the Leave top bar is a dropdown, not a link
    readonly entitlementsMenu: Locator;
    readonly addEntitlementsLink: Locator;
    readonly heading: Locator;
    readonly formLoader: Locator;
    readonly employeeNameInput: Locator;
    readonly employeeOptions: Locator;
    readonly leaveTypeDropdown: Locator;
    readonly leavePeriodDropdown: Locator;
    readonly entitlementInput: Locator;
    readonly saveButton: Locator;
    // Shown after Save: "Updating Entitlement - Existing Entitlement value ... will be updated to ..."
    readonly confirmButton: Locator;
    readonly savedText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.entitlementsMenu = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'Entitlements' });
        this.addEntitlementsLink = page.getByRole('menuitem', { name: 'Add Entitlements' });
        // Form title is a <p>, not a heading
        this.heading = page.getByText('Add Leave Entitlement', { exact: true });
        this.formLoader = page.locator('.oxd-form-loader');
        this.employeeNameInput = groupByLabel(page, 'Employee Name').getByPlaceholder('Type for hints...');
        this.employeeOptions = page.locator('.oxd-autocomplete-option');
        this.leaveTypeDropdown = groupByLabel(page, 'Leave Type').locator('.oxd-select-text');
        this.leavePeriodDropdown = groupByLabel(page, 'Leave Period').locator('.oxd-select-text');
        this.entitlementInput = groupByLabel(page, 'Entitlement').locator('input');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
        this.savedText = page.getByText('Successfully Saved');
    }

    // Autocomplete shows "Searching...." first, so wait for the matching option before clicking.
    // Options are "First Middle Last"; match first + last exactly so "John Doe" doesn't pick "John Doe Smith"
    async selectEmployee(name: string) {
        const [first, last] = [name.split(' ')[0], name.split(' ').slice(-1)[0]];
        await this.employeeNameInput.fill(name);
        await this.employeeOptions.filter({ hasText: new RegExp(`^\\s*${first}(\\s+\\S+)?\\s+${last}\\s*$`) }).click();
    }

    async selectOption(dropdown: Locator, option: string) {
        await selectOption(this.page, dropdown, option);
    }
}
