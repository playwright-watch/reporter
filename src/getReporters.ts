import type { ReporterDescription } from '@playwright/test/types/test';
import { name } from '../package.json';
import type { ReporterOptions } from './types';
import { getOutput } from './getOutput';

export function getReporters(options: ReporterOptions): ReporterDescription[] {
  const { reportFile } = getOutput(options);

  return [
    ['json', { outputFile: reportFile }],
    [name, options],
  ];
}
