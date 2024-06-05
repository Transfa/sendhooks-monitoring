import useSWR from "swr";
import { fetcher } from "@/utils";

const usePaginatedData = (
  page: number,
  pageSize: number,
  filters: {
    status?: string;
    createdStartDate?: string;
    createdEndDate?: string;
    deliveredStartDate?: string;
    deliveredEndDate?: string;
    search?: string;
  },
) => {
  const cleanedFilterQuery = {};

  Object.keys(filters).map((key) => {
    // @ts-ignore
    if (filters[key]) {
      // @ts-ignore
      cleanedFilterQuery[key] = filters[key];
    }
  });
  const query = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
    ...cleanedFilterQuery,
  }).toString();

  const { data, error } = useSWR(`/hooks/?${query}`, fetcher);

  return {
    data: data?.data,
    meta: data?.meta,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePaginatedData;
