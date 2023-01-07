import type {
  JSONReport,
  JSONReportSpec,
  JSONReportSuite,
} from '@playwright/test/reporter';
import { basename } from 'path';
import { readFile } from 'fs/promises';
import { getSupabase } from '../supabase';
import type { ReporterOptions } from '../types';

export async function uploadArtefacts(
  reportId: string,
  report: JSONReport,
  options: ReporterOptions
) {
  const { logger, project, publicKey } = options;

  logger.info('Starting to upload artefacts...');

  const failedSpecRunAttachments = flattedSpecs(report.suites)
    .flatMap((s) => s.tests.map((t) => ({ ...t, specId: s.id })))
    .flatMap((t) => t.results.map((r) => ({ ...r, specId: t.specId })))
    .filter((r) => r.status === 'failed')
    .flatMap((r) =>
      r.attachments.map((a) => ({ ...a, specId: r.specId, retry: r.retry }))
    );

  const supabase = getSupabase(project, publicKey);

  await Promise.all(
    failedSpecRunAttachments.map(
      async ({ specId, name, retry, path, contentType }) => {
        const result = await supabase.storage
          .from('artefacts')
          .upload(
            `test-runs/${reportId}/specs/${specId}/retry-${retry}/${name}/${basename(
              path
            )}`,
            await readFile(path),
            {
              contentType: contentType,
            }
          );

        if (result.error != null)
          logger.error(
            `Failed to upload attachement ${path} (${name}) for spec #${specId}`,
            result.error
          );
        else
          logger.debug(
            `Uploaded attachement ${path} (${name}) for spec #${specId}`
          );
      }
    )
  );

  logger.info('Attachments uploaded');
}

function flattedSpecs(suites: JSONReportSuite[]): JSONReportSpec[] {
  const subSuites = suites.flatMap((s) => s.suites ?? []);

  const subSpecs = subSuites.length === 0 ? [] : flattedSpecs(subSuites);
  const specs = suites.flatMap((s) => s.specs ?? []).flatMap((s) => s);

  return [...specs, ...subSpecs];
}
