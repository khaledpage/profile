#!/bin/bash

# Test runner script that manages server and tests separately
set -e

echo "🚀 Starting test environment..."

# Function to cleanup processes on exit
cleanup() {
    echo "🧹 Cleaning up..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    pkill -f "next dev" 2>/dev/null || true
    exit
}

# Setup cleanup trap
trap cleanup EXIT INT TERM

# Kill any existing Next.js processes
echo "🔄 Stopping any existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start the development server in background
echo "📱 Starting Next.js development server..."
npm run dev > dev-server.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Server failed to start within 30 seconds"
        cat dev-server.log
        exit 1
    fi
    sleep 1
done

# Run the tests
echo "🧪 Running tests..."

# Run specific test suites
if [ "$1" = "main" ]; then
    echo "Running main features tests..."
    npx playwright test tests/main-features.spec.ts --reporter=line
elif [ "$1" = "file-ops" ]; then
    echo "Running file operations tests..."
    npx playwright test tests/file-operations.spec.ts --reporter=line
elif [ "$1" = "admin" ]; then
    echo "Running admin analytics tests..."
    npx playwright test tests/admin-analytics.spec.ts --reporter=line
elif [ "$1" = "security" ]; then
    echo "Running security tests..."
    npx playwright test tests/security-api.spec.ts --reporter=line
elif [ "$1" = "all" ] || [ -z "$1" ]; then
    echo "Running all test suites..."
    npx playwright test --reporter=line
else
    echo "Running custom test: $1"
    npx playwright test "$1" --reporter=line
fi

echo "✅ Tests completed!"
