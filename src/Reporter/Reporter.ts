import type {
  Reporter as ReporterBase,
  TestError,
} from '@playwright/test/reporter';
import consola from 'consola';
import type { ReporterOptions } from '../types';
import { getReport } from './getReport';
import { uploadReport } from './uploadReport';

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
    logger.debug('Test run started');
  }

  onError?(error: TestError): void {
    const { logger } = this.options;
    this.errorInWorkerProcess = error;
    logger.error(error);
  }

  async onEnd() {
    const { logger } = this.options;

    if (this.errorInWorkerProcess != null) {
      logger.info(
        "There's an error in worker process, report will not be uploaded"
      );
      return;
    }

    const report = await getReport(this.options);

    await uploadReport(report, this.options);
  }
}
