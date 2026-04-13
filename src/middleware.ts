import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-cookie";
import {
  REFERRAL_SESSION_COOKIE,
  REFERRAL_STATUS_COOKIE,
  verifySignedSessionCookie,
  verifySignedStatusCookie,
} from "@/lib/referral-session";

/** Production: any non-canonical host (not localhost / *.vercel.app) gets a 308 to this origin. */
const CANONICAL_ORIGIN = "https://mustardseedautism.co.uk";
const CANONICAL_HOSTS = new Set(["mustardseedautism.co.uk", "www.mustardseedautism.co.uk"]);

function canonicalRedirectUrl(request: NextRequest): URL | null {
  if (process.env.SKIP_CANONICAL_HOST_REDIRECT === "true") {
    return null;
  }
  const hostname = request.nextUrl.hostname.toLowerCase();
  if (!hostname || CANONICAL_HOSTS.has(hostname)) {
    return null;
  }
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
    return null;
  }
  return new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, CANONICAL_ORIGIN);
}

export async function middleware(request: NextRequest) {
  const canonical = canonicalRedirectUrl(request);
  if (canonical) {
    return NextResponse.redirect(canonical, 308);
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/referral-form" || pathname.startsWith("/referral-form/")) {
    return NextResponse.redirect(new URL("/eligibility", request.url));
  }

  const isTestingMode =
    process.env.TESTING_MODE === "true" || process.env.NEXT_PUBLIC_TESTING_MODE === "true";
  const isDemoMode =
    process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (!isTestingMode && !isDemoMode) {
    const sessionCookie = request.cookies.get(REFERRAL_SESSION_COOKIE)?.value;
    const statusCookie = request.cookies.get(REFERRAL_STATUS_COOKIE)?.value;
    const sessionId = await verifySignedSessionCookie(sessionCookie);
    const status = await verifySignedStatusCookie(statusCookie);
    const hasAuth = Boolean(sessionId && status);

    if (pathname === "/eligibility") {
      if (hasAuth && status === "waiting") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (hasAuth && status === "selected") {
        return NextResponse.redirect(new URL("/selected", request.url));
      }
      if (hasAuth && status === "rejected") {
        return NextResponse.redirect(new URL("/not-selected", request.url));
      }
      if (hasAuth && status === "completed") {
        return NextResponse.redirect(new URL("/submitted", request.url));
      }
    }

    if (pathname === "/" && !hasAuth) {
      return NextResponse.redirect(new URL("/eligibility", request.url));
    }

    if (pathname === "/" && hasAuth && status !== "waiting") {
      const destination =
        status === "selected"
          ? "/selected"
          : status === "rejected"
          ? "/not-selected"
          : "/submitted";
      return NextResponse.redirect(new URL(destination, request.url));
    }

    if (pathname === "/selected" && (!hasAuth || status !== "selected")) {
      return NextResponse.redirect(new URL(hasAuth ? "/" : "/eligibility", request.url));
    }

    if (pathname === "/not-selected" && (!hasAuth || status !== "rejected")) {
      return NextResponse.redirect(new URL(hasAuth ? "/" : "/eligibility", request.url));
    }

    if (pathname === "/submitted" && (!hasAuth || status !== "completed")) {
      return NextResponse.redirect(new URL(hasAuth ? "/" : "/eligibility", request.url));
    }
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("ms_admin_session")?.value;
  const ok = await verifyAdminCookie(secret, cookie);
  if (!ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
