import useSWR from "swr";
import { fetcher } from "@/utils";

const usePaginatedData = (page: number, limit: number) => {
  const { data, error } = useSWR(
    `/hooks/?page=${page}&limit=${limit}`,
    fetcher,
  );

  return {
    data: data?.data,
    meta: data?.meta,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePaginatedData;
