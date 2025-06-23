#!/bin/bash

# Script to restart both backend and frontend servers
# For use with Windows Git Bash or other Bash terminals on Windows

echo "=== CHAKRAS MUSIC APP - SERVER RESTART SCRIPT ==="
echo ""

# Function to kill processes on Windows by port
kill_process_by_port() {
    local port=$1
    echo "Checking for processes on port $port..."
    
    # Use Windows-specific command but through bash
    PID=$(netstat -ano | grep :$port | grep LISTENING | awk '{print $5}')
    
    if [ -n "$PID" ]; then
        echo "Found process with PID $PID on port $port. Killing..."
        taskkill //F //PID $PID
        sleep 1
    else
        echo "No process found on port $port."
    fi
}

# Stop backend server (port 5000)
echo ""
echo "=== Stopping backend server ==="
kill_process_by_port 5000

# Stop frontend server (port 5173)
echo ""
echo "=== Stopping frontend server ==="
kill_process_by_port 5173

# Give processes time to fully terminate
echo ""
echo "=== Waiting for processes to terminate ==="
sleep 2

# Start backend server
echo ""
echo "=== Starting backend server ==="
cd "$(dirname "$0")/backend"
npm start &
BACKEND_PID=$!
echo "Backend server started with PID $BACKEND_PID"

# Wait a bit for backend to initialize
sleep 3

# Start frontend server
echo ""
echo "=== Starting frontend server ==="
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started with PID $FRONTEND_PID"

echo ""
echo "=== Servers restarted ==="
echo "Backend running on port 5000"
echo "Frontend running on port 5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
wait
