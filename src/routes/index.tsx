import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Table as ReactTable,
  useReactTable,
} from "@tanstack/react-table";
import { components } from "schema";

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

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta {
    filterOptions?: string[];
  }
}
const columns: ColumnDef<components["schemas"]["Runner"]>[] = [
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => <div className="size-3 rounded-full bg-green-9" />,
    meta: {
      filterOptions: [
        "active",
        "failed",
        "idle",
        "offline",
      ] as components["schemas"]["RunnerState"][],
    },
  },
  {
    accessorKey: "id",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("id")}</div>
        <div className="text-gray-11">
          {row.original.organization} / {row.original.runner_group}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "job",
    header: "Current job",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">SAS_JORGE</div>
        <div className="text-gray-11">26799402790</div>
      </div>
    ),
  },
  {
    accessorKey: "",
    header: "Current job",
    cell: ({ row }) =>
      (() => {
        const percentagePoints = [
          0.7, 0.6, 0.55, 0.6, 0.75, 0.8, 0.9, 0.85, 0.7, 0.6, 0.5, 0.4,
        ];
        const pathData = percentagePoints
          .map(
            (y, i) =>
              `${i === 0 ? "M" : "L"}${(i * 128) / (percentagePoints.length - 1)} ${32 - y * 32}`,
          )
          .join(" ");

        return (
          <svg className="h-8 w-32 stroke-blue-9">
            <path
              d={pathData}
              fill="none"
              // stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        );
      })(),
  },
];

import {
  Command,
  CommandEmpty,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
  CheckIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListFilterIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

export function DataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const query = useMemo(
    () => Object.fromEntries(columnFilters.map((t) => [`${t.id}_eq`, t.value])),
    [columnFilters],
  );

  const { data, isLoading } = api.useQuery("get", "/runners", {
    params: { query },
  });

  const tableData = useMemo(() => {
    return data ?? [];
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    debugTable: true,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="flex justify-between pb-2">
        <div className="flex gap-2">
          <TableFilterMenu table={table} />
          {table.getState().columnFilters.map((filter) => {
            const column = table.getColumn(filter.id);
            const value = filter.value as string;
            return (
              <div key={filter.id} className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    column?.setFilterValue(undefined);
                  }}
                  key={value}
                  className="flex items-center gap-1 rounded-md border px-2 py-1"
                >
                  <span className="text-gray-11">
                    {typeof column?.columnDef.header === "string"
                      ? column.columnDef.header
                      : filter.id}
                    :
                  </span>
                  <span>{value}</span>
                  <XIcon />
                </Button>
              </div>
            );
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

function TableFilterMenu<TData>({ table }: { table: ReactTable<TData> }) {
  const [open, setOpen] = useState(false);
  const [filterCol, setFilterCol] = useState<string | undefined>(undefined);

  const handleSelect = (value: string) => {
    const column = table.getColumn(filterCol!);
    if (column) {
      column.setFilterValue(value);
      setOpen(false);
      setFilterCol(undefined);
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
        {filterCol ? (
          (() => {
            const column = table.getColumn(filterCol)!;
            const currentFilters = (column.getFilterValue() as string[]) || [];

            return (
              <Command>
                <CommandInput
                  placeholder={`Search ${
                    typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.columnDef.id
                  }...`}
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {column.columnDef.meta?.filterOptions?.map((option) => (
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
            );
          })()
        ) : (
          <Command>
            <CommandInput placeholder="Search column..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {table.getAllColumns().map((column) =>
                  column.getCanFilter() &&
                  column.columnDef.meta?.filterOptions ? (
                    <CommandItem
                      className="group"
                      key={column.id}
                      value={column.id}
                      onSelect={(colId: string) => {
                        setFilterCol(colId);
                      }}
                    >
                      {typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : column.columnDef.id}
                      <CheckIcon className="ml-auto h-4 w-4 opacity-0 group-data-[checked=true]:opacity-100" />
                    </CommandItem>
                  ) : null,
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
