#!/bin/bash

# Demonstration script for Testing vs Production modes

echo "🎭 Referral Website V2 - Mode Demonstration"
echo "=============================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root directory
cd "$PROJECT_ROOT"

# Function to show current mode
show_current_mode() {
    if [ -f .env.local ] && grep -q "TESTING_MODE=true" .env.local; then
        echo "🔧 Current Mode: TESTING"
        echo "   - Testing navigation panel visible"
        echo "   - Direct access to all pages"
        echo "   - Debug information shown"
        echo "   - User flow restrictions bypassed"
    else
        echo "🚀 Current Mode: PRODUCTION"
        echo "   - Enforced user flow"
        echo "   - No debug information"
        echo "   - Proper session validation"
        echo "   - Access control based on user status"
    fi
    echo ""
}

# Function to show available pages
show_available_pages() {
    echo "📱 Available Pages:"
    echo "   • Main Page (/) - Waiting room with countdown"
    echo "   • Referral Form (/referral-form) - Application form"
    echo "   • Not Selected (/not-selected) - Rejection page with resources"
    echo "   • Submitted (/submitted) - Confirmation page"
    echo "   • Admin Dashboard (/admin) - System management"
    echo "   • Debug Page (/debug) - Debug version without DB"
    echo "   • Minimal Test (/minimal) - Minimal test page"
    echo "   • Session Test (/session-test) - Session testing"
    echo ""
}

# Function to show testing mode features
show_testing_features() {
    echo "🧪 Testing Mode Features:"
    echo "   • Purple gear icon in top-right corner"
    echo "   • Click to see all available pages"
    echo "   • Direct navigation to any page"
    echo "   • Debug information visible"
    echo "   • Session management tools"
    echo "   • Environment status display"
    echo ""
}

# Function to show production features
show_production_features() {
    echo "🏭 Production Mode Features:"
    echo "   • Clean, professional interface"
    echo "   • Enforced user flow sequence"
    echo "   • Session validation required"
    echo "   • Access denied for invalid sessions"
    echo "   • No debug information visible"
    echo "   • Proper error handling"
    echo ""
}

# Main demonstration
echo "Current Configuration:"
show_current_mode

echo "Available Pages:"
show_available_pages

if [ -f .env.local ] && grep -q "TESTING_MODE=true" .env.local; then
    show_testing_features
    
    echo "🔄 To switch to Production Mode:"
    echo "   ./scripts/disable-testing-mode.sh"
    echo "   npm run dev"
    echo ""
    
    echo "🎯 Testing Mode Usage:"
    echo "   1. Start the server: npm run dev"
    echo "   2. Open http://localhost:3001"
    echo "   3. Look for purple gear icon in top-right"
    echo "   4. Click to see all available pages"
    echo "   5. Navigate directly to any page"
    echo "   6. Use debug controls to test scenarios"
    
else
    show_production_features
    
    echo "🔄 To switch to Testing Mode:"
    echo "   ./scripts/enable-testing-mode.sh"
    echo "   npm run dev"
    echo ""
    
    echo "🎯 Production Mode Usage:"
    echo "   1. Start the server: npm run dev"
    echo "   2. Open http://localhost:3001"
    echo "   3. Follow the proper user flow:"
    echo "      - Start at main page"
    echo "      - Wait for countdown"
    echo "      - Get selected/rejected"
    echo "      - Access appropriate page"
    echo "   4. Try accessing pages directly (should be blocked)"
fi

echo ""
echo "📚 For more information, see:"
echo "   • TESTING_GUIDE.md - Comprehensive testing guide"
echo "   • DEPLOYMENT.md - Deployment instructions"
echo "   • README.md - Project overview"
echo ""
echo "🛠️ Quick Commands:"
echo "   • Enable testing: ./scripts/enable-testing-mode.sh"
echo "   • Disable testing: ./scripts/disable-testing-mode.sh"
echo "   • Start server: npm run dev"
echo "   • Build production: npm run build"
echo "   • Start production: npm start"
echo ""
echo "✨ Happy testing!"
