#!/bin/bash

echo "🚀 Starting port cleanup..."

# List of ports to kill
PORTS=(3000 8000)

for PORT in "${PORTS[@]}"; do
  echo "🔍 Checking for processes on port $PORT..."
  PID=$(lsof -t -i :$PORT)

  if [ -z "$PID" ]; then
    echo "✅ No process found on port $PORT."
  else
    echo "Kiling process with PID: $PID on port $PORT..."
    kill -9 $PID
    echo "💀 Killed process $PID on port $PORT."
  fi
done

echo "✨ Port cleanup finished!"
