---
name: add-page-object
description: Add a new OrangeHRM page object and register it as a Playwright fixture. Use when a test needs a page that has no class under tests/Pages yet (e.g. Leave, Admin, Time), or when asked to create a page object or fixture.
---

# Add a page object and fixture

## 1. Create the class in `tests/Pages/<Name>Page.ts`

Follow the existing style: `readonly` locators, set in the constructor, user-facing locators first.

```ts
import { Page, Locator } from "@playwright/test";

export class LeavePage {
    readonly page: Page;
    readonly url: string;
    readonly heading: Locator;
    readonly leaveTypeDropdown: Locator;
    readonly applyButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.url = 'https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave';
        this.heading = page.getByRole('heading', { name: 'Apply Leave' });
        this.leaveTypeDropdown = page.locator('.oxd-input-group')
            .filter({ has: page.getByText('Leave Type', { exact: true }) })
            .locator('.oxd-select-text');
        this.applyButton = page.getByRole('button', { name: 'Apply' });
    }
}
```

OrangeHRM dropdowns are custom divs, not `<select>`. Locate the `.oxd-select-text` inside the input group whose label matches the field. Then pick a value with `selectOption(page, dropdown, option)` from `tests/utils/orangeHrmUtils.ts`.

## 2. Register it in `tests/fixtures/pageFixtures.ts`

Import the class, then add it to the `PageFixtures` type and to `base.extend`:

```ts
import { LeavePage } from '../Pages/LeavePage';

type PageFixtures = {
    // ...existing
    leavePage: LeavePage;
};

export const test = base.extend<PageFixtures>({
    // ...existing
    leavePage: async ({ page }, use) => {
        await use(new LeavePage(page));
    },
});
```

## 3. Use it in a spec

```ts
import { test, expect } from './fixtures/pageFixtures';

test('apply leave', async ({ page, leavePage }) => {
    await page.goto(leavePage.url);
    await expect(leavePage.heading).toBeVisible();
});
```

- Import `test` and `expect` from `./fixtures/pageFixtures`, never from `@playwright/test`.
- Don't call `new XPage(page)` inside tests. Ask for the fixture by name instead.
- Put test data in `test-data/<Name>Page.json` and import it. Don't hard-code it.

## 4. Check it

```
npx playwright test --list
```

The new spec should appear under `[chromium]`.
