#!/usr/bin/env node
import path from "path";
import os from "os";
import { getOptions } from "./cli";
import { parseBlogDate } from "./utils/date";
import { ensureDir, isDirectory } from "./utils/fsHelpers";
import { promptForSimpleConfirmation, promptForConfiguration, Config } from "./config";
import { processImages } from "./processor";

// Orchestrator for the Image Batch Tool
// 1) CLI parsing, 2) default directories,
// 3) date-based target dir, 4) interactive config, 5) process images

async function main() {
  const opts = getOptions();

  // 1) Raw directory
  let rawDir = opts.raw;
  if (!rawDir) {
    rawDir = path.join(os.homedir(), "Pictures", "_raw");
    ensureDir(rawDir);
  }
  if (!isDirectory(rawDir)) {
    console.error(`Raw directory not found: ${rawDir}`);
    process.exit(1);
  }

  // 2) Blog parent directory
  let blogDir = opts.blog;
  if (!blogDir) {
    blogDir = path.join(os.homedir(), "Pictures", "blog");
    ensureDir(blogDir);
  }
  if (!isDirectory(blogDir)) {
    console.error(`Blog parent directory not found: ${blogDir}`);
    process.exit(1);
  }

  // 3) Date & target dir
  const now = new Date();
  let year: string;
  let month: string;
  if (opts.blogDate) {
    const parsed = parseBlogDate(opts.blogDate);
    year = parsed.year;
    month = parsed.month;
  } else {
    const dateStr = opts.date || `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}01`;
    year = dateStr.substring(0, 4);
    month = dateStr.substring(4, 6);
  }
  const targetDir = path.join(blogDir, year, month);
  ensureDir(targetDir);

  // 4) Confirm or reconfigure
  const initial: Config = { rawDir, blogDir, blogTargetDir: targetDir, date: `${year}${month}01` };
  const confirmed = await promptForSimpleConfirmation(rawDir, targetDir, initial.date);
  const config = confirmed ? initial : await promptForConfiguration(initial);

  // 5) Process images
  await processImages(config.rawDir, config.blogTargetDir);
  
  console.log("🎉 Done!");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
