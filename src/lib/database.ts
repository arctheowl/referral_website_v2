import { neon } from "@neondatabase/serverless";

export const getSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined. Please set it in your .env.local file");
  }
  return neon(process.env.DATABASE_URL);
};

// Database schema for v2 referral system
export const createTables = async () => {
  const sql = getSql();
  
  // Countdown timer table
  // selection_status: set when selection runs (e.g. 'completed'); null/blank before.
  // selected_at: when selection was run for this countdown.
  await sql`
    CREATE TABLE IF NOT EXISTS countdown_timer (
      id SERIAL PRIMARY KEY,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      is_active BOOLEAN DEFAULT true,
      selection_status VARCHAR(50),
      selected_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`ALTER TABLE countdown_timer ADD COLUMN IF NOT EXISTS selection_status VARCHAR(50);`;
  await sql`ALTER TABLE countdown_timer ADD COLUMN IF NOT EXISTS selected_at TIMESTAMP;`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS countdown_timer_single_active_idx
    ON countdown_timer ((is_active))
    WHERE is_active = true;
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS countdown_timer_active_lookup_idx
    ON countdown_timer (is_active, id DESC);
  `;

  // User sessions table
  await sql`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) UNIQUE NOT NULL,
      queue_position INTEGER,
      status VARCHAR(50) DEFAULT 'waiting', -- 'waiting', 'selected', 'rejected', 'completed'
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      selected_at TIMESTAMP,
      completed_at TIMESTAMP
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS user_sessions_status_idx
    ON user_sessions (status);
  `;

  // Waitlist table (for rejected users)
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) REFERENCES user_sessions(session_id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      postcode VARCHAR(20),
      child_dob DATE,
      child_name VARCHAR(255),
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Eligibility check table (pre-screening before waiting room).
  // selection_status: NULL until countdown ends, then true (selected) or false (rejected).
  // eligible: false when user chose "none of the above" for diagnosis/school_year/catchment_town; they still go to waiting room but are never selected.
  await sql`
    CREATE TABLE IF NOT EXISTS eligibility_checks (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) UNIQUE NOT NULL,
      parent_name VARCHAR(255),
      primary_email VARCHAR(255),
      phone_number VARCHAR(50),
      secondary_email VARCHAR(255),
      diagnosis VARCHAR(255),
      school_year VARCHAR(50) NOT NULL,
      catchment_town VARCHAR(255) NOT NULL,
      can_attend_hospital BOOLEAN NOT NULL,
      eligible BOOLEAN DEFAULT true,
      selection_status BOOLEAN,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`ALTER TABLE eligibility_checks ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);`;
  await sql`ALTER TABLE eligibility_checks ADD COLUMN IF NOT EXISTS selection_status BOOLEAN;`;
  await sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'eligibility_checks'
          AND column_name = 'selection_status'
          AND data_type IN ('character varying', 'text')
      ) THEN
        ALTER TABLE eligibility_checks
        ALTER COLUMN selection_status TYPE BOOLEAN
        USING CASE
          WHEN selection_status IS NULL THEN NULL
          WHEN LOWER(selection_status::text) IN ('selected', 'true', 't', '1', 'yes') THEN TRUE
          ELSE FALSE
        END;
      END IF;
    END $$;
  `;
  await sql`ALTER TABLE eligibility_checks ADD COLUMN IF NOT EXISTS eligible BOOLEAN DEFAULT true;`;
  await sql`
    CREATE INDEX IF NOT EXISTS eligibility_checks_eligible_idx
    ON eligibility_checks (eligible);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS eligibility_checks_selection_status_idx
    ON eligibility_checks (selection_status);
  `;
  // Initialize default values
  const activeCountdownRows = await sql`
    SELECT id
    FROM countdown_timer
    WHERE is_active = true
    LIMIT 1;
  `;
  if (!activeCountdownRows.length) {
    await sql`
      INSERT INTO countdown_timer (start_time, end_time, is_active, selection_status)
      VALUES (NOW(), NOW() + INTERVAL '1 hour', true, 'pending');
    `;
  }

};
