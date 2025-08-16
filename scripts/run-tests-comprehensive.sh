#!/bin/bash

# Comprehensive Test Runner Script for Next.js + Playwright
# This script demonstrates the proper way to run server and tests

set -e  # Exit on any error

echo "🚀 Comprehensive Test Runner for Profile Project"
echo "================================================"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -ti:$port > /dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo "🔄 Killing process on port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Function to wait for server
wait_for_server() {
    local url=$1
    local timeout=${2:-60}
    local count=0
    
    echo "⏳ Waiting for server at $url..."
    
    while [ $count -lt $timeout ]; do
        if curl -s -o /dev/null -w "%{http_code}" $url | grep -q "200\|302\|403"; then
            echo "✅ Server is ready!"
            return 0
        fi
        echo "   ... waiting ($count/$timeout)"
        sleep 2
        count=$((count + 2))
    done
    
    echo "❌ Server failed to start within $timeout seconds"
    return 1
}

# Parse command line arguments
TEST_TYPE=${1:-"all"}
BROWSER=${2:-"chromium"}
MODE=${3:-"auto"}

echo "📋 Configuration:"
echo "   Test Type: $TEST_TYPE"
echo "   Browser: $BROWSER"
echo "   Mode: $MODE"
echo ""

# Clean up any existing processes on port 3000
if check_port 3000; then
    echo "🧹 Cleaning up existing server on port 3000..."
    kill_port 3000
fi

case $MODE in
    "manual")
        echo "🔧 MANUAL MODE: You manage the server"
        echo "   Please ensure your dev server is running on http://localhost:3000"
        echo "   Run: npm run dev"
        echo ""
        read -p "Press Enter when server is ready..." -r
        ;;
        
    "separate")
        echo "🔧 SEPARATE MODE: Starting server in background..."
        
        # Start server in background
        npm run dev > dev-server.log 2>&1 &
        SERVER_PID=$!
        echo "   Server PID: $SERVER_PID"
        
        # Wait for server to be ready
        if ! wait_for_server "http://localhost:3000"; then
            echo "❌ Failed to start server"
            kill $SERVER_PID 2>/dev/null || true
            exit 1
        fi
        
        # Function to cleanup on exit
        cleanup() {
            echo "🧹 Cleaning up server (PID: $SERVER_PID)..."
            kill $SERVER_PID 2>/dev/null || true
            wait $SERVER_PID 2>/dev/null || true
        }
        trap cleanup EXIT
        ;;
        
    "auto"|*)
        echo "🔧 AUTO MODE: Using Playwright webServer (recommended)"
        echo "   Playwright will manage the server automatically"
        ;;
esac

echo ""
echo "🧪 Running Tests..."
echo "==================="

# Run tests based on type
case $TEST_TYPE in
    "main")
        echo "🎯 Running Main Features Tests..."
        npx playwright test tests/main-features.spec.ts --project=$BROWSER --reporter=html
        ;;
        
    "file-ops")
        echo "📁 Running File Operations Tests..."
        npx playwright test tests/file-operations.spec.ts --project=$BROWSER --reporter=html
        ;;
        
    "admin")
        echo "👑 Running Admin Dashboard Tests..."
        npx playwright test tests/admin-analytics.spec.ts --project=$BROWSER --reporter=html
        ;;
        
    "security")
        echo "🔒 Running Security & API Tests..."
        npx playwright test tests/security-api.spec.ts --project=$BROWSER --reporter=html
        ;;
        
    "single")
        echo "🎯 Running Single Test..."
        TEST_NAME=${4:-"admin dashboard should be accessible"}
        npx playwright test --grep="$TEST_NAME" --project=$BROWSER --reporter=line
        ;;
        
    "debug")
        echo "🐛 Running Tests in Debug Mode..."
        npx playwright test tests/main-features.spec.ts --project=$BROWSER --headed --debug
        ;;
        
    "all"|*)
        echo "🌟 Running All Test Suites..."
        
        echo "1️⃣ Main Features..."
        npx playwright test tests/main-features.spec.ts --project=$BROWSER --reporter=line
        
        echo "2️⃣ File Operations..."
        npx playwright test tests/file-operations.spec.ts --project=$BROWSER --reporter=line
        
        echo "3️⃣ Admin Dashboard..."
        npx playwright test tests/admin-analytics.spec.ts --project=$BROWSER --reporter=line
        
        echo "4️⃣ Security & API..."
        npx playwright test tests/security-api.spec.ts --project=$BROWSER --reporter=line
        ;;
esac

echo ""
echo "📊 Test Results:"
echo "================"

if [ $? -eq 0 ]; then
    echo "✅ All tests completed successfully!"
    echo "📋 View detailed report: npx playwright show-report"
else
    echo "❌ Some tests failed"
    echo "🔍 Check the reports for details"
    echo "📋 View report: npx playwright show-report"
fi

echo ""
echo "💡 Usage Examples:"
echo "=================="
echo "  ./scripts/run-tests.sh                          # Run all tests (auto mode)"
echo "  ./scripts/run-tests.sh main chromium auto       # Run main tests on chromium"
echo "  ./scripts/run-tests.sh debug chromium separate  # Debug with separate server"
echo "  ./scripts/run-tests.sh single chromium manual   # Run single test manually"
echo ""
echo "🔧 Modes:"
echo "  auto     - Playwright manages server (recommended)"
echo "  separate - Script starts server in background"
echo "  manual   - You start the server manually"
echo ""
