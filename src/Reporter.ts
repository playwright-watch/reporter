import type {
  Reporter as ReporterBase,
  TestError,
} from '@playwright/test/reporter';
import axios from 'axios';
import consola from 'consola';
import { readFile } from 'fs/promises';
import { getOutput } from './getOutput';
import type { ReporterOptions } from './types';

export class Reporter implements ReporterBase {
  public errorInWorkerProcess: TestError | null = null;

  private readonly options: ReporterOptions;

  constructor(options: ReporterOptions) {
    this.options = {
      ...options,
      logger: options.logger ?? consola.withTag('Playwright Monitor'),
    };
  }

  onStart() {
    const { logger } = this.options;
    logger.log('Report started');
  }

  onError?(error: TestError): void {
    const { logger } = this.options;
    this.errorInWorkerProcess = error;
    logger.error(error);
  }

  async onEnd() {
    const { project, publicKey, target, logger } = this.options;

    if (this.errorInWorkerProcess != null) {
      logger.info(
        "There's an error in worker process, report will not be uploaded"
      );
      return;
    }

    const { reportFile } = getOutput(this.options);
    const resultsReport = await readFile(reportFile);

    const response = await axios.post(
      `https://${project}.functions.supabase.co/upload-report`,
      {
        target,
        report: JSON.parse(resultsReport.toString()),
      },
      {
        headers: {
          Authorization: `Bearer ${publicKey}`,
        },
      }
    );

    if (response.status !== 200) {
      logger.error(
        'Failed to upload report to Playwright Monitor dashboard',
        response.status,
        response.data
      );
    } else {
      logger.info('Report uploaded to Playwright Monitor dashboard');
    }
  }
}
