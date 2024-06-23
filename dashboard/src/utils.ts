import wretch from "wretch";
import dayjs from "dayjs";

// Function to retrieve the API URL
async function retrieveApiUrl(): Promise<string> {
  const response = await fetch("api/");
  const data = await response.json();
  return data.apiUrl;
}

// Fetcher function to make API requests
export const fetcher = async (url: string): Promise<any> => {
  const apiUrl = await retrieveApiUrl();
  const api = wretch(`${apiUrl}/api/sendhooks/v1`);

  return api.url(url).get().json();
};

// Function to format dates
export const formatDate = (date: string): string => {
  if (!date) return "-";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
