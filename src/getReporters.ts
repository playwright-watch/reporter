import type { ReporterDescription } from '@playwright/test/types/test';
import { name } from '../package.json';
import type { ReporterOptions } from './types';
import { getOutput } from './getOutput';

export function getReporters(
  options: Partial<ReporterOptions> = {}
): ReporterDescription[] {
  const filledOptions: ReporterOptions = {
    organization: process.env.PLAYWRIGHT_WATCH_ORGANIZATION,
    api_key: process.env.PLAYWRIGHT_WATCH_API_KEY,
    project: process.env.PLAYWRIGHT_WATCH_PROJECT,
    supabaseProject: process.env.PLAYWRIGHT_WATCH_SUPABASE_PROJECT,
    supabasePublicKey: process.env.PLAYWRIGHT_WATCH_SUPABASE_PUBLIC_KEY,
    ...options,
  };

  if (filledOptions.supabasePublicKey == null)
    throw new Error('Supabase public key is required.');

  const { reportFile } = getOutput(filledOptions);

  const reporterName = process.env.PLAYWRIGHT_WATCH_E2E_TEST_RUN
    ? './src'
    : name;

  return [
    ['json', { outputFile: reportFile }],
    [reporterName, filledOptions],
  ];
}
