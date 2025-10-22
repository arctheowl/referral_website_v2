#!/bin/bash

# Script to set up database configuration

echo "🗄️ Database Setup for Referral Website V2"
echo "=========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root directory
cd "$PROJECT_ROOT"

echo "📁 Project Root: $PROJECT_ROOT"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Creating from example..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local from example"
fi

echo ""
echo "🔧 Database Configuration Options:"
echo ""
echo "1. Use Neon (Serverless PostgreSQL) - Recommended for production"
echo "2. Use local PostgreSQL - For development"
echo "3. Use placeholder URL - For testing without database"
echo "4. Skip setup - Keep current configuration"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Neon Database Setup:"
        echo "1. Go to https://neon.tech and create a free account"
        echo "2. Create a new project"
        echo "3. Copy the connection string"
        echo "4. Paste it below (it should look like: postgresql://user:pass@host/db?sslmode=require)"
        echo ""
        read -p "Enter your Neon database URL: " neon_url
        
        if [ -n "$neon_url" ]; then
            # Update .env.local with the real database URL
            sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$neon_url\"|" .env.local
            echo "✅ Database URL updated in .env.local"
            echo ""
            echo "🚀 Next steps:"
            echo "1. Run: npm run init-db"
            echo "2. Run: npm run dev"
        else
            echo "❌ No database URL provided"
        fi
        ;;
    2)
        echo ""
        echo "🏠 Local PostgreSQL Setup:"
        echo "Make sure PostgreSQL is installed and running locally"
        echo ""
        read -p "Enter database name (default: referral_db): " db_name
        read -p "Enter username (default: postgres): " db_user
        read -p "Enter password: " db_pass
        read -p "Enter host (default: localhost): " db_host
        read -p "Enter port (default: 5432): " db_port
        
        db_name=${db_name:-referral_db}
        db_user=${db_user:-postgres}
        db_host=${db_host:-localhost}
        db_port=${db_port:-5432}
        
        local_url="postgresql://$db_user:$db_pass@$db_host:$db_port/$db_name"
        
        # Update .env.local with the local database URL
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$local_url\"|" .env.local
        echo "✅ Database URL updated in .env.local"
        echo ""
        echo "🚀 Next steps:"
        echo "1. Create the database: createdb $db_name"
        echo "2. Run: npm run init-db"
        echo "3. Run: npm run dev"
        ;;
    3)
        echo ""
        echo "🧪 Using placeholder URL for testing..."
        echo "Note: This will cause database errors but allows testing the UI"
        echo ""
        echo "✅ Configuration set for testing without database"
        ;;
    4)
        echo ""
        echo "⏭️ Skipping database setup"
        echo "Current configuration will be kept"
        ;;
    *)
        echo ""
        echo "❌ Invalid option. Skipping setup."
        ;;
esac

echo ""
echo "📋 Current .env.local configuration:"
echo "=================================="
grep -E "(DATABASE_URL|TESTING_MODE|NODE_ENV)" .env.local | head -5

echo ""
echo "🛠️ Available commands:"
echo "• Initialize database: npm run init-db"
echo "• Start development: npm run dev"
echo "• Enable testing mode: ./scripts/set-testing-mode.sh"
echo "• Check setup: ./scripts/verify-setup.sh"
echo ""
echo "✨ Setup complete!"
