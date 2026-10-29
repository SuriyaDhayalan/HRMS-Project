import { test, expect } from './fixtures/pageFixtures';
import { uniqueId, updateJson } from './utils/dataUtils';
import AddEmployeePageData from '../test-data/AddEmployeePage.json';
import PersonalDetailsPageData from '../test-data/PersonalDetailsPage.json';

test('Load the Login Page', async ({ page, dashboardPage, pimPage, personalDetailsPage }) => {
    // Already logged in via storageState from auth.setup.ts
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    await expect(dashboardPage.heading).toBeVisible();
    await dashboardPage.pimLink.click();
    await pimPage.addEmployeeLink.click();
    await pimPage.photoInput.setInputFiles('./test-data/images/employee.png');
    await pimPage.firstNameInput.fill(AddEmployeePageData.firstName);
    await pimPage.lastNameInput.fill(AddEmployeePageData.lastName);
    await pimPage.MiddleNameInput.fill(AddEmployeePageData.MiddleName);
    const employeeId = uniqueId();
    await pimPage.employeeIdInput.fill(employeeId);
    await pimPage.createLoginDetailsCheckbox.check();
    // Usernames must be unique too; build from the name so the saved JSON value never piles up suffixes
    const username = (AddEmployeePageData.firstName + AddEmployeePageData.lastName).toLowerCase() + employeeId;
    await pimPage.usernameInput.fill(username);
    await pimPage.passwordInput.fill(AddEmployeePageData.password);
    await pimPage.confirmPasswordInput.fill(AddEmployeePageData.confirmPassword);
    await pimPage.saveButton.click();
    await expect(pimPage.submittedText).toBeVisible();
    

    // Record the ID and username that were saved so the JSON shows the latest employee
    updateJson('./test-data/AddEmployeePage.json', { employeeId, username });

    await expect(page).toHaveURL(personalDetailsPage.url);
    await expect(personalDetailsPage.heading).toBeVisible();
    // Form loads its saved values after the heading; wait so they don't overwrite what we type
    await expect(personalDetailsPage.employeeIdInput).toHaveValue(employeeId);
    await personalDetailsPage.otherIdInput.fill(PersonalDetailsPageData.otherId);
    await personalDetailsPage.driversLicenseInput.fill(PersonalDetailsPageData.driversLicense);
    await personalDetailsPage.licenseExpiryDateInput.fill(PersonalDetailsPageData.licenseExpiryDate);
    await personalDetailsPage.selectOption(personalDetailsPage.nationality, PersonalDetailsPageData.nationality);
    await personalDetailsPage.selectOption(personalDetailsPage.maritalStatus, PersonalDetailsPageData.maritalStatus);
    await personalDetailsPage.dateOfbirth.fill(PersonalDetailsPageData.dateOfBirth);
    await personalDetailsPage.selectGender(PersonalDetailsPageData.gender);
    await personalDetailsPage.saveButton.click();
    await expect(personalDetailsPage.updatedText).toBeVisible();


});
 
