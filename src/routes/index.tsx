import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Table as ReactTable,
  useReactTable,
} from "@tanstack/react-table";
import { type components } from "schema";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="p-2">
      <h1 className="text-3xl font-semibold">Runners</h1>
      <div>
        <Button variant="outline">Continue</Button>
        <Button variant="secondary">Continue</Button>
        <Button variant="link">Continue</Button>
        <Button variant="ghost">Continue</Button>
        <Button>Continue</Button>
        <Button size="sm">Continue</Button>
        <Button size="lg">Continue</Button>
      </div>
      <DataTable />
    </div>
  );
}

const columns: ColumnDef<components["schemas"]["Runner"]>[] = [
  {
    accessorKey: "state",
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="group -ml-4"
          data-order={column.getIsSorted()}
          onClick={() => column.toggleSorting()}
        >
          Runner
          <svg
            className="stroke-gray-9"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <g className="group-data-[order=desc]:stroke-gray-12">
              <path d="m21 16-4 4-4-4" />
              <path d="M17 20V4" />
            </g>
            <g className="group-data-[order=asc]:stroke-gray-12">
              <path d="m3 8 4-4 4 4" />
              <path d="M7 4v16" />
            </g>
          </svg>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center">
        <RunnerState state={row.original.state!} />
        <div className="ml-6">
          <div className="font-medium">{row.getValue("id")}</div>
          <div className="text-gray-11">
            {row.original.organization} / {row.original.runner_group}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "job",
    header: "Current job",
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
          <div>
            <div className="font-medium">{job.SAS}</div>
            <div className="text-gray-11">{job.id}</div>
          </div>
        );
      }
    },
  },
  // {
  //   accessorKey: "",
  //   header: "Current job",

  //   cell: ({ row }) =>
  //     (() => {
  //       const percentagePoints = [
  //         0.7, 0.6, 0.55, 0.6, 0.75, 0.8, 0.9, 0.85, 0.7, 0.6, 0.5, 0.4,
  //       ];
  //       const pathData = percentagePoints
  //         .map(
  //           (y, i) =>
  //             `${i === 0 ? "M" : "L"}${(i * 128) / (percentagePoints.length - 1)} ${32 - y * 32}`,
  //         )
  //         .join(" ");

  //       return (
  //         <svg className="h-8 w-32 stroke-blue-9">
  //           <path d={pathData} fill="none" strokeWidth="1" />
  //         </svg>
  //       );
  //     })(),
  // },
];

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RunnerState } from "@/components/ui/runner-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ListFilterIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

export function DataTable() {
  const { data, isLoading } = api.useQuery("get", "/runners");

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
      },
    },
  });

  return (
    <>
      <div className="flex justify-between pb-2">
        <div className="flex gap-2">
          <TableFilter
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

          {table.getState().columnFilters.map((colFilter) => {
            const column = table.getColumn(colFilter.id)!;
            const colFilters = colFilter.value as string[];
            return colFilters.map((filter) => {
              return (
                <div key={filter} className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      column.setFilterValue(
                        ((column.getFilterValue() as string[]) ?? []).filter(
                          (oldFilter) => oldFilter !== filter,
                        ),
                      );
                    }}
                    className="flex items-center gap-1 rounded-md border px-2 py-1"
                  >
                    <span className="text-gray-11">
                      {typeof column?.columnDef.header === "string"
                        ? column.columnDef.header
                        : colFilter.id}
                      :
                    </span>
                    <span>{filter}</span>
                    <XIcon />
                  </Button>
                </div>
              );
            });
          })}
        </div>
        <Button variant="outline">
          <SearchIcon />
          Search
        </Button>
      </div>
      <div className="rounded-md border">
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
                <TableRow
                  key={row.id}
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
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </>
  );
}

function TablePagination<TData>({ table }: { table: ReactTable<TData> }) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-11">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          onClick={() => table.firstPage()}
          disabled={table.getState().pagination.pageIndex === 0}
        >
          <ChevronFirstIcon />
        </Button>
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <Button
          variant="outline"
          onClick={() => table.lastPage()}
          disabled={
            table.getState().pagination.pageIndex === table.getPageCount() - 1
          }
        >
          <ChevronLastIcon />
        </Button>
      </div>
    </div>
  );
}

function TableFilter<TData>({
  table,
  colId,
  options,
}: {
  table: ReactTable<TData>;
  colId: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const column = table.getColumn(colId);
  if (!column) return null;

  const currentFilters = (column.getFilterValue() as string[]) || [];
  const handleSelect = (value: string) => {
    if (currentFilters.includes(value)) {
      column.setFilterValue(
        currentFilters.filter((filter) => filter !== value),
      );
    } else {
      column.setFilterValue([...currentFilters, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ListFilterIcon /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.columnDef.id
            }...`}
          />
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="group"
                  key={option}
                  value={option}
                  onSelect={handleSelect}
                  data-checked={currentFilters.includes(option)}
                >
                  {option}
                  <CheckIcon className="ml-auto h-4 w-4 opacity-0 group-data-[checked=true]:opacity-100" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
