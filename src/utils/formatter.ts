export const formatDateTime = (dateTime: Date | string | undefined | null, format: string, utc = false): string => {
  if (typeof dateTime === "undefined") {
    return "";
  }

  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

  if (date instanceof Date && utc) {
    date.setHours(date.getHours() - 7);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value: ${dateTime}`);
  }

  const pad = (num: number) => String(num).padStart(2, '0');

  const day = pad(date.getDate());
  const month = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date); // Short month format (jun)
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  let result = "";

  switch (format) {
    case "d-m-Y":
      result = `${day} ${month} ${year}`;
      break;
    case "d-m-Y H:i:s":
      result = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
      break;
    case "m-Y":
      result = `${month}-${year}`;
      break;
    case "M":
      result = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return result;
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

