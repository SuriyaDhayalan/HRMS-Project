// spec: Apply Leave – Test Plan
// seed: tests/seed.spec.ts
import { test, expect } from './fixtures/pageFixtures';
import { weekdayBetween, parseDate, formatDate } from './utils/dataUtils';
import LeavePageData from '../test-data/LeavePage.json';

// leaveType picks one of leaveTypes; fail fast on a typo instead of a 2-minute dropdown timeout
if (!LeavePageData.leaveTypes.includes(LeavePageData.leaveType)) {
    throw new Error(`leaveType "${LeavePageData.leaveType}" is not in leaveTypes in test-data/LeavePage.json`);
}

// Apply Leave only offers leave types with balance in the current period, so leavePeriod must be the current one.
// Leave dates must fall inside it; start from tomorrow so leave is never in the past.
const [periodFirstDay, periodEnd] = LeavePageData.leavePeriod.split(' - ').map(parseDate);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const periodStart = periodFirstDay > tomorrow ? periodFirstDay : tomorrow;

test.describe('Apply Leave', () => {
    // Demo site is slow; entitlement + apply navigation can eat the default 30s
    test.describe.configure({ timeout: 120_000 });

    test.beforeEach(async ({ page, dashboardPage, leavePage, addEntitlementPage }) => {
        // Already logged in via storageState from auth.setup.ts
        await page.goto('/web/index.php/dashboard/index');
        // Apply Leave only works for the logged-in employee, so entitle that employee
        const employeeName = (await dashboardPage.userName.innerText()).trim();

        // Leave > Entitlements > Add Entitlements
        await leavePage.leaveMenuLink.click();
        await addEntitlementPage.entitlementsMenu.click();
        await addEntitlementPage.addEntitlementsLink.click();
        await expect(addEntitlementPage.heading).toBeVisible();
        await expect(addEntitlementPage.formLoader).toBeHidden();

        await addEntitlementPage.selectEmployee(employeeName);
        await addEntitlementPage.selectOption(addEntitlementPage.leaveTypeDropdown, LeavePageData.leaveType);
        await addEntitlementPage.selectOption(addEntitlementPage.leavePeriodDropdown, LeavePageData.leavePeriod);
        await addEntitlementPage.entitlementInput.fill(LeavePageData.entitlement);
        await addEntitlementPage.saveButton.click();
        await addEntitlementPage.confirmButton.click();
        await expect(addEntitlementPage.savedText).toBeVisible();

        // 1. Click "Leave" in the left menu, then "Apply"
        await leavePage.leaveMenuLink.click();
        await leavePage.applyLink.click();
        await expect(leavePage.heading).toBeVisible();
        await expect(leavePage.formLoader).toBeHidden();
    });

    test('LR-01 Apply leave with valid dates', async ({ leavePage }) => {
        // 2. Select Leave Type "CAN - Personal"
        await leavePage.selectLeaveType(LeavePageData.leaveType);

        // 3. Pick From Date and To Date
        const day = formatDate(weekdayBetween(periodStart, periodEnd));
        await leavePage.fillDates(day, day);

        // 4. Click "Apply"
        await leavePage.applyButton.click();
        await expect(leavePage.savedText).toBeVisible();
    });

    test('LR-10 Apply leave with To Date before From Date', async ({ leavePage }) => {
        await leavePage.selectLeaveType(LeavePageData.leaveType);

        const from = weekdayBetween(periodStart, periodEnd);
        const to = new Date(from);
        to.setDate(from.getDate() - 1);
        await leavePage.fillDates(formatDate(from), formatDate(to));

        await expect(leavePage.toDateError).toHaveText('To date should be after from date');
    });
});
