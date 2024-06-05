"use client";

import { useState, useEffect, useCallback } from "react";

import { SWRProvider } from "@/app/swr-provider";
import { formatDate } from "@/utils";

import usePaginatedData from "@/hooks/usepagination";
import Link from "next/link";
import { Filters, Webhook } from "@/types/webhook";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
} from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/hooks/data-table";

import capitalize from "lodash/capitalize";
import isEmpty from "lodash/isEmpty";
import fromPairs from "lodash/fromPairs";

const truncateText = (text: string, maxLength: number, id: string | number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return (
    <div>
      {text.substring(0, maxLength)}...
      <Link href={`/hooks/${id}`}>
        <p className="underline text-primary hover:text-blue-950">more</p>
      </Link>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10; // Items per page
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<{
    status?: string;
    createdStartDate?: string;
    createdEndDate?: string;
    deliveredStartDate?: string;
    deliveredEndDate?: string;
    search?: string;
  }>({
    status: (params.status as string) || "",
    createdStartDate: (params.createdStartDate as string) || "",
    createdEndDate: (params.createdEndDate as string) || "",
    deliveredStartDate: (params.deliveredStartDate as string) || "",
    deliveredEndDate: (params.deliveredEndDate as string) || "",
    search: (params.search as string) || "",
  });

  useEffect(() => {
    const cleanedFilterQuery: Filters = {};

    Object.keys(filters).map((key) => {
      if (filters[key as keyof Filters]) {
        cleanedFilterQuery[key as keyof Filters] =
          filters[key as keyof Filters];
      }
    });

    const query = new URLSearchParams({
      ...cleanedFilterQuery,
    }).toString();

    if (isEmpty(query)) {
      router.push(`${pathname}`);
    }

    router.push(`${pathname}?${query}`);
  }, [filters, router, pathname]);

  useEffect(() => {
    const query = searchParams.toString();

    setFilters({
      ...fromPairs([...Array.from(searchParams.entries())]),
    });

    setPage(
      searchParams.get("page")
        ? parseInt(searchParams.get("page") as string)
        : 1,
    );

    router.push(`${pathname}?${query}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hooksKey = useCallback(() => {
    if (!searchParams) return `/hooks/`;
    const query = searchParams.toString();

    return `/hooks/?${query}`;
  }, [searchParams]);

  const { data: hooks, meta, isLoading, isError } = usePaginatedData(hooksKey);

  const columns: ColumnDef<Webhook>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => {
        return (
          <div className="w-16">
            <Link href={`hooks/${row.getValue("_id")}`}>
              <p className="underline text-primary hover:text-blue-950">
                {row.getValue("_id")}
              </p>
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusIsSuccess = row.getValue("status") === "success";
        return (
          <div
            className={`text-center ${
              statusIsSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {capitalize(row.getValue("status"))}
          </div>
        );
      },
    },
    {
      accessorKey: "created",
      header: "Created",
      cell: ({ row }) => {
        const [date, time] = formatDate(row.getValue("created")).split(" ");
        return (
          <div className="text-center">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "delivered",
      header: "Delivered",
      cell: ({ row }) => {
        const [date, time] = formatDate(row.getValue("delivered")).split(" ");
        return (
          <div className="text-center">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "error",
      header: "Error",
      cell: ({ row }) => {
        const error: string = row.getValue("error") || "-";
        const id = row.getValue("_id") as string;
        return truncateText(error, 20, id); // Adjust the maxLength as needed
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;
  return (
    <SWRProvider>
      <DataTable
        columns={columns}
        data={hooks}
        meta={meta}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        filters={filters}
        setFilters={setFilters}
      />
    </SWRProvider>
  );
}
