#!/bin/bash
set -e

echo "🚀 Starting MatkaKing development environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."

    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

    if ! command -v mysql &> /dev/null; then
        echo -e "${YELLOW}⚠️  MySQL client not found in PATH. Make sure MySQL server is running.${NC}"
    else
        echo -e "${GREEN}✅ MySQL: $(mysql --version | head -1)${NC}"
    fi
}

# Install dependencies
install_deps() {
    echo ""
    echo "📦 Installing dependencies..."

    echo "  Installing server dependencies..."
    cd "$PROJECT_DIR/server"
    npm install

    echo "  Installing client dependencies..."
    cd "$PROJECT_DIR/client"
    npm install

    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Setup environment
setup_env() {
    echo ""
    echo "⚙️  Setting up environment..."

    # Create .env file if it doesn't exist
    if [ ! -f "$PROJECT_DIR/server/.env" ]; then
        cp "$PROJECT_DIR/server/.env.example" "$PROJECT_DIR/server/.env"
        echo -e "${YELLOW}⚠️  Created server/.env from .env.example. Please update with your MySQL credentials.${NC}"
    fi

    # Generate Prisma client
    echo "  Generating Prisma client..."
    cd "$PROJECT_DIR/server"
    npx prisma generate

    echo -e "${GREEN}✅ Environment configured${NC}"
}

# Setup database
setup_database() {
    echo ""
    echo "🗄️  Setting up database..."

    cd "$PROJECT_DIR/server"

    # Push schema to database
    echo "  Pushing Prisma schema to MySQL..."
    npx prisma db push

    # Seed database
    echo "  Seeding database..."
    npx tsx prisma/seed.ts

    echo -e "${GREEN}✅ Database configured${NC}"
}

# Start development servers
start_dev() {
    echo ""
    echo "🎯 Starting development servers..."

    # Start server in background
    cd "$PROJECT_DIR/server"
    echo "  Starting API server on port 3001..."
    npm run dev &
    SERVER_PID=$!

    # Start client in background
    cd "$PROJECT_DIR/client"
    echo "  Starting React dev server on port 5173..."
    npm run dev &
    CLIENT_PID=$!

    echo ""
    echo -e "${GREEN}✅ Development servers started!${NC}"
    echo ""
    echo "  🌐 Frontend: http://localhost:5173"
    echo "  🔗 API:      http://localhost:3001/api/health"
    echo "  💬 Socket:   ws://localhost:3001"
    echo ""
    echo "  Server PID: $SERVER_PID"
    echo "  Client PID: $CLIENT_PID"
    echo ""
    echo "  Press Ctrl+C to stop all servers"

    # Handle shutdown
    cleanup() {
        echo ""
        echo "🛑 Stopping servers..."
        kill $SERVER_PID 2>/dev/null
        kill $CLIENT_PID 2>/dev/null
        echo "✅ All servers stopped"
        exit 0
    }

    trap cleanup INT TERM

    # Wait for processes
    wait
}

# Main
case "${1:-}" in
    install)
        check_prerequisites
        install_deps
        ;;
    setup)
        check_prerequisites
        install_deps
        setup_env
        setup_database
        ;;
    dev)
        start_dev
        ;;
    *)
        check_prerequisites
        install_deps
        setup_env
        setup_database
        start_dev
        ;;
esac
