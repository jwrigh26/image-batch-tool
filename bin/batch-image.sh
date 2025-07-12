#!/usr/bin/env bash
RAW_DIR="$(dirname "$0")/../raw"

if [ ! -d "$RAW_DIR" ]; then
  echo "Directory 'raw/' not found. Would you like to create it? (y/n)"
  read -r answer
  if [ "$answer" = "y" ]; then
    mkdir -p "$RAW_DIR"
    echo "Created 'raw/' directory."
  else
    echo "Exiting. 'raw/' directory is required."
    exit 1
  fi
fi

# Run the Node CLI to print image filenames
cd "$(dirname "$0")/.."
npm start
