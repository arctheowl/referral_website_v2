-- Clean restart for a new referral round.
-- BEFORE RUNNING: take a Neon snapshot / branch backup of production.
--
-- Open window: selection fires at 2026-11-23 19:00:00 GMT.
-- Capacity / eligibility rules / app copy are unchanged in code (SELECTION_LIMIT = 40).

BEGIN;

-- Truncate cohort tables together so FKs (e.g. waitlist -> user_sessions) are satisfied.
TRUNCATE TABLE
  waitlist,
  eligibility_checks,
  user_sessions
RESTART IDENTITY;

-- Newsletter signups from the previous round (table may exist in production).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'newsletter'
  ) THEN
    EXECUTE 'TRUNCATE TABLE newsletter RESTART IDENTITY';
  END IF;
END $$;

-- Reset active countdown for the new open; deactivate any extras.
UPDATE countdown_timer
SET is_active = false,
    updated_at = CURRENT_TIMESTAMP
WHERE is_active = true;

INSERT INTO countdown_timer (
  start_time,
  end_time,
  is_active,
  selection_status,
  selected_at
)
VALUES (
  TIMESTAMPTZ '2026-11-17 00:00:00+00',
  TIMESTAMPTZ '2026-11-23 19:00:00+00',
  true,
  NULL,
  NULL
);

COMMIT;

-- Sanity checks (run after commit):
-- SELECT id, start_time, end_time, is_active, selection_status, selected_at
-- FROM countdown_timer WHERE is_active = true;
-- SELECT COUNT(*) FROM eligibility_checks;
-- SELECT COUNT(*) FROM user_sessions;
-- SELECT COUNT(*) FROM waitlist;
