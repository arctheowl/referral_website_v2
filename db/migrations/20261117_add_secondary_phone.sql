-- Optional second contact number on eligibility checks.
-- Run on staging first, then production.

ALTER TABLE eligibility_checks
  ADD COLUMN IF NOT EXISTS secondary_phone VARCHAR(50);
