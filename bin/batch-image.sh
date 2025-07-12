#!/usr/bin/env bash

# Parse flags and positional arguments
ARGS=("$@")

# Find project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Ensure Node.js and npm are available
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Please install Node.js."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Please install npm."
  exit 1
fi

# Run the TypeScript CLI
cd "$PROJECT_ROOT"
echo "Project is at ${PROJECT_ROOT}"
npm start -- "${ARGS[@]}"
