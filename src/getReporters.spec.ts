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
      organization: 'ACME',
      project: 'dynamites',
      supabaseProject: 'acmeproject',
      supabasePublicKey: 'test_key',
    });

    expect(reporters.length).toBe(2);

    const [jsonReporter, reporter] = reporters;

    const [jsonReporterName, jsonReporterOptions] = jsonReporter;

    expect(jsonReporterName).toBe('json');

    expect(jsonReporterOptions).toEqual({
      outputFile: 'test-results/playwright-watch-report.json',
    });

    const [name, options] = reporter;

    expect(name).toBe('@playwright-watch/reporter');

    expect(options).toEqual({
      organization: 'ACME',
      project: 'dynamites',
      supabaseProject: 'acmeproject',
      supabasePublicKey: 'test_key',
    });
  });

  test("Default reporter for project 'ACME' with custom report folder", () => {
    const reporters = getReporters({
      organization: 'ACME',
      project: 'dynamites',
      supabaseProject: 'acmeproject',
      supabasePublicKey: 'test_key',

      testResultsFolder: 'my-folder',
    });

    expect(reporters.length).toBe(2);

    const [jsonReporter, reporter] = reporters;

    const [jsonReporterName, jsonReporterOptions] = jsonReporter;

    expect(jsonReporterName).toBe('json');

    expect(jsonReporterOptions).toEqual({
      outputFile: 'my-folder/playwright-watch-report.json',
    });

    const [name, options] = reporter;

    expect(name).toBe('@playwright-watch/reporter');

    expect(options).toEqual({
      organization: 'ACME',
      project: 'dynamites',
      supabaseProject: 'acmeproject',
      supabasePublicKey: 'test_key',
      testResultsFolder: 'my-folder',
    });
  });
});
