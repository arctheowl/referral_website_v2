#!/bin/bash

# Verification script to ensure all scripts are working correctly

echo "🔍 Verifying Script Setup"
echo "========================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root directory
cd "$PROJECT_ROOT"

echo "📁 Project Root: $PROJECT_ROOT"
echo "📁 Scripts Directory: $SCRIPT_DIR"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local found"
    echo "   Location: $(pwd)/.env.local"
    echo "   Size: $(wc -c < .env.local) bytes"
else
    echo "❌ .env.local not found"
    echo "   Please create .env.local with your database configuration"
    exit 1
fi

echo ""

# Check all scripts
echo "📜 Checking Scripts:"
scripts=("set-testing-mode.sh" "set-production-mode.sh" "enable-testing-mode.sh" "disable-testing-mode.sh" "demo.sh")

for script in "${scripts[@]}"; do
    if [ -f "scripts/$script" ]; then
        if [ -x "scripts/$script" ]; then
            echo "✅ $script - Found and executable"
        else
            echo "⚠️  $script - Found but not executable"
            chmod +x "scripts/$script"
            echo "   Fixed: Made executable"
        fi
    else
        echo "❌ $script - Not found"
    fi
done

echo ""

# Test script functionality
echo "🧪 Testing Script Functionality:"

# Test set-testing-mode.sh
echo "Testing set-testing-mode.sh..."
if ./scripts/set-testing-mode.sh > /dev/null 2>&1; then
    echo "✅ set-testing-mode.sh works"
else
    echo "❌ set-testing-mode.sh failed"
fi

# Test set-production-mode.sh
echo "Testing set-production-mode.sh..."
if ./scripts/set-production-mode.sh > /dev/null 2>&1; then
    echo "✅ set-production-mode.sh works"
else
    echo "❌ set-production-mode.sh failed"
fi

# Test demo.sh
echo "Testing demo.sh..."
if ./scripts/demo.sh > /dev/null 2>&1; then
    echo "✅ demo.sh works"
else
    echo "❌ demo.sh failed"
fi

echo ""

# Check current mode
echo "🎯 Current Mode:"
if [ -f .env.local ] && grep -q "TESTING_MODE=true" .env.local; then
    echo "🔧 TESTING MODE"
    echo "   - Testing navigation panel visible"
    echo "   - Direct access to all pages"
    echo "   - Debug information shown"
else
    echo "🚀 PRODUCTION MODE"
    echo "   - Enforced user flow"
    echo "   - No debug information"
    echo "   - Proper session validation"
fi

echo ""

# Show available commands
echo "🛠️ Available Commands:"
echo "   • Switch to testing: ./scripts/set-testing-mode.sh"
echo "   • Switch to production: ./scripts/set-production-mode.sh"
echo "   • Show demo: ./scripts/demo.sh"
echo "   • Start server: npm run dev"
echo "   • Build production: npm run build"

echo ""
echo "✨ Setup verification complete!"
