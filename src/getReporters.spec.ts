import { expect, test, describe } from '@jest/globals';
import { getReporters } from './index';

describe('getReporters', () => {
  test(`Package index should export ${getReporters.name}`, () => {
    const indexGetReporters: typeof getReporters =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./index').getReporters;

    expect(typeof indexGetReporters).toBe('function');
    expect(indexGetReporters).toBe(getReporters);
  });

  test("Default reporter for project 'ACME'", () => {
    const reporters = getReporters({
      target: 'ACME',
      project: 'acmeproject',
      publicKey: 'test_key',
    });

    expect(reporters.length).toBe(2);

    const [jsonReporter, reporter] = reporters;

    const [jsonReporterName, jsonReporterOptions] = jsonReporter;

    expect(jsonReporterName).toBe('json');

    expect(jsonReporterOptions).toEqual({
      outputFile: 'test-results/playwright-monitor-report.json',
    });

    const [name, options] = reporter;

    expect(name).toBe('@thehatsky/playwright-monitor-reporter');

    expect(options).toEqual({
      target: 'ACME',
      project: 'acmeproject',
      publicKey: 'test_key',
    });
  });

  test("Default reporter for project 'ACME'", () => {
    const reporters = getReporters({
      target: 'ACME',
      project: 'acmeproject',
      publicKey: 'test_key',

      testResultsFolder: 'my-folder',
    });

    expect(reporters.length).toBe(2);

    const [jsonReporter, reporter] = reporters;

    const [jsonReporterName, jsonReporterOptions] = jsonReporter;

    expect(jsonReporterName).toBe('json');

    expect(jsonReporterOptions).toEqual({
      outputFile: 'my-folder/playwright-monitor-report.json',
    });

    const [name, options] = reporter;

    expect(name).toBe('@thehatsky/playwright-monitor-reporter');

    expect(options).toEqual({
      target: 'ACME',
      project: 'acmeproject',
      publicKey: 'test_key',
      testResultsFolder: 'my-folder',
    });
  });
});
