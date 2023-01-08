import { describe, it } from '@jest/globals';
import consola from 'consola';
import { uploadArtefacts } from './uploadArtefacts';

const TARGET = 'target';
const KEY = 'key';
const PROJECT = 'test';

describe('uploadArtefacts', () => {
  it('Uploads something', () => {
    uploadArtefacts(
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
        project: TARGET,
        supabasePublicKey: KEY,
        logger: consola.withTag('Playwright Watch'),
      }
    );
  });
});
