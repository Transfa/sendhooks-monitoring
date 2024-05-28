import wretch from "wretch";

export const fetcher = (url: string) =>
  wretch("http://localhost:5002/api/sendhooks/v1").get(url);
