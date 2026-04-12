-- Remove deprecated referral_applications table (no longer used).
-- Run manually on Neon if the table was created by an older init.

DROP TABLE IF EXISTS referral_applications;
