import { config } from "dotenv";
import { getSql } from "@/lib/database";

config({ path: ".env.local" });

const TOTAL_USERS = 100;
const INELIGIBLE_USERS = 11;
const SESSION_PREFIX = "test_seed_user_";
const NONE_OF_THE_ABOVE = "none_of_the_above";

const SCHOOL_YEARS = [
  "Reception",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
];

const CATCHMENT_TOWNS = [
  "Aldershot",
  "Ash",
  "Camberley",
  "Farnham",
  "Fleet",
  "Frimley",
  "Hook",
  "Yateley",
];

function pick<T>(arr: T[], idx: number): T {
  return arr[idx % arr.length];
}

async function seedTestUsers() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined. Please set it in .env.local");
  }

  const sql = getSql();
  const hasEligibilityChecks = await sql`
    SELECT to_regclass('public.eligibility_checks') AS table_ref;
  `;
  if (!hasEligibilityChecks[0]?.table_ref) {
    throw new Error("eligibility_checks table does not exist");
  }
  const hasUserSessions = await sql`
    SELECT to_regclass('public.user_sessions') AS table_ref;
  `;
  if (!hasUserSessions[0]?.table_ref) {
    throw new Error("user_sessions table does not exist");
  }

  // Reset only records created by this seed script.
  await sql`
    DELETE FROM waitlist
    WHERE session_id LIKE ${`${SESSION_PREFIX}%`};
  `;
  await sql`
    DELETE FROM eligibility_checks
    WHERE session_id LIKE ${`${SESSION_PREFIX}%`};
  `;
  await sql`
    DELETE FROM user_sessions
    WHERE session_id LIKE ${`${SESSION_PREFIX}%`};
  `;

  const [queueBaseRow] = await sql`
    SELECT COALESCE(MAX(queue_position), 0)::int AS max_position
    FROM user_sessions;
  `;
  const queueBase = Number(queueBaseRow?.max_position || 0);

  for (let i = 0; i < TOTAL_USERS; i++) {
    const userNumber = String(i + 1).padStart(3, "0");
    const sessionId = `${SESSION_PREFIX}${userNumber}`;
    const isIneligible = i < INELIGIBLE_USERS;

    const diagnosis = isIneligible ? NONE_OF_THE_ABOVE : "diagnosis";
    const schoolYear = isIneligible ? NONE_OF_THE_ABOVE : pick(SCHOOL_YEARS, i);
    const catchmentTown = isIneligible ? NONE_OF_THE_ABOVE : pick(CATCHMENT_TOWNS, i);

    await sql`
      INSERT INTO eligibility_checks (
        session_id,
        parent_name,
        primary_email,
        phone_number,
        secondary_email,
        diagnosis,
        school_year,
        catchment_town,
        can_attend_hospital,
        eligible,
        selection_status
      ) VALUES (
        ${sessionId},
        ${`Test Parent ${userNumber}`},
        ${`test.parent.${userNumber}@example.com`},
        ${`070000${String(i + 1).padStart(5, "0")}`},
        NULL,
        ${diagnosis},
        ${schoolYear},
        ${catchmentTown},
        true,
        ${!isIneligible},
        NULL
      );
    `;

    await sql`
      INSERT INTO user_sessions (
        session_id,
        queue_position,
        status,
        selected_at,
        completed_at
      ) VALUES (
        ${sessionId},
        ${queueBase + i + 1},
        'waiting',
        NULL,
        NULL
      );
    `;
  }

  const [summary] = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE eligible = true)::int AS eligible_count,
      COUNT(*) FILTER (WHERE eligible = false)::int AS ineligible_count
    FROM eligibility_checks
    WHERE session_id LIKE ${`${SESSION_PREFIX}%`};
  `;
  const [sessionSummary] = await sql`
    SELECT COUNT(*)::int AS seeded_sessions
    FROM user_sessions
    WHERE session_id LIKE ${`${SESSION_PREFIX}%`};
  `;

  console.log("Seed complete.");
  console.log(`Inserted ${summary.total} users.`);
  console.log(`Eligible: ${summary.eligible_count}`);
  console.log(`Ineligible: ${summary.ineligible_count}`);
  console.log(`Seeded user_sessions: ${sessionSummary.seeded_sessions}`);
}

seedTestUsers().catch((error) => {
  console.error("Failed to seed test users:", error);
  process.exit(1);
});
