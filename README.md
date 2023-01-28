# Playwright Watch reporter

A reporter for Playwright Watch, a tool for tracking and analyzing playwright test results.

## Installation

Install package with `npm`, `yarn`, or `pnpm`:

```sh
npm install --save-dev @playwright-watch/playwright-watch-reporter
# or
yard add --dev @playwright-watch/playwright-watch-reporter
# or
pnpm install --save-dev @playwright-watch/playwright-watch-reporter
```

Register reporter in your `playwright.config.ts`:

```ts
import { PlaywrightTestConfig } from '@playwright/test';
import {
  getMetadata,
  getReporters,
} from '@playwright-watch/playwright-watch-reporter';

const config: PlaywrightTestConfig = {
  // ...
  metadata: {
    // ...
    ...getMetadata(),
  },
  reporter: [
    // ...
    ...getReporters({
      organization: '<your_organization_slug>',
      project: '<your_project_slug>',
      api_ket: '<your_organization_api_key>',
      supabaseProject: '<playwright_watch_supabase_project>',
      supabasePublicKey: '<playwright_watch_supabase_public_key>',
    }),
  ],
};

export default config;
```

## Command-line interface

A reporter can be used as a command-line tool.

### Environment Variables

The following environment variables need to be set in order for the app to function properly:

- `PLAYWRIGHT_WATCH_ORGANIZATION`: Your organization slug. Can be found [ organization's settings](https://playwright.watch/settings).
- `PLAYWRIGHT_WATCH_API_KEY`: Your organization API key. Can be viewed [in organization's settings](https://playwright.watch/settings).

> **Warning**
> API key should be stored securely. Do not commit it in your repository.

- `PLAYWRIGHT_WATCH_PROJECT`: Project of the report. Projects can be created [at projects list](https://playwright.watch/projects).
- `PLAYWRIGHT_WATCH_SUPABASE_PROJECT`: Supabase project ID.
- `PLAYWRIGHT_WATCH_SUPABASE_PUBLIC_KEY`: Public key of your supabase project.
