import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3000", channel: "chrome", headless: true },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    // Never reuse a user's live-enabled local server for form tests.
    reuseExistingServer: false,
    env: { BETA_SIGNUP_PERSISTENCE: "disabled", SUPABASE_URL: "", SUPABASE_PUBLISHABLE_KEY: "", SUPABASE_ANON_KEY: "" },
    timeout: 60_000,
  },
});
