import type { JSONReport } from '@playwright/test/reporter';
import { readFile } from 'fs/promises';
import { getOutput } from '../getOutput';
import type { ReporterOptions } from '../types';

export async function getReport(options: ReporterOptions): Promise<JSONReport> {
  const { reportFile } = getOutput(options);
  const resultsReport = await readFile(reportFile);
  const report = JSON.parse(resultsReport.toString()) as JSONReport;

  return report;
}
