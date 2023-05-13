import * as Sentry from '@sentry/node';
import { readFile } from 'fs/promises';
import { getSupabase } from '../supabase';
import type { ReporterOptions } from '../types';
import { extractBase64ReportFromHtml } from './extractBase64ReportFromHtml';
import { getHtmlOutput } from '../getOutput';

export async function uploadHtmlReportSummary(
  reportId: string,
  options: ReporterOptions
) {
  const {
    logger,
    organization,
    api_key,
    project,
    supabaseProject,
    supabasePublicKey,
  } = options;

  logger.info('Starting to upload HTML summary...');

  const htmlReportFile = await readFile(getHtmlOutput(options).htmlFile);
  const htmlBase64Report = extractBase64ReportFromHtml(
    htmlReportFile.toString()
  );

  const supabase = getSupabase(supabaseProject, supabasePublicKey);

  const filePath = `${project}/test-runs/${reportId}/html-report.zip`;

  const result = await supabase.functions.invoke('protected', {
    body: {
      command: 'upload-artefact',
      organization,
      api_key,
      path: filePath,
      file: htmlBase64Report,
      contentType: 'application/zip',
    },
  });

  if (result.error != null) {
    logger.error(`Failed to upload base64 HTML report`, result.error);
    Sentry.captureException(result.error);
  } else logger.debug(`Uploaded base64 HTML report`);

  logger.info('HTML report summary uploaded');
}
