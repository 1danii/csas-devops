import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { components } from "schema";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data, isLoading } = api.useQuery("get", "/runners");

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
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}

const columns: ColumnDef<components["schemas"]["Runner"]>[] = [
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => <div className="bg-green-9 size-3 rounded-full" />,
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
import { CheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="flex justify-between pb-2">
        <FilterMenu />
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
    </>
  );
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

function FilterMenu() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ListFilterIcon /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  className="group"
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  data-checked={value === framework.value}
                >
                  {framework.label}
                  <CheckIcon className="mr-2 h-4 w-4 opacity-0 group-data-[checked=true]:opacity-100" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
