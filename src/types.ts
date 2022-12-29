import type { Consola } from 'consola';

export type Logger = Console | Pick<Consola, 'error' | 'info' | 'log'>;

export interface ReporterOptions {
  target: string;
  project: string;
  publicKey: string;

  logger?: Logger;
  testResultsFolder?: string;
}
