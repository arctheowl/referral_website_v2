# Referral Launch Runbook (Neon + Vercel)

## 1) Environment variables

Set these in Vercel (Preview + Production):

- `DATABASE_URL` (Neon connection string for this environment)
- `ADMIN_SECRET` (already used by admin auth)
- `REFERRAL_COOKIE_SECRET` (new; long random secret)
- `SELECTION_CRON_SECRET` (new; long random secret) or Vercel `CRON_SECRET`

## 2) Neon migration steps

1. Create a Neon branch from production for validation.
2. Run the migration SQL from:
   - `db/migrations/20260412_referral_flow_hardening.sql`
3. Validate:
   - `countdown_timer_single_active_idx` exists
   - `countdown_timer_active_lookup_idx` exists
   - `user_sessions_status_idx` exists
   - `eligibility_checks_eligible_idx` exists
   - `eligibility_checks_selection_status_idx` exists
4. Promote the migration to production branch.

## 3) Cron setup (Vercel)

This project includes `vercel.json` cron:

- `* * * * *` -> `GET /api/selection/run`

Scheduler auth options:

- `Authorization: Bearer <CRON_SECRET>` (Vercel native), or
- `x-selection-cron-secret: <SELECTION_CRON_SECRET>`

If your scheduler cannot set headers, use Vercel Scheduled Functions with environment secret injection, or an external scheduler that supports custom headers.

## 4) Endpoint behavior expectations

`/api/selection/run` returns JSON with one of:

- `reason: "countdown_not_expired"`
- `reason: "selection_in_progress"`
- `reason: "already_completed"`
- `ranSelection: true` with counts after successful execution

This endpoint is idempotent and safe to call repeatedly.

## 5) Pre-launch verification checklist

1. Create test users and complete eligibility.
2. Confirm direct `/` access without valid session cookies redirects to `/eligibility`.
3. Confirm users cannot manually cross-access:
   - selected user -> `/not-selected` denied/redirected
   - rejected user -> `/selected` denied/redirected
4. Set countdown expiry 2-3 minutes ahead from admin.
5. Simulate concurrent clients (multiple browsers/incognito tabs).
6. Verify exactly 40 selected (or fewer if fewer than 40 eligible).
7. Verify cron calls continue to return `already_completed` after first completion.

## 6) Rollback plan

1. Disable cron by removing schedule in Vercel project settings.
2. Redeploy previous stable build.
3. If needed, restore prior Neon branch snapshot.
4. Reset countdown row state (`selection_status`, `selected_at`) manually before next run.

