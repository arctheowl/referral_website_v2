"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSql } from "@/lib/database";
import { verifyAdminCookie } from "@/lib/admin-cookie";
import {
  REFERRAL_SESSION_COOKIE,
  REFERRAL_STATUS_COOKIE,
  createSignedSessionCookie,
  createSignedStatusCookie,
  verifySignedSessionCookie,
  verifySignedStatusCookie,
  type ReferralFlowStatus,
} from "@/lib/referral-session";

async function requireAdmin(): Promise<void> {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return;
  const cookieStore = await cookies();
  const ok = await verifyAdminCookie(secret, cookieStore.get("ms_admin_session")?.value);
  if (!ok) redirect("/admin/login");
}

const SELECTION_LIMIT = 40;
const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function tableExists(tableName: string): Promise<boolean> {
  try {
    const sql = getSql();
    const result = await sql`
      SELECT to_regclass(${`public.${tableName}`}) AS table_ref;
    `;
    return !!result[0]?.table_ref;
  } catch (error) {
    console.error(`Error checking table existence for ${tableName}:`, error);
    return false;
  }
}

async function columnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const sql = getSql();
    const result = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = ${tableName}
          AND column_name = ${columnName}
      ) AS column_exists;
    `;
    return !!result[0]?.column_exists;
  } catch (error) {
    console.error(`Error checking column existence for ${tableName}.${columnName}:`, error);
    return false;
  }
}

function normalizeFlowStatus(value: unknown): ReferralFlowStatus | null {
  if (value === null || value === undefined) return null;
  const status = String(value).trim().toLowerCase();
  if (status === "waiting") return "waiting";
  if (status === "selected") return "selected";
  if (status === "rejected") return "rejected";
  if (status === "completed") return "completed";
  return null;
}

async function setReferralCookies(sessionId: string, status: ReferralFlowStatus): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = await createSignedSessionCookie(sessionId);
  const statusCookie = await createSignedStatusCookie(status);
  if (!sessionCookie || !statusCookie) return;

  const secure = process.env.NODE_ENV === "production";
  cookieStore.set(REFERRAL_SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
  });
  cookieStore.set(REFERRAL_STATUS_COOKIE, statusCookie, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
  });
}

async function clearReferralCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(REFERRAL_SESSION_COOKIE);
  cookieStore.delete(REFERRAL_STATUS_COOKIE);
}

async function resolveStatusForSession(sessionId: string): Promise<ReferralFlowStatus | null> {
  const session = await getUserSession(sessionId);
  return normalizeFlowStatus(session?.status);
}

// Countdown timer actions
export async function getCountdownTimer() {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT *
      FROM countdown_timer
      ORDER BY is_active DESC, updated_at DESC NULLS LAST, id DESC
      LIMIT 1;
    `;
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching countdown timer:", error);
    return null;
  }
}

export async function updateCountdownEndTime(endTimeIso: string) {
  await requireAdmin();
  try {
    const sql = getSql();
    const current = await getCountdownTimer();
    if (!current) {
      return { success: false, error: "Countdown timer not found" };
    }

    await sql`
      UPDATE countdown_timer
      SET
        end_time = ${endTimeIso}::timestamp,
        selection_status = NULL,
        selected_at = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${current.id};
    `;
    return { success: true };
  } catch (error) {
    console.error("Error updating countdown end time:", error);
    return { success: false, error: "Failed to update countdown timer" };
  }
}

export async function runSelectionNow() {
  await requireAdmin();
  try {
    const sql = getSql();
    const current = await getCountdownTimer();
    if (!current) {
      return { success: false, error: "Countdown timer not found" };
    }

    await sql`
      UPDATE countdown_timer
      SET end_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${current.id};
    `;
    return await runSelectionIfNeeded();
  } catch (error) {
    console.error("Error running selection now:", error);
    return { success: false, ranSelection: false, error: "Failed to run selection now" };
  }
}

// User session actions
export async function createUserSession(sessionId: string) {
  try {
    const sql = getSql();
    const hasUserSessions = await tableExists("user_sessions");

    if (!hasUserSessions) {
      // Fallback mode for deployments that removed user_sessions:
      // derive a deterministic queue position from eligibility submissions.
      const [{ queue_position }] = await sql`
        SELECT COALESCE(COUNT(*), 0)::int + 1 AS queue_position
        FROM eligibility_checks;
      `;
      return {
        success: true,
        queuePosition: Number(queue_position || 1),
        existing: true
      };
    }
    
    // Check if session already exists
    const existingSession = await sql`
      SELECT * FROM user_sessions WHERE session_id = ${sessionId};
    `;
    
    if (existingSession.length > 0) {
      // Session already exists, return existing position
      return { 
        success: true, 
        queuePosition: existingSession[0].queue_position,
        existing: true 
      };
    }
    
    const [{ next_position }] = await sql`
      SELECT COALESCE(MAX(queue_position), 0)::int + 1 AS next_position
      FROM user_sessions;
    `;
    const queuePosition = Number(next_position || 1);
    
    await sql`
      INSERT INTO user_sessions (session_id, queue_position, status)
      VALUES (${sessionId}, ${queuePosition}, 'waiting');
    `;

    return { success: true, queuePosition, existing: false };
  } catch (error) {
    console.error("Error creating user session:", error);
    return { success: false, error: "Failed to create session" };
  }
}

export async function getUserSession(sessionId: string) {
  try {
    const sql = getSql();
    const hasUserSessions = await tableExists("user_sessions");
    if (!hasUserSessions) {
      const data = await sql`
        SELECT session_id, selection_status
        FROM eligibility_checks
        WHERE session_id = ${sessionId}
        LIMIT 1;
      `;
      if (!data.length) return null;

      const selection = data[0].selection_status;
      const status =
        selection === null || selection === undefined
          ? "waiting"
          : String(selection).toLowerCase() === "true" || String(selection).toLowerCase() === "selected"
            ? "selected"
            : "rejected";

      return {
        session_id: data[0].session_id,
        queue_position: null,
        status,
        joined_at: null,
        selected_at: status === "selected" ? new Date().toISOString() : null,
        completed_at: null,
      };
    }
    const data = await sql`SELECT * FROM user_sessions WHERE session_id = ${sessionId};`;
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
}

export async function bootstrapReferralSession(sessionId: string) {
  try {
    const normalizedSessionId = sessionId.trim();
    if (!normalizedSessionId) {
      return { success: false, status: null as ReferralFlowStatus | null, hasEligibility: false };
    }

    const eligibility = await checkEligibilityStatus(normalizedSessionId);
    if (!eligibility) {
      return { success: true, status: null as ReferralFlowStatus | null, hasEligibility: false };
    }

    const status = (await resolveStatusForSession(normalizedSessionId)) ?? "waiting";
    await setReferralCookies(normalizedSessionId, status);
    return { success: true, status, hasEligibility: true };
  } catch (error) {
    console.error("Error bootstrapping referral session:", error);
    return { success: false, status: null as ReferralFlowStatus | null, hasEligibility: false };
  }
}

export async function getAuthorizedFlowState() {
  try {
    const cookieStore = await cookies();
    const sessionId = await verifySignedSessionCookie(
      cookieStore.get(REFERRAL_SESSION_COOKIE)?.value
    );
    if (!sessionId) {
      return { authenticated: false, sessionId: null as string | null, status: null as ReferralFlowStatus | null };
    }

    let status = await verifySignedStatusCookie(cookieStore.get(REFERRAL_STATUS_COOKIE)?.value);
    const dbStatus = await resolveStatusForSession(sessionId);
    if (dbStatus && dbStatus !== status) {
      status = dbStatus;
      await setReferralCookies(sessionId, dbStatus);
    }

    if (!status) {
      await clearReferralCookies();
      return { authenticated: false, sessionId: null as string | null, status: null as ReferralFlowStatus | null };
    }

    return { authenticated: true, sessionId, status };
  } catch (error) {
    console.error("Error getting authorized flow state:", error);
    return { authenticated: false, sessionId: null as string | null, status: null as ReferralFlowStatus | null };
  }
}

// Newsletter actions
export async function addNewsletterSignup(newsletterData: { name: string; email: string }) {
  try {
    const sql = getSql();
    const hasNewsletter = await tableExists("newsletter");
    if (!hasNewsletter) {
      return { success: false, error: "Newsletter table not found" };
    }

    await sql`
      INSERT INTO newsletter (name, email)
      VALUES (${newsletterData.name}, ${newsletterData.email});
    `;

    return { success: true };
  } catch (error) {
    console.error("Error adding newsletter signup:", error);
    return { success: false, error: "Failed to add newsletter signup" };
  }
}

// Admin actions
export async function getEligibleQueueEntries() {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT
        ec.id,
        ec.session_id,
        ec.parent_name,
        ec.primary_email,
        ec.phone_number,
        ec.secondary_phone,
        ec.secondary_email,
        ec.school_year,
        ec.catchment_town,
        ec.submitted_at,
        us.queue_position,
        us.status AS session_status,
        us.joined_at
      FROM eligibility_checks ec
      JOIN user_sessions us ON ec.session_id = us.session_id
      WHERE ec.eligible = true
      ORDER BY us.queue_position ASC, ec.submitted_at DESC;
    `;
    return data;
  } catch (error) {
    console.error("Error fetching eligible queue entries:", error);
    return [];
  }
}

export async function getEligibilityChecks() {
  await requireAdmin();
  try {
    const sql = getSql();
    const hasUserSessions = await tableExists("user_sessions");
    const hasSubmittedAt = await columnExists("eligibility_checks", "submitted_at");
    const hasCreatedAt = await columnExists("eligibility_checks", "created_at");
    const submittedAtExpr = hasSubmittedAt
      ? sql`ec.submitted_at`
      : hasCreatedAt
      ? sql`ec.created_at`
      : sql`NULL::timestamp`;

    const data = hasUserSessions
      ? await sql`
          SELECT
            ec.id,
            ec.session_id,
            ec.parent_name,
            ec.primary_email,
            ec.phone_number,
            ec.secondary_phone,
            ec.secondary_email,
            ec.diagnosis,
            ec.school_year,
            ec.catchment_town,
            ec.can_attend_hospital,
            ec.eligible,
            ec.selection_status,
            ${submittedAtExpr} AS submitted_at,
            us.queue_position,
            us.status AS session_status,
            us.joined_at
          FROM eligibility_checks ec
          LEFT JOIN user_sessions us ON ec.session_id = us.session_id;
        `
      : await sql`
          SELECT
            ec.id,
            ec.session_id,
            ec.parent_name,
            ec.primary_email,
            ec.phone_number,
            ec.secondary_phone,
            ec.secondary_email,
            ec.diagnosis,
            ec.school_year,
            ec.catchment_town,
            ec.can_attend_hospital,
            ec.eligible,
            ec.selection_status,
            ${submittedAtExpr} AS submitted_at,
            NULL::integer AS queue_position,
            NULL::text AS session_status,
            NULL::timestamp AS joined_at
          FROM eligibility_checks ec;
        `;
    // Sort in app layer so we can support schemas with missing timestamp columns.
    return data.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const aTime = a.submitted_at ? new Date(String(a.submitted_at)).getTime() : 0;
      const bTime = b.submitted_at ? new Date(String(b.submitted_at)).getTime() : 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error fetching eligibility checks:", error);
    return [];
  }
}

export async function getNewsletterEntries() {
  await requireAdmin();
  try {
    const sql = getSql();
    const hasNewsletter = await tableExists("newsletter");
    if (!hasNewsletter) return [];

    const hasCreatedAt = await columnExists("newsletter", "created_at");
    const hasAddedAt = await columnExists("newsletter", "added_at");
    const orderColumn = hasCreatedAt ? sql`created_at` : hasAddedAt ? sql`added_at` : sql`id`;

    const data = await sql`
      SELECT *
      FROM newsletter
      ORDER BY ${orderColumn} DESC;
    `;
    return data;
  } catch (error) {
    console.error("Error fetching newsletter entries:", error);
    return [];
  }
}

export async function getTotalUniqueUsers() {
  await requireAdmin();
  try {
    const sql = getSql();
    const hasUserSessions = await tableExists("user_sessions");
    const data = hasUserSessions
      ? await sql`
          SELECT COUNT(DISTINCT session_id) as unique_users
          FROM user_sessions;
        `
      : await sql`
          SELECT COUNT(DISTINCT session_id) as unique_users
          FROM eligibility_checks;
        `;
    return data[0]?.unique_users || 0;
  } catch (error) {
    console.error("Error fetching total unique users:", error);
    return 0;
  }
}

// Eligibility check actions
export async function submitEligibilityCheck(
  sessionId: string,
  eligibilityData: {
    parentName: string;
    primaryEmail: string;
    phoneNumber: string;
    secondaryPhone?: string;
    secondaryEmail?: string;
    diagnosis: string;
    schoolYear: string;
    catchmentTown: string;
    canAttendHospital: boolean;
  }
) {
  try {
    const sql = getSql();
    const normalizedSessionId = sessionId.trim();
    if (!normalizedSessionId) {
      return { success: false, error: "Missing session ID" };
    }

    // Check if eligibility already exists
    const existing = await sql`
      SELECT id FROM eligibility_checks WHERE session_id = ${normalizedSessionId};
    `;

    if (existing.length > 0) {
      const status = (await resolveStatusForSession(normalizedSessionId)) ?? "waiting";
      await setReferralCookies(normalizedSessionId, status);
      return { success: true, alreadySubmitted: true };
    }

    const noneValue = "none_of_the_above";
    const eligible =
      eligibilityData.schoolYear !== noneValue &&
      eligibilityData.diagnosis !== noneValue &&
      eligibilityData.catchmentTown !== noneValue;

    // Insert eligibility check
    await sql`
      INSERT INTO eligibility_checks (session_id, parent_name, primary_email, phone_number, secondary_phone, secondary_email, diagnosis, school_year, catchment_town, can_attend_hospital, eligible)
      VALUES (${normalizedSessionId}, ${eligibilityData.parentName}, ${eligibilityData.primaryEmail}, ${eligibilityData.phoneNumber}, ${eligibilityData.secondaryPhone ?? null}, ${eligibilityData.secondaryEmail ?? null}, ${eligibilityData.diagnosis}, ${eligibilityData.schoolYear}, ${eligibilityData.catchmentTown}, ${eligibilityData.canAttendHospital}, ${eligible});
    `;

    await createUserSession(normalizedSessionId);
    await setReferralCookies(normalizedSessionId, "waiting");

    return { success: true, alreadySubmitted: false };
  } catch (error) {
    console.error("Error submitting eligibility check:", error);
    return { success: false, error: "Failed to submit eligibility check" };
  }
}

export async function checkEligibilityStatus(sessionId: string) {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT * FROM eligibility_checks WHERE session_id = ${sessionId};
    `;
    return data[0] || null;
  } catch (error) {
    console.error("Error checking eligibility status:", error);
    return null;
  }
}

export async function getSelectionOutcome(sessionId: string) {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT
        us.status AS session_status,
        us.selected_at,
        ec.selection_status,
        ec.eligible
      FROM user_sessions us
      LEFT JOIN eligibility_checks ec ON ec.session_id = us.session_id
      WHERE us.session_id = ${sessionId}
      LIMIT 1;
    `;
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching selection outcome:", error);
    return null;
  }
}

export async function runSelectionIfNeeded() {
  const sql = getSql();
  let claimedCountdownId: number | null = null;

  try {
    const countdownRows = await sql`
      SELECT id, end_time, selected_at, selection_status
      FROM countdown_timer
      WHERE is_active = true
      ORDER BY id DESC
      LIMIT 1;
    `;

    if (!countdownRows.length) {
      return { success: false, ranSelection: false, error: "No active countdown timer found" };
    }

    const countdown = countdownRows[0];
    const now = Date.now();
    const endTime = new Date(countdown.end_time).getTime();
    if (Number.isNaN(endTime) || now < endTime) {
      return { success: true, ranSelection: false, reason: "countdown_not_expired" };
    }

    if (countdown.selection_status === "completed") {
      return { success: true, ranSelection: false, reason: "already_completed" };
    }

    const claimRows = await sql`
      UPDATE countdown_timer
      SET
        selection_status = 'running',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${countdown.id}
        AND (
          selection_status IS NULL
          OR TRIM(COALESCE(selection_status::text, '')) = ''
          OR selection_status = 'pending'
        )
      RETURNING id;
    `;
    if (!claimRows.length) {
      const latestRows = await sql`
        SELECT selection_status
        FROM countdown_timer
        WHERE id = ${countdown.id}
        LIMIT 1;
      `;
      const status = String(latestRows[0]?.selection_status ?? "").toLowerCase();
      if (status === "completed") {
        return { success: true, ranSelection: false, reason: "already_completed" };
      }
      return { success: true, ranSelection: false, reason: "selection_in_progress" };
    }
    claimedCountdownId = Number(claimRows[0].id);

    const hasUserSessions = await tableExists("user_sessions");
    const maxUsers = SELECTION_LIMIT;

    // Hard idempotency guard: if any users are already selected for this active cohort,
    // never run selection again.
    if (hasUserSessions) {
      const selectedCountRows = await sql`
        SELECT COUNT(*)::int AS selected_count
        FROM user_sessions us
        JOIN eligibility_checks ec ON ec.session_id = us.session_id
        WHERE us.status = 'selected';
      `;
      const alreadySelectedCount = Number(selectedCountRows[0]?.selected_count || 0);
      if (alreadySelectedCount > 0) {
        await sql`
          UPDATE countdown_timer
          SET
            selection_status = 'completed',
            selected_at = COALESCE(selected_at, CURRENT_TIMESTAMP),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${countdown.id};
        `;
        return {
          success: true,
          ranSelection: false,
          reason: "already_completed",
          selectedCount: alreadySelectedCount,
          maxUsers,
        };
      }
    } else {
      const selectedCountRows = await sql`
        SELECT COUNT(*)::int AS selected_count
        FROM eligibility_checks
        WHERE selection_status = true;
      `;
      const alreadySelectedCount = Number(selectedCountRows[0]?.selected_count || 0);
      if (alreadySelectedCount > 0) {
        await sql`
          UPDATE countdown_timer
          SET
            selection_status = 'completed',
            selected_at = COALESCE(selected_at, CURRENT_TIMESTAMP),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${countdown.id};
        `;
        return {
          success: true,
          ranSelection: false,
          reason: "already_completed",
          selectedCount: alreadySelectedCount,
          maxUsers,
        };
      }
    }

    let selectedRows: Record<string, unknown>[] = [];

    if (hasUserSessions) {
      // Baseline all waiting users with submitted eligibility as not selected.
      await sql`
        UPDATE eligibility_checks ec
        SET selection_status = false
        FROM user_sessions us
        WHERE us.session_id = ec.session_id
          AND us.status = 'waiting';
      `;

      await sql`
        UPDATE user_sessions us
        SET status = 'rejected'
        WHERE us.status = 'waiting'
          AND EXISTS (
            SELECT 1
            FROM eligibility_checks ec
            WHERE ec.session_id = us.session_id
          );
      `;

      // Randomly select up to maxUsers from eligible waiting users.
      selectedRows = await sql`
        SELECT us.session_id
        FROM user_sessions us
        JOIN eligibility_checks ec ON ec.session_id = us.session_id
        WHERE us.status = 'rejected'
          AND ec.eligible = true
        ORDER BY RANDOM()
        LIMIT ${maxUsers};
      `;
    } else {
      // No user_sessions table: selection is driven directly from eligibility_checks.
      await sql`
        UPDATE eligibility_checks
        SET selection_status = false
        WHERE session_id IS NOT NULL;
      `;

      selectedRows = await sql`
        SELECT ec.session_id
        FROM eligibility_checks ec
        WHERE ec.eligible = true
        ORDER BY RANDOM()
        LIMIT ${maxUsers};
      `;
    }

    const selectedIds = selectedRows.map((row) => row.session_id as string);
    const selectedCount = selectedIds.length;

    if (selectedCount > 0) {
      await sql`
        UPDATE eligibility_checks
        SET selection_status = true
        WHERE session_id = ANY(${selectedIds}::text[]);
      `;

      if (hasUserSessions) {
        await sql`
          UPDATE user_sessions
          SET status = 'selected', selected_at = CURRENT_TIMESTAMP
          WHERE session_id = ANY(${selectedIds}::text[]);
        `;
      }
    }

    await sql`
      UPDATE countdown_timer
      SET
        selected_at = CURRENT_TIMESTAMP,
        selection_status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${countdown.id};
    `;

    return {
      success: true,
      ranSelection: true,
      selectedCount,
      maxUsers
    };
  } catch (error) {
    if (claimedCountdownId) {
      try {
        await sql`
          UPDATE countdown_timer
          SET selection_status = NULL, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${claimedCountdownId}
            AND selection_status = 'running';
        `;
      } catch (rollbackError) {
        console.error("Failed to reset countdown selection status after error:", rollbackError);
      }
    }
    console.error("Error running selection:", error);
    return { success: false, ranSelection: false, error: "Failed to run selection" };
  }
}

export async function resolveSelectionOutcome(sessionId: string) {
  try {
    const normalizedSessionId = sessionId.trim();
    if (!normalizedSessionId) {
      return { success: false, pending: false, error: "Missing session ID" };
    }

    const eligibility = await checkEligibilityStatus(normalizedSessionId);
    if (!eligibility) {
      return { success: false, pending: false, error: "Eligibility check not found for this session" };
    }

    const statusValue = String(eligibility.selection_status ?? "").toLowerCase();
    if (!statusValue) {
      return { success: true, pending: true };
    }

    const status: ReferralFlowStatus =
      statusValue === "true" || statusValue === "selected" ? "selected" : "rejected";
    await setReferralCookies(normalizedSessionId, status);
    return { success: true, pending: false, status };
  } catch (error) {
    console.error("Error resolving selection outcome:", error);
    return { success: false, pending: false, error: "Failed to resolve selection outcome" };
  }
}

export async function getSelectionSummary() {
  await requireAdmin();
  try {
    const sql = getSql();
    const [countdown] = await sql`
      SELECT selected_at
      FROM countdown_timer
      ORDER BY updated_at DESC
      LIMIT 1;
    `;

    const [counts] = await sql`
      SELECT
        COUNT(*) FILTER (
          WHERE LOWER(COALESCE(selection_status::text, '')) IN ('true', 't', '1', 'yes', 'selected')
        ) AS selected_count,
        COUNT(*) FILTER (
          WHERE selection_status IS NOT NULL
            AND LOWER(COALESCE(selection_status::text, '')) NOT IN ('true', 't', '1', 'yes', 'selected')
        ) AS rejected_count,
        COUNT(*) FILTER (
          WHERE selection_status IS NULL
            OR TRIM(COALESCE(selection_status::text, '')) = ''
        ) AS pending_count
      FROM eligibility_checks;
    `;

    return {
      selectionCompletedAt: countdown?.selected_at || null,
      selectedCount: Number(counts?.selected_count || 0),
      rejectedCount: Number(counts?.rejected_count || 0),
      pendingCount: Number(counts?.pending_count || 0),
      maxUsers: SELECTION_LIMIT,
      currentUsers: Number(counts?.selected_count || 0)
    };
  } catch (error) {
    console.error("Error fetching selection summary:", error);
    return {
      selectionCompletedAt: null,
      selectedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
      maxUsers: SELECTION_LIMIT,
      currentUsers: 0
    };
  }
}