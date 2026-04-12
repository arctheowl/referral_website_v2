import { NextResponse } from "next/server";
import { runSelectionIfNeeded } from "@/app/actions";

function isAuthorized(request: Request): boolean {
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
  return Boolean(
    (providedSecret && providedSecret === configuredSecret) ||
      (bearer && bearer === configuredSecret)
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await runSelectionIfNeeded();
  return NextResponse.json({ ok: result.success, ...result });
}

export async function POST(request: Request) {
  return GET(request);
}

