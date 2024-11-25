import { JobStateBadge } from "@/components/job-state";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
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
import { ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { Fragment, useMemo } from "react";
import { type components } from "schema";

export const Route = createFileRoute("/automations/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    void queryClient.prefetchQuery(api.queryOptions("get", "/automations"));
  },
});

function RouteComponent() {
  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">Automations</h1>
      <DataTable />
    </div>
  );
}

const columns: ColumnDef<components["schemas"]["Automation"]>[] = [
  {
    accessorKey: "state",
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "id",
    header: "Automation",
    size: 300,
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="relative flex size-8 flex-shrink-0 items-center justify-center rounded-full border bg-gray-2">
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </div>
        <div className="ml-6 mr-2 min-w-96">
          <div className="font-medium">{row.original.type}</div>
          <div className="text-gray-11">{row.original.id}</div>
        </div>
        <JobStateBadge
          state={
            row.original.state === "INITIAL"
              ? "queued"
              : row.original.state === "FINISHED"
                ? "success"
                : row.original.state === "FAILED"
                  ? "failed"
                  : "in_progress"
          }
          label={row.original.state}
        />
      </div>
    ),
  },
  {
    accessorKey: "sas",
    size: 100,
    header: "SAS",
    cell: ({ row }) => <span className="font-medium">{row.original.sas}</span>,
  },
  {
    accessorKey: "last_activity",
    size: 100,
    header: ({ column }) => (
      <TableHeaderSortable column={column} header="Last activity" />
    ),
    cell: ({ row }) => (
      <div className="text-xs font-medium text-gray-11">
        {DateTime.fromISO(row.original.last_activity).toRelative()}
      </div>
    ),
  },
  {
    id: "actions",
    size: 48,
    cell: ({ row }) => (
      <div className="flex">
        <Button
          onClick={() => row.toggleExpanded()}
          variant="outline"
          size="icon"
          className="ml-auto !border"
        >
          <ChevronRight
            className={cn(
              "duration-150 ease-in-out",
              row.getIsExpanded() ? "rotate-90" : "rotate-0",
            )}
          />
        </Button>
      </div>
    ),
  },
];

function DataTable() {
  const { data, isLoading } = api.useQuery("get", "/automations");
  const { queryClient } = Route.useRouteContext();

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
      sorting: [{ id: "last_activity", desc: true }],
      columnVisibility: {
        state: false,
      },
    },
  });

  return (
    <>
      <div className="flex justify-between pb-2">
        <div className="flex gap-2">
          <TableFilter
            label="State"
            colId="state"
            options={Array.from(
              table.getColumn("state")!.getFacetedUniqueValues().keys(),
            )}
            table={table}
          />
          <TableFilter
            label="SAS"
            colId="sas"
            options={Array.from(
              table.getColumn("sas")!.getFacetedUniqueValues().keys(),
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
                <Fragment key={row.id}>
                  <TableRow
                    onMouseOver={() =>
                      queryClient.ensureQueryData(
                        api.queryOptions("get", "/automations/{id}/logs", {
                          params: { path: { id: row.original.id } },
                        }),
                      )
                    }
                    className={cn(row.getIsExpanded() && "border-b-0")}
                    data-state={row.getIsSelected() && "selected"}
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
                  {row.getIsExpanded() && (
                    <AutomationLogs automationId={row.original.id} />
                  )}
                </Fragment>
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

function AutomationLogs({ automationId }: { automationId: string }) {
  const { data } = api.useQuery("get", "/automations/{id}/logs", {
    params: { path: { id: automationId } },
  });
  return (
    <>
      {data ? (
        data.length > 0 ? (
          data.map((log, i) => (
            <div
              key={i}
              className={cn("table-row", i === data.length - 1 && "border-b")}
            >
              <div className="relative ml-10 flex h-12 w-full items-center !border-l pl-16">
                <div
                  className={cn(
                    "absolute left-0 flex size-6 flex-shrink-0 -translate-x-1/2 items-center justify-center rounded-full border bg-gray-2 p-0.5",
                    log.level === "WARNING" && "bg-yellow-3 text-yellow-12",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>

                <div className="font-medium text-gray-12">
                  {log.description}
                </div>
                <div className="ml-6 text-xs font-medium text-gray-11">
                  {DateTime.fromISO(log.timestamp).toRelative()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={cn("relative table-row h-16 border-b")}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              No logs available.
            </div>
          </div>
        )
      ) : (
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn("relative table-row h-12", i === 2 && "border-b")}
          >
            <div className="absolute inset-x-6 inset-y-1 animate-pulse rounded-md bg-gray-2" />
          </div>
        ))
      )}
    </>
  );
}
