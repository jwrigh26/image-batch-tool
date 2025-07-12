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

async function main() {
  const argv = await yargs
    .option("raw", {
      type: "string",
      describe: "Path to raw image directory",
    })
    .option("date", {
      type: "string",
      describe: "Date for output organization (YYYYMMDD)",
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

  const files = fs.readdirSync(rawDir);
  const imageFiles = files.filter((file) =>
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log(`No image files found in ${rawDir}.`);
  } else {
    console.log(`Image files in ${rawDir}:`);
    imageFiles.forEach((f) => console.log(f));
  }
}

main();
