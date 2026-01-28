# Scripts Overview

This directory contains TypeScript utility scripts for database operations and testing.

## Available Scripts

### Database Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `init-db.ts` | Initialize database schema and tables | `npm run init-db` or `tsx src/scripts/init-db.ts` |
| `create-timer.ts` | Create a countdown timer (1 hour) | `tsx src/scripts/create-timer.ts` |
| `create-short-timer.ts` | Create a short countdown timer (30 seconds) for testing | `tsx src/scripts/create-short-timer.ts` |

### Testing Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `test-duplicate-submission.ts` | Test duplicate submission handling | `tsx src/scripts/test-duplicate-submission.ts` |
| `test-session-exclusivity.ts` | Test session exclusivity logic | `tsx src/scripts/test-session-exclusivity.ts` |

## Usage

All scripts require:
- A `.env.local` file with `DATABASE_URL` configured
- Database to be initialized (run `npm run init-db` first)

### Running Scripts

```bash
# Using tsx directly
tsx src/scripts/create-timer.ts

# Or add to package.json scripts for convenience
npm run create-timer
```

## Note

For mode management scripts (testing mode, production mode), see the root-level `scripts/` directory.
