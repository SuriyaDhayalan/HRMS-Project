---
name: playwright-auth-storage-state
description: Log in once and reuse the session across all tests with Playwright storageState. Use when tests repeat the login steps, when the saved session has expired, or when adding a new authenticated test or user role.
---

# Login once with storageState

`storageState` is a JSON file holding the browser's cookies and localStorage. When a test starts with that file loaded, the site treats it as already logged in.

## How it is wired in this project

- `tests/auth.setup.ts` logs in through `LoginPage` with `test-data/images/LoginPage.json`, then saves the session:
  ```ts
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  ```
- `playwright.config.ts`:
  ```ts
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  ```
- `.gitignore` lists `/playwright/.auth/`. Never commit that file, because it holds a live session cookie.

## Writing a test that needs login

Don't log in inside the test. Start at the page you need:

```ts
test('...', async ({ page, dashboardPage }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    await expect(dashboardPage.heading).toBeVisible();
});
```

## Refresh an expired session

If tests land on the login page, save a new session:

```
npx playwright test --project=setup
```

A normal `npx playwright test` also runs `setup` first.

## Open the app logged in, without a test

```
npx playwright open --load-storage=playwright/.auth/user.json <url>
```

## Several users or roles

Add one setup test per role, each saving to its own file (for example `playwright/.auth/admin.json` and `playwright/.auth/ess.json`). Then use either of these:
- one project per role, each with its own `storageState`; or
- `test.use({ storageState: 'playwright/.auth/ess.json' })` at the top of a spec file.

For a login test that must start logged out, add `test.use({ storageState: { cookies: [], origins: [] } })`.
