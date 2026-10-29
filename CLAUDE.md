# CLAUDE.md

Playwright + TypeScript end-to-end tests for the OrangeHRM demo site (https://opensource-demo.orangehrmlive.com).

## Commands

```
npx playwright test                      # run all tests (setup project runs first)
npx playwright test --project=setup      # refresh the saved login session only
npx playwright test --trace on           # force a trace for every test
npx playwright show-trace traces/<test>/trace.zip
npx playwright show-report
```

There are no npm scripts, and TypeScript (`tsc`) is not installed, so type errors only show in the editor.

## Layout

- `playwright.config.ts`: `outputDir: './traces'`, which is wiped at the start of every run. Only `chromium` is enabled, and `headless: false`.
- `tests/auth.setup.ts`: logs in once and saves the session to `playwright/.auth/user.json` (gitignored).
- `tests/fixtures/pageFixtures.ts`: a custom `test` that provides the page objects as fixtures.
- `tests/Pages/`: page objects (`LoginPage`, `DashboardPage`, `PIMPage`, `PersonalDetailsPage`). Locators are `readonly` fields set in the constructor.
- `tests/utils/`: `dataUtils.ts` (`uniqueId`, `updateJson`) and `orangeHrmUtils.ts` (helper for OrangeHRM's custom dropdowns).
- `test-data/`: JSON test data and `images/employee.png`. Login credentials are in `test-data/images/LoginPage.json`.

## Conventions

- Import `test` and `expect` from `./fixtures/pageFixtures`, not `@playwright/test`. Get page objects from the test's arguments, e.g. `async ({ page, pimPage }) => ...`.
- Tests start already logged in, because the `chromium` project loads the session through `storageState`. Begin with `page.goto(...)` to the page you need, and don't log in inside tests.
- New page object: add a class under `tests/Pages/`, then register it in `PageFixtures` and `base.extend` in `pageFixtures.ts`.
- Keep test data in `test-data/*.json`, not hard-coded in specs.
- OrangeHRM dropdowns are custom divs, not `<select>`. Use `selectOption` from `orangeHrmUtils.ts`.
- Employee IDs must be unique and at most 10 characters, so use `uniqueId()`. Usernames must be unique too.

## Known issues

- The demo site is slow, and `page.goto` sometimes hits the 30s timeout.
- `.oxd-form-loader` can cover form fields after the page loads, which makes clicks time out. Wait for it to be hidden before you interact with the form.
- The saved session in `playwright/.auth/user.json` can expire. If tests land on the login page, run the setup project again.
