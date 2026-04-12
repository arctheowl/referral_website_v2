const SALT = "mustardseed-admin-v1";

export async function expectedAdminCookieValue(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(SALT));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminCookie(
  secret: string,
  cookieVal: string | undefined
): Promise<boolean> {
  if (!secret || !cookieVal) return false;
  const expected = await expectedAdminCookieValue(secret);
  if (expected.length !== cookieVal.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ cookieVal.charCodeAt(i);
  }
  return diff === 0;
}
