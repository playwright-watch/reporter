import type { JSONReport } from '@playwright/test/reporter';
import axios from 'axios';
import { getSupabase } from '../supabase';
import type { ReporterOptions } from '../types';
import { uploadArtefacts } from './uploadArtefacts';

export async function uploadReport(
  report: JSONReport,
  options: ReporterOptions
) {
  const { logger, project, target, publicKey } = options;

  const supabase = getSupabase(project, publicKey);

  const response = await supabase.functions.invoke<{ data: { id: string } }>(
    'upload-report',
    {
      body: {
        target,
        report,
      },
    }
  );

  if (response.error != null || response.data == null) {
    logger.error('Failed to upload report to dashboard', response.error);

    return;
  }

  const { data } = response.data;

  logger.info('Report summary uploaded to dashboard');

  await uploadArtefacts(data.id, report, options);

  logger.info('Report upload complete');
}
