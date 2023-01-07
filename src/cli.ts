#!/usr/bin/env node
import consola from 'consola';
import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getReport } from './Reporter/getReport';
import { uploadArtefacts } from './Reporter/uploadArtefacts';
import { ReporterOptions } from './types';

const defaultOptions: ReporterOptions = {
  project: process.env.SUPABASE_PROJECT,
  publicKey: process.env.SUPABASE_KEY,
  target: 'test',
  logger: consola.withTag('Playwright Monitor'),
  testResultsFolder: '',
};

Yargs(hideBin(process.argv))
  .scriptName('playwright-monitor-reporter')
  .usage('$0 <cmd> [args]')
  .demandCommand()
  .command<{
    path: string;
  }>(
    'upload [path]',
    'upload a test report with all artefacts',
    (yargs) => {
      yargs.positional('path', {
        type: 'string',
        describe: 'path to report folder',
      });
    },
    async function (argv) {
      const options: ReporterOptions = {
        ...defaultOptions,
        testResultsFolder: argv.path,
      };

      const report = await getReport(options);

      uploadArtefacts('98c3ed27-5a75-4506-893a-6a8d454347a3', report, options);
    }
  )
  .help().argv;
