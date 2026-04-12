export const REFERRAL_SESSION_COOKIE = "ms_referral_session";
export const REFERRAL_STATUS_COOKIE = "ms_referral_status";

const SESSION_SALT = "mustardseed-referral-session-v1";
const STATUS_SALT = "mustardseed-referral-status-v1";

export type ReferralFlowStatus = "waiting" | "selected" | "rejected" | "completed";

function getCookieSecret(): string {
  return (
    process.env.REFERRAL_COOKIE_SECRET?.trim() ||
    process.env.ADMIN_SECRET?.trim() ||
    ""
  );
}

async function sign(message: string, salt: string): Promise<string | null> {
  const secret = getCookieSecret();
  if (!secret) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${salt}:${message}`));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verify(message: string, salt: string, signature: string): Promise<boolean> {
  const expected = await sign(message, salt);
  if (!expected || expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSignedSessionCookie(sessionId: string): Promise<string | null> {
  if (!sessionId) return null;
  const sig = await sign(sessionId, SESSION_SALT);
  if (!sig) return null;
  return `${encodeURIComponent(sessionId)}.${sig}`;
}

export async function verifySignedSessionCookie(cookieValue?: string): Promise<string | null> {
  if (!cookieValue) return null;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return null;
  const encodedId = cookieValue.slice(0, dot);
  const signature = cookieValue.slice(dot + 1);
  const sessionId = decodeURIComponent(encodedId);
  const ok = await verify(sessionId, SESSION_SALT, signature);
  return ok ? sessionId : null;
}

export async function createSignedStatusCookie(
  status: ReferralFlowStatus
): Promise<string | null> {
  const sig = await sign(status, STATUS_SALT);
  if (!sig) return null;
  return `${status}.${sig}`;
}

export async function verifySignedStatusCookie(
  cookieValue?: string
): Promise<ReferralFlowStatus | null> {
  if (!cookieValue) return null;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return null;
  const status = cookieValue.slice(0, dot) as ReferralFlowStatus;
  if (!["waiting", "selected", "rejected", "completed"].includes(status)) return null;
  const signature = cookieValue.slice(dot + 1);
  const ok = await verify(status, STATUS_SALT, signature);
  return ok ? status : null;
}

