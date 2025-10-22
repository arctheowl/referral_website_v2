#!/bin/bash

# Script to set production mode with proper flow enforcement
# This is the script referenced in the testing guide

echo "Setting up Production Mode..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local not found. Please create it with your database configuration first."
    echo "You can copy from .env.local.example if it exists."
    exit 1
fi

# Backup current .env.local
cp .env.local .env.local.backup
echo "Backed up current .env.local to .env.local.backup"

# Remove TESTING_MODE from .env.local
if grep -q "TESTING_MODE" .env.local; then
    # Create a temporary file without TESTING_MODE
    grep -v "TESTING_MODE" .env.local > .env.local.tmp
    mv .env.local.tmp .env.local
    echo "Removed TESTING_MODE from .env.local"
else
    echo "TESTING_MODE not found in .env.local (already in production mode)"
fi

# Ensure NODE_ENV is set to production
if ! grep -q "NODE_ENV" .env.local; then
    echo "" >> .env.local
    echo "# Production Mode" >> .env.local
    echo "NODE_ENV=production" >> .env.local
    echo "Added NODE_ENV=production to .env.local"
else
    # Update existing NODE_ENV to production
    sed -i 's/NODE_ENV=.*/NODE_ENV=production/' .env.local
    echo "Updated NODE_ENV=production in .env.local"
fi

echo ""
echo "Production mode enabled!"
echo ""
echo "The application is now in production mode with:"
echo "- Enforced user flow"
echo "- No debug information"
echo "- Proper session validation"
echo "- Access control based on user status"
echo ""
echo "To use production mode:"
echo "1. Build the application: npm run build"
echo "2. Start the production server: npm start"
echo "3. Or use development server: npm run dev"
echo ""
echo "Production flow enforcement:"
echo "- Users must start at main page"
echo "- Only selected users can access referral form"
echo "- Only rejected users can access not-selected page"
echo "- Only completed users can access submitted page"
echo "- Invalid sessions redirect to main page"
echo ""
echo "To switch back to testing mode:"
echo "./scripts/set-testing-mode.sh"
echo ""
echo "To restore original configuration:"
echo "cp .env.local.backup .env.local"