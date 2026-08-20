#!/bin/bash
cd "$(dirname "$0")"
PORT=8081

echo "Thuldai website — local preview"
echo "Folder: $(pwd)"
echo ""

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 not found. Install Python 3 first."
  read -r -p "Press Enter to close..."
  exit 1
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use — server may already be running."
  echo "Open: http://localhost:$PORT/index.html"
else
  echo "Starting server on http://localhost:$PORT/index.html"
  echo "Keep this window OPEN while you browse. Press Ctrl+C to stop."
  echo ""
  python3 -m http.server "$PORT"
fi
