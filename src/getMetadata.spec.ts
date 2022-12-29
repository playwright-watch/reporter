import { jest, beforeEach, expect, test, describe } from '@jest/globals';
import * as Metadata from './getMetadata';

describe('getMetadata', () => {
  const OLD_ENV = process.env;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const getMetadata = () => require('./index').getMetadata();

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  test(`Package index should export ${Metadata.getMetadata.name}`, () => {
    const indexGetMetadata: typeof Metadata.getMetadata =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./index').getMetadata;

    expect(typeof indexGetMetadata).toBe('function');
    expect(indexGetMetadata.name).toEqual(Metadata.getMetadata.name);
  });

  test('Empty metadata', () => {
    process.env = {};

    expect(getMetadata).not.toThrow();
    const emptyMetadata = getMetadata();

    expect(emptyMetadata).toEqual({});
  });

  test('Github metadata read from environment', async () => {
    process.env.GITHUB_ACTIONS = '1';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'example/qa-stuff';
    process.env.GITHUB_RUN_ID = '782138031';

    expect(getMetadata).not.toThrow();
    const emptyMetadata = getMetadata();

    expect(emptyMetadata).toEqual({
      github: {
        runUrl: 'https://github.com/example/qa-stuff/actions/runs/782138031',
      },
    });
  });

  test('Github metadata is not read without GITHUB_ACTIONS', async () => {
    process.env.GITHUB_ACTIONS = '';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'example/qa-stuff';
    process.env.GITHUB_RUN_ID = '782138031';

    expect(getMetadata).not.toThrow();
    const emptyMetadata = getMetadata();

    expect(emptyMetadata).toEqual({});
  });
});
