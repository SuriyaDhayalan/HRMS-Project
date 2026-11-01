# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Playwright + TypeScript end-to-end tests for the OrangeHRM demo site (https://opensource-demo.orangehrmlive.com, set as `baseURL`).

## Commands

```
npx playwright test                              # run all tests (setup project runs first)
npx playwright test tests/ApplyLeave.spec.ts     # run one spec file
npx playwright test -g "Apply leave with valid dates"   # run one test by title
npx playwright test --project=setup              # refresh the saved login session only
npx playwright test --trace on                   # force a trace for every test
npx playwright show-trace traces/<test>/trace.zip
npx playwright show-report
```

There are no npm scripts, and TypeScript (`tsc`) is not installed, so type errors only show in the editor.

## Layout

- `playwright.config.ts`: `outputDir: './traces'`, which is wiped at the start of every run. Only `chromium` is enabled, and `headless: false`. Traces are recorded `on-first-retry`, and retries happen only on CI.
- `tests/auth.setup.ts`: logs in once and saves the session to `playwright/.auth/user.json` (gitignored). The `chromium` project depends on the `setup` project.
- `tests/fixtures/pageFixtures.ts`: a custom `test` that provides the page objects as fixtures.
- `tests/Pages/`: page objects. Locators are `readonly` fields set in the constructor.
- `tests/utils/dataUtils.ts`: `uniqueId`, `updateJson`, and date helpers (`parseDate`, `formatDate`, `weekdayBetween`).
- `tests/utils/orangeHrmUtils.ts`: `selectOption` for OrangeHRM's custom dropdowns, and `groupByLabel` to find a field by its sibling label.
- `test-data/`: JSON test data and `images/employee.png`. Login credentials are in `test-data/images/LoginPage.json`.
- `specs/`: test plans. `tests/seed.spec.ts` is the seed file for the Playwright test planner/generator/healer agents in `.claude/agents/`, which use the `playwright-test` MCP server from `.mcp.json`.
- `.github/workflows/playwright.yml`: runs `npx playwright test` on push/PR to `main`/`master` and uploads `playwright-report/`.

## Conventions

- Import `test` and `expect` from `./fixtures/pageFixtures`, not `@playwright/test`. Get page objects from the test's arguments, e.g. `async ({ page, pimPage }) => ...`.
- Tests start already logged in, because the `chromium` project loads the session through `storageState`. Begin with `page.goto(...)` to the page you need, and don't log in inside tests.
- New page object: add a class under `tests/Pages/`, then register it in `PageFixtures` and `base.extend` in `pageFixtures.ts`.
- Keep test data in `test-data/*.json`, not hard-coded in specs. `updateJson` writes values back into these files (e.g. `LoginPage.spec.ts` saves the new `employeeId` and `username` to `AddEmployeePage.json`), so a run can change tracked files.
- OrangeHRM dropdowns are custom divs, not `<select>`. Use `selectOption` from `orangeHrmUtils.ts`.
- Many OrangeHRM fields have no placeholder or accessible name. Locate them with `groupByLabel(page, '<Label>')`.
- Employee IDs must be unique and at most 10 characters, so use `uniqueId()`. Usernames must be unique too.
- OrangeHRM shows dates as `yyyy-dd-mm`. Use `parseDate`/`formatDate`, not `Date` string parsing.

## Leave tests

- `ApplyLeave.spec.ts` first adds an entitlement for the logged-in user, because Apply Leave only offers leave types that have a balance.
- In `test-data/LeavePage.json`, `leaveType` must be one of `leaveTypes` (the spec throws otherwise), and `leavePeriod` must be the current leave period.
- Leave dates are a random weekday inside the period, so repeat runs don't fail with "Failed to Submit" for overlapping leave.

## Known issues

- The demo site is slow, and `page.goto` sometimes hits the 30s timeout. Long flows raise the timeout with `test.describe.configure({ timeout: ... })`.
- `.oxd-form-loader` can cover form fields after the page loads, which makes clicks time out. Wait for it to be hidden before you interact with the form.
- The saved session in `playwright/.auth/user.json` can expire. If tests land on the login page, run the setup project again.
