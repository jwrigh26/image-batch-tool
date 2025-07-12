// Utilities for parsing and validating blog dates

export function parseBlogDate(blogDateStr: string): {
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

    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    if (monthNum < 1 || monthNum > 12) {
      console.log(`⚠️  Invalid month ${month}, defaulting to month 01`);
      return { year, month: "01", isValid: false };
    }

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

  // Invalid format, default to today's year/month
  console.log(
    `⚠️  Invalid blog date format: ${blogDateStr}. Expected YYYYMM or YYYYMMDD`
  );
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return { year, month, isValid: false };
}
