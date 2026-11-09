import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestSchema, toPayload } from "../src/lib/beta-signup";
import { createSignupHandler } from "../src/lib/signup-handler";
import { BackendUnconfirmedError, getSignupStore, type SignupStore } from "../src/lib/signup-store";
import { recordSignupConsent } from "../src/lib/signup-consent";
import { PRIVACY_POLICY_VERSION } from "../src/lib/privacy-policy";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const valid = {
  nickname: "  테스트  ", email: " TEST@EXAMPLE.COM ", os: "iPhone", signup_reason: ["SNS·숏폼 사용을 줄이고 싶어서"], age_range: null, target_apps: ["Instagram"], reduction_methods: [], consent: true,
  company: "", attribution: { utm_source: "qa", utm_medium: null, utm_campaign: null, utm_content: null, referrer: null },
};
function request(data: unknown = valid, origin = "https://praytime.test") {
  return new Request("https://praytime.test/api/beta-signup", { method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(data) });
}
beforeEach(() => {
  vi.stubEnv("VERCEL_ENV", "test");
  vi.stubEnv("BETA_SIGNUP_PERSISTENCE", "disabled");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "");
  vi.stubEnv("SUPABASE_ANON_KEY", "");
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Live network is forbidden in unit tests"); }));
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("Beta signup boundary", () => {
  it("blocks production writes during legal review even if persistence is configured", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("BETA_SIGNUP_PERSISTENCE", "supabase");
    const getStore = vi.fn();
    const response = await createSignupHandler(getStore, () => new Date(), false)(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ status: "error", code: "PRIVACY_REVIEW_REQUIRED" });
    expect(getStore).not.toHaveBeenCalled();
  });
  it.each(["nickname", "email", "os", "signup_reason"] as const)("rejects missing required %s before persistence", async field => {
    const payload: Record<string, unknown> = { ...valid };
    delete payload[field];
    const insert = vi.fn();
    const response = await createSignupHandler(() => ({ insert }))(request(payload));
    expect(response.status).toBe(422);
    expect((await response.json()).errors[field]).toBeDefined();
    expect(insert).not.toHaveBeenCalled();
  });
  it("rejects invalid email independently of all other fields", async () => {
    const insert = vi.fn();
    const response = await createSignupHandler(() => ({ insert }))(request({ ...valid, email: "invalid-email" }));
    expect(response.status).toBe(422);
    expect((await response.json()).errors.email).toBeDefined();
    expect(insert).not.toHaveBeenCalled();
  });
  it("validates and maps all eight groups without inventing DB columns", () => {
    const payload = toPayload(requestSchema.parse(valid));
    expect(payload).toEqual({ nickname: "테스트", email: "test@example.com", os: "iPhone", signup_reason: "SNS·숏폼 사용을 줄이고 싶어서", age_range: null, target_apps: ["Instagram"], reduction_methods: [], utm_source: "qa", utm_medium: null, utm_campaign: null, utm_content: null, referrer: null });
    expect(payload).not.toHaveProperty("consent");
    expect(payload).not.toHaveProperty("utm_term");
  });
  it("rejects invalid fields without calling persistence", async () => {
    const insert = vi.fn();
    const response = await createSignupHandler(() => ({ insert }))(request({ ...valid, nickname: "", email: "wrong@", os: "", signup_reason: [], consent: false }));
    expect(response.status).toBe(422);
    expect(Object.keys((await response.json()).errors)).toEqual(expect.arrayContaining(["nickname", "email", "os", "signup_reason", "consent"]));
    expect(insert).not.toHaveBeenCalled();
  });
  it("rejects forged optional values and oversized attribution", async () => {
    const insert = vi.fn();
    expect((await createSignupHandler(() => ({ insert }))(request({ ...valid, age_range: "unknown", target_apps: ["invented"] }))).status).toBe(422);
    expect((await createSignupHandler(() => ({ insert }))(request({ ...valid, attribution: { utm_source: "x".repeat(201) } }))).status).toBe(422);
    expect(insert).not.toHaveBeenCalled();
  });
  it("keeps an unconfigured backend unavailable, never successful", async () => {
    vi.stubEnv("BETA_SIGNUP_PERSISTENCE", "disabled");
    const response = await createSignupHandler(getSignupStore)(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ status: "error", code: "BACKEND_UNCONFIRMED" });
  });
  it("does not issue a receipt for a honeypot", async () => {
    const insert = vi.fn();
    const response = await createSignupHandler(() => ({ insert }))(request({ ...valid, company: "bot" }));
    expect(response.status).toBe(422);
    expect(await response.json()).not.toHaveProperty("receipt");
    expect(insert).not.toHaveBeenCalled();
  });
  it.each([ ["created", 201, "success"], ["duplicate", 409, "duplicate"], ["error", 502, "error"] ] as const)("distinguishes provider %s", async (providerStatus, httpStatus, status) => {
    const store: SignupStore = { insert: vi.fn().mockResolvedValue({ status: providerStatus }) };
    const response = await createSignupHandler(() => store)(request());
    expect(response.status).toBe(httpStatus);
    const body = await response.json();
    expect(body.status).toBe(status);
    expect(body.receipt === true).toBe(providerStatus === "created");
    expect(store.insert).toHaveBeenCalledWith(expect.objectContaining({ email: "test@example.com", utm_source: "qa" }));
  });
  it("contains transport failures without exposing database messages", async () => {
    const response = await createSignupHandler(() => ({ insert: async () => { throw new Error("private database details"); } }))(request());
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain("private database details");
  });
  it("rejects cross-origin and malformed requests", async () => {
    const insert = vi.fn();
    const handler = createSignupHandler(() => ({ insert }));
    expect((await handler(request(valid, "https://foreign.test"))).status).toBe(403);
    expect((await handler(new Request("https://praytime.test/api/beta-signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }))).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });
  it("accepts the browser-facing Host when Next normalizes the internal URL", async () => {
    const normalized = new Request("http://localhost:3000/api/beta-signup", { method: "POST", headers: { "Content-Type": "application/json", origin: "http://127.0.0.1:3000", host: "127.0.0.1:3000" }, body: JSON.stringify(valid) });
    const response = await createSignupHandler(() => { throw new BackendUnconfirmedError(); })(normalized);
    expect(response.status).toBe(503);
  });
  it("requires explicit configuration and rejects secret keys", () => {
    vi.stubEnv("BETA_SIGNUP_PERSISTENCE", "supabase");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "sb_secret_not_allowed");
    expect(getSignupStore).toThrow(BackendUnconfirmedError);
  });
  it.each([false, undefined])("rejects consent=%s even when every other field is valid", async consent => {
    const insert = vi.fn();
    const response = await createSignupHandler(() => ({ insert }))(request({ ...valid, consent }));
    expect(response.status).toBe(422);
    expect((await response.json()).errors.consent).toBeDefined();
    expect(insert).not.toHaveBeenCalled();
  });
  it("records approved production consent, ignoring spoofed client metadata", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const insert = vi.fn().mockResolvedValue({ status: "created" });
    const time = new Date("2026-11-06T01:02:03.456Z");
    const handler = createSignupHandler(() => ({ insert }), () => time);
    const response = await handler(request({ ...valid, privacy_consent_at: "1970-01-01T00:00:00Z", privacy_policy_version: "forged", signup_source: "forged" }));
    expect(response.status).toBe(201);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ privacy_consent_at: time.toISOString(), privacy_policy_version: PRIVACY_POLICY_VERSION, signup_source: "mission5_landing" }));
    expect(insert.mock.calls[0][0]).not.toHaveProperty("consent");
  });
  it("binds the policy version to the archived current policy text", () => {
    const snapshot = readFileSync(new URL("../docs/privacy/operating-policy-snapshot.txt", import.meta.url));
    expect(PRIVACY_POLICY_VERSION).toBe(`privacy-sha256:${createHash("sha256").update(snapshot).digest("hex")}`);
  });
});

describe("Optional Supabase adapter (HTTP mocked; no live submissions)", () => {
  it.each([ [201, {}, "created"], [409, { code: "23505", message: "duplicate", details: null, hint: null }, "duplicate"], [400, { code: "42501", message: "RLS", details: null, hint: null }, "error"], [500, { code: "XX000", message: "private provider failure", details: null, hint: null }, "error"] ] as const)("maps HTTP %i to %s", async (httpStatus, body, status) => {
    vi.stubEnv("BETA_SIGNUP_PERSISTENCE", "supabase");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "sb_publishable_mock_test_only");
    const mockedFetch = vi.fn().mockResolvedValue(new Response(httpStatus === 201 ? null : JSON.stringify(body), { status: httpStatus, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", mockedFetch);
    const payload = recordSignupConsent(requestSchema.parse(valid));
    expect(await getSignupStore().insert(payload)).toEqual({ status });
    expect(mockedFetch.mock.calls[0][0].toString()).toContain("/rest/v1/beta_signups");
    expect(mockedFetch.mock.calls[0][1].method).toBe("POST");
    const headers = new Headers(mockedFetch.mock.calls[0][1].headers);
    expect(headers.get("apikey")).toBe("sb_publishable_mock_test_only");
    expect(headers.has("Authorization")).toBe(false);
    expect(JSON.parse(mockedFetch.mock.calls[0][1].body)).toEqual(payload);
  });
  it("prefers the verified publishable-key env and emits the deployed wire contract", async () => {
    vi.stubEnv("BETA_SIGNUP_PERSISTENCE", "supabase");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_verified_contract_test");
    vi.stubEnv("SUPABASE_ANON_KEY", "sb_secret_ignored_legacy_value");
    const mockedFetch = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", mockedFetch);
    const result = await getSignupStore().insert(recordSignupConsent(requestSchema.parse(valid)));
    expect(result).toEqual({ status: "created" });
    const [url, init] = mockedFetch.mock.calls[0];
    expect(url.toString()).toBe("https://example.supabase.co/rest/v1/beta_signups");
    const headers = new Headers(init.headers);
    expect(headers.get("apikey")).toBe("sb_publishable_verified_contract_test");
    expect(headers.has("Authorization")).toBe(false);
    expect(headers.get("Content-Type")).toContain("application/json");
    expect(JSON.parse(init.body)).not.toHaveProperty("consent");
  });
  it("keeps Authorization for an explicitly configured legacy anon JWT", async () => {
    const token = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ role: "anon" })).toString("base64url")}.test-signature`;
    vi.stubEnv("BETA_SIGNUP_PERSISTENCE", "supabase");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", token);
    const mockedFetch = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", mockedFetch);
    await getSignupStore().insert(recordSignupConsent(requestSchema.parse(valid)));
    expect(new Headers(mockedFetch.mock.calls[0][1].headers).get("Authorization")).toBe(`Bearer ${token}`);
  });
});
