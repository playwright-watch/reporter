import type { Consola } from 'consola';

export type Logger = Pick<Console | Consola, 'debug' | 'info' | 'error'>;

export interface ReporterOptions {
  target: string;
  project: string;
  publicKey: string;

  logger?: Logger;
  testResultsFolder?: string;
}
