#!/usr/bin/env node
import consola from 'consola';
import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getReport } from './Reporter/getReport';
import { uploadArtefacts } from './Reporter/uploadArtefacts';
import { ReporterOptions } from './types';

const defaultOptions: ReporterOptions = {
  supabaseProject: process.env.PLAYWRIGHT_WATCH_SUPABASE_PROJECT,
  supabasePublicKey: process.env.PLAYWRIGHT_WATCH_SUPABASE_PUBLIC_KEY,
  organization: process.env.PLAYWRIGHT_WATCH_ORGANIZATION,
  project: process.env.PLAYWRIGHT_WATCH_PROJECT,
  api_key: process.env.PLAYWRIGHT_WATCH_API_KET,
  logger: consola.withTag('Playwright Watch'),
  testResultsFolder: '',
};

Yargs(hideBin(process.argv))
  .scriptName('playwright-watch-reporter')
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
