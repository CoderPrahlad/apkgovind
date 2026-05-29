#!/bin/bash
set -e

echo "🔨 Building MatkaKing for production..."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Build client
echo ""
echo "📦 Building React client..."
cd "$PROJECT_DIR/client"
npm run build
echo "✅ Client built to client/dist/"

# Build server
echo ""
echo "📦 Building Express server..."
cd "$PROJECT_DIR/server"
npm run build
echo "✅ Server built to server/dist/"

# Generate Prisma client for production
echo ""
echo "📦 Generating Prisma client..."
cd "$PROJECT_DIR/server"
npx prisma generate

echo ""
echo "✅ Build complete!"
echo ""
echo "To start the production server:"
echo "  cd server"
echo "  DATABASE_URL='mysql://user:pass@host:port/db' npm start"
