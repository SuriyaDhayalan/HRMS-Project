# Leave request form: test scenarios

**Seed:** `tests/seed.spec.ts`
**Spec:** `tests/ApplyLeave.spec.ts`
**Precondition for every scenario, unless it says otherwise:** the logged-in user has `entitlement` days of `leaveType` in the current `leavePeriod`. The spec's `beforeEach` handles this.

Status:
- ✅ **Implemented**: in the spec and passing.
- 🟡 **Planned**: expected text seen on the site, but no test yet.
- ⚪ **Unverified**: the expected text is a best guess. Confirm it from a run's `error-context.md` before you assert on it, then update this file.

## Precondition: Add Entitlement

| ID | Scenario | Steps | Expected | Status |
|----|----------|-------|----------|--------|
| LR-00 | Add entitlement for the logged-in user | Leave › Entitlements › Add Entitlements. Pick the employee named in `dashboardPage.userName`, then `leaveType`, `leavePeriod` and `entitlement`. Click Save, then Confirm. | `Successfully Saved` | ✅ (spec `beforeEach`) |

## 1. Happy path

| ID | Scenario | Steps | Expected | Status |
|----|----------|-------|----------|--------|
| LR-01 | Apply leave with valid dates | Leave › Apply. Pick `leaveType`. Set From and To to the same random weekday. Click Apply. | `Successfully Saved` | ✅ |
| LR-02 | Multi-day leave | Same as LR-01, with To set 2 weekdays after From. | `Successfully Saved` | 🟡 |
| LR-03 | Half day, morning | Single date, then Duration = `Half Day - Morning`. Click Apply. | `Successfully Saved` | ⚪ |
| LR-04 | Specific time | Single date, then Duration = `Specify Time` with From 09:00 and To 13:00. Click Apply. | `Successfully Saved`. Duration shows `4.00` | ⚪ |
| LR-05 | Partial days on multi-day leave | Multi-day range, then Partial Days = `Start Day Only` with half day morning. Click Apply. | `Successfully Saved` | ⚪ |
| LR-06 | With comment | LR-01 plus a short comment. | `Successfully Saved`, and the comment appears in My Leave | 🟡 |
| LR-07 | Leave shows in My Leave | After LR-01, open Leave › My Leave and filter by that date. | One row with that date and `leaveType`, status `Pending Approval` | ⚪ |

## 2. Validation

| ID | Scenario | Steps | Expected | Status |
|----|----------|-------|----------|--------|
| LR-10 | To Date before From Date | Pick `leaveType`. Set From to a weekday and To to the day before. | `To date should be after from date` under To Date | ✅ |
| LR-11 | No leave type | Leave Leave Type empty, set dates, click Apply. | `Required` under Leave Type | 🟡 |
| LR-12 | No dates | Pick `leaveType`, clear both dates, click Apply. | `Required` under From Date and To Date | 🟡 |
| LR-13 | Wrong date format | Type `31-12-2026` into From Date and blur. | `Should be a valid date in yyyy-dd-mm format` | ⚪ |
| LR-14 | Comment too long | 251+ characters in Comments. | `Should not exceed 250 characters` | ⚪ |

## 3. Business rules

| ID | Scenario | Steps | Expected | Status |
|----|----------|-------|----------|--------|
| LR-20 | Overlapping leave | Apply LR-01, then apply again for the same date. | Rejected with an overlap message, `Failed to Submit` or an overlapping-leave list | ⚪ |
| LR-21 | Weekend only | From and To set to the same Saturday. | Rejected, since 0 working days | ⚪ |
| LR-22 | More days than balance | Range longer than the remaining balance. | Insufficient-balance warning or confirm | ⚪ |
| LR-23 | No balance hides the form | Precondition skipped. User has no balance in the current period. | Only `No Leave Types with Leave Balance` shows, with no form fields | ✅ (seen manually, no test yet) |
| LR-24 | Balance from the next period doesn't count | Entitle only `2027-01-03 - 2028-29-02`, then open Apply. | Same as LR-23 | ✅ (seen manually, no test yet) |
| LR-25 | Balance shown | After LR-00, pick `leaveType` on Apply. | Leave Balance shows a number of days greater than 0 | 🟡 |

## 4. Leave types

| ID | Scenario | Steps | Expected | Status |
|----|----------|-------|----------|--------|
| LR-30 | Every leave type can be applied | Data-driven over `leaveTypes`: LR-00 then LR-01 for each type. | `Successfully Saved` for each | 🟡 (slow, about 13 × 60s) |

## Notes on writing them

- One `test()` per ID. Put the ID in the title, e.g. `test('LR-02 Multi-day leave', ...)`.
- Keep strings and values in `test-data/LeavePage.json`. Add keys as needed, e.g. `durationHalfMorning`.
- Change the status here in the same change that adds or verifies the test.
