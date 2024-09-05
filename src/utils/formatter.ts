export const formatDateTime = (dateTime: Date | string | undefined | null, format: string): string => {
  if (typeof dateTime === "undefined") {
    return "";
  }

  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value: ${dateTime}`);
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  switch (format) {
    case "d-m-Y":
      break;
    case "d-m-Y H:i:s":
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.second = "2-digit";
      break;
    case "m-Y":
      delete options.day;
      break;
    case "M":
      options.month = "long";
      delete options.day;
      delete options.year;
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return new Intl.DateTimeFormat("id-ID", options).format(date);
};

export const convertToYmd = (dateString: string) => {
  // Split the input string by "-"
  const [month, year] = dateString.split("-").map(Number);
  // Create a new Date object with the first day of the given month and year
  const date = new Date(year, month); // month is 0-indexed in JS
  // Format the date to Y-m-d
  const formattedDate = date.toISOString().slice(0, 10); // "Y-m-d" format
  return formattedDate;
};

