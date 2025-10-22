#!/bin/bash

# Script to set testing mode for showcasing all pages
# This is the script referenced in the testing guide

echo "Setting up Testing Mode..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local not found. Please create it with your database configuration first."
    echo "You can copy from .env.local.example if it exists."
    exit 1
fi

# Backup current .env.local
cp .env.local .env.local.backup
echo "Backed up current .env.local to .env.local.backup"

# Add TESTING_MODE to .env.local if not already present
if ! grep -q "TESTING_MODE" .env.local; then
    echo "" >> .env.local
    echo "# Testing Mode" >> .env.local
    echo "TESTING_MODE=true" >> .env.local
    echo "Added TESTING_MODE=true to .env.local"
else
    # Update existing TESTING_MODE to true
    sed -i 's/TESTING_MODE=.*/TESTING_MODE=true/' .env.local
    echo "Updated TESTING_MODE=true in .env.local"
fi

echo ""
echo "Testing mode enabled!"
echo ""
echo "Features now available:"
echo "- Testing navigation panel (purple gear icon) in top-right corner"
echo "- Direct access to all pages"
echo "- Debug information visible"
echo "- Bypass user flow restrictions"
echo ""
echo "To use testing mode:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3001"
echo "3. Look for purple gear icon in top-right corner"
echo "4. Click to see all available pages"
echo ""
echo "To switch back to production mode:"
echo "1. Remove TESTING_MODE from .env.local"
echo "2. Or run: ./scripts/set-production-mode.sh"
echo "3. Restart the server"
echo ""
echo "To restore original configuration:"
echo "cp .env.local.backup .env.local"