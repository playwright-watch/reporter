import { describe, expect, jest, test } from '@jest/globals';
import axios from 'axios';
import consola from 'consola';
import { getReporters } from '../getReporters';
import { Reporter } from '.';
import fs from 'fs/promises';

jest.mock('axios');
jest.mock('fs/promises');

const axiosMock = axios as jest.Mocked<typeof axios>;
const fsMock = fs as jest.Mocked<typeof fs>;

const defaultOptions = {
  target: 'ACME',
  project: 'acmeproject',
  publicKey: 'test_key',
};

describe('Reporter', () => {
  const createLogger = () => ({
    debug: jest.fn(consola.debug),
    info: jest.fn(consola.info),
    error: jest.fn(consola.error),
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

    expect(logger.debug).toBeCalledWith('Report started');
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

    expect(axiosMock.post).not.toBeCalled();
    expect(logger.error).not.toBeCalled();
    expect(logger.debug).not.toBeCalled();
    expect(logger.info).toBeCalledWith(
      "There's an error in worker process, report will not be uploaded"
    );
  });

  test('onEnd without error successfully uploads the report', async () => {
    const logger = createLogger();
    const reporter = new Reporter({ ...defaultOptions, logger });

    fsMock.readFile.mockResolvedValue(Buffer.from('{}'));
    axiosMock.post.mockResolvedValue(
      Promise.resolve({
        status: 200,
        data: {},
      })
    );

    await reporter.onEnd();

    expect(axiosMock.post).toBeCalledWith(
      `https://${defaultOptions.project}.functions.supabase.co/upload-report`,
      {
        target: defaultOptions.target,
        report: {},
      },
      {
        headers: {
          Authorization: `Bearer ${defaultOptions.publicKey}`,
        },
      }
    );

    expect(logger.error).not.toBeCalled();
    expect(logger.debug).not.toBeCalled();
    expect(logger.info).toBeCalledWith('Report summary uploaded to dashboard');
  });

  test('onEnd without error but with failed report upload logs error', async () => {
    const logger = createLogger();
    const reporter = new Reporter({ ...defaultOptions, logger });

    fsMock.readFile.mockResolvedValue(Buffer.from('{}'));
    const failedRequest = {
      status: 400,
      data: { error: 'Invalid request' },
    };
    axiosMock.post.mockResolvedValue(Promise.resolve(failedRequest));

    await reporter.onEnd();

    expect(axiosMock.post).toBeCalledWith(
      `https://${defaultOptions.project}.functions.supabase.co/upload-report`,
      {
        target: defaultOptions.target,
        report: {},
      },
      {
        headers: {
          Authorization: `Bearer ${defaultOptions.publicKey}`,
        },
      }
    );

    expect(logger.error).toBeCalledWith(
      'Failed to upload report to dashboard',
      failedRequest.status,
      failedRequest.data
    );
    expect(logger.debug).not.toBeCalled();
    expect(logger.info).not.toBeCalled();
  });
});
