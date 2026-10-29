---
name: playwright-ci
description: Run this Playwright suite in CI/CD (GitHub Actions) with traces and the HTML report uploaded as artifacts. Use when asked to set up CI, a pipeline, or a GitHub workflow, or to get traces from CI runs.
---

# Playwright in CI/CD

## Config changes CI needs

In `playwright.config.ts`:

```ts
use: {
    trace: 'on-first-retry',     // retries: 2 on CI, so failures get a trace
    headless: !!process.env.CI,  // CI runners have no display; headless: false breaks them
},
```

`retries`, `workers` and `forbidOnly` already switch on `process.env.CI`. GitHub Actions sets `CI=true` automatically.

## Workflow: `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: |
            playwright-report/
            traces/
          retention-days: 7
```

The artifact path is `traces/` because the config sets `outputDir: './traces'`.

## Prerequisites

- The project must be a git repo pushed to GitHub (`git init` first if it isn't one).
- `package-lock.json` must be committed, because `npm ci` needs it.
- `playwright/.auth/` stays gitignored. The `setup` project logs in fresh on each CI run.
- If the credentials ever become real secrets, move them to GitHub Secrets and read them with `process.env` instead of the JSON file.

## View a CI trace

1. Download the `playwright-report` artifact from the run page.
2. Run `npx playwright show-report playwright-report`, or `npx playwright show-trace traces/<test>/trace.zip`, or drop the zip onto https://trace.playwright.dev.
