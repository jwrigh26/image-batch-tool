# Image Batch Processor

A simple repository and CLI tool for automating image batch processing using TypeScript, Node.js, and Sharp, driven by a bash wrapper script.

---

## 📄 Summary

This project provides a highly configurable, date-organized image batch processor. You drop raw photos (e.g. scans of hand‑drawn sketches or digital images) into a `raw/` folder, run a bash wrapper that invokes the Node/TS CLI, and it will:

1. Compress the original images (strip metadata, adjust quality)
2. Read each image’s true dimensions
3. Generate responsive variants (`orig`, `large`, `medium`, `small`) by percentage scaling
4. Output WebP (and optionally JPEG) files into `blog/<YYYY>/<MM>/` folders
5. Name each file using `YYYYMMDD-category-slug-label.webp` convention
6. Optionally generate an `index.html` gallery for each month

---

## ✅ Requirements

- **Node.js** (v16+) & **npm**
- **TypeScript** (installed as a dev dependency)
- **Sharp** ([https://sharp.pixelplumbing.com/](https://sharp.pixelplumbing.com/))
- **Bash** shell (for the wrapper script)
- **GNU coreutils** (`mkdir`, `basename`, etc.)
- **ImageMagick** (optional, if you prefer to swap in for certain transforms)

---

## ⚙️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone git@github.com:<your-org>/image-batch-processor.git
   cd image-batch-processor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build**

   ```bash
   npm run build
   ```

4. **Make the bash wrapper executable**

   ```bash
   chmod +x ./bin/batch-image.sh
   ```

---

## 🚀 Usage

1. Drop your raw images into your default folder: `~/Pictures/_raw` (created automatically if missing), or specify a custom folder with the `--raw` flag.
2. Run the CLI tool directly or via the bash wrapper, passing any flags as needed:

   ```bash
   # Use default raw folder
   npm start -- --date 20250712 --category sketch

   # Or specify a custom raw folder
   npm start -- --raw /path/to/images --date 20250712 --category sketch
   ```

   Or, if using the bash wrapper:

   ```bash
   ./bin/batch-image.sh --date 20250712 --category sketch
   ./bin/batch-image.sh --raw /path/to/images --date 20250712 --category sketch
   ```

3. Check the output under `blog/2025/07/`. You should see your `.webp` variants and optionally an `index.html` gallery.

---

## 🛠️ Development Steps

1. **CLI Entrypoint** (`src/index.ts`)

   - Parse flags (`--date`, `--category`, `--scales`, `--quality`, etc.) using [yargs](https://github.com/yargs/yargs) or `commander`.
   - Accept a list of file paths at the end.

2. **Image Compression**

   - Use `sharp(input)` to `.jpeg({ quality, mozjpeg: true })` or `.webp({ quality })`, `.toBuffer()` or `.toFile()`.
   - Strip metadata with `.withMetadata({ exif: false, icc: false })`.

3. **Dimension Detection**

   - After compression, call `.metadata()` to get `width`.
   - Store original width for scaling calculations.

4. **Variant Generation**

   - Define scale factors in a config or default map (`{ orig: 1, large: 0.75, medium: 0.5, small: 0.25 }`).
   - For each factor: calculate new width, call `sharp(buffer).resize(newWidth).toFile(tempPath)`.

5. **Slug & Filename Logic**

   - Slugify original filename: lowercase, replace non-alphanumerics with `-`, trim duplicates.
   - Construct final filename: `${date}-${category}-${slug}-${label}.webp`.

6. **Date‑based Output Folders**

   - Extract `YYYY` and `MM` from the `--date` flag.
   - Ensure `blog/${YYYY}/${MM}` exists before writing files.

7. **Bash Wrapper** (`bin/batch-image.sh`)

   - Reads positional args and flags.
   - Calls the compiled Node CLI with `node dist/index.js "$@"`.
   - Handles global settings (e.g. `export NODE_ENV=production`).

8. **Optional: HTML Index Generator**

   - After processing all images, scan the month folder with `fs.readdir()`.
   - Emit a minimal `index.html` with a CSS grid, `<img>` previews, and filename listings.

---

## 📋 Checklist

- ***

Let me know if you’d like to flesh out any of the code snippets or add a sample `index.html` template!
