#!/bin/bash

# Script to enable mock mode for testing without database

echo "🧪 Enabling Mock Mode for Testing"
echo "================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root directory
cd "$PROJECT_ROOT"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Creating from example..."
    cp .env.local.example .env.local
fi

# Backup current .env.local
cp .env.local .env.local.backup
echo "✅ Backed up current .env.local to .env.local.backup"

# Set up mock mode configuration
cat > .env.local << 'EOF'
# Mock Mode Configuration - For testing without database
TESTING_MODE=true
NODE_ENV=development

# Mock database URL (will cause errors but allows UI testing)
DATABASE_URL="postgresql://mock:mock@localhost:5432/mock"

# Mock mode flag
MOCK_MODE=true
EOF

echo "✅ Mock mode enabled!"
echo ""
echo "🧪 Mock Mode Features:"
echo "- Testing navigation panel visible"
echo "- Direct access to all pages"
echo "- Debug information shown"
echo "- UI testing without database"
echo "- Database errors will occur (this is expected)"
echo ""
echo "⚠️  Note: Database operations will fail, but you can test the UI"
echo ""
echo "🚀 To start testing:"
echo "1. npm run dev"
echo "2. Open http://localhost:3001"
echo "3. Use the purple gear icon to navigate between pages"
echo ""
echo "🔄 To disable mock mode:"
echo "cp .env.local.backup .env.local"
echo ""
echo "🛠️ To set up real database:"
echo "./scripts/setup-database.sh"
