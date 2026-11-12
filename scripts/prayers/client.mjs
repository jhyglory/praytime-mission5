import { createClient } from "@supabase/supabase-js";
import { seedEnvironment } from "./seed-lib.mjs";

/**
 * Node-only CLI client. Never import this module into a browser component.
 * @param {Record<string, string | undefined>} [env]
 * @param {typeof fetch} [fetchImpl]
 */
export function createPrayerSeedClient(env = process.env, fetchImpl = fetch) {
  const configuration = seedEnvironment(env);
  const { url, key, legacy } = configuration;
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(input instanceof Request ? input.headers : undefined);
        new Headers(init?.headers).forEach((value, name) => headers.set(name, value));
        // Modern sb_secret_* API keys are not JWT bearer tokens. Keep legacy JWTs intact.
        if (key.startsWith("sb_secret_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        const signals = [input instanceof Request ? input.signal : undefined, init?.signal, AbortSignal.timeout(15_000)].filter(Boolean);
        return fetchImpl(input, { ...init, headers, cache: "no-store", signal: AbortSignal.any(signals) });
      },
    },
  });
  return { client, legacy };
}
