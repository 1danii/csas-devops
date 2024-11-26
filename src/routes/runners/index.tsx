import { JobStateDot } from "@/components/job-state";
import { RunnerStateDot } from "@/components/runner-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { UseQueryResult } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { type components } from "schema";

export const Route = createFileRoute("/runners/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">Runners</h1>
      <DataTable />
    </div>
  );
}

function DataTable() {
  const { data, isLoading } = api.useQuery("get", "/runners");
  const [selectedMetric, setSelectedMetric] =
    useState<keyof components["schemas"]["Metric"]>("cpu");

  const columns: ColumnDef<components["schemas"]["Runner"]>[] = useMemo(
    () => [
      {
        accessorKey: "state",
        filterFn: "arrIncludesSome",
      },
      {
        accessorKey: "organization",
        filterFn: "arrIncludesSome",
      },
      {
        accessorKey: "runner_group",
        filterFn: "arrIncludesSome",
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <TableHeaderSortable column={column} header="Runner" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <RunnerStateDot state={row.original.state!} />
            <div className="ml-6">
              <div className="font-medium">{row.original.id}</div>
              <div className="text-gray-11">
                {row.original.organization} / {row.original.runner_group}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "job",
        header: "Job",
        cell: ({ row }) => {
          const { data, isLoading } = api.useQuery("get", "/jobs", {
            // @ts-expect-error param
            params: { query: { runner_eq: row.original.id } },
          });
          if (isLoading) {
            return (
              <div>
                <div className="mb-1 h-4 w-20 animate-pulse rounded-md bg-gray-2" />
                <div className="h-4 w-24 animate-pulse rounded-md bg-gray-2" />
              </div>
            );
          }
          if (data && data.length > 0) {
            const job = data[0]!;

            return (
              <div className="flex items-center">
                <div className="mr-6 min-w-28">
                  <div className="font-medium">{job.SAS}</div>
                  <div className="text-gray-11">{job.id}</div>
                </div>
                <JobStateDot state={job.state!} />
                <div className="ml-2 text-xs font-medium text-gray-11">
                  {DateTime.fromISO(job.timestamp!).toRelative()}
                </div>
              </div>
            );
          }
        },
      },
      {
        accessorKey: "",
        header: "Stats",
        cell: ({ row }) =>
          (() => {
            const metrics = api.useQuery("get", "/metrics/{id}", {
              params: { path: { id: row.original.id! } },
            }) as UseQueryResult<{
              runner: string;
              metrics: components["schemas"]["Metric"][];
            }>;

            if (!metrics.data) return null;
            const percentagePoints = metrics.data?.metrics.map((metrics) =>
              Number(metrics.cpu),
            );
            const pathData = percentagePoints
              .map(
                (y, i) =>
                  `${i === 0 ? "M" : "L"}${(i * 128) / (percentagePoints.length - 1)} ${32 - y * 32}`,
              )
              .join(" ");

            return (
              <svg className="h-8 w-32 stroke-blue-9">
                <path d={pathData} fill="none" strokeWidth="1" />
              </svg>
            );
          })(),
      },
    ],
    [selectedMetric],
  );

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
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnVisibility: {
        state: false,
        organization: false,
        runner_group: false,
      },
    },
  });

  return (
    <>
      <div className="flex justify-between pb-2">
        <div className="flex w-full gap-2">
          <TableFilter
            label="State"
            colId="state"
            options={
              [
                "active",
                "failed",
                "idle",
                "offline",
              ] as components["schemas"]["RunnerState"][]
            }
            table={table}
          />
          <TableFilter
            label="Organization"
            colId="organization"
            options={["csas-dev", "csas-ops"]}
            table={table}
          />
          <TableFilter
            label="Runner group"
            colId="runner_group"
            options={["csas-linux", "csas-linux-test", "csas-linux-prod"]}
            table={table}
          />

          <Select
            value={selectedMetric}
            onValueChange={(v: keyof components["schemas"]["Metric"]) =>
              setSelectedMetric(v)
            }
          >
            <SelectTrigger className="ml-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                [
                  "cpu",
                  "memory",
                  "network_receive",
                  "network_transmit",
                  "fs_reads",
                  "fs_writes",
                ] as (keyof components["schemas"]["Metric"])[]
              ).map((metric, i) => (
                <SelectItem key={i} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  to="/runners/$id"
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
