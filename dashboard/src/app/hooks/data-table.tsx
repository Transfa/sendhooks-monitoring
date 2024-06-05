"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Paginate from "@/components/paginate";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { SearchInput } from "@/components/ui/search-input";
import { Filters } from "@/types/webhook";
import { Cross1Icon } from "@radix-ui/react-icons";

const AvailableFiltersKey = {
  status: "status",
  created: "created",
  delivered: "delivered",
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  meta: any;
  pageSize: number;
  setPage: (value: number) => void;
  filters: Filters;
  setFilters: (filters: {
    status?: string;
    createdStartDate?: string;
    createdEndDate?: string;
    deliveredStartDate?: string;
    deliveredEndDate?: string;
    search?: string;
  }) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  meta,
  pageSize,
  setPage,
  filters,
  setFilters,
}: DataTableProps<TData, TValue>) {
  const [visibleFilters, setVisibleFilters] = useState<string[]>(["search"]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: meta.totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      // @ts-ignore
      const newState = updater({ pageIndex: page - 1, pageSize });
      setPage(newState.pageIndex + 1);
    },
    manualPagination: true,
  });
  const handleFilterChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleAddFilter = (filterName: string) => {
    setVisibleFilters((prev) => [...prev, filterName]);
  };

  const handleRemoveFilterComponent = (filterName: string) => {
    setVisibleFilters((prev) => prev.filter((name) => name !== filterName));
    // @ts-ignore
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [filterName]: "",
    }));
  };
  const handleRemoveFilter = (filterName: string) => {
    // @ts-ignore
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [filterName]: "",
    }));
  };

  const availableFilters: { name: string; label: string }[] = [
    { name: "status", label: "Status" },
    { name: "created", label: "Created" },
    { name: "delivered", label: "Delivered" },
  ];

  useEffect(() => {
    Object.keys(filters).map((key) => {
      if (
        !!filters[key as keyof Filters] &&
        Object.keys(AvailableFiltersKey).includes(key)
      ) {
        setVisibleFilters([...visibleFilters, key]);
      }

      if (
        !!filters[key as keyof Filters] &&
        (key === "createdStartDate" || key === "createdEndDate")
      ) {
        setVisibleFilters([...visibleFilters, "created"]);
      }
      if (
        !!filters[key as keyof Filters] &&
        (key === "deliveredStartDate" || key === "deliveredEndDate")
      ) {
        setVisibleFilters([...visibleFilters, "delivered"]);
      }
    });
  }, [filters]);

  return (
    <div>
      <div className="flex space-x-4 mb-4 justify-between">
        <div className="flex space-x-2">
          {visibleFilters.includes("search") && (
            <SearchInput
              value={filters?.search}
              handleFilterChange={handleFilterChange}
            />
          )}
          {visibleFilters.includes("status") && (
            <div className="relative w-[200px]">
              <Select
                name="status"
                value={filters.status || ""}
                onValueChange={(value) => {
                  handleFilterChange({
                    target: { name: "status", value: value },
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Cross1Icon
                className="absolute bottom-6 left-48 cursor-pointer border border-black bg-white rounded "
                onClick={() => handleRemoveFilterComponent("status")}
              />
            </div>
          )}

          {visibleFilters.includes("created") && (
            <DatePickerWithRange
              onRemoveFilter={handleRemoveFilter}
              placeholder={"Filter by creation date"}
              value={{
                from: filters.createdStartDate
                  ? new Date(filters.createdStartDate as string)
                  : undefined,
                to: filters.createdEndDate
                  ? new Date(filters.createdEndDate as string)
                  : undefined,
              }}
              onRemoveComponent={() => {
                handleRemoveFilterComponent("createdEndDate");
                handleRemoveFilterComponent("createdStartDate");

                setVisibleFilters([
                  ...visibleFilters.filter(
                    (visibleFilter) => visibleFilter !== "created",
                  ),
                ]);
              }}
              onDateChange={handleFilterChange}
              fromKey={"createdStartDate"}
              toKey={"createdEndDate"}
            />
          )}

          {visibleFilters.includes("delivered") && (
            <DatePickerWithRange
              onRemoveFilter={handleRemoveFilter}
              placeholder={"Filter by delivered date"}
              value={{
                from: filters.deliveredStartDate
                  ? new Date(filters.deliveredStartDate as string)
                  : undefined,
                to: filters.deliveredEndDate
                  ? new Date(filters.deliveredEndDate as string)
                  : undefined,
              }}
              onRemoveComponent={() => {
                handleRemoveFilterComponent("deliveredStartDate");
                handleRemoveFilterComponent("deliveredEndDate");

                setVisibleFilters([
                  ...visibleFilters.filter(
                    (visibleFilter) => visibleFilter !== "delivered",
                  ),
                ]);
              }}
              onDateChange={handleFilterChange}
              fromKey={"deliveredStartDate"}
              toKey={"deliveredEndDate"}
            />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Filters</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableFilters
              .filter((filter) => !visibleFilters.includes(filter.name))
              .map((filter) => (
                <DropdownMenuItem
                  key={filter.name}
                  onClick={() => handleAddFilter(filter.name)}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-12 text-center"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Paginate
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={(value) => {
            setPage(value);
            handleFilterChange({
              target: {
                name: "page",
                value: value.toString(),
              },
            });
          }}
        />
      </div>
    </div>
  );
}
