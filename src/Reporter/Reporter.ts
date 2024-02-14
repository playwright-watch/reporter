import type {
  Reporter as ReporterBase,
  TestError,
} from '@playwright/test/reporter';
import * as Sentry from '@sentry/node';
import consola from 'consola';
import type { ReporterOptions } from '../types';
import { getReport } from './getReport';
import { uploadReport } from './uploadReport';

const SENTRY_DSN =
  'https://43666d7026cd4f6191d47bff594d6e9e@o1285163.ingest.sentry.io/4504742442041344';

export class Reporter implements ReporterBase {
  public errorInWorkerProcess: TestError | null = null;

  private readonly options: ReporterOptions;

  constructor(options: ReporterOptions) {
    this.options = {
      ...options,
      logger: options.logger ?? consola.withTag('Playwright Watch'),
    };

    if (options.allowTelemetry) {
      Sentry.init({
        dsn: SENTRY_DSN,
        tracesSampleRate: 1.0,
      } as unknown as Sentry.NodeOptions);
    }
  }

  onStart() {
    const { logger } = this.options;
    logger.debug('Test run started');
  }

  onError?(error: TestError): void {
    const { logger, allowTelemetry } = this.options;
    this.errorInWorkerProcess = error;
    logger.error(error);

    if (allowTelemetry) {
      Sentry.captureException(error);
    }
  }

  async onEnd() {
    const { logger, allowTelemetry } = this.options;

    if (this.errorInWorkerProcess != null) {
      logger.info(
        "There's an error in worker process, report will not be uploaded",
      );
      return;
    }

    try {
      const report = await getReport(this.options);

      await uploadReport(report, this.options);
    } catch (error) {
      if (allowTelemetry) {
        Sentry.captureException(error);
      }
    }
  }
}
