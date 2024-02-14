import type { JSONReport } from '@playwright/test/reporter';
import { getSupabase } from '../supabase';
import type { ReporterOptions } from '../types';
import { uploadArtefacts } from './uploadArtefacts';
import { uploadHtmlReportSummary } from './uploadHtmlReportSummary';

export async function uploadReport(
  report: JSONReport,
  options: ReporterOptions,
) {
  const {
    logger,
    supabaseProject,
    project,
    supabasePublicKey,
    organization,
    api_key,
  } = options;

  const supabase = getSupabase(supabaseProject, supabasePublicKey);

  const response = await supabase.functions.invoke<{ data: { id: string } }>(
    'protected',
    {
      body: {
        command: 'upload-report',
        organization,
        api_key,
        project,
        report,
      },
    },
  );

  if (response.error != null || response.data == null) {
    logger.error('Failed to upload report to dashboard', response.error);

    return;
  }

  const { data } = response.data;

  logger.info('Report summary uploaded to dashboard');

  await uploadHtmlReportSummary(data.id, options);

  await uploadArtefacts(data.id, report, options);

  logger.info('Report upload complete');
}
