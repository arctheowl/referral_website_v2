#!/bin/bash

# Script to disable testing mode

echo "Disabling Testing Mode..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local not found."
    exit 1
fi

# Remove TESTING_MODE from .env.local
if grep -q "TESTING_MODE" .env.local; then
    # Create a temporary file without TESTING_MODE
    grep -v "TESTING_MODE" .env.local > .env.local.tmp
    mv .env.local.tmp .env.local
    echo "Removed TESTING_MODE from .env.local"
else
    echo "TESTING_MODE not found in .env.local"
fi

echo ""
echo "Testing mode disabled!"
echo ""
echo "The application is now in production mode with:"
echo "- Enforced user flow"
echo "- No debug information"
echo "- Proper session validation"
echo "- Access control based on user status"
echo ""
echo "To re-enable testing mode:"
echo "./scripts/enable-testing-mode.sh"
