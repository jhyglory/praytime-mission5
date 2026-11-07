import { createSignupHandler } from "@/lib/signup-handler";
import { getSignupStore } from "@/lib/signup-store";

export const runtime = "nodejs";
export const POST = createSignupHandler(getSignupStore);
