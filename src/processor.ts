import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Process images from rawDir to targetDir.
 * For each image, resize to max width (1200px) and convert to WebP.
 * Saves processed files in targetDir with the same basename but .webp extension.
 */
export async function processImages(
  rawDir: string,
  targetDir: string,
  maxWidth = 1200
): Promise<void> {
  const files = fs.readdirSync(rawDir);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".bmp",
      ".tiff",
    ].includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log(`No image files found in ${rawDir}.`);
    return;
  }

  console.log(`\n🔄 Processing ${imageFiles.length} image(s)...`);
  const promises = imageFiles.map(async (filename) => {
    const inputPath = path.join(rawDir, filename);
    const name = path.parse(filename).name;
    const outputPath = path.join(targetDir, `${name}.webp`);

    try {
      await sharp(inputPath)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`✅ ${filename} → ${name}.webp`);
    } catch (err) {
      console.error(`❌ Failed processing ${filename}:`, err);
    }
  });

  await Promise.all(promises);
  console.log(`\n🎉 All images processed and saved to ${targetDir}`);
}
