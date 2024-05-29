import wretch from "wretch";
import dayjs from "dayjs";

const api = () => wretch("http://localhost:5002/api/sendhooks/v1");

export const fetcher = (url: string): Promise<any> => {
  return api().get(url).json();
};

export const formatDate = (date: string) => {
  if (!date) {
    return "-";
  }

  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};