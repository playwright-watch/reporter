declare namespace NodeJS {
  export interface ProcessEnv {
    PLAYWRIGHT_WATCH_E2E_TEST_RUN?: string;
    PLAYWRIGHT_WATCH_E2E_ARRANGE?: string;

    PLAYWRIGHT_WATCH_API_KEY?: string;
    PLAYWRIGHT_WATCH_ORGANIZATION?: string;
    PLAYWRIGHT_WATCH_PROJECT?: string;
    PLAYWRIGHT_WATCH_SUPABASE_PROJECT?: string;
    PLAYWRIGHT_WATCH_SUPABASE_PUBLIC_KEY?: string;
  }
}
