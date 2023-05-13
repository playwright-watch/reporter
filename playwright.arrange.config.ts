import type { PlaywrightTestConfig } from '@playwright/test';
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
};

export default config;
