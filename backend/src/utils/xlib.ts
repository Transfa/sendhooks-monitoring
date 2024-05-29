import { appLog } from "../share/app-log";

export function parseDateTime(dateTimeStr: string): Date | string {
  try {
    // Split the input and take the first three parts: date, time, and timezone
    const parts = dateTimeStr.split(" ");
    if (parts.length < 4) {
      appLog.error("Invalid date format");
    }

    // Example input: '2024-05-24 23:06:16.053251798 +0000 UTC m=+519.052021779'
    // Extract only the relevant part for standard Date parsing (up to seconds or milliseconds)
    const dateTimeParts = dateTimeStr.split(" "); // Split by space to isolate parts
    const formattedDateTime =
      dateTimeParts[0] +
      " " +
      dateTimeParts[1] +
      " " +
      dateTimeParts[2] +
      "" +
      dateTimeParts[3]; // '2024-05-24 23:06:16.053251798 +0000 UTC'

    const date = new Date(formattedDateTime);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      appLog.error("Invalid date conversion");
    }
    return date;
  } catch (error) {
    appLog.error(error); // Log the error for debugging purposes
    return ""; // Return an empty string in case of errors
  }
}
