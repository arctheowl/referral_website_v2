import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { runSelectionIfNeeded } from "@/app/actions";
import { verifyAdminCookie } from "@/lib/admin-cookie";

async function isAuthorized(request: Request): Promise<boolean> {
  const configuredSecret = (
    process.env.SELECTION_CRON_SECRET ||
    process.env.CRON_SECRET
  )?.trim();
  if (!configuredSecret) return false;
  const providedSecret = request.headers.get("x-selection-cron-secret")?.trim();
  const authHeader = request.headers.get("authorization")?.trim();
  const bearer = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice("bearer ".length).trim()
    : "";
  const secretOk = Boolean(
    (providedSecret && providedSecret === configuredSecret) ||
      (bearer && bearer === configuredSecret)
  );
  if (secretOk) return true;

  const adminSecret = process.env.ADMIN_SECRET?.trim();
  if (!adminSecret) return false;
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("ms_admin_session")?.value;
  return verifyAdminCookie(adminSecret, adminCookie);
}

export async function GET(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await runSelectionIfNeeded();
  return NextResponse.json({ ok: result.success, ...result });
}

export async function POST(request: Request) {
  return GET(request);
}

