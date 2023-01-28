import { describe, it, jest } from '@jest/globals';
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

describe('uploadArtefacts', () => {
  it('Uploads something', async () => {
    await uploadArtefacts(
      '',
      {
        suites: [],
        config: {
          projects: [],
        } as any,
        errors: [],
      },
      {
        supabaseProject: PROJECT,
        organization: 'ACME',
        api_key: 'key',
        project: TARGET,
        supabasePublicKey: KEY,
        logger: consola.withTag('Playwright Watch'),
      }
    );
  });
});
