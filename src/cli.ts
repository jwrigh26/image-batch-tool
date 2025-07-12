import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export interface Options {
  raw?: string;
  blog?: string;
  date?: string;
  blogDate?: string;
  category?: string;
}

export function getOptions(): Options {
  // Parse command-line options synchronously
  const argv = yargs(hideBin(process.argv))
    .option("raw", { type: "string", describe: "Path to raw image directory" })
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
    .help()
    .alias("help", "h")
    .version()
    .parseSync();

  return {
    raw: argv.raw,
    blog: argv.blog,
    date: argv.date,
    // yargs camel-cases hyphenated flags
    blogDate: argv.blogDate,
    category: argv.category,
  };
}
