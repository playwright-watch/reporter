import { join } from 'path';
import type { ReporterOptions } from './types';

export function getJsonOutput({
  rootFolder,
  testResultsFolder = 'test-results',
}: ReporterOptions) {
  return {
    reportFile: join(
      rootFolder,
      testResultsFolder,
      'playwright-watch-report.json'
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getHtmlOutput({ rootFolder }: ReporterOptions) {
  return {
    folder: join(rootFolder, 'playwright-report'),
    htmlFile: join(rootFolder, 'playwright-report', 'index.html'),
  };
}
