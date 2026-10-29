import { Page, Locator } from '@playwright/test';

// OrangeHRM fields often have no placeholder or accessible name, only a sibling label
export function groupByLabel(scope: Page | Locator, label: string): Locator {
    // `has` must be page-rooted; a locator from `scope` would search for the form inside the group
    const page = 'goto' in scope ? scope : scope.page();
    return scope.locator('.oxd-input-group')
        .filter({ has: page.getByText(label, { exact: true }) });
}

// OrangeHRM dropdowns are custom divs, not <select>, so open them and click the option
export async function selectOption(page: Page, dropdown: Locator, option: string) {
    await dropdown.click();
    await page.getByRole('option', { name: option, exact: true }).click();
}
