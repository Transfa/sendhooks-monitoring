"use client";

import { SWRProvider } from "@/app/swr-provider";
import { formatDate } from "@/utils";

import usePaginatedData from "@/hooks/usepagination";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Webhook } from "@/types/webhook";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
} from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/hooks/data-table";

import capitalize from "lodash/capitalize";
import { noop } from "lodash";

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

    router.push(`${pathname}?${query}`);
  }, [page, filters, router, pathname]);

  const {
    data: hooks,
    meta,
    isLoading,
    isError,
  } = usePaginatedData(page, pageSize, filters);

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
