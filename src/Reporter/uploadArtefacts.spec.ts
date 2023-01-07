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
        project: PROJECT,
        target: TARGET,
        publicKey: KEY,
        logger: consola.withTag('Playwright Monitor'),
      }
    );
  });
});
