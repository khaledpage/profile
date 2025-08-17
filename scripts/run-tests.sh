#!/bin/bash

# Test runner script that manages server and tests separately
set -e

echo "🚀 Starting test environment..."

# Function to cleanup processes on exit
cleanup() {
    echo "🧹 Cleaning up..."
    
    # Kill the server process if it exists
    if [ ! -z "$SERVER_PID" ]; then
        echo "   Stopping server process (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null || true
        sleep 2
        # Force kill if still running
        kill -9 $SERVER_PID 2>/dev/null || true
    fi
    
    # Kill any remaining Next.js processes
    echo "   Cleaning up any remaining Next.js processes..."
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "node.*next" 2>/dev/null || true
    
    # Wait a moment for cleanup
    sleep 1
    
    echo "✅ Cleanup completed"
}

# Setup cleanup trap
trap cleanup EXIT INT TERM

# Kill any existing Next.js processes
echo "🔄 Stopping any existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
sleep 3

# Start the development server in background on port 3001
echo "📱 Starting Next.js development server on port 3001..."
PORT=3001 npm run dev > dev-server.log 2>&1 &
SERVER_PID=$!

# Check if server process is actually running
sleep 2
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ Server process failed to start"
    if [ -f dev-server.log ]; then
        echo "Server log:"
        cat dev-server.log
    fi
    exit 1
fi

# Wait for server to be ready with better timeout handling
echo "⏳ Waiting for server to be ready on port 3001..."
SERVER_READY=false
for i in {1..45}; do
    # Check if server process is still alive
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "❌ Server process died unexpectedly"
        if [ -f dev-server.log ]; then
            echo "Server log:"
            tail -20 dev-server.log
        fi
        exit 1
    fi
    
    # Try to connect to server on port 3001 (as configured in Playwright)
    if curl -s --connect-timeout 2 --max-time 5 http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Server is ready on port 3001!"
        SERVER_READY=true
        break
    fi
    
    # Show progress every 10 attempts
    if [ $((i % 10)) -eq 0 ]; then
        echo "   Still waiting... (attempt $i/45)"
    fi
    
    sleep 1
done

# Final check if server is ready
if [ "$SERVER_READY" = false ]; then
    echo "❌ Server failed to start within 45 seconds"
    echo "Server log (last 30 lines):"
    if [ -f dev-server.log ]; then
        tail -30 dev-server.log
    else
        echo "No server log found"
    fi
    
    # Try to get more info about what's running on port 3001
    echo "Checking what's running on port 3001:"
    lsof -i :3001 2>/dev/null || echo "Nothing found on port 3001"
    
    exit 1
fi

# Run the tests with process monitoring
echo "🧪 Running tests..."

# Function to run tests with background monitoring
run_test_with_monitoring() {
    local test_command="$1"
    local test_name="$2"
    
    echo "Running $test_name..."
    
    # Start the test in background
    eval "$test_command" &
    TEST_PID=$!
    
    # Monitor the test process
    local elapsed=0
    local max_time=600  # 10 minutes
    
    while kill -0 $TEST_PID 2>/dev/null; do
        sleep 5
        elapsed=$((elapsed + 5))
        
        if [ $elapsed -ge $max_time ]; then
            echo "❌ Test timed out after $max_time seconds"
            kill $TEST_PID 2>/dev/null || true
            sleep 2
            kill -9 $TEST_PID 2>/dev/null || true
            return 124
        fi
        
        # Show progress every minute
        if [ $((elapsed % 60)) -eq 0 ] && [ $elapsed -gt 0 ]; then
            echo "   Test running... (${elapsed}s elapsed)"
        fi
    done
    
    # Get the exit code
    wait $TEST_PID
    return $?
}

# Run specific test suites
if [ "$1" = "main" ]; then
    run_test_with_monitoring "npx playwright test tests/main-features.spec.ts --reporter=line" "main features tests"
    TEST_EXIT_CODE=$?
elif [ "$1" = "file-ops" ]; then
    run_test_with_monitoring "npx playwright test tests/file-operations.spec.ts --reporter=line" "file operations tests"
    TEST_EXIT_CODE=$?
elif [ "$1" = "admin" ]; then
    run_test_with_monitoring "npx playwright test tests/admin-analytics.spec.ts --reporter=line" "admin analytics tests"
    TEST_EXIT_CODE=$?
elif [ "$1" = "security" ]; then
    run_test_with_monitoring "npx playwright test tests/security-api.spec.ts --reporter=line" "security tests"
    TEST_EXIT_CODE=$?
elif [ "$1" = "all" ] || [ -z "$1" ]; then
    run_test_with_monitoring "npx playwright test --reporter=line" "all test suites"
    TEST_EXIT_CODE=$?
else
    run_test_with_monitoring "npx playwright test \"$1\" --reporter=line" "custom test: $1"
    TEST_EXIT_CODE=$?
fi

# Check test results
if [ $TEST_EXIT_CODE -eq 124 ]; then
    echo "❌ Tests timed out"
    exit 1
elif [ $TEST_EXIT_CODE -ne 0 ]; then
    echo "❌ Tests failed with exit code $TEST_EXIT_CODE"
    exit $TEST_EXIT_CODE
else
    echo "✅ Tests completed successfully!"
fi
