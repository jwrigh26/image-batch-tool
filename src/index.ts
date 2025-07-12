#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";
import yargs from "yargs";

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tiff",
];

function promptForRawDir(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question("Enter the path to your raw image directory: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function promptForSimpleConfirmation(
  rawDir: string,
  blogDir: string,
  date: string
): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    console.log("\n📋 Configuration Summary:");
    console.log(`📁 Raw directory:  ${rawDir}`);
    console.log(`📝 Blog directory: ${blogDir}`);
    console.log(`📅 Date:           ${date}`);
    console.log();
    rl.question(
      "Does this look correct? Ready to proceed? (y/n): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
      }
    );
  });
}

interface Config {
  rawDir: string;
  blogDir: string;
  date: string;
}

function promptForInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function parseBlogDate(blogDateStr: string): {
  year: string;
  month: string;
  isValid: boolean;
} {
  // Handle YYYYMM format (6 digits)
  if (/^\d{6}$/.test(blogDateStr)) {
    const year = blogDateStr.substring(0, 4);
    const month = blogDateStr.substring(4, 6);

    // Validate month (01-12)
    const monthNum = parseInt(month, 10);
    if (monthNum >= 1 && monthNum <= 12) {
      return { year, month, isValid: true };
    } else {
      console.log(`⚠️  Invalid month ${month}, defaulting to month 01`);
      return { year, month: "01", isValid: false };
    }
  }

  // Handle YYYYMMDD format (8 digits)
  if (/^\d{8}$/.test(blogDateStr)) {
    const year = blogDateStr.substring(0, 4);
    const month = blogDateStr.substring(4, 6);
    const day = blogDateStr.substring(6, 8);

    // Validate month
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    if (monthNum < 1 || monthNum > 12) {
      console.log(`⚠️  Invalid month ${month}, defaulting to month 01`);
      return { year, month: "01", isValid: false };
    }

    // Check if day is valid for the given month/year
    const yearNum = parseInt(year, 10);
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

    if (dayNum < 1 || dayNum > daysInMonth) {
      console.log(
        `⚠️  Invalid day ${day} for ${year}-${month}, defaulting to first of month`
      );
      return { year, month, isValid: false };
    }

    return { year, month, isValid: true };
  }

  // Invalid format
  console.log(
    `⚠️  Invalid blog date format: ${blogDateStr}. Expected YYYYMM or YYYYMMDD`
  );
  const today = new Date();
  return {
    year: today.getFullYear().toString(),
    month: String(today.getMonth() + 1).padStart(2, "0"),
    isValid: false,
  };
}

async function promptForConfiguration(config: Config): Promise<Config> {
  console.log("\n📋 Configuration Review:");
  console.log(
    "Let's go through each setting. Press Enter to keep current value, or type a new value.\n"
  );

  // Raw directory
  console.log(`📁 Raw directory: ${config.rawDir}`);
  const rawInput = await promptForInput(
    "Enter new raw directory (or press Enter to keep): "
  );
  if (rawInput) {
    config.rawDir = rawInput;
    // Validate the new raw directory
    if (
      !fs.existsSync(config.rawDir) ||
      !fs.statSync(config.rawDir).isDirectory()
    ) {
      console.log(
        `⚠️  Warning: Directory ${config.rawDir} does not exist or is not a directory.`
      );
      const createIt = await promptForInput(
        "Would you like to create it? (y/n): "
      );
      if (createIt.toLowerCase() === "y" || createIt.toLowerCase() === "yes") {
        try {
          fs.mkdirSync(config.rawDir, { recursive: true });
          console.log(`✅ Created directory: ${config.rawDir}`);
        } catch (err) {
          console.log(`❌ Failed to create directory: ${config.rawDir}`);
          return await promptForConfiguration(config); // Start over
        }
      }
    }
  }

  // Blog directory
  console.log(`\n📝 Blog directory: ${config.blogDir}`);
  const blogInput = await promptForInput(
    "Enter new blog directory (or press Enter to keep): "
  );
  if (blogInput) {
    config.blogDir = blogInput;
    // Validate the new blog directory
    if (
      !fs.existsSync(config.blogDir) ||
      !fs.statSync(config.blogDir).isDirectory()
    ) {
      console.log(
        `⚠️  Warning: Directory ${config.blogDir} does not exist or is not a directory.`
      );
      const createIt = await promptForInput(
        "Would you like to create it? (y/n): "
      );
      if (createIt.toLowerCase() === "y" || createIt.toLowerCase() === "yes") {
        try {
          fs.mkdirSync(config.blogDir, { recursive: true });
          console.log(`✅ Created directory: ${config.blogDir}`);
        } catch (err) {
          console.log(`❌ Failed to create directory: ${config.blogDir}`);
          return await promptForConfiguration(config); // Start over
        }
      }
    }
  }

  // Date
  console.log(`\n📅 Date: ${config.date}`);
  const dateInput = await promptForInput(
    "Enter new date (YYYYMMDD format, or press Enter to keep): "
  );
  if (dateInput) {
    if (!/^\d{8}$/.test(dateInput)) {
      console.log(`❌ Invalid date format. Please use YYYYMMDD format.`);
      return await promptForConfiguration(config); // Start over
    }
    config.date = dateInput;
  }

  // Final confirmation
  console.log("\n📋 Final Configuration Summary:");
  console.log(`📁 Raw directory:  ${config.rawDir}`);
  console.log(`📝 Blog directory: ${config.blogDir}`);
  console.log(`📅 Date:           ${config.date}`);
  console.log();

  const finalConfirm = await promptForInput(
    "Is this configuration correct? (y/n/edit): "
  );
  if (
    finalConfirm.toLowerCase() === "n" ||
    finalConfirm.toLowerCase() === "no"
  ) {
    console.log("Operation cancelled by user.");
    process.exit(0);
  } else if (finalConfirm.toLowerCase() === "edit") {
    return await promptForConfiguration(config); // Start over
  } else if (
    finalConfirm.toLowerCase() === "y" ||
    finalConfirm.toLowerCase() === "yes"
  ) {
    return config;
  } else {
    // Default to edit if unclear response
    return await promptForConfiguration(config);
  }
}

async function main() {
  const argv = await yargs
    .option("raw", {
      type: "string",
      describe: "Path to raw image directory",
    })
    .option("blog", {
      type: "string",
      describe: "Path to blog output directory",
    })
    .option("date", {
      type: "string",
      describe: "Date for output organization (YYYYMMDD)",
    })
    .option("blog-date", {
      type: "string",
      describe: "Blog date for directory structure (YYYYMM or YYYYMMDD)",
    })
    .option("category", {
      type: "string",
      describe: "Category for image batch",
    })
    .parse();

  let rawDir = argv.raw as string | undefined;
  if (!rawDir) {
    // Default to ~/Pictures/_raw
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (!homeDir) {
      console.error("Could not determine home directory.");
      process.exit(1);
    }
    rawDir = path.join(homeDir, "Pictures", "_raw");
    if (!fs.existsSync(rawDir)) {
      try {
        fs.mkdirSync(rawDir, { recursive: true });
        console.log(`Created default raw directory at: ${rawDir}`);
      } catch (err) {
        console.error(`Failed to create default raw directory: ${rawDir}`);
        process.exit(1);
      }
    }
  }

  if (!fs.existsSync(rawDir) || !fs.statSync(rawDir).isDirectory()) {
    console.error(
      `Provided raw directory does not exist or is not a directory: ${rawDir}`
    );
    process.exit(1);
  }

  // Handle blog directory
  let blogDir = argv.blog as string | undefined;
  let blogYear: string;
  let blogMonth: string;
  let targetDir: string;

  // Check if --blog-date is provided
  const blogDateStr = argv["blog-date"] as string | undefined;
  if (blogDateStr) {
    // Parse blog date and get year/month
    const parsedDate = parseBlogDate(blogDateStr);
    blogYear = parsedDate.year;
    blogMonth = parsedDate.month;

    if (!blogDir) {
      // Default to ~/Pictures/blog if not specified
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      if (!homeDir) {
        console.error("Could not determine home directory.");
        process.exit(1);
      }
      blogDir = path.join(homeDir, "Pictures", "blog");
    }

    // Create the blog directory structure based on blog-date
    const blogYearDir = path.join(blogDir, blogYear);
    targetDir = path.join(blogYearDir, blogMonth);

    try {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`📅 Created blog date directory: ${targetDir}`);
    } catch (err) {
      console.error(`Failed to create blog date directory: ${targetDir}`);
      process.exit(1);
    }
  } else {
    // Original blog directory logic
    if (!blogDir) {
      // Default to ~/Pictures/blog
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      if (!homeDir) {
        console.error("Could not determine home directory.");
        process.exit(1);
      }
      blogDir = path.join(homeDir, "Pictures", "blog");
      if (!fs.existsSync(blogDir)) {
        try {
          fs.mkdirSync(blogDir, { recursive: true });
          console.log(`Created default blog directory at: ${blogDir}`);
        } catch (err) {
          console.error(`Failed to create default blog directory: ${blogDir}`);
          process.exit(1);
        }
      }
    }

    if (!fs.existsSync(blogDir) || !fs.statSync(blogDir).isDirectory()) {
      console.error(
        `Provided blog directory does not exist or is not a directory: ${blogDir}`
      );
      process.exit(1);
    }

    // Handle date - use provided date or today's date
    let dateStr = argv.date as string | undefined;
    if (!dateStr) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      dateStr = `${year}${month}${day}`;
    }

    // Validate date format (YYYYMMDD)
    if (!/^\d{8}$/.test(dateStr)) {
      console.error("Date must be in YYYYMMDD format");
      process.exit(1);
    }

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);

    // Create year/month directory structure in blog folder
    const yearDir = path.join(blogDir, year);
    targetDir = path.join(yearDir, month);

    try {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`Ensured blog output directory exists: ${targetDir}`);
    } catch (err) {
      console.error(`Failed to create blog output directory: ${targetDir}`);
      process.exit(1);
    }
  }

  console.log(`📁 Blog images will be processed to: ${targetDir}`);

  // For configuration purposes, we need to extract or construct the date string
  let dateStr: string;
  if (blogDateStr) {
    // If blog-date was provided, create a full YYYYMMDD date string
    // Default to first day of the month if only YYYYMM was provided
    if (blogDateStr.length === 6) {
      dateStr = blogDateStr + "01";
    } else {
      dateStr = blogDateStr;
    }
  } else {
    // Use provided date or today's date
    dateStr =
      (argv.date as string | undefined) ||
      (() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}${month}${day}`;
      })();
  }

  // Get initial user confirmation
  const initialConfirmed = await promptForSimpleConfirmation(
    rawDir,
    targetDir,
    dateStr
  );

  let finalConfig: Config;
  if (!initialConfirmed) {
    // User said no, so run the interactive configuration editor
    finalConfig = await promptForConfiguration({
      rawDir,
      blogDir: targetDir,
      date: dateStr,
    });

    // Update variables with potentially modified values
    rawDir = finalConfig.rawDir;
    dateStr = finalConfig.date;

    // Recalculate month directory based on potentially new date/blog dir
    const finalYear = dateStr.substring(0, 4);
    const finalMonth = dateStr.substring(4, 6);
    const finalMonthDir = path.join(
      path.dirname(finalConfig.blogDir),
      finalYear,
      finalMonth
    );

    // Ensure the final output directory exists
    try {
      fs.mkdirSync(finalMonthDir, { recursive: true });
      console.log(`✅ Ensured final output directory exists: ${finalMonthDir}`);
    } catch (err) {
      console.error(
        `Failed to create final output directory: ${finalMonthDir}`
      );
      process.exit(1);
    }

    // Update finalConfig with the correct final month directory
    finalConfig.blogDir = finalMonthDir;
  } else {
    // User confirmed initial config, use it as-is
    finalConfig = {
      rawDir,
      blogDir: targetDir,
      date: dateStr,
    };
  }

  // rawDir is good to go so use it!
  const files = fs.readdirSync(finalConfig.rawDir);
  const imageFiles = files.filter((file) =>
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log(`No image files found in ${finalConfig.rawDir}.`);
  } else {
    console.log(
      `\n✅ Processing ${imageFiles.length} image(s) from ${finalConfig.rawDir} to ${finalConfig.blogDir}`
    );
    console.log("🎉 Success! Image batch processing would happen here.");
    // TODO: Actual image processing will go here
  }
}

main();
