import {test,expect} from '@playwright/test';
import { uniqueId, updateJson } from './utils/dataUtils';
import { DashboardPage } from './Pages/DashboardPage';
import { PIMPage } from './Pages/PIMPage';
import AddEmployeePageData from '../test-data/AddEmployeePage.json';
import PersonalDetailsPageData from '../test-data/PersonalDetailsPage.json';
import { PersonalDetailsPage } from './Pages/PersonalDetailsPage';

test('Load the Login Page', async ({ page }) => {
    // Already logged in via storageState from auth.setup.ts
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.heading).toBeVisible();
    await dashboardPage.pimLink.click();
    const pimPage = new PIMPage(page);
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

    const personaldetailPage = new PersonalDetailsPage(page);
    await expect(page).toHaveURL(personaldetailPage.url);
    await expect(personaldetailPage.heading).toBeVisible();
    // Form loads its saved values after the heading; wait so they don't overwrite what we type
    await expect(personaldetailPage.employeeIdInput).toHaveValue(employeeId);
    await personaldetailPage.otherIdInput.fill(PersonalDetailsPageData.otherId);
    await personaldetailPage.driversLicenseInput.fill(PersonalDetailsPageData.driversLicense);
    await personaldetailPage.licenseExpiryDateInput.fill(PersonalDetailsPageData.licenseExpiryDate);
    await personaldetailPage.selectOption(personaldetailPage.nationality, PersonalDetailsPageData.nationality);
    await personaldetailPage.selectOption(personaldetailPage.maritalStatus, PersonalDetailsPageData.maritalStatus);
    await personaldetailPage.dateOfbirth.fill(PersonalDetailsPageData.dateOfBirth);
    await personaldetailPage.selectGender(PersonalDetailsPageData.gender);
    await personaldetailPage.saveButton.click();
    await expect(personaldetailPage.updatedText).toBeVisible();


});
 
