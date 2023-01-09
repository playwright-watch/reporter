import { join } from 'path';
import type { ReporterOptions } from './types';

export function getOutput({
  testResultsFolder = 'test-results',
}: ReporterOptions) {
  return {
    reportFile: join(testResultsFolder, 'playwright-watch-report.json'),
  };
}
