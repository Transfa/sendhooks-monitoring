import useSWR from "swr";
import { fetcher } from "@/utils";

const usePaginatedData = (hooksKey: () => string) => {
  const { data, error } = useSWR(hooksKey, fetcher);

  return {
    data: data?.data,
    meta: data?.meta,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePaginatedData;
