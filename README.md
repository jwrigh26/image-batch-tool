# Image Batch Tool

A Node.js/TypeScript CLI tool for batch processing images with organized directory structures. Perfect for blog workflows and image organization.

## Features

- 🖼️ **Batch Image Processing**: Process multiple images at once
- 📁 **Smart Directory Organization**: Automatic year/month folder structures
- 📅 **Flexible Date Handling**: Support for YYYYMM and YYYYMMDD formats
- 🎯 **Blog-Optimized**: Designed for blog content workflows
- 🔧 **Interactive Configuration**: Edit settings on-the-fly
- 🌐 **Global CLI Access**: Run `batch-image` from anywhere

## Quick Start

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jwrigh26/image-batch-tool.git
   cd image-batch-tool
   ```

2. **Make setup script executable and run it:**

   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Reload your shell:**
   ```bash
   source ~/.bashrc
   ```

> **Note:** If you get a "Permission denied" error, make sure the script is executable with `chmod +x setup.sh`

### Usage

#### Basic Commands

```bash
# Quick blog post processing (creates ~/Pictures/blog/YYYY/MM structure)
batch-image --blog-date 202507

# Specific date processing
batch-image --blog-date 20250715

# Traditional blog workflow
batch-image --blog ~/Pictures/blog --date 20250715

# Raw image processing
batch-image --raw ~/Pictures/camera-uploads

# Get help
batch-image --help
```

#### Example Workflows

**Blog Post Workflow:**

```bash
# For July 2025 blog posts
batch-image --blog-date 202507
# Creates: ~/Pictures/blog/2025/07/
```

**Custom Directory:**

```bash
# Specify your own blog directory
batch-image --blog ~/Documents/my-blog --date 20250715
# Creates: ~/Documents/my-blog/2025/07/
```

**Interactive Configuration:**
When prompted, you can:

- Change source directory
- Modify blog parent directory
- Update the date
- Review final target directory

## Command Reference

| Flag          | Description                     | Example                  |
| ------------- | ------------------------------- | ------------------------ |
| `--raw`       | Source directory for raw images | `--raw ~/Downloads`      |
| `--blog`      | Blog parent directory           | `--blog ~/Pictures/blog` |
| `--date`      | Full date (YYYYMMDD)            | `--date 20250715`        |
| `--blog-date` | Blog date (YYYYMM or YYYYMMDD)  | `--blog-date 202507`     |
| `--category`  | Image category                  | `--category vacation`    |

## Directory Structure

The tool creates organized directory structures:

```
~/Pictures/
├── _raw/                    # Default raw images location
└── blog/                    # Default blog images location
    └── 2025/
        ├── 01/             # January 2025
        ├── 07/             # July 2025
        └── 12/             # December 2025
```

## Configuration

The tool supports interactive configuration editing. If the initial setup doesn't look right, answer "n" when prompted and you can:

- ✏️ Change the raw directory
- 📝 Modify blog parent directory
- 📅 Update the date
- 📂 Preview the final target directory

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Local Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run locally
npm run start -- --help

# Link globally for testing
npm link
```

## Troubleshooting

### Permission Denied Errors

If you encounter "Permission denied" when running scripts:

```bash
chmod +x setup.sh
chmod +x uninstall.sh
```

### Command Not Found After Installation

If `batch-image` command is not found after setup:

1. Reload your shell: `source ~/.bashrc`
2. Or open a new terminal window
3. Check if `~/bin` is in your PATH: `echo $PATH`

### npm link Issues

If npm link fails during setup:

- Make sure you have Node.js and npm installed
- Try running `npm install -g` manually after setup completes

### PATH Not Updated

If the PATH isn't updated in your shell:

- The setup script modifies `.bashrc`
- For other shells (zsh, fish), manually add `export PATH="$HOME/bin:$PATH"` to your shell config
- Or use the npm global link: `npm link` (after building)

## Uninstall

To completely remove the tool:

```bash
chmod +x uninstall.sh
./uninstall.sh
```

This will:

- Remove the global `batch-image` command
- Clean up PATH modifications in `.bashrc`
- Remove the `~/bin/batch-image` wrapper script
- Offer to remove empty `~/bin` directory

> **Note:** If you get a "Permission denied" error, make sure the script is executable with `chmod +x uninstall.sh`

## License

MIT License - feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `./setup.sh` and `./uninstall.sh`
5. Submit a pull request
