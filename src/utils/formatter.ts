export function formatDateTime(
  dateTime: Date | string,
  format: string
): string {
  // Parse the dateTime if it's a string
  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new RangeError("Invalid time value");
  }

  // Define options based on the format
  const options: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "d-m-Y":
      options.day = "2-digit";
      options.month = "long"; // Use 'long' to get full month name
      options.year = "numeric";
      break;
    case "d-m-Y H:i:s":
      options.day = "2-digit";
      options.month = "long"; // Use 'long' to get full month name
      options.year = "numeric";
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.second = "2-digit";
      break;
    case "m-Y":
      options.month = "long"; // Use 'long' to get full month name
      options.year = "numeric";
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  // Format date in Indonesian locale
  return new Intl.DateTimeFormat("id-ID", options).format(date);
}
