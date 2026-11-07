import { toPayload, type SignupPayload, type SignupRequest } from "./beta-signup";
import { PRIVACY_POLICY_VERSION } from "./privacy-policy";

export type RecordedSignupPayload = SignupPayload & {
  privacy_consent_at: string;
  privacy_policy_version: string;
  signup_source: "mission5_landing";
};

/** Only the route handler calls this, after server-side consent validation.
 * Client-supplied timestamps, policy identifiers and source are never copied.
 */
export function recordSignupConsent(input: SignupRequest, serverTime = new Date()): RecordedSignupPayload {
  return {
    ...toPayload(input),
    privacy_consent_at: serverTime.toISOString(),
    privacy_policy_version: PRIVACY_POLICY_VERSION,
    signup_source: "mission5_landing",
  };
}
