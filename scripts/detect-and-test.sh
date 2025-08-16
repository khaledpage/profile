#!/bin/bash

# Smart Port Detection Script for Playwright Tests
# This script detects which port the Next.js server is running on and updates Playwright config

echo "🔍 Detecting Next.js server port..."

# Function to detect port from Next.js output
detect_nextjs_port() {
    # Look for running Next.js processes
    local port=$(ps aux | grep "next dev" | grep -v grep | head -1 | grep -o "localhost:[0-9]*" | cut -d: -f2)
    
    if [ -n "$port" ]; then
        echo $port
        return 0
    fi
    
    # Default fallback
    echo "3000"
    return 1
}

# Function to check if port is responding
check_port_health() {
    local port=$1
    curl -s -o /dev/null -w "%{http_code}" http://localhost:$port | grep -q "200\|302"
}

# Function to update Playwright config
update_playwright_config() {
    local port=$1
    local config_file="playwright.config.ts"
    
    echo "📝 Updating Playwright config to use port $port..."
    
    # Use sed to update the baseURL
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|baseURL: 'http://127.0.0.1:[0-9]*'|baseURL: 'http://127.0.0.1:$port'|" $config_file
    else
        # Linux
        sed -i "s|baseURL: 'http://127.0.0.1:[0-9]*'|baseURL: 'http://127.0.0.1:$port'|" $config_file
    fi
    
    echo "✅ Updated baseURL to http://127.0.0.1:$port"
}

# Main logic
DETECTED_PORT=$(detect_nextjs_port)

echo "🌐 Checking port $DETECTED_PORT..."

if check_port_health $DETECTED_PORT; then
    echo "✅ Server is healthy on port $DETECTED_PORT"
    update_playwright_config $DETECTED_PORT
    
    echo "🧪 Running tests..."
    npx playwright test "$@"
else
    echo "❌ No healthy server found on port $DETECTED_PORT"
    echo "💡 Please start your server with: npm run dev"
    echo "📋 Then run: ./scripts/detect-and-test.sh [test-args]"
    exit 1
fi
