import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Slugify a string for use in filenames
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Responsive variant configuration
const SCALE_FACTORS = {
  orig: 1,      // Original size (up to maxWidth)
  large: 0.75,  // 75% of original
  medium: 0.5,  // 50% of original  
  small: 0.25   // 25% of original
};

// Output format configuration
const OUTPUT_FORMATS = {
  webp: { 
    ext: '.webp', 
    options: { quality: 80 },
    description: 'Modern, smaller file size'
  },
  jpeg: { 
    ext: '.jpg', 
    options: { quality: 85, mozjpeg: true },
    description: 'Universal compatibility'
  }
};

/**
 * Process images from rawDir to targetDir.
 * Creates responsive variants (orig, large, medium, small) in both WebP and JPEG formats.
 * Saves processed files in targetDir with YYYYMMDD-category-slug-variant.ext naming.
 */
export async function processImages(
  rawDir: string,
  targetDir: string,
  maxWidth = 1200,
  category = "image",
  date?: string,
  outputFormats: ('webp' | 'jpeg')[] = ['webp', 'jpeg']
): Promise<void> {
  const files = fs.readdirSync(rawDir);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"].includes(
      ext
    );
  });

  if (imageFiles.length === 0) {
    console.log(`No image files found in ${rawDir}.`);
    return;
  }

  console.log(`\n🔄 Processing ${imageFiles.length} image(s) with responsive variants in ${outputFormats.join(' & ')} formats...`);
  const promises = imageFiles.map(async (filename) => {
    const inputPath = path.join(rawDir, filename);
    const name = path.parse(filename).name;
    const slug = slugify(name);
    
    // Generate base filename: YYYYMMDD-category-slug
    const datePrefix = date || new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const baseFilename = `${datePrefix}-${category}-${slug}`;

    try {
      const { width, height } = await sharp(inputPath).metadata();
      const originalWidth = width || 0;
      
      console.log(`📐 ${filename}: ${width}x${height}px → Creating variants in ${outputFormats.length} format(s)...`);
      
      // Create all responsive variants in all requested formats
      const allVariantPromises: Promise<any>[] = [];
      
      for (const format of outputFormats) {
        const formatConfig = OUTPUT_FORMATS[format];
        
        const formatVariantPromises = Object.entries(SCALE_FACTORS).map(async ([variant, scale]) => {
          const targetWidth = Math.round(Math.min(originalWidth * scale, maxWidth));
          const outputFilename = `${baseFilename}-${variant}${formatConfig.ext}`;
          const outputPath = path.join(targetDir, outputFilename);
          
          // Check if file already exists and warn
          if (fs.existsSync(outputPath)) {
            console.log(`⚠️  Overwriting existing: ${outputFilename}`);
          }

          const sharpInstance = sharp(inputPath)
            .resize({ width: targetWidth, withoutEnlargement: true })
            .withMetadata({}); // Strip all metadata
            
          // Apply format-specific processing
          if (format === 'webp') {
            sharpInstance.webp(formatConfig.options);
          } else if (format === 'jpeg') {
            sharpInstance.jpeg(formatConfig.options);
          }
          
          await sharpInstance.toFile(outputPath);
            
          return { variant, format, filename: outputFilename, width: targetWidth };
        });
        
        allVariantPromises.push(...formatVariantPromises);
      }
      
      const allVariants = await Promise.all(allVariantPromises);
      
      // Group variants by format for logging
      const variantsByFormat: Record<string, string[]> = {};
      allVariants.forEach(v => {
        if (!variantsByFormat[v.format]) variantsByFormat[v.format] = [];
        variantsByFormat[v.format].push(`${v.variant}(${v.width}px)`);
      });
      
      const formatSummaries = Object.entries(variantsByFormat)
        .map(([fmt, variants]) => `${fmt.toUpperCase()}: ${variants.join(', ')}`)
        .join(' | ');
      
      console.log(`✅ ${filename} → ${allVariants.length} total variants: ${formatSummaries}`);
      
    } catch (err) {
      console.error(`❌ Failed processing ${filename}:`, err);
    }
  });

  await Promise.all(promises);
  
  // Count total files created by format
  const allFiles = fs.readdirSync(targetDir);
  const webpCount = allFiles.filter(f => f.endsWith('.webp')).length;
  const jpegCount = allFiles.filter(f => f.endsWith('.jpg')).length;
  
  console.log(`\n🎉 Generated files in ${targetDir}:`);
  if (webpCount > 0) console.log(`   📱 ${webpCount} WebP files (modern, smaller)`);
  if (jpegCount > 0) console.log(`   🖼️  ${jpegCount} JPEG files (universal compatibility)`);
  console.log(`   📊 Total: ${webpCount + jpegCount} responsive variant files`);
}
