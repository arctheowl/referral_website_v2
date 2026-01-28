#!/bin/bash

# Script to enable demo mode (no database required)

echo "🎭 Enabling Demo Mode"
echo "===================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root directory
cd "$PROJECT_ROOT"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    touch .env.local
fi

# Backup current .env.local
if [ -f .env.local ]; then
    cp .env.local .env.local.backup
    echo "✅ Backed up current .env.local to .env.local.backup"
fi

# Set up demo mode configuration
cat > .env.local << 'EOF'
# Demo Mode Configuration - No database required
# All data is stored in browser localStorage

DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true
NODE_ENV=development

# No database URL needed - demo mode uses mock data
# DATABASE_URL is not required in demo mode
EOF

echo "✅ Demo mode enabled!"
echo ""
echo "🎭 Demo Mode Features:"
echo "- No database connection required"
echo "- All data stored in browser localStorage"
echo "- Navigate through all user flows"
echo "- Perfect for demonstrations and testing"
echo "- Can be deployed without any configuration"
echo ""
echo "🚀 To start the demo:"
echo "1. npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Visit /demo to select a flow"
echo "4. Or navigate directly to any page"
echo ""
echo "📱 Demo Page:"
echo "Visit /demo to see all available flows and start a demonstration"
echo ""
echo "🔄 To disable demo mode:"
echo "cp .env.local.backup .env.local"
echo ""
echo "💡 Note: Demo mode works completely offline and requires no setup!"
