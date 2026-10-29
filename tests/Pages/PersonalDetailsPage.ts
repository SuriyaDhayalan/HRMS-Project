import {Page, Locator} from '@playwright/test'
import { groupByLabel, selectOption } from '../utils/orangeHrmUtils';

export class PersonalDetailsPage {
    readonly page: Page;
    // Ends with the new employee's internal number, e.g. /pim/viewPersonalDetails/empNumber/123
    readonly url: RegExp = /\/web\/index\.php\/pim\/viewPersonalDetails\/empNumber\/\d+$/;
    readonly heading: Locator;
    // First form on the page; "Custom Fields" below has its own Save button
    readonly personalForm: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly middleName: Locator;
    readonly employeeIdInput: Locator;
    readonly otherIdInput: Locator;
    readonly driversLicenseInput: Locator;
    readonly licenseExpiryDateInput: Locator;
    readonly nationality: Locator;
    readonly maritalStatus: Locator;
    readonly dateOfbirth: Locator;
    readonly gender: Locator;
    readonly saveButton: Locator;
    readonly updatedText: Locator;
    readonly attachFile: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Personal Details' });
        this.personalForm = page.locator('form').first();
        this.firstName = this.personalForm.getByPlaceholder('First Name');
        this.lastName = this.personalForm.getByPlaceholder('Last Name');
        this.middleName = this.personalForm.getByPlaceholder('Middle Name');
        this.employeeIdInput = groupByLabel(this.personalForm, 'Employee Id').locator('input');
        this.otherIdInput = groupByLabel(this.personalForm, 'Other Id').locator('input');
        this.driversLicenseInput = groupByLabel(this.personalForm, "Driver's License Number").locator('input');
        this.licenseExpiryDateInput = groupByLabel(this.personalForm, 'License Expiry Date').locator('input');
        this.nationality = groupByLabel(this.personalForm, 'Nationality').locator('.oxd-select-text');
        this.maritalStatus = groupByLabel(this.personalForm, 'Marital Status').locator('.oxd-select-text');
        this.dateOfbirth = groupByLabel(this.personalForm, 'Date of Birth').locator('input');
        this.gender = groupByLabel(this.personalForm, 'Gender');
        this.saveButton = this.personalForm.getByRole('button', { name: 'Save' });
        this.updatedText = page.getByText('Successfully Updated');
        this.attachFile = page.getByRole('button', { name: 'Add' });
    }

    async selectOption(dropdown: Locator, option: string) {
        await selectOption(this.page, dropdown, option);
    }

    // Radio inputs are hidden behind custom styling, so click the "Male"/"Female" label
    async selectGender(value: string) {
        await this.gender.locator('label', { hasText: new RegExp(`^${value}$`) }).click();
    }
}
