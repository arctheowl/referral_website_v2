#!/bin/bash

# Script to enable testing mode while preserving existing database configuration

echo "Enabling Testing Mode..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local not found. Please create it with your database configuration first."
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
    echo "TESTING_MODE already present in .env.local"
fi

echo ""
echo "Testing mode enabled!"
echo ""
echo "Features now available:"
echo "- Testing navigation panel (purple gear icon)"
echo "- Direct access to all pages"
echo "- Debug information visible"
echo "- Bypass user flow restrictions"
echo ""
echo "To disable testing mode:"
echo "1. Remove TESTING_MODE=true from .env.local"
echo "2. Or run: ./scripts/disable-testing-mode.sh"
echo ""
echo "To restore original configuration:"
echo "cp .env.local.backup .env.local"
