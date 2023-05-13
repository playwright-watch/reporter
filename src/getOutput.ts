import { join } from 'path';
import type { ReporterOptions } from './types';

export function getJsonOutput({
  testResultsFolder = 'test-results',
}: ReporterOptions) {
  return {
    reportFile: join(testResultsFolder, 'playwright-watch-report.json'),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getHtmlOutput(_: ReporterOptions) {
  return {
    folder: 'playwright-report',
    htmlFile: join('playwright-report', 'index.html'),
  };
}
