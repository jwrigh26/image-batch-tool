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
| `--preset`    | Output configuration preset     | `--preset modern`        |

### Output Presets

Choose how many files to generate per image:

| Preset | Files Per Image | Formats | Sizes | Best For |
|--------|-----------------|---------|-------|----------|
| **modern** _(default)_ | **3 files** | WebP only | large, medium, small | Modern websites (95%+ browser support) |
| **minimal** | **1 file** | WebP only | medium | Simple blogs, fast loading |
| **blog** | **4 files** | WebP + JPEG | large, medium | Blog with fallback support |
| **full** | **8 files** | WebP + JPEG | orig, large, medium, small | Maximum compatibility |

**Examples:**
```bash
# Default: 3 WebP files (recommended)
batch-image --blog-date 202507 --category travel

# Minimal: just 1 optimized file  
batch-image --blog-date 202507 --category travel --preset minimal

# Blog: 4 files with JPEG fallbacks
batch-image --blog-date 202507 --category travel --preset blog
```

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

## 🌐 Responsive Image Output

The tool generates responsive variants with configurable presets to balance quality, compatibility, and file count:

### Default Output (Modern Preset)

Each input image creates **3 optimized WebP files** _(recommended for modern websites)_:

```
20250715-category-image-name-large.webp   (75% size, ~900px)
20250715-category-image-name-medium.webp  (50% size, ~600px)  
20250715-category-image-name-small.webp   (25% size, ~300px)
```

### File Size Benefits

WebP provides significant space savings over JPEG:

| Variant | WebP Size | JPEG Size* | Savings |
|---------|-----------|------------|---------|
| Large | 18K | 37K | **51% smaller** |
| Medium | 11K | 21K | **48% smaller** |
| Small | 5K | 8K | **38% smaller** |

_*JPEG sizes shown for comparison - only generated with `blog` or `full` presets_

### WebP Browser Support (2024)

- **✅ Supported**: Chrome, Firefox, Safari, Edge (95%+ of users)
- **❌ Not Supported**: Internet Explorer, very old mobile browsers  
- **Recommendation**: Use `modern` preset for new projects, `blog` preset if you need IE support

### HTML Usage Examples

**Modern Responsive Images (Default Preset):**

```html
<img src="20250715-blog-image-medium.webp"
     srcset="20250715-blog-image-small.webp 400w,
             20250715-blog-image-medium.webp 800w,
             20250715-blog-image-large.webp 1200w"
     sizes="(max-width: 768px) 400px,
            (max-width: 1024px) 800px,
            1200px"
     alt="Description" loading="lazy">
```

**With JPEG Fallback (Blog Preset):**

```html
<picture>
  <!-- Large screens: WebP preferred, JPEG fallback -->
  <source srcset="20250715-blog-image-large.webp" 
          media="(min-width: 1024px)" type="image/webp">
  <source srcset="20250715-blog-image-large.jpg" 
          media="(min-width: 1024px)" type="image/jpeg">
  
  <!-- Mobile: WebP preferred, JPEG fallback -->
  <source srcset="20250715-blog-image-medium.webp" type="image/webp">
  <img src="20250715-blog-image-medium.jpg" 
       alt="Description" loading="lazy">
</picture>
```

**CSS Background Images:**

```css
.hero-image {
  background-image: url('20250715-blog-image-large.webp');
}

/* Fallback for browsers without WebP support */
.no-webp .hero-image {
  background-image: url('20250715-blog-image-large.jpg');
}

/* Responsive backgrounds */
@media (max-width: 768px) {
  .hero-image {
    background-image: url('20250715-blog-image-medium.webp');
  }
  .no-webp .hero-image {
    background-image: url('20250715-blog-image-medium.jpg');
  }
}
```

### Browser Support

- **WebP**: Chrome, Firefox, Safari (iOS 14+), Edge
- **JPEG**: Universal support (all browsers)
- **Recommended**: Use `<picture>` element for automatic format selection

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
