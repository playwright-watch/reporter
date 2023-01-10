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
      organization: '<your_organization_name>',
      project: '<your_project_name>',
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

- `PLAYWRIGHT_WATCH_ORGANIZATION`: Your organization slug
- `PLAYWRIGHT_WATCH_PROJECT`: Project of the report
- `SUPABASE_PROJECT`: Supabase project ID
- `SUPABASE_KEY`: Public key of your supabase project
