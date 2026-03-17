#!/bin/bash
# Run the development server on port 8000. Make this script executable with: chmod +x run.sh
set -e
npm run preload-blog && vite --port 8000
