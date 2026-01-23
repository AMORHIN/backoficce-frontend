"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@radix-ui/react-progress"
import { formatPrice } from "@/lib/formatPrice"


import { TableIntegrationsProps } from "./TableIntegrations.types"
import React from "react"
import Image from 'next/image';

const data: TableIntegrationsProps[] = [
  {
    app: "Stripe",
    icon: "/images/stripe.png",
    type: "Finance",
    rate: 60,
    profit: 450,
  },
  {
    app: "Zapier",
    icon: "/images/zapier.png",
    type: "CRM",
    rate: 20,
    profit: 123.5,
  },
  {
    app: "Shopify",
    icon: "/images/shopify.png",
    type: "Marketplace",
    rate: 80,
    profit: 879.89,
  }
]

export const columns: ColumnDef<TableIntegrationsProps>[] = [
  {

    accessorKey: "icon",
    header: "LOGO",
    cell: ({ row }) => (
      <div className="capitalize">
        <Image src={row.getValue("icon")} alt="LOGO" width={20} height={20} />
      </div>
    ),
  },
  {
    accessorKey: "app",
    header: "APPLICATION",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("app")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div>TYPE</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "rate",
    header: () => <div className="text-right">RATE</div>,
    cell: ({ row }) => {
      const rate = row.getValue("rate") as number
      return (
        <div className="text-right font-medium flex gap-2 items-center justify-end">
          <Progress value={rate} className="h-2 w-20" />
          <span className="text-sm">{rate}%</span>
        </div>
      )
    },
  },
  {

    accessorKey: "profit",
    header: ( {column} ) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PROFIT
            <ChevronUp className="ml-2 h-4 w-4"/>
          </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("profit"))
      return (<div className="text-right font-medium">{formatPrice(amount) }</div>)
    },
  },
]

export function TablaIntegrations() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter applications..."
          value={(table.getColumn("app")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("app")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                        cell.getContext()
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
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
