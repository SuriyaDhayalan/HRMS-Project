---
name: playwright-trace
description: Create and open Playwright trace files (trace.zip) for this project. Use when asked to record a trace, debug a failing test with the trace viewer, or find where trace files are written.
---

# Playwright traces

## Where traces go

`playwright.config.ts` sets `outputDir: './traces'`. Each test writes its trace to:

```
traces/<test-name>-<project>/trace.zip
```

Playwright wipes `traces/` at the start of every run, so only the latest run's traces are kept.

## Record a trace

The config uses `trace: 'on-first-retry'`, and `retries` is 0 locally, so a normal local run records no trace. Force one from the command line instead of editing the config:

```
npx playwright test --trace on
```

To record a single test only:

```
npx playwright test tests/LoginPage.spec.ts --trace on
```

## Open a trace

```
npx playwright show-trace traces/<test-name>-<project>/trace.zip
```

You can also drop the zip onto https://trace.playwright.dev, or open `npx playwright show-report`, where each failed test links to its trace.

## Trace modes (`use.trace` in config)

| Mode | Records |
|---|---|
| `'on-first-retry'` | only when a test is retried (current setting, cheap on CI) |
| `'retain-on-failure'` | every test, but keeps only failed ones |
| `'on'` | every test, keeps all |
| `'off'` | nothing |

## Debugging with a trace

1. Run with `--trace on` and find the `trace.zip` path that the failure output prints.
2. Open it and go to the failed action. Check the action's log for messages such as `<div class="oxd-form-loader"> intercepts pointer events`.
3. Use the before/after DOM snapshots to see what blocked the action.
