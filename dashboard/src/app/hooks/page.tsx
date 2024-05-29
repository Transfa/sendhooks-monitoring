"use client";

import { SWRProvider } from "@/app/swr-provider";
import { formatDate } from "@/utils";

import usePaginatedData from "@/hooks/usepagination";
import { useState } from "react";
import Link from "next/link";
import { Webhook } from "@/types/webhook";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/hooks/data-table";

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
          <Link href={`hooks/${row.getValue("_id")}`}>
            {row.getValue("_id")}
          </Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "created",
      header: "Created",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("created"))}</div>;
      },
    },
    {
      accessorKey: "delivered",
      header: "Delivered",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("delivered"))}</div>;
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
        <div className="container mx-auto py-10">
          <DataTable
            columns={columns}
            data={hooks}
            meta={meta}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
          />
        </div>
      </>
    </SWRProvider>
  );
}
