import * as React from "react";

import { cn } from "@/lib/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { Column, Table } from "@tanstack/react-table";
import {
  CheckIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ListFilterIcon,
  XIcon,
} from "lucide-react";
import { Button } from "./button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function TableFilter<TData>({
  label,
  table,
  colId,
  options,
}: {
  label: string;
  table: Table<TData>;
  colId: string;
  options: string[];
}) {
  const [open, setOpen] = React.useState(false);
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
      <div className="flex">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              currentFilters.length > 0 && "rounded-e-none border-r-0",
            )}
          >
            <ListFilterIcon /> {label}
          </Button>
        </PopoverTrigger>
        {currentFilters.length > 0 && (
          <Button
            onClick={() => {
              column.setFilterValue(undefined);
            }}
            variant="outline"
            className="group rounded-s-none"
          >
            <div className="flex items-center gap-1 text-sm text-gray-11">
              {currentFilters.join(", ")}
            </div>

            <XIcon className="z-10 cursor-pointer transition group-hover:text-red-9" />
          </Button>
        )}
      </div>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search...`} />
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

function TablePagination<TData>({ table }: { table: Table<TData> }) {
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

const TableHeaderSortable = <TData,>({
  column,
  header,
}: {
  column: Column<TData>;
  header: string;
}) => {
  return (
    <Button
      variant="ghost"
      className="group -ml-4"
      data-order={column.getIsSorted()}
      onClick={() => column.toggleSorting()}
    >
      {header}
      <svg
        className="stroke-gray-9"
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
};

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <div
      ref={ref}
      className={cn(
        "table w-full table-fixed caption-bottom border-collapse text-sm",
        className,
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("table-header-group *:border-b", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("table-row-group [&_*:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t font-medium [&>*]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("table-row border-b transition-colors", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableRowLink = React.forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ className, ...props }, ref) => (
    <Link
      ref={ref}
      className={cn("table-row border-b transition-colors", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRowLink";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "table-cell h-12 px-6 text-left align-middle font-semibold [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "table-cell h-16 px-6 align-middle [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFilter,
  TableFooter,
  TableHead,
  TableHeader,
  TableHeaderSortable,
  TablePagination,
  TableRow,
  TableRowLink,
};
