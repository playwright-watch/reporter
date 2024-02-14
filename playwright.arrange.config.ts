import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import configBase from './playwright.config';
import { getReporters } from './src';

const config: PlaywrightTestConfig = {
  ...configBase,

  testDir: './e2e/arrange',
  reporter: [
    ...getReporters({
      project: 'arranged-tests',
      allowTelemetry: true,
    }),
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'iphone',
      use: {
        ...devices['iPhone 13 Mini'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
  ],
};

export default config;
