import wretch from "wretch";
import dayjs from "dayjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

const api = () => wretch(`${API_URL}/api/sendhooks/v1`);

export const fetcher = (url: string): Promise<any> => {
  return api().get(url).json();
};

export const formatDate = (date: string) => {
  if (!date) {
    return "-";
  }

  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
