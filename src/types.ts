import type { Consola } from 'consola';

export type Logger = Pick<Console | Consola, 'debug' | 'info' | 'error'>;

export interface ReporterOptions {
  project: string;
  organization: string;
  api_key: string;

  supabaseProject: string;
  supabasePublicKey: string;

  logger?: Logger;
  testResultsFolder?: string;
}
