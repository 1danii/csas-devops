import { JobStateDot } from "@/components/job-state";
import {
  Table,
  TableBody,
  TableCell,
  TableFilter,
  TableHead,
  TableHeader,
  TableHeaderSortable,
  TablePagination,
  TableRow,
  TableRowLink,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { type components } from "schema";

export const Route = createFileRoute("/jobs/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">Jobs</h1>
      <DataTable />
    </div>
  );
}

const columns: ColumnDef<components["schemas"]["Job"]>[] = [
  {
    accessorKey: "state",
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "SAS",
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "id",
    header: "Job",
    cell: ({ row }) => (
      <div className="flex items-center">
        <JobStateDot state={row.original.state!} />
        <div className="ml-6">
          <div className="font-medium">{row.original.SAS}</div>
          <div className="text-gray-11">{row.original.id}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <TableHeaderSortable column={column} header="Started" />
    ),
    cell: ({ row }) => (
      <div className="text-xs font-medium text-gray-11">
        {DateTime.fromISO(row.original.timestamp!).toRelative()}
      </div>
    ),
  },
  {
    accessorKey: "runner",
    header: "Runner",
    cell: ({ row }) => (
      <div className="flex items-center font-medium">{row.original.runner}</div>
    ),
  },
];

function DataTable() {
  const { data, isLoading } = api.useQuery("get", "/jobs");

  const tableData = useMemo(() => {
    return data ?? [];
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnVisibility: {
        state: false,
        SAS: false,
      },
      sorting: [{ id: "timestamp", desc: true }],
    },
  });

  return (
    <>
      <div className="flex justify-between pb-2">
        <div className="flex gap-2">
          <TableFilter
            label="State"
            colId="state"
            options={
              [
                "success",
                "in_progress",
                "queued",
                "failed",
              ] as components["schemas"]["JobState"][]
            }
            table={table}
          />
          <TableFilter
            label="SAS"
            colId="SAS"
            options={Array.from(
              table.getColumn("SAS")!.getFacetedUniqueValues().keys(),
            )}
            table={table}
          />
        </div>
      </div>
      <div className="rounded-md border bg-primary">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      style={{ width: `${header.getSize()}px` }}
                      key={header.id}
                    >
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
                <TableRowLink
                  to="/jobs/$id"
                  params={{ id: row.original.id! }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="relative"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRowLink>
              ))
            ) : isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {table.getAllColumns().map((column) => (
                    <TableCell key={column.id}>
                      <div
                        style={{ width: `${column.getSize()}px` }}
                        className="h-4 animate-pulse rounded-md bg-gray-2"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="relative h-24 text-center">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  No results.
                </div>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </>
  );
}
