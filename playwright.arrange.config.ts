import type { PlaywrightTestConfig } from '@playwright/test';
import configBase from './playwright.config';
import { getReporters } from './src';

const config: PlaywrightTestConfig = {
  ...configBase,

  testDir: './e2e/arrange',
  reporter: [
    ['html'],
    ...getReporters({
      project: 'arranged-tests',
    }),
  ],
};

export default config;
