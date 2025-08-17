#!/bin/bash

PORT=9323
CHECK_INTERVAL=30   # seconds between checks
TIMEOUT=100         # 100 seconds

current_pid=""
start_time=0

while true; do
    pid=$(lsof -ti tcp:$PORT)

    if [[ -n "$pid" ]]; then
        now=$(date +%s)

        if [[ "$pid" != "$current_pid" ]]; then
            current_pid=$pid
            start_time=$now
            echo "$(date '+%Y-%m-%d %H:%M:%S') - Port $PORT in use by PID $pid, start monitoring"
        else
            elapsed=$((now - start_time))
            echo "$(date '+%Y-%m-%d %H:%M:%S') - Port $PORT still used by PID $pid, elapsed ${elapsed}s"
            if (( elapsed >= TIMEOUT )); then
                echo "$(date '+%Y-%m-%d %H:%M:%S') - Killing PID $pid (used port $PORT for more than $TIMEOUT seconds)"
                kill -9 $pid
                current_pid=""
                start_time=0
            fi
        fi
    else
        if [[ -n "$current_pid" ]]; then
            echo "$(date '+%Y-%m-%d %H:%M:%S') - Port $PORT is now free"
        fi
        current_pid=""
        start_time=0
    fi

    sleep $CHECK_INTERVAL
done
