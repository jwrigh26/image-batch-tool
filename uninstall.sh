#!/usr/bin/env bash
# Uninstall script for image-batch-tool
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
USER_BIN="$HOME/bin"
GLOBAL_CMD="$USER_BIN/batch-image"

echo "🗑️  Uninstalling Image Batch Tool..."

# Remove npm global link
echo "📦 Removing npm global link..."
if command -v npm &> /dev/null; then
  npm unlink -g 2>/dev/null || echo "  (npm global link was not found)"
else
  echo "  (npm not found, skipping npm unlink)"
fi

# Remove the global wrapper script from ~/bin
if [ -f "$GLOBAL_CMD" ]; then
  rm "$GLOBAL_CMD"
  echo "✅ Removed global command from ~/bin/batch-image"
else
  echo "ℹ️  Global command ~/bin/batch-image was not found"
fi

# Remove ~/bin from PATH in .bashrc if we added it
if grep -q 'export PATH="$HOME/bin:$PATH"' "$HOME/.bashrc" 2>/dev/null; then
  # Create a backup of .bashrc
  cp "$HOME/.bashrc" "$HOME/.bashrc.backup.$(date +%Y%m%d_%H%M%S)"
  echo "💾 Created backup of .bashrc"
  
  # Remove the PATH export line
  sed -i '/^export PATH="\$HOME\/bin:\$PATH"$/d' "$HOME/.bashrc"
  echo "✅ Removed ~/bin from PATH in .bashrc"
else
  echo "ℹ️  ~/bin PATH entry was not found in .bashrc"
fi

# Check if ~/bin directory is empty and offer to remove it
if [ -d "$USER_BIN" ]; then
  if [ -z "$(ls -A "$USER_BIN")" ]; then
    echo ""
    read -p "🗂️  ~/bin directory is empty. Remove it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      rmdir "$USER_BIN"
      echo "✅ Removed empty ~/bin directory"
    fi
  else
    echo "ℹ️  ~/bin directory contains other files, leaving it intact"
  fi
fi

cat <<MSG

🎉 Uninstall complete!

Note: Node modules and project files remain in this directory.
To completely remove, delete this entire project folder.

If you modified .bashrc, a backup was created as .bashrc.backup.TIMESTAMP
Restart your terminal or run: source ~/.bashrc
MSG
