import type { createConsola } from 'consola';

export type Logger = Pick<
  Console | ReturnType<typeof createConsola>,
  'debug' | 'info' | 'error'
>;

export interface ReporterOptions {
  /**
   * Path to root directory where test folders will be created.
   */
  rootFolder: string;

  /**
   * Organization's slug name.
   *
   * Can be found at https://playwright.watch/settings.
   *
   * @default process.env.PLAYWRIGHT_WATCH_ORGANIZATION
   */
  organization: string;

  /**
   * Project's slug name.
   *
   * Projects can be created at https://playwright.watch/projects.
   *
   * @default process.env.PLAYWRIGHT_WATCH_PROJECT
   */
  project: string;

  /**
   * Organization's API key.
   *
   * CAUTION. API key should be stored securely. Do not commit it in your repository.
   *
   * Can be viewed in organization's settings https://playwright.watch/settings.
   *
   * @default process.env.PLAYWRIGHT_WATCH_API_KEY
   */
  api_key: string;

  /**
   * Supabase project.
   *
   * @default process.env.PLAYWRIGHT_WATCH_SUPABASE_PROJECT
   */
  supabaseProject: string;

  /**
   * Supabase public key.
   *
   * @default process.env.PLAYWRIGHT_WATCH_SUPABASE_PUBLIC_KEY
   */
  supabasePublicKey: string;

  /**
   * Custom logger.
   *
   * @default Consola
   * @see https://www.npmjs.com/package/consola
   */
  logger?: Logger;

  /**
   * Output directory of playwright tests.
   *
   * @default test-results
   */
  testResultsFolder?: string;

  /**
   * Allow @playwright-watch to collect telemetry via Senty
   *
   * @default false
   */
  allowTelemetry?: boolean;
}
