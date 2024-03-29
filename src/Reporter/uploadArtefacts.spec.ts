import { describe, it, jest } from '@jest/globals';
import { expect } from '@playwright/test';
import * as Sentry from '@sentry/node';
import consola from 'consola';
import { uploadArtefacts } from './uploadArtefacts';

const TARGET = 'target';
const KEY = 'key';
const PROJECT = 'test';

const functionsInvoke =
  jest.fn<() => { error: null | unknown; data: null | unknown }>();
const storageUpload = jest.fn();
const storageFrom = jest.fn(() => ({
  upload: storageUpload,
}));

jest.mock('fs/promises', () => ({
  readFile() {
    return 'Hello!';
  },
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

const captureException = jest.spyOn(Sentry, 'captureException');

describe('uploadArtefacts', () => {
  it('Uploads something', async () => {
    await uploadArtefacts(
      '',
      {
        suites: [],
        config: {
          projects: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        errors: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stats: {} as any,
      },
      {
        rootFolder: '.',
        supabaseProject: PROJECT,
        organization: 'ACME',
        api_key: 'key',
        project: TARGET,
        supabasePublicKey: KEY,
        logger: consola.withTag('Playwright Watch'),
      },
    );
  });

  it('Logs to sentry if upload fails', async () => {
    const error = new Error('Some error');

    functionsInvoke.mockImplementationOnce(() => ({
      error,
      data: null,
    }));

    await uploadArtefacts(
      '',
      {
        suites: [
          {
            specs: [
              {
                tests: [
                  {
                    results: [
                      {
                        status: 'failed',
                        attachments: [
                          {
                            name: 'test',
                            path: 'test',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any[],
        config: {
          projects: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        errors: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stats: {} as any,
      },
      {
        rootFolder: '.',
        supabaseProject: PROJECT,
        organization: 'ACME',
        api_key: 'key',
        project: TARGET,
        supabasePublicKey: KEY,
        logger: consola.withTag('Playwright Watch'),
      },
    );

    expect(captureException.mock.calls[0]).toEqual([error]);
  });
});
