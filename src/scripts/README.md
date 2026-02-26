# Scripts Overview

This directory contains TypeScript utility scripts for database operations.

## Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `init-db.ts` | Initialize database schema and tables | `npm run init-db` or `tsx src/scripts/init-db.ts` |

## Usage

The script requires:
- A `.env.local` file with `DATABASE_URL` configured

## Note

For mode management scripts (testing mode, production mode), see the root-level `scripts/` directory.
