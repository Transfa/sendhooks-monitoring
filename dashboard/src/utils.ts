import wretch from "wretch";
import dayjs from "dayjs";

import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
