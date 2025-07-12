import fs from "fs";
import path from "path";
import readline from "readline";
import { ensureDir, isDirectory } from "./utils/fsHelpers";

export interface Config {
  rawDir: string;
  blogDir: string;       // Parent blog directory, e.g., ~/Pictures/blog
  blogTargetDir: string; // Created year/month subdirectory, e.g., ~/Pictures/blog/2025/06
  date: string;          // YYYYMMDD formatted date
}

/**
 * Prompt the user with a question and return the input string.
 */
export function promptForInput(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Show a simple summary prompt and ask for confirmation (y/n).
 */
export function promptForSimpleConfirmation(
  rawDir: string,
  blogTargetDir: string,
  date: string
): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    console.log("\n📋 Configuration Summary:");
    console.log(`📁 Raw directory:  ${rawDir}`);
    console.log(`📝 Blog directory: ${blogTargetDir}`);
    console.log(`📅 Date:           ${date}`);
    console.log();
    rl.question(
      "Does this look correct? Ready to proceed? (y/n): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase().startsWith("y"));
      }
    );
  });
}

/**
 * Interactive configuration editor.
 * Allows changing rawDir, blogDir, and date, then creates target directory.
 */
export async function promptForConfiguration(
  config: Config
): Promise<Config> {
  console.log("\n📋 Configuration Review:");
  console.log("Let's go through each setting. Press Enter to keep current value, or type a new value.\n");

  // Raw directory
  console.log(`📁 Raw directory: ${config.rawDir}`);
  const rawInput = await promptForInput("Enter new raw directory (or press Enter to keep): ");
  if (rawInput) {
    config.rawDir = rawInput;
    if (!isDirectory(config.rawDir)) {
      console.log(`⚠️  Warning: Directory ${config.rawDir} does not exist or is not a directory.`);
      const createIt = await promptForInput("Would you like to create it? (y/n): ");
      if (createIt.toLowerCase().startsWith("y")) {
        ensureDir(config.rawDir);
        console.log(`✅ Created directory: ${config.rawDir}`);
      }
    }
  }

  // Blog parent directory
  console.log(`\n📝 Blog parent directory: ${config.blogDir}`);
  const blogInput = await promptForInput("Enter new blog parent directory (or press Enter to keep): ");
  if (blogInput) {
    config.blogDir = blogInput;
    if (!isDirectory(config.blogDir)) {
      console.log(`⚠️  Warning: Directory ${config.blogDir} does not exist or is not a directory.`);
      const createIt = await promptForInput("Would you like to create it? (y/n): ");
      if (createIt.toLowerCase().startsWith("y")) {
        ensureDir(config.blogDir);
        console.log(`✅ Created directory: ${config.blogDir}`);
      }
    }
  }

  // Date
  console.log(`\n📅 Date: ${config.date}`);
  const dateInput = await promptForInput("Enter new date (YYYYMMDD format, or press Enter to keep): ");
  if (dateInput) {
    if (!/^\d{8}$/.test(dateInput)) {
      console.log(`❌ Invalid date format. Please use YYYYMMDD format.`);
      return promptForConfiguration(config);
    }
    config.date = dateInput;
  }

  // Build target directory and ensure it exists
  const year = config.date.substring(0, 4);
  const month = config.date.substring(4, 6);
  config.blogTargetDir = path.join(config.blogDir, year, month);
  ensureDir(config.blogTargetDir);
  console.log(`✅ Target directory created/verified: ${config.blogTargetDir}`);

  // Final summary
  console.log("\n📋 Final Configuration Summary:");
  console.log(`📁 Raw directory:     ${config.rawDir}`);
  console.log(`📝 Blog parent dir:   ${config.blogDir}`);
  console.log(`📂 Target directory:  ${config.blogTargetDir}`);
  console.log(`📅 Date:              ${config.date}`);
  console.log();

  const finalConfirm = await promptForInput("Is this configuration correct? (y/n/edit): ");
  if (finalConfirm.toLowerCase().startsWith("n")) {
    console.log("Operation cancelled by user.");
    process.exit(0);
  } else if (finalConfirm.toLowerCase().startsWith("edit")) {
    return promptForConfiguration(config);
  }
  return config;
}
