import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { expectedAdminCookieValue } from "@/lib/admin-cookie";

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Admin access is not configured (ADMIN_SECRET)." },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = body.password ?? "";
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(secret, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieVal = await expectedAdminCookieValue(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ms_admin_session", cookieVal, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
