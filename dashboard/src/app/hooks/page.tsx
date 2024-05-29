"use client";

import { SWRProvider } from "@/app/swr-provider";
import { formatDate } from "@/utils";

import usePaginatedData from "@/hooks/usepagination";
import { useState } from "react";
import Link from "next/link";
import { Webhook } from "@/types/webhook";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/hooks/data-table";

import capitalize from "lodash/capitalize";

export default function HooksListing() {
  const [page, setPage] = useState(1);
  const pageSize = 10; // Items per page
  const {
    data: hooks,
    meta,
    isLoading,
    isError,
  } = usePaginatedData(page, pageSize);

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
            <div className="pb-4">{date}</div>
            <div>{time}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "error",
      header: "Error",
      cell: ({ row }) => {
        return row.getValue("error") || "-";
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;
  return (
    <SWRProvider>
      <>
        <DataTable
          columns={columns}
          data={hooks}
          meta={meta}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
        />
      </>
    </SWRProvider>
  );
}
