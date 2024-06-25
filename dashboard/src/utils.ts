import wretch from "wretch";
import dayjs from "dayjs";
import { env } from "next-runtime-env";
// Fetcher function to make API requests
export const fetcher = async (url: string): Promise<any> => {
  const apiUrl = env("NEXT_PUBLIC_API_URL");
  const api = wretch(`${apiUrl}/api/sendhooks/v1`);

  return api.url(url).get().json();
};

// Function to format dates
export const formatDate = (date: string): string => {
  if (!date) return "-";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
