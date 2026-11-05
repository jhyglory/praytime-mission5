import { fieldErrorsFrom, requestSchema } from "./beta-signup";
import { recordSignupConsent } from "./signup-consent";
import { BackendUnconfirmedError, type SignupStore } from "./signup-store";

const serverMessage = "신청을 접수하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도해주세요.";
function reply(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function createSignupHandler(getStore: () => SignupStore, serverNow: () => Date = () => new Date()) {
  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        // Next's local worker may normalize request.url to localhost. Host retains
        // the browser-facing authority; keep foreign-origin POSTs rejected.
        const requestUrl = new URL(request.url);
        const originUrl = new URL(origin);
        const host = request.headers.get("host") ?? requestUrl.host;
        if (originUrl.host !== host || originUrl.protocol !== requestUrl.protocol) return reply({ status: "error", message: serverMessage }, 403);
      } catch { return reply({ status: "error", message: serverMessage }, 403); }
    }
    if (!request.headers.get("content-type")?.includes("application/json")) return reply({ status: "error", message: serverMessage }, 415);
    if (Number(request.headers.get("content-length")) > 16_384) return reply({ status: "error", message: serverMessage }, 413);
    let raw: unknown;
    try {
      const body = await request.text();
      if (new TextEncoder().encode(body).length > 16_384) return reply({ status: "error", message: serverMessage }, 413);
      raw = JSON.parse(body);
    } catch { return reply({ status: "error", message: serverMessage }, 400); }
    const parsed = requestSchema.safeParse(raw);
    if (!parsed.success) return reply({ status: "invalid", errors: fieldErrorsFrom(parsed.error.issues) }, 422);
    // A trap submission never produces a receipt or a success/conversion signal.
    if (parsed.data.company.trim()) return reply({ status: "rejected", message: serverMessage }, 422);
    try {
      const store = getStore();
      const result = await store.insert(recordSignupConsent(parsed.data, serverNow()));
      if (result.status === "duplicate") return reply({ status: "duplicate", message: "이미 신청된 이메일입니다." }, 409);
      if (result.status !== "created") return reply({ status: "error", message: serverMessage }, 502);
      return reply({ status: "success", receipt: true }, 201);
    } catch (error) {
      return reply({ status: "error", code: error instanceof BackendUnconfirmedError ? "BACKEND_UNCONFIRMED" : "SUBMISSION_FAILED", message: serverMessage }, error instanceof BackendUnconfirmedError ? 503 : 502);
    }
  };
}
