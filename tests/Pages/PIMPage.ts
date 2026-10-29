import { Page,Locator } from "@playwright/test";
import { groupByLabel } from "../utils/orangeHrmUtils";

export class PIMPage {
    readonly page: Page;
    readonly addEmployeeLink: Locator;
    readonly photoInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly MiddleNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly createLoginDetailsCheckbox: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly saveButton: Locator;
    readonly submittedText : Locator;
    

    constructor(page: Page) {
        this.page = page;
        this.addEmployeeLink = page.getByRole('link', { name: 'Add Employee' });
        this.photoInput = page.locator('input[type="file"]');
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.MiddleNameInput=page.getByPlaceholder('Middle Name');
        this.employeeIdInput = groupByLabel(page, 'Employee Id').locator('input');
        this.createLoginDetailsCheckbox = page.locator('.oxd-switch-wrapper label');
        this.usernameInput = groupByLabel(page, 'Username').locator('input');
        this.passwordInput = groupByLabel(page, 'Password').locator('input');
        this.confirmPasswordInput = groupByLabel(page, 'Confirm Password').locator('input');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.submittedText = page.getByText('Successfully Saved');
    }
}
