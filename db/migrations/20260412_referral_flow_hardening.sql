-- Referral flow hardening migration
-- Run on staging first, then production.

-- Ensure countdown status can represent scheduler lifecycle.
ALTER TABLE countdown_timer
  ALTER COLUMN selection_status TYPE VARCHAR(50);

-- Optional guardrail: one active countdown row at a time.
CREATE UNIQUE INDEX IF NOT EXISTS countdown_timer_single_active_idx
  ON countdown_timer ((is_active))
  WHERE is_active = true;

-- Improve hot-path reads.
CREATE INDEX IF NOT EXISTS countdown_timer_active_lookup_idx
  ON countdown_timer (is_active, id DESC);

CREATE INDEX IF NOT EXISTS user_sessions_status_idx
  ON user_sessions (status);

CREATE INDEX IF NOT EXISTS eligibility_checks_eligible_idx
  ON eligibility_checks (eligible);

CREATE INDEX IF NOT EXISTS eligibility_checks_selection_status_idx
  ON eligibility_checks (selection_status);

-- Normalize legacy selection status text values if present.
UPDATE countdown_timer
SET selection_status = NULL
WHERE TRIM(COALESCE(selection_status, '')) = '';

