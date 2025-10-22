#!/bin/bash

echo "🚀 Setting up Referral Website V2 Database"
echo "=========================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo ""
    echo "Please create a .env.local file with your database URL:"
    echo ""
    echo "DATABASE_URL=\"postgresql://username:password@host:port/database?sslmode=require\""
    echo ""
    echo "Example for Neon:"
    echo "DATABASE_URL=\"postgresql://myuser:mypassword@ep-abc123.us-east-1.aws.neon.tech/neondb?sslmode=require\""
    echo ""
    echo "You can get a free database from:"
    echo "- Neon: https://neon.tech"
    echo "- Supabase: https://supabase.com"
    echo ""
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env.local; then
    echo "❌ DATABASE_URL not found in .env.local!"
    echo "Please add your database URL to the .env.local file."
    exit 1
fi

echo "✅ .env.local file found"
echo ""

# Initialize the database
echo "🔧 Initializing database..."
npm run init-db

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Database setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run dev' to start the development server"
    echo "2. Visit http://localhost:3000 to see the waiting room"
    echo "3. Visit http://localhost:3000/admin to access the admin dashboard"
    echo ""
else
    echo ""
    echo "❌ Database initialization failed!"
    echo "Please check your DATABASE_URL and try again."
    exit 1
fi
