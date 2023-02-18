import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import consola from 'consola';
import { Reporter } from '.';
import fs from 'fs/promises';
import { getReporters } from '../getReporters';

const functionsInvoke =
  jest.fn<() => { error: null | unknown; data: null | unknown }>();
const storageUpload = jest.fn();
const storageFrom = jest.fn(() => ({
  upload: storageUpload,
}));

jest.mock('../supabase', () => ({
  getSupabase: () => ({
    functions: {
      invoke: functionsInvoke,
    },
    storage: {
      from: storageFrom,
    },
  }),
}));

jest.mock('fs/promises');
const fsMock = fs as jest.Mocked<typeof fs>;

const defaultOptions = {
  organization: 'ACME',
  api_key: 'apikey',
  project: 'dynamites',
  supabaseProject: 'acmeproject',
  supabasePublicKey: 'test_key',
};

describe('Reporter', () => {
  const createLogger = () => ({
    debug: jest.fn(consola.debug),
    info: jest.fn(consola.info),
    error: jest.fn(consola.error),
  });

  beforeEach(() => {
    functionsInvoke.mockReset();
    storageUpload.mockReset();
    storageFrom.mockReset();
  });

  test('Create a reporter from default options', () => {
    const [, reporterArguments] = getReporters(defaultOptions);

    const [, options] = reporterArguments;

    const reporter = new Reporter(options);
    expect(reporter).toBeDefined();
    expect(reporter).not.toBeNull();
  });

  test('Default export should be a Reporter constructor', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DefaultExportReporter: typeof Reporter = require('../index').default;

    const reporter = new DefaultExportReporter(defaultOptions);

    expect(reporter).toBeDefined();
    expect(reporter).not.toBeNull();
  });

  test('onStart calls log', () => {
    const logger = createLogger();

    const reporter = new Reporter({
      ...defaultOptions,
      logger,
    });

    expect(logger.debug).not.toBeCalled();

    reporter.onStart();

    expect(logger.debug).toBeCalledWith('Test run started');
  });

  test('onError logs error and memos it in state', () => {
    const logger = createLogger();

    const reporter = new Reporter({
      ...defaultOptions,
      logger,
    });

    const error = {
      message: 'Error message',
      stack: 'Some stack info',
      value: 'Some value',
    };

    expect(logger.error).not.toBeCalled();
    expect(reporter.errorInWorkerProcess).toBeNull();

    reporter.onError(error);

    expect(logger.info).not.toBeCalled();
    expect(logger.debug).not.toBeCalled();
    expect(logger.error).toBeCalledWith(error);
    expect(reporter.errorInWorkerProcess).toEqual(error);
  });

  test('onEnd with error only logs', async () => {
    const logger = createLogger();
    const reporter = new Reporter({ ...defaultOptions, logger });

    reporter.errorInWorkerProcess = {
      message: 'Error',
    };

    await reporter.onEnd();

    // expect(fetchMock).not.toBeCalled();
    expect(logger.error).not.toBeCalled();
    expect(logger.debug).not.toBeCalled();
    expect(logger.info).toBeCalledWith(
      "There's an error in worker process, report will not be uploaded"
    );
  });

  test('onEnd without error successfully uploads the report without artifacts', async () => {
    const logger = createLogger();
    const reporter = new Reporter({ ...defaultOptions, logger });

    const report = {
      suites: [],
    };

    functionsInvoke.mockReturnValue({
      error: null,
      data: {
        data: {
          id: 'test',
        },
      },
    });

    fsMock.readFile.mockResolvedValue(Buffer.from(JSON.stringify(report)));

    await reporter.onEnd();

    expect(functionsInvoke).toBeCalledWith('protected', {
      body: {
        command: 'upload-report',
        organization: defaultOptions.organization,
        api_key: defaultOptions.api_key,
        project: defaultOptions.project,
        report: report,
      },
    });

    expect(storageFrom).not.toBeCalled();
    expect(logger.error).not.toBeCalled();
    expect(logger.debug).not.toBeCalled();
    expect(logger.info).toBeCalledWith('Report summary uploaded to dashboard');
  });

  test('onEnd without error but with failed report upload logs error', async () => {
    const logger = createLogger();
    const reporter = new Reporter({ ...defaultOptions, logger });

    const report = {
      suites: [],
    };

    const error = {
      message: 'Invalid request',
    };

    functionsInvoke.mockReturnValue({
      error,
      data: null,
    });

    fsMock.readFile.mockResolvedValue(Buffer.from(JSON.stringify(report)));

    await reporter.onEnd();

    expect(logger.error).toBeCalledWith(
      'Failed to upload report to dashboard',
      error
    );
    expect(logger.debug).not.toBeCalled();
    expect(logger.info).not.toBeCalled();
  });
});
