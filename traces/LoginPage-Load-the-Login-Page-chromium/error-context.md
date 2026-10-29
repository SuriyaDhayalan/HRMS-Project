# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: LoginPage.spec.ts >> Load the Login Page
- Location: tests\LoginPage.spec.ts:9:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  locator('form').first().locator('.oxd-input-group').filter({ has: getByText('Employee Id', { exact: true }) }).locator('input')
Expected: "79615870"
Received: ""

Call log:
  - Expect "toHaveValue" locator('form').first().locator('.oxd-input-group').filter({ has: getByText('Employee Id', { exact: true }) }).locator('input') with timeout 5000ms
  - waiting for locator('form').first().locator('.oxd-input-group').filter({ has: getByText('Employee Id', { exact: true }) }).locator('input')
    4 × locator resolved to <input data-v-1f99f73c="" class="oxd-input oxd-input--active"/>
      - unexpected value ""
  - Test timeout of 30000ms exceeded.

```

```yaml
- textbox
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import { uniqueId, updateJson } from './utils/dataUtils';
  3  | import { DashboardPage } from './Pages/DashboardPage';
  4  | import { PIMPage } from './Pages/PIMPage';
  5  | import AddEmployeePageData from '../test-data/AddEmployeePage.json';
  6  | import PersonalDetailsPageData from '../test-data/PersonalDetailsPage.json';
  7  | import { PersonalDetailsPage } from './Pages/PersonalDetailsPage';
  8  | 
  9  | test('Load the Login Page', async ({ page }) => {
  10 |     // Already logged in via storageState from auth.setup.ts
  11 |     await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  12 |     const dashboardPage = new DashboardPage(page);
  13 |     await expect(dashboardPage.heading).toBeVisible();
  14 |     await dashboardPage.pimLink.click();
  15 |     const pimPage = new PIMPage(page);
  16 |     await pimPage.addEmployeeLink.click();
  17 |     await pimPage.photoInput.setInputFiles('./test-data/images/employee.png');
  18 |     await pimPage.firstNameInput.fill(AddEmployeePageData.firstName);
  19 |     await pimPage.lastNameInput.fill(AddEmployeePageData.lastName);
  20 |     await pimPage.MiddleNameInput.fill(AddEmployeePageData.MiddleName);
  21 |     const employeeId = uniqueId();
  22 |     await pimPage.employeeIdInput.fill(employeeId);
  23 |     await pimPage.createLoginDetailsCheckbox.check();
  24 |     // Usernames must be unique too; build from the name so the saved JSON value never piles up suffixes
  25 |     const username = (AddEmployeePageData.firstName + AddEmployeePageData.lastName).toLowerCase() + employeeId;
  26 |     await pimPage.usernameInput.fill(username);
  27 |     await pimPage.passwordInput.fill(AddEmployeePageData.password);
  28 |     await pimPage.confirmPasswordInput.fill(AddEmployeePageData.confirmPassword);
  29 |     await pimPage.saveButton.click();
  30 |     await expect(pimPage.submittedText).toBeVisible();
  31 |     
  32 | 
  33 |     // Record the ID and username that were saved so the JSON shows the latest employee
  34 |     updateJson('./test-data/AddEmployeePage.json', { employeeId, username });
  35 | 
  36 |     const personaldetailPage = new PersonalDetailsPage(page);
  37 |     await expect(page).toHaveURL(personaldetailPage.url);
  38 |     await expect(personaldetailPage.heading).toBeVisible();
  39 |     // Form loads its saved values after the heading; wait so they don't overwrite what we type
> 40 |     await expect(personaldetailPage.employeeIdInput).toHaveValue(employeeId);
     |                                                      ^ Error: expect(locator).toHaveValue(expected) failed
  41 |     await personaldetailPage.otherIdInput.fill(PersonalDetailsPageData.otherId);
  42 |     await personaldetailPage.driversLicenseInput.fill(PersonalDetailsPageData.driversLicense);
  43 |     await personaldetailPage.licenseExpiryDateInput.fill(PersonalDetailsPageData.licenseExpiryDate);
  44 |     await personaldetailPage.selectOption(personaldetailPage.nationality, PersonalDetailsPageData.nationality);
  45 |     await personaldetailPage.selectOption(personaldetailPage.maritalStatus, PersonalDetailsPageData.maritalStatus);
  46 |     await personaldetailPage.dateOfbirth.fill(PersonalDetailsPageData.dateOfBirth);
  47 |     await personaldetailPage.selectGender(PersonalDetailsPageData.gender);
  48 |     await personaldetailPage.saveButton.click();
  49 |     await expect(personaldetailPage.updatedText).toBeVisible();
  50 | 
  51 | 
  52 | });
  53 |  
  54 | 
```