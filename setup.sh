#!/usr/bin/env bash
# Setup script for image-batch-tool
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
USER_BIN="$HOME/bin"
GLOBAL_CMD="$USER_BIN/batch-image"

echo "🚀 Setting up Image Batch Tool..."

# Ensure this script and uninstall script are executable
chmod +x "$PROJECT_DIR/setup.sh" 2>/dev/null || true
chmod +x "$PROJECT_DIR/uninstall.sh" 2>/dev/null || true

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) and try again."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
cd "$PROJECT_DIR"
echo "📦 Installing npm dependencies..."
npm install

# Build the TypeScript project
echo "🔨 Building TypeScript project..."
npm run build

# Link the CLI globally using npm
echo "🔗 Linking batch-image globally with npm link..."
npm link

# Make the main batch script executable
chmod +x "$PROJECT_DIR/bin/batch-image.sh" 2>/dev/null || echo "⚠️  Could not make batch-image.sh executable"

# Ensure ~/bin exists
mkdir -p "$USER_BIN"

# Create the global wrapper script in ~/bin
echo "📝 Creating global wrapper script..."
cat > "$GLOBAL_CMD" <<EOF
#!/usr/bin/env bash
cd "$PROJECT_DIR"
./bin/batch-image.sh "\$@"
EOF
chmod +x "$GLOBAL_CMD"

# Add ~/bin to PATH in .bashrc if not present
if ! grep -q 'export PATH="$HOME/bin:$PATH"' "$HOME/.bashrc"; then
  echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
  echo "✅ Added ~/bin to PATH in .bashrc"
else
  echo "✅ ~/bin already in PATH"
fi

cat <<MSG

🎉 Setup complete!

Next steps:
1. Reload your shell: source ~/.bashrc
2. Or open a new terminal window
3. Test the installation: batch-image --help

The 'batch-image' command is now available globally!
MSG
