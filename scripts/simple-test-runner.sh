#!/bin/bash

echo "🚀 Starting server and tests properly..."

# Kill any existing server
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start server in true background
echo "📡 Starting Next.js server..."
nohup npm run dev > dev-server.log 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to be ready..."
sleep 10

# Check if server is responding
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is ready on http://localhost:3000"
    
    echo "🧪 Running tests..."
    npx playwright test tests/main-features.spec.ts --grep="admin dashboard should be accessible" --project=chromium --reporter=line
    
    echo "🧹 Cleaning up..."
    kill $SERVER_PID 2>/dev/null || true
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi
