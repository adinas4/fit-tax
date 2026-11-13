#!/usr/bin/env bash
# Watchdog: keeps the Next.js dev server running on port 3000.
# If the server process is not alive (or port 3000 is not responding),
# it restarts it. Intended to run detached in the background.

cd /home/z/my-project
LOG=/home/z/my-project/dev.log

while true; do
  # Check if something is listening on port 3000.
  if ! curl -s -o /dev/null --max-time 3 http://localhost:3000/ 2>/dev/null; then
    # Kill any stale next dev process.
    pkill -f "next dev -p 3000" 2>/dev/null
    sleep 1
    # Start fresh.
    nohup ./node_modules/.bin/next dev -p 3000 > "$LOG" 2>&1 &
    echo "[$(date)] (re)started next dev, pid $!" >> /home/z/my-project/watchdog.log
    # Give it time to boot before the next check.
    sleep 12
  else
    sleep 10
  fi
done
