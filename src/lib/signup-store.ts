import { createClient } from "@supabase/supabase-js";
import type { RecordedSignupPayload } from "./signup-consent";

export type PersistenceResult = { status: "created" } | { status: "duplicate" } | { status: "error" };
export interface SignupStore { insert(payload: RecordedSignupPayload): Promise<PersistenceResult> }

export class BackendUnconfirmedError extends Error {}

/** Reuses the deployed Lovable beta_signups contract.
 * URL, publishable key configuration, table, mapping, and transport were verified
 * against the live deployment. Local credentials are kept in ignored .env.local.
 * Private schema, email uniqueness, and RLS were inspected through Lovable.
 * A clearly marked QA row verified real insert, duplicate and consent recording.
 */
export function getSignupStore(): SignupStore {
  if (process.env.BETA_SIGNUP_PERSISTENCE !== "supabase") throw new BackendUnconfirmedError("Backend is unconfirmed");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key || !URL.canParse(url) || new URL(url).protocol !== "https:") throw new BackendUnconfirmedError("Missing public insert configuration");
  if (key.startsWith("sb_secret_")) throw new BackendUnconfirmedError("A public insert key is required");
  if (key.startsWith("eyJ")) {
    try {
      const claims = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString());
      if (claims.role !== "anon") throw new BackendUnconfirmedError("A public insert key is required");
    } catch { throw new BackendUnconfirmedError("Invalid public insert key"); }
  }
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(input instanceof Request ? input.headers : undefined);
        new Headers(init?.headers).forEach((value, name) => headers.set(name, value));
        // Exact behavior of the live Lovable client: publishable keys belong in
        // apikey, not in the JWT Authorization slot. Do not remove real JWTs.
        if (key.startsWith("sb_publishable_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers, signal: AbortSignal.timeout(10_000) });
      },
    },
  });
  return {
    async insert(payload) {
      // No select(): preserves insert-only RLS and does not disclose applicants.
      const { error, status } = await client.from("beta_signups").insert(payload);
      if (error?.code === "23505") return { status: "duplicate" };
      if (error || status !== 201) return { status: "error" };
      return { status: "created" };
    },
  };
}
