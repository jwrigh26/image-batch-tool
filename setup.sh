#!/usr/bin/env bash
# Setup script for image-batch-tool
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
USER_BIN="$HOME/bin"
GLOBAL_CMD="$USER_BIN/batch-image"

# Install dependencies
cd "$PROJECT_DIR"
echo "Installing npm dependencies..."
npm install

# Make the main batch script executable
chmod +x "$PROJECT_DIR/bin/batch-image.sh"

# Ensure ~/bin exists
mkdir -p "$USER_BIN"

# Create the global wrapper script in ~/bin
cat > "$GLOBAL_CMD" <<EOF
#!/usr/bin/env bash
cd "$PROJECT_DIR"
./bin/batch-image.sh "$@"
EOF
chmod +x "$GLOBAL_CMD"

# Add ~/bin to PATH in .bashrc if not present
if ! grep -q 'export PATH="$HOME/bin:$PATH"' "$HOME/.bashrc"; then
  echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
  echo "Added ~/bin to PATH in .bashrc"
fi

cat <<MSG

Setup complete!
You can now run 'batch-image' from any terminal.
If you just ran this, run: source ~/.bashrc
MSG
