# Scripts Overview

This directory contains scripts to help manage the referral website in different modes.

## Available Scripts

### Mode Management Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `set-testing-mode.sh` | Enable testing mode for showcasing all pages | `./scripts/set-testing-mode.sh` |
| `set-production-mode.sh` | Enable production mode with enforced user flow | `./scripts/set-production-mode.sh` |
| `enable-testing-mode.sh` | Alternative way to enable testing mode | `./scripts/enable-testing-mode.sh` |
| `disable-testing-mode.sh` | Alternative way to disable testing mode | `./scripts/disable-testing-mode.sh` |
| `demo.sh` | Show current mode and available features | `./scripts/demo.sh` |

### Script Descriptions

#### `set-testing-mode.sh`
- **Purpose**: Enable testing mode for demonstrations and development
- **Features**: 
  - Adds `TESTING_MODE=true` to `.env.local`
  - Backs up current configuration
  - Shows testing mode features
- **Usage**: `./scripts/set-testing-mode.sh`

#### `set-production-mode.sh`
- **Purpose**: Enable production mode with proper flow enforcement
- **Features**:
  - Removes `TESTING_MODE` from `.env.local`
  - Sets `NODE_ENV=production`
  - Backs up current configuration
  - Shows production mode features
- **Usage**: `./scripts/set-production-mode.sh`

#### `enable-testing-mode.sh`
- **Purpose**: Alternative way to enable testing mode
- **Features**: Same as `set-testing-mode.sh` but with different messaging
- **Usage**: `./scripts/enable-testing-mode.sh`

#### `disable-testing-mode.sh`
- **Purpose**: Alternative way to disable testing mode
- **Features**: Removes testing mode without setting production mode
- **Usage**: `./scripts/disable-testing-mode.sh`

#### `demo.sh`
- **Purpose**: Show current mode and demonstrate features
- **Features**:
  - Shows current configuration
  - Lists available pages
  - Shows mode-specific features
  - Provides usage instructions
- **Usage**: `./scripts/demo.sh`

## Quick Start

### For Testing/Demonstrations
```bash
./scripts/set-testing-mode.sh
npm run dev
```

### For Production
```bash
./scripts/set-production-mode.sh
npm run build
npm start
```

### Check Current Mode
```bash
./scripts/demo.sh
```

## Mode Differences

### Testing Mode
- ✅ Testing navigation panel visible
- ✅ Direct access to all pages
- ✅ Debug information shown
- ✅ User flow restrictions bypassed
- ✅ Session management tools available

### Production Mode
- ❌ No testing navigation panel
- ❌ No debug information
- ✅ Enforced user flow
- ✅ Proper session validation
- ✅ Access control based on user status

## Troubleshooting

### Scripts not working
- Make sure scripts are executable: `chmod +x scripts/*.sh`
- Check if `.env.local` exists
- Verify database configuration is correct

### Mode not switching
- Restart the development server after running scripts
- Check `.env.local` for correct environment variables
- Use `./scripts/demo.sh` to verify current mode

### Backup and restore
- Scripts automatically backup `.env.local` to `.env.local.backup`
- To restore: `cp .env.local.backup .env.local`
- To see backup: `ls -la .env.local*`
