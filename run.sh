#!/bin/bash
set -e
cd "$(dirname "$0")"
exec .venv/bin/uvicorn server.app:app --host 0.0.0.0 --port 8000
