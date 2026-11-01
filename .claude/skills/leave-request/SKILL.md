---
name: leave-request
description: Write, extend, or debug tests for OrangeHRM's Leave module (Apply Leave form, Add Entitlements). Use when asked for leave tests, leave scenarios, entitlement setup, or when a leave spec fails with "No Leave Types with Leave Balance", a dropdown timeout, or "Failed to Submit".
---

# Leave request form

Test scenarios live in [scenarios.md](scenarios.md). Each one has an ID (`LR-01`, ...) and a status. Read it before writing a test, and update the status when a scenario gets implemented or its expected text is verified.

## Files

| What | Where |
|------|-------|
| Spec | `tests/ApplyLeave.spec.ts` |
| Apply Leave page object | `tests/Pages/LeavePage.ts` (fixture `leavePage`) |
| Add Entitlement page object | `tests/Pages/AddEntitlementPage.ts` (fixture `addEntitlementPage`) |
| Logged-in user name | `dashboardPage.userName` |
| Test data | `test-data/LeavePage.json` (`leaveType`, `leaveTypes`, `leavePeriod`, `entitlement`) |
| Date helpers | `tests/utils/dataUtils.ts` (`weekdayBetween`, `parseDate`, `formatDate`) |

## Rules that are not obvious

1. **The form only renders with a balance.** With no balance in the *current* leave period, Apply Leave shows only `No Leave Types with Leave Balance`, with no fields. Every test entitles the logged-in user first (the `beforeEach` in the spec does this).
2. **Only the current period counts.** The current period is `2026-01-01 - 2027-28-02`, and the next is `2027-01-03 - 2028-29-02`. Entitlement in the next period does not unlock the form. When the current period rolls over on 2027-03-01, update `leavePeriod` in the JSON.
3. **Apply Leave always applies for the logged-in user.** So entitle the name from `dashboardPage.userName` (currently "John Doe", empNumber 7). To book leave for someone else, use Leave › Assign Leave, which is not covered yet.
4. **Employee autocomplete has look-alikes.** Typing "John Doe" also suggests "John Doe Smith". `AddEntitlementPage.selectEmployee` matches first and last name exactly. Keep it that way.
5. **Dates are `yyyy-dd-mm`.** Use `formatDate` and `parseDate`. Never hand-write dates in specs.
6. **Dates must be random weekdays inside the period, from tomorrow on.** A repeated date clashes with leave already booked, and a weekend has 0 working days. Use `weekdayBetween(periodStart, periodEnd)`.
7. **Filling From Date auto-fills To Date on blur.** `LeavePage.fillDates` sets From, blurs, then overwrites To. Use it rather than filling the inputs directly.
8. **Leave type names are spelled as the site has them**, including `CAN - Matternity` and `Pesonal`. `leaveType` must be one of `leaveTypes`. The spec fails fast otherwise.
9. **The Add Entitlement form title is a `<p>`, not a heading.** Locate it with `getByText('Add Leave Entitlement', { exact: true })`.
10. **Saving an entitlement always opens a Confirm dialog.** It adds to any existing balance rather than replacing it, so the balance grows on every run.
11. **The demo site is slow.** The suite timeout is 120s, set with `test.describe.configure`. Wait for `.oxd-form-loader` to be hidden before typing.

## Check data through the API (faster than the UI)

The saved session works with Playwright's `request` context. Write throwaway scripts in the scratchpad, not in the repo.

```js
const { request } = require('E:/Playwright_OodoHRM/node_modules/playwright');
const ctx = await request.newContext({
  baseURL: 'https://opensource-demo.orangehrmlive.com',
  storageState: 'E:/Playwright_OodoHRM/playwright/.auth/user.json',
});
// GET /web/index.php/api/v2/pim/myself                          -> logged-in empNumber
// GET /web/index.php/api/v2/leave/leave-periods                 -> periods + currentLeavePeriod
// GET /web/index.php/api/v2/leave/leave-types?limit=0           -> all leave types
// GET /web/index.php/api/v2/leave/leave-types/eligible          -> types with balance (empty = form hidden)
// GET /web/index.php/api/v2/leave/leave-entitlements?empNumber=7&fromDate=...&toDate=...
```

## Run

```
npx playwright test tests/ApplyLeave.spec.ts --reporter=line
```

When a test fails, read `traces/<test>/error-context.md` (the page snapshot) and `test-failed-1.png` before changing locators.
